/**
 * Flyen Platform - Data Mapping Utilities
 * Handles bidirectional serialization and deserialization between 
 * database (snake_case) and frontend (camelCase) naming conventions.
 */

// ============================================================================
// ENQUIRY MAPPERS
// ============================================================================

export const mapEnquiryToReact = (dbEnq) => {
  if (!dbEnq) return null;
  return {
    id: dbEnq.id,
    projectId: dbEnq.project_id || '',
    projectTitle: dbEnq.project_title || '',
    customerName: dbEnq.customer_name || '',
    mobileNumber: dbEnq.mobile_number || '',
    email: dbEnq.email || '',
    message: dbEnq.message || '',
    status: dbEnq.status || 'new',
    price: dbEnq.price || '',
    notes: dbEnq.notes || '',
    userId: dbEnq.user_id || null,
    createdAt: dbEnq.created_at,
    updatedAt: dbEnq.updated_at
  };
};

export const mapEnquiryToDB = (reactEnq) => {
  if (!reactEnq) return null;
  const dbEnq = {
    id: reactEnq.id,
    project_id: reactEnq.projectId,
    project_title: reactEnq.projectTitle,
    customer_name: reactEnq.customerName || reactEnq.name,
    mobile_number: reactEnq.mobileNumber || reactEnq.mobile,
    email: reactEnq.email,
    message: reactEnq.message,
    status: reactEnq.status,
    price: (reactEnq.price !== undefined && reactEnq.price !== null && String(reactEnq.price).trim() !== '') 
      ? parseFloat(String(reactEnq.price).replace(/[^\d.]/g, '')) 
      : null,
    notes: reactEnq.notes
  };

  // Clean undefined keys
  Object.keys(dbEnq).forEach(key => {
    if (dbEnq[key] === undefined) {
      delete dbEnq[key];
    }
  });

  return dbEnq;
};

// ============================================================================
// PROJECT MAPPERS
// ============================================================================

export const mapProjectToReact = (dbProj) => {
  if (!dbProj) return null;
  return {
    id: dbProj.id,
    title: dbProj.title || '',
    slug: dbProj.slug || '',
    description: dbProj.description || '',
    fullDescription: dbProj.full_description || '',
    category: dbProj.category || '',
    department: dbProj.department || '',
    projectLevel: dbProj.project_level || 1,
    difficulty: dbProj.difficulty || 'Beginner',
    price: dbProj.price || 0,
    status: dbProj.status || 'draft',
    featured: !!dbProj.featured,
    currency: dbProj.currency || 'INR',
    technology: dbProj.technology || '',
    buildTime: dbProj.build_time || '',
    features: dbProj.features || [],
    badge: dbProj.badge || '',
    searchKeywords: dbProj.search_keywords || [],
    images: dbProj.images || [],
    videoUrl: dbProj.video_url || '',
    resources: dbProj.resources || [],
    components: dbProj.components || [],
    specifications: dbProj.specifications || [],
    reviews: dbProj.reviews || [],
    relatedProjects: dbProj.related_projects || [],
    stockStatus: dbProj.stock_status || 'instock',
    downloads: dbProj.downloads || 0,
    howItWorks: dbProj.how_it_works || '',
    applications: dbProj.applications || [],
    benefits: dbProj.benefits || [],
    estimatedDelivery: dbProj.estimated_delivery || '',
    whatsappNumber: dbProj.whatsapp_number || '',
    lastUpdated: dbProj.last_updated || '',
    variants: dbProj.variants || [],
    createdAt: dbProj.created_at,
    updatedAt: dbProj.updated_at
  };
};

export const mapProjectToDB = (reactProj) => {
  if (!reactProj) return null;
  const dbProj = {
    id: reactProj.id,
    title: reactProj.title,
    slug: reactProj.slug,
    description: reactProj.description,
    full_description: reactProj.fullDescription,
    category: reactProj.category,
    department: reactProj.department,
    project_level: reactProj.projectLevel,
    difficulty: reactProj.difficulty,
    price: reactProj.price,
    status: reactProj.status,
    featured: reactProj.featured,
    currency: reactProj.currency,
    technology: reactProj.technology,
    build_time: reactProj.buildTime,
    features: reactProj.features,
    badge: reactProj.badge,
    search_keywords: reactProj.searchKeywords,
    images: reactProj.images,
    video_url: reactProj.videoUrl,
    resources: reactProj.resources,
    components: reactProj.components,
    specifications: reactProj.specifications,
    reviews: reactProj.reviews,
    related_projects: reactProj.relatedProjects,
    stock_status: reactProj.stockStatus,
    downloads: reactProj.downloads,
    how_it_works: reactProj.howItWorks,
    applications: reactProj.applications,
    benefits: reactProj.benefits,
    estimated_delivery: reactProj.estimatedDelivery,
    whatsapp_number: reactProj.whatsappNumber,
    last_updated: reactProj.lastUpdated,
    variants: reactProj.variants
  };

  // Clean undefined keys
  Object.keys(dbProj).forEach(key => {
    if (dbProj[key] === undefined) {
      delete dbProj[key];
    }
  });

  return dbProj;
};

// ============================================================================
// CONTACT MAPPERS
// ============================================================================

export const mapContactToReact = (dbContact) => {
  if (!dbContact) return null;
  return {
    id: dbContact.id,
    name: dbContact.name || '',
    mobileNumber: dbContact.mobile_number || '',
    email: dbContact.email || '',
    category: dbContact.category || '',
    subject: dbContact.subject || '',
    message: dbContact.message || '',
    status: dbContact.status || 'new',
    internalNotes: dbContact.internal_notes || '',
    assignedTo: dbContact.assigned_to || null,
    createdAt: dbContact.created_at,
    updatedAt: dbContact.updated_at
  };
};

export const mapContactToDB = (reactContact) => {
  if (!reactContact) return null;
  const dbContact = {
    id: reactContact.id,
    name: reactContact.name,
    mobile_number: reactContact.mobileNumber || reactContact.mobile,
    email: reactContact.email,
    category: reactContact.category,
    subject: reactContact.subject,
    message: reactContact.message,
    status: reactContact.status,
    internal_notes: reactContact.internalNotes,
    assigned_to: reactContact.assignedTo
  };

  // Clean undefined keys
  Object.keys(dbContact).forEach(key => {
    if (dbContact[key] === undefined) {
      delete dbContact[key];
    }
  });

  return dbContact;
};
