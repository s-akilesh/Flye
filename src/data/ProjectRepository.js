import { supabase } from '../lib/supabase.js';

// Helper to generate a URL-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const ProjectRepository = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    if (error) {
      console.error("Failed to load projects from Supabase", error);
      throw error;
    }
    return data || [];
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // PostgREST code for single row not found
      console.error(`Failed to get project by ID ${id} from Supabase`, error);
      throw error;
    }
    return data;
  },

  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error(`Failed to get project by slug ${slug} from Supabase`, error);
      throw error;
    }
    return data;
  },

  create: async (project) => {
    const id = 'proj-' + Math.random().toString(36).substring(2, 9);
    const baseSlug = generateSlug(project.title);

    // Ensure slug uniqueness
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', uniqueSlug);
      if (error) {
        console.error("Error checking slug uniqueness in Supabase", error);
        throw error;
      }
      if (!data || data.length === 0) {
        break;
      }
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject = {
      ...project,
      id,
      slug: uniqueSlug,
      downloads: 0,
      reviews: project.reviews || [],
      lastUpdated: new Date().toLocaleDateString('en-IN')
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.error("Failed to create project in Supabase", error);
      throw error;
    }
    return data;
  },

  update: async (id, updatedFields) => {
    let newSlug = updatedFields.slug;
    if (updatedFields.title) {
      const baseSlug = generateSlug(updatedFields.title);
      newSlug = baseSlug;
      let counter = 1;
      while (true) {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', id);
        if (error) {
          console.error("Error checking slug uniqueness in Supabase during update", error);
          throw error;
        }
        if (!data || data.length === 0) {
          break;
        }
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatePayload = {
      ...updatedFields,
      slug: newSlug || updatedFields.slug,
      lastUpdated: new Date().toLocaleDateString('en-IN')
    };

    // Remove system-managed properties to avoid constraint/insert-only errors
    delete updatePayload.created_at;
    delete updatePayload.updated_at;

    const { data, error } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Failed to update project ${id} in Supabase`, error);
      throw error;
    }
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Failed to delete project ${id} from Supabase`, error);
      throw error;
    }
  },

  duplicate: async (id) => {
    const original = await ProjectRepository.getById(id);
    if (!original) throw new Error(`Project with ID ${id} not found`);

    const dupTitle = `${original.title} (Copy)`;
    const baseSlug = generateSlug(dupTitle);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', uniqueSlug);
      if (error) {
        console.error("Error checking slug uniqueness in Supabase during duplicate", error);
        throw error;
      }
      if (!data || data.length === 0) {
        break;
      }
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newId = 'proj-' + Math.random().toString(36).substring(2, 9);
    
    const duplicated = {
      ...original,
      id: newId,
      title: dupTitle,
      slug: uniqueSlug,
      featured: false,
      downloads: 0,
      reviews: [],
      lastUpdated: new Date().toLocaleDateString('en-IN')
    };

    // Remove system-managed fields
    delete duplicated.created_at;
    delete duplicated.updated_at;

    const { data, error } = await supabase
      .from('projects')
      .insert(duplicated)
      .select()
      .single();

    if (error) {
      console.error(`Failed to duplicate project ${id} in Supabase`, error);
      throw error;
    }
    return data;
  }
};
