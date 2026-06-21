import projectsData from './projects.json';

const LOCAL_STORAGE_KEY = 'flyen_projects';

// Helper to generate a URL-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper to get data from local storage or initialize it
const getStoredProjects = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  let projectsList = [];
  if (stored) {
    try {
      projectsList = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse projects from localStorage", e);
      projectsList = projectsData;
    }
  } else {
    projectsList = projectsData;
  }

  // Ensure all loaded projects have the new schema fields and a lastUpdated field (auto migration for preloaded records)
  let modified = false;
  const verifiedList = projectsList.map((p) => {
    const defaultData = projectsData.find((d) => d.id === p.id);
    let updated = false;

    if (!p.lastUpdated) {
      p.lastUpdated = '21/06/2026';
      updated = true;
    }

    if (defaultData) {
      if (!p.howItWorks && defaultData.howItWorks) {
        p.howItWorks = defaultData.howItWorks;
        updated = true;
      }
      if ((!p.applications || p.applications.length === 0) && defaultData.applications) {
        p.applications = defaultData.applications;
        updated = true;
      }
      if ((!p.benefits || p.benefits.length === 0) && defaultData.benefits) {
        p.benefits = defaultData.benefits;
        updated = true;
      }
      if (!p.estimatedDelivery && defaultData.estimatedDelivery) {
        p.estimatedDelivery = defaultData.estimatedDelivery;
        updated = true;
      }
      if (!p.whatsappNumber && defaultData.whatsappNumber) {
        p.whatsappNumber = defaultData.whatsappNumber;
        updated = true;
      }
    }

    if (updated) {
      modified = true;
    }
    return p;
  });

  if (modified || !stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedList));
  }
  return verifiedList;
};

const saveStoredProjects = (projects) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
};

export const ProjectRepository = {
  getAll: async () => {
    return getStoredProjects();
  },

  getById: async (id) => {
    const list = getStoredProjects();
    return list.find((p) => p.id === id) || null;
  },

  getBySlug: async (slug) => {
    const list = getStoredProjects();
    return list.find((p) => p.slug === slug) || null;
  },

  create: async (project) => {
    const list = getStoredProjects();
    const id = 'proj-' + Math.random().toString(36).substring(2, 9);
    const slug = generateSlug(project.title);

    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (list.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
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

    list.push(newProject);
    saveStoredProjects(list);
    return newProject;
  },

  update: async (id, updatedFields) => {
    const list = getStoredProjects();
    
    let newSlug = updatedFields.slug;
    if (updatedFields.title) {
      const baseSlug = generateSlug(updatedFields.title);
      newSlug = baseSlug;
      let counter = 1;
      while (list.some((p) => p.slug === newSlug && p.id !== id)) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatedList = list.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          slug: newSlug || p.slug,
          lastUpdated: new Date().toLocaleDateString('en-IN')
        };
      }
      return p;
    });

    saveStoredProjects(updatedList);
    return updatedList.find((p) => p.id === id) || null;
  },

  delete: async (id) => {
    const list = getStoredProjects();
    const filtered = list.filter((p) => p.id !== id);
    saveStoredProjects(filtered);
  },

  duplicate: async (id) => {
    const list = getStoredProjects();
    const original = list.find((p) => p.id === id);
    if (!original) throw new Error(`Project with ID ${id} not found`);

    const dupTitle = `${original.title} (Copy)`;
    const baseSlug = generateSlug(dupTitle);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (list.some((p) => p.slug === uniqueSlug)) {
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

    list.push(duplicated);
    saveStoredProjects(list);
    return duplicated;
  }
};
