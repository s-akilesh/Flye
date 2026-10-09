import { supabase } from './supabaseClient.js';

// Default initial testimonials for seed & offline fallback
const DEFAULT_SEED_REVIEWS = [
  {
    id: 'a4e7b58b-f484-4cbb-a212-9d63bfe1e67a',
    name: 'Akash Sharma',
    project: 'Project',
    category: 'Electronics Kit',
    rating: 5,
    comment: 'The hardware was 100% pre-tested and ready to run. Every motor driver and sensor worked out of the box with the provided schematics. Helped our team secure top marks in our capstone review!',
    avatar_text: 'AS',
    avatar_bg: '#0d9488',
    avatar_url: '',
    email: 'akash.s@example.com',
    status: 'approved',
    show_in_home: true,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a7afe9f0-6275-48b1-b766-7aebfbc0ab6a',
    name: 'Sneha Reddy',
    project: '3D Printing',
    category: '3D Printing',
    rating: 5,
    comment: 'Got our custom drone chassis and sensor brackets 3D printed with 0.1mm layer tolerance. The PETG parts arrived within 48 hours and fit our brushless motors flawlessly.',
    avatar_text: 'SR',
    avatar_bg: '#f97316',
    avatar_url: '',
    email: 'sneha.r@example.com',
    status: 'approved',
    show_in_home: true,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '96a7774a-011c-4645-8acb-d4cc67fbf432',
    name: 'Vikram Patel',
    project: '3D Printing & Project',
    category: 'Electronics Kit',
    rating: 5,
    comment: 'Flyen saved us weeks of component sourcing and debugging. The live debug guidance from their hardware mentors was invaluable when calibrating our ESP32 gateway.',
    avatar_text: 'VP',
    avatar_bg: '#3b82f6',
    avatar_url: '',
    email: 'vikram.p@example.com',
    status: 'approved',
    show_in_home: true,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b281fbb4-9a84-4fe1-bb38-9cb8c1e82811',
    name: 'Pooja Nair',
    project: '3D Printing',
    category: '3D Printing',
    rating: 5,
    comment: 'Ordered 15 personalized engraved keepsake boxes for our tech fest. The print precision, surface finish, and snap-fit hinges exceeded everyone’s expectations.',
    avatar_text: 'PN',
    avatar_bg: '#8b5cf6',
    avatar_url: '',
    email: 'pooja.n@example.com',
    status: 'approved',
    show_in_home: true,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c8192aa1-419b-4cc8-8742-5f818cc271e9',
    name: 'Karthik Verma',
    project: 'Project',
    category: 'Electronics Kit',
    rating: 5,
    comment: 'The Smart Solar MPPT Tracking package came with clean documentation and complete wiring guides. Highly recommended for students who want industrial-standard hardware!',
    avatar_text: 'KV',
    avatar_bg: '#10b981',
    avatar_url: '',
    email: 'karthik.v@example.com',
    status: 'approved',
    show_in_home: true,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'flyen_customer_reviews';

const AVATAR_COLORS = [
  '#0d9488', '#f97316', '#3b82f6', '#8b5cf6', '#10b981',
  '#ec4899', '#06b6d4', '#6366f1', '#eab308', '#14b8a6'
];

export const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generates 2-letter uppercase initials from name.
 */
export const getInitials = (name) => {
  if (!name) return 'FL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Selects deterministic color from name.
 */
export const getAvatarBg = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getLocalReviews = () => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return DEFAULT_SEED_REVIEWS;
    }
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_REVIEWS));
      return DEFAULT_SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEED_REVIEWS;
  } catch (e) {
    return DEFAULT_SEED_REVIEWS;
  }
};

const saveLocalReviews = (items) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('[reviewService] LocalStorage save failed:', e);
  }
};

export const reviewService = {
  /**
   * Retrieves all reviews with optional status/type filter.
   * Uses Supabase table with LocalStorage fallback.
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        // Sync local storage cache
        saveLocalReviews(data.length > 0 ? data : DEFAULT_SEED_REVIEWS);
        return data.length > 0 ? data : DEFAULT_SEED_REVIEWS;
      }
      return getLocalReviews();
    } catch (err) {
      console.warn('[reviewService] Falling back to local storage cache:', err);
      return getLocalReviews();
    }
  },

  /**
   * Retrieves approved reviews featured for Home screen showcase.
   */
  async getFeatured() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('show_in_home', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
      const local = getLocalReviews();
      const filtered = local.filter(r => r.status === 'approved' && r.show_in_home && r.is_active !== false);
      return filtered.length > 0 ? filtered : DEFAULT_SEED_REVIEWS;
    } catch (err) {
      const local = getLocalReviews();
      return local.filter(r => r.status === 'approved' && r.show_in_home);
    }
  },

  /**
   * Submits a new review (can be called from public feedback form or admin).
   */
  async create(reviewData) {
    if (!reviewData.name || !reviewData.name.trim()) throw new Error('Name is required');
    if (!reviewData.comment || !reviewData.comment.trim()) throw new Error('Feedback comment is required');

    const cleanName = reviewData.name.trim();
    const avatarText = reviewData.avatar_text || getInitials(cleanName);
    const avatarBg = reviewData.avatar_bg || getAvatarBg(cleanName);

    const insertPayload = {
      name: cleanName,
      email: reviewData.email ? reviewData.email.trim() : null,
      role: reviewData.role ? reviewData.role.trim() : null,
      institution: reviewData.institution ? reviewData.institution.trim() : null,
      project: reviewData.project ? reviewData.project.trim() : '3D Printing & Project',
      category: reviewData.category || 'General',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment.trim(),
      avatar_url: reviewData.avatar_url || null,
      avatar_text: avatarText,
      avatar_bg: avatarBg,
      status: reviewData.status || 'approved',
      show_in_home: reviewData.show_in_home !== undefined ? !!reviewData.show_in_home : true,
      is_active: true
    };

    if (reviewData.id && isUuid(reviewData.id)) {
      insertPayload.id = reviewData.id;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(insertPayload)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalReviews();
        saveLocalReviews([data, ...local.filter(r => r.id !== data.id)]);
        return data;
      }
      if (error) {
        console.error('[reviewService] Supabase insert error:', error);
      }
    } catch (err) {
      console.warn('[reviewService] Supabase insert failed, storing locally:', err);
    }

    // Local Storage fallback with valid UUID
    const fallbackRecord = {
      id: reviewData.id && isUuid(reviewData.id) ? reviewData.id : generateUUID(),
      ...insertPayload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const current = getLocalReviews();
    const updated = [fallbackRecord, ...current.filter(r => r.id !== fallbackRecord.id)];
    saveLocalReviews(updated);
    return fallbackRecord;
  },

  /**
   * Updates an existing review (status, show_in_home, rating, comments, etc.).
   */
  async update(id, updates) {
    if (!id) throw new Error('Review ID is required');

    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (isUuid(id)) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .update(payload)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && data) {
          const local = getLocalReviews();
          saveLocalReviews(local.map(r => (r.id === id ? { ...r, ...data } : r)));
          return data;
        }
        if (error) {
          console.warn('[reviewService] Supabase update warning:', error);
        }
      } catch (err) {
        console.warn('[reviewService] Supabase update failed, updating locally:', err);
      }
    }

    const local = getLocalReviews();
    const updated = local.map(r => (r.id === id ? { ...r, ...payload } : r));
    saveLocalReviews(updated);
    return updated.find(r => r.id === id);
  },

  /**
   * Deletes a review by ID.
   */
  async delete(id) {
    if (!id) throw new Error('Review ID is required');

    if (isUuid(id)) {
      try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', id);
        if (error) {
          console.warn('[reviewService] Supabase delete warning:', error);
        }
      } catch (err) {
        console.warn('[reviewService] Supabase delete failed, deleting locally:', err);
      }
    }

    const local = getLocalReviews();
    const filtered = local.filter(r => r.id !== id);
    saveLocalReviews(filtered);
    return true;
  },

  /**
   * Calculates overall review KPIs and distribution.
   */
  calculateStats(reviews = []) {
    if (!reviews || reviews.length === 0) {
      return {
        total: 0,
        averageRating: '5.0',
        homeFeaturedCount: 0,
        approvedCount: 0,
        pendingCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = reviews.length;
    const approved = reviews.filter(r => r.status === 'approved');
    const pending = reviews.filter(r => r.status === 'pending');
    const homeFeatured = reviews.filter(r => r.show_in_home && r.status === 'approved');

    const sumRatings = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    const averageRating = (sumRatings / total).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      distribution[star] = (distribution[star] || 0) + 1;
    });

    return {
      total,
      averageRating,
      homeFeaturedCount: homeFeatured.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      distribution
    };
  }
};
