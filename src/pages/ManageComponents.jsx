import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LearningRepository } from '../data/learning';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export const ManageComponents = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dbAssets, setDbAssets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load all components from repository
  const components = useMemo(() => {
    return LearningRepository.getComponents() || [];
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set(components.map(c => c.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [components]);

  // Load asset metadata from database to show checkmarks
  useEffect(() => {
    const fetchAssetStatuses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('component_assets')
          .select('component_slug, asset_type, version');

        if (error) throw error;

        // Group by component_slug
        const assetMap = {};
        data.forEach(item => {
          if (!assetMap[item.component_slug]) {
            assetMap[item.component_slug] = {};
          }
          assetMap[item.component_slug][item.asset_type] = item.version;
        });

        setDbAssets(assetMap);
      } catch (err) {
        console.error('Error fetching asset statuses:', err);
        showToast('Failed to load asset status checklist from database.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetStatuses();
  }, [showToast]);

  // Filter components
  const filteredComponents = useMemo(() => {
    return components.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) || 
                            comp.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || comp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [components, search, categoryFilter]);

  // Count total assets uploaded
  const stats = useMemo(() => {
    let uploadedCount = 0;
    const slugs = Object.keys(dbAssets);
    slugs.forEach(slug => {
      uploadedCount += Object.keys(dbAssets[slug] || {}).length;
    });
    return {
      totalComponents: components.length,
      uploadedAssets: uploadedCount
    };
  }, [components, dbAssets]);

  return (
    <div style={{ padding: '0 40px var(--space-8) 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="portal-header" style={{ padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
        <div className="portal-title-area">
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>Component Asset Workspace</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage master SVGs, interactive parts, and design assets for all engineering components
          </p>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* KPI Summary Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <Card style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total components</span>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-blue)', margin: '8px 0 0 0' }}>{stats.totalComponents}</h3>
          </Card>
          <Card style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total assets uploaded</span>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-emerald)', margin: '8px 0 0 0' }}>{stats.uploadedAssets}</h3>
          </Card>
        </div>

        {/* Toolbar card */}
        <Card style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Search components by name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Components list card */}
        <div className="card-glass" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Component</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Level</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Master SVG</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Pinout</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Exploded</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Thumbnail</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading component asset statuses...
                  </td>
                </tr>
              ) : filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No components found matching your search.
                  </td>
                </tr>
              ) : (
                filteredComponents.map((comp) => {
                  const assets = dbAssets[comp.slug] || {};
                  
                  const renderStatusIcon = (assetType) => {
                    const version = assets[assetType];
                    if (version) {
                      return (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', fontSize: '15px' }}>✓</span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>v{version}</span>
                        </div>
                      );
                    }
                    return <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>—</span>;
                  };

                  return (
                    <tr 
                      key={comp.slug} 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{comp.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{comp.slug}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{comp.category}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '11px', 
                          background: 'rgba(139, 92, 246, 0.08)', 
                          border: '1px solid rgba(139, 92, 246, 0.15)', 
                          color: 'var(--accent-violet)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          Level {comp.level || '1'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>{renderStatusIcon('component')}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>{renderStatusIcon('pinout')}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>{renderStatusIcon('exploded')}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>{renderStatusIcon('thumbnail')}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <Button 
                          type="button"
                          variant="secondary" 
                          onClick={() => navigate(`/admin/components/edit/${comp.slug}`)}
                          style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Assets"
                        >
                          <span className="material-icons-outlined" style={{ fontSize: '16px' }}>edit</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
