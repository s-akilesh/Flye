import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../../modules/projects/hooks/useProjects';
import { printingInventoryService } from '../../../modules/printing-inventory/services/printingInventoryService';
import { masterDataService } from '../../services/masterDataService';
import { useCart, formatCurrency, parseNumericPrice } from '../../context/CartContext';
import { ROUTES } from '../../constants/routes';

const RECENT_SEARCHES_KEY = 'flyen_recent_searches_v1';

const STATIC_QUICK_LINKS = [
  {
    id: 'page-printing',
    title: '3D Printing Catalog',
    sub: 'Functional parts, enclosures, prototypes & replacement gears',
    category: 'Catalog',
    type: 'page',
    icon: 'view_in_ar',
    route: ROUTES.PRINTING
  },
  {
    id: 'page-projects',
    title: 'Ready-Made Project Kits',
    sub: 'Verified final-year IoT, Robotics, and Embedded hardware packages',
    category: 'Catalog',
    type: 'page',
    icon: 'memory',
    route: ROUTES.PROJECTS
  },
  {
    id: 'page-my-projects',
    title: 'My Enquiries & Tracking',
    sub: 'Check quotes, active builds & project progress',
    category: 'Orders',
    type: 'page',
    icon: 'folder_shared',
    route: ROUTES.MY_PROJECTS
  },
  {
    id: 'page-contact',
    title: 'Contact Engineering Lab',
    sub: 'Talk with our technical hardware mentors in Chennai',
    category: 'Support',
    type: 'page',
    icon: 'support_agent',
    route: ROUTES.CONTACT
  },
  {
    id: 'page-feedback',
    title: 'Share Maker Feedback & Reviews',
    sub: 'Submit testimonial or review component precision',
    category: 'Community',
    type: 'page',
    icon: 'rate_review',
    route: ROUTES.FEEDBACK || '/feedback'
  }
];

const POPULAR_TAGS = [
  '3D Printing',
  'Drone',
  'Autonomous Rover',
  'ESP32 IoT',
  'Solar MPPT',
  'Custom Enclosure',
  'PETG',
  'Robotics'
];

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { addToCart, isItemInCart } = useCart();
  const { projects } = useProjects();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | '3d' | 'projects' | 'pages'
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 3D Products & Categories State
  const [printingProducts, setPrintingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fetch search sources
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchSearchData = async () => {
      try {
        const [prints, cats] = await Promise.all([
          printingInventoryService.getPublishedProducts().catch(() => []),
          masterDataService.getCategories().catch(() => [])
        ]);
        if (isMounted) {
          setPrintingProducts(prints || []);
          setCategories(cats || []);
        }
      } catch (err) {
        console.error('Failed to load global search data:', err);
      }
    };
    fetchSearchData();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveTab('all');
    }
  }, [isOpen]);

  // Save query to recent searches
  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const trimmed = term.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Build searchable index
  const searchIndex = useMemo(() => {
    const list = [];

    // 1. Projects
    (projects || []).forEach(p => {
      const img = p.images?.main || (Array.isArray(p.images) ? p.images[0] : '') || p.image || '';
      list.push({
        id: `proj-${p.id || p.slug}`,
        rawId: p.id,
        slug: p.slug,
        title: p.title || p.name || 'Project Kit',
        description: p.short_description || p.description || '',
        category: p.category || 'Electronics Kit',
        price: p.price ? String(p.price) : 'Contact for Quote',
        numericPrice: parseNumericPrice(p.price),
        image: img,
        type: 'project',
        tags: [p.category, p.difficulty, p.tags, 'hardware', 'kit', 'electronics'].filter(Boolean).join(' ')
      });
    });

    // 2. 3D Print Products
    (printingProducts || []).forEach(p => {
      const img = p.primary_image_url || p.image_url || (p.images && p.images[0]?.image_url) || '';
      list.push({
        id: `print-${p.id || p.idNum}`,
        rawId: p.id,
        idNum: p.idNum || p.id,
        title: p.title || p.name || '3D Printed Product',
        description: p.description || '',
        category: p.category || '3D Printing',
        material: p.material || 'PLA / PETG',
        price: p.price ? String(p.price) : '₹499',
        numericPrice: parseNumericPrice(p.price || 499),
        image: img,
        type: '3d_print',
        tags: [p.category, p.material, p.tags, '3d print', 'enclosure', 'parts'].filter(Boolean).join(' ')
      });
    });

    // 3. Static Pages & Quick Services
    STATIC_QUICK_LINKS.forEach(page => {
      list.push({
        id: page.id,
        title: page.title,
        description: page.sub,
        category: page.category,
        type: 'page',
        icon: page.icon,
        route: page.route,
        tags: `${page.title} ${page.sub} ${page.category} page navigate`
      });
    });

    // 4. Dynamic Categories
    (categories || []).forEach(cat => {
      const is3d = cat.type === '3d_print_category';
      const route = is3d
        ? `${ROUTES.PRINTING}?category=${encodeURIComponent(cat.key || cat.value)}`
        : `${ROUTES.PROJECTS}?category=${encodeURIComponent(cat.value || cat.key)}`;

      list.push({
        id: `cat-${cat.id || cat.key}`,
        title: `${cat.value} (${is3d ? '3D Category' : 'Project Category'})`,
        description: `Explore all items categorized under ${cat.value}`,
        category: is3d ? '3D Category' : 'Project Category',
        type: 'category',
        icon: is3d ? 'view_in_ar' : 'memory',
        route,
        tags: `${cat.value} ${cat.key} category filter`
      });
    });

    return list;
  }, [projects, printingProducts, categories]);

  // Filter results based on query and active tab
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return searchIndex.filter(item => {
      // Tab filter
      if (activeTab === '3d' && item.type !== '3d_print') return false;
      if (activeTab === 'projects' && item.type !== 'project') return false;
      if (activeTab === 'pages' && item.type !== 'page' && item.type !== 'category') return false;

      // Text search match
      const titleMatch = item.title?.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      const catMatch = item.category?.toLowerCase().includes(q);
      const tagMatch = item.tags?.toLowerCase().includes(q);

      return titleMatch || descMatch || catMatch || tagMatch;
    });
  }, [searchIndex, query, activeTab]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { all: 0, '3d': 0, projects: 0, pages: 0 };

    const matches = searchIndex.filter(item => {
      return item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.tags?.toLowerCase().includes(q);
    });

    return {
      all: matches.length,
      '3d': matches.filter(i => i.type === '3d_print').length,
      projects: matches.filter(i => i.type === 'project').length,
      pages: matches.filter(i => i.type === 'page' || i.type === 'category').length
    };
  }, [searchIndex, query]);

  // Handle clicking a result
  const handleSelectResult = useCallback((item) => {
    if (!item) return;
    saveRecentSearch(query || item.title);
    onClose();

    if (item.type === 'project' && item.slug) {
      navigate(ROUTES.PROJECT_DETAILS.replace(':slug', item.slug));
    } else if (item.type === '3d_print' && item.idNum) {
      navigate(ROUTES.PRINTING_DETAILS.replace(':id', item.idNum));
    } else if (item.route) {
      navigate(item.route);
    }
  }, [navigate, onClose, query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter') {
        if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, handleSelectResult, onClose]);

  const highlightMatch = (text, term) => {
    if (!term || !text) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} style={{ color: 'var(--flyen-teal, #00dfa2)', fontWeight: '800', background: 'rgba(0, 223, 162, 0.1)', borderRadius: '2px', padding: '0 2px' }}>
          {part}
        </span>
      ) : part
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '70px 16px 24px 16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(5, 7, 13, 0.78)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />

          {/* Search Spotlight Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              maxHeight: 'calc(100vh - 110px)',
              background: 'var(--sys-surface, #0f131d)',
              border: '1px solid var(--sys-border, rgba(255, 255, 255, 0.12))',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 10
            }}
          >
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--sys-divider, rgba(255, 255, 255, 0.08))',
              gap: '12px',
              background: 'var(--sys-surface-hover, rgba(255, 255, 255, 0.02))'
            }}>
              <span className="material-icons" style={{ fontSize: '22px', color: 'var(--flyen-teal, #00dfa2)' }}>
                search
              </span>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search 3D prints, project kits, IoT nodes, sensors, guides..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--txt-primary, #ffffff)',
                  fontFamily: 'Inter, sans-serif'
                }}
              />

              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--txt-muted, #94a3b8)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Clear"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                </button>
              ) : (
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: 'var(--txt-muted, #64748b)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  letterSpacing: '0.4px'
                }}>
                  ESC
                </span>
              )}
            </div>

            {/* Filter Tabs (When Query is active) */}
            {query.trim() && (
              <div style={{
                display: 'flex',
                gap: '6px',
                padding: '10px 18px',
                borderBottom: '1px solid var(--sys-divider, rgba(255, 255, 255, 0.06))',
                background: 'var(--sys-surface, #0f131d)',
                overflowX: 'auto'
              }}>
                {[
                  { id: 'all', label: 'All Results', count: tabCounts.all },
                  { id: '3d', label: '3D Prints', count: tabCounts['3d'] },
                  { id: 'projects', label: 'Project Kits', count: tabCounts.projects },
                  { id: 'pages', label: 'Pages & Topics', count: tabCounts.pages }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === tab.id ? 'rgba(0, 223, 162, 0.15)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--flyen-teal, #00dfa2)' : 'var(--txt-muted, #94a3b8)',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label} <span style={{ opacity: 0.7, fontSize: '10.5px' }}>({tab.count})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Results / Suggestions Scrollable Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {query.trim() ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const inCart = (item.type === 'project' || item.type === '3d_print') && isItemInCart(item.rawId || item.idNum || item.slug);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: isSelected ? 'rgba(0, 223, 162, 0.08)' : 'transparent',
                          border: isSelected ? '1px solid rgba(0, 223, 162, 0.25)' : '1px solid transparent',
                          cursor: 'pointer',
                          gap: '12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          {/* Image Thumbnail or Icon */}
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#090d16',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: 'var(--flyen-teal)'
                          }}>
                            {item.image ? (
                              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span className="material-icons" style={{ fontSize: '20px' }}>
                                {item.icon || (item.type === 'project' ? 'memory' : 'view_in_ar')}
                              </span>
                            )}
                          </div>

                          {/* Titles and Sub */}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{
                                fontSize: '13.5px',
                                fontWeight: '700',
                                color: isSelected ? 'var(--txt-primary, #ffffff)' : 'var(--txt-primary, #ffffff)',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {highlightMatch(item.title, query)}
                              </h4>

                              <span style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: item.type === 'project' 
                                  ? 'rgba(99, 102, 241, 0.12)' 
                                  : item.type === '3d_print' 
                                  ? 'rgba(0, 223, 162, 0.12)' 
                                  : 'rgba(255, 255, 255, 0.08)',
                                color: item.type === 'project' 
                                  ? '#818cf8' 
                                  : item.type === '3d_print' 
                                  ? 'var(--flyen-teal, #00dfa2)' 
                                  : 'var(--txt-muted)',
                                flexShrink: 0
                              }}>
                                {item.type === 'project' ? 'Project' : item.type === '3d_print' ? '3D Print' : item.category}
                              </span>
                            </div>

                            {item.description && (
                              <p style={{
                                fontSize: '11.5px',
                                color: 'var(--txt-muted, #94a3b8)',
                                margin: '2px 0 0 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {highlightMatch(item.description, query)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Quick Add-to-Cart Action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          {item.price && (
                            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--flyen-teal, #00dfa2)' }}>
                              {item.price.startsWith('₹') ? item.price : formatCurrency(item.numericPrice || item.price)}
                            </span>
                          )}

                          {(item.type === '3d_print' || item.type === 'project') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart({
                                  id: item.rawId || item.slug || item.idNum,
                                  slug: item.slug,
                                  idNum: item.idNum,
                                  title: item.title,
                                  price: item.price,
                                  image: item.image,
                                  category: item.category,
                                  type: item.type
                                }, 1, {}, true);
                              }}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                background: inCart ? 'var(--flyen-teal)' : 'rgba(255, 255, 255, 0.08)',
                                color: inCart ? '#000000' : 'var(--txt-primary)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s'
                              }}
                              title={inCart ? 'In Cart (Click to add another)' : 'Add to cart'}
                            >
                              <span className="material-icons" style={{ fontSize: '16px' }}>
                                {inCart ? 'check' : 'add_shopping_cart'}
                              </span>
                            </button>
                          )}

                          <span className="material-icons" style={{ fontSize: '16px', color: 'var(--txt-muted)' }}>
                            chevron_right
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* No Results Found View */
                  <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                    <span className="material-icons" style={{ fontSize: '38px', color: 'var(--txt-muted)', marginBottom: '8px' }}>
                      search_off
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--txt-primary)', margin: '0 0 6px 0' }}>
                      No matches found for "{query}"
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--txt-muted)', margin: '0 0 16px 0' }}>
                      Have a custom part or project requirement? Request a tailored engineering quote.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(ROUTES.CONTACT);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'rgba(0, 223, 162, 0.15)',
                        border: '1px solid rgba(0, 223, 162, 0.3)',
                        color: 'var(--flyen-teal)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Request Custom Hardware Quote
                    </button>
                  </div>
                )
              ) : (
                /* Empty Query View: Recent Searches & Quick Links */
                <div>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 8px 6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          style={{ background: 'none', border: 'none', color: 'var(--txt-muted)', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setQuery(term)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'var(--sys-surface-hover, rgba(255, 255, 255, 0.04))',
                              border: '1px solid var(--sys-border, rgba(255, 255, 255, 0.08))',
                              color: 'var(--txt-secondary, #cbd5e1)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span className="material-icons" style={{ fontSize: '13px', color: 'var(--txt-muted)' }}>history</span>
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Topics / Quick Suggestions */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ padding: '4px 6px 8px 6px', fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Popular Searches
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {POPULAR_TAGS.map((tag, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setQuery(tag)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: 'rgba(0, 223, 162, 0.06)',
                            border: '1px solid rgba(0, 223, 162, 0.18)',
                            color: 'var(--flyen-teal, #00dfa2)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Navigation Pages */}
                  <div>
                    <div style={{ padding: '4px 6px 8px 6px', fontSize: '11px', fontWeight: '700', color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Quick Links
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {STATIC_QUICK_LINKS.map((link) => (
                        <div
                          key={link.id}
                          onClick={() => {
                            onClose();
                            navigate(link.route);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sys-surface-hover, rgba(255, 255, 255, 0.04))'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="material-icons" style={{ fontSize: '18px', color: 'var(--flyen-teal)' }}>
                            {link.icon}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                              {link.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                              {link.sub}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Keyboard Shortcuts Footer */}
            <div style={{
              padding: '10px 18px',
              background: 'var(--sys-surface-hover, rgba(255, 255, 255, 0.02))',
              borderTop: '1px solid var(--sys-divider, rgba(255, 255, 255, 0.06))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--txt-muted, #94a3b8)'
            }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <span><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', marginRight: '4px' }}>↑</kbd><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', marginRight: '4px' }}>↓</kbd> Navigate</span>
                <span><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', marginRight: '4px' }}>↵</kbd> Select</span>
                <span><kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', marginRight: '4px' }}>ESC</kbd> Close</span>
              </div>

              <span>Flyen Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
