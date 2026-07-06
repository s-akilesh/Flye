import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LearningRepository } from '../data/learning';
import { useComponentAssets } from '../hooks/useComponentAssets';
import { componentAssetService } from '../services/componentAssetService';
import { useToast } from '../context/ToastContext';

export const EditComponentAssets = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    assets,
    parts,
    buildVideo,
    isLoading,
    fetchAssetsAndParts,
    uploadAsset,
    deleteAsset,
    saveParts,
    deletePart,
    saveBuildVideoInfo,
    deleteBuildVideoInfo
  } = useComponentAssets();

  // Find component details
  const component = useMemo(() => {
    return LearningRepository.getComponentBySlug(slug);
  }, [slug]);

  // Compute folder path category folder
  const getCategoryFolder = (categoryName) => {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('board')) return 'boards';
    if (name.includes('sensor')) return 'sensors';
    if (name.includes('semiconductor')) return 'semiconductors';
    return 'passive';
  };

  // Compute exact folder structure matching specifications
  const storageFolder = useMemo(() => {
    if (!component) return '';
    const categoryFolder = getCategoryFolder(component.category);
    const family = LearningRepository.getFamilyBySlug(component.slug);
    const familySlug = family ? family.id : component.slug;
    
    if (familySlug && familySlug !== component.slug) {
      return `${categoryFolder}/${familySlug}/${component.slug}`;
    }
    return `${categoryFolder}/${component.slug}`;
  }, [component]);

  // Local state for parts list management
  const [localParts, setLocalParts] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState('manager'); // 'manager' | 'preview'

  // Video guide states
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [fetchingTitle, setFetchingTitle] = useState(false);

  // Sync inputs with database loaded state
  useEffect(() => {
    if (buildVideo) {
      setVideoUrl(buildVideo.video_url || '');
      setVideoTitle(buildVideo.video_title || '');
    } else {
      setVideoUrl('');
      setVideoTitle('');
    }
  }, [buildVideo]);

  const handleFetchTitle = async () => {
    if (!videoUrl) {
      showToast('Please enter a YouTube video URL first.', 'warning');
      return;
    }
    setFetchingTitle(true);
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      if (data.title) {
        setVideoTitle(data.title);
        showToast('Fetched video title successfully!', 'success');
      } else {
        showToast('Could not fetch title from URL. Please enter it manually.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error fetching video title.', 'error');
    } finally {
      setFetchingTitle(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!videoUrl) {
      showToast('Please enter a valid video URL.', 'warning');
      return;
    }
    try {
      await saveBuildVideoInfo(slug, videoUrl, videoTitle);
    } catch (err) {
      console.error(err);
    }
  };

  // Load list of all other components to populate the 'Link to another component' dropdown
  const allComponents = useMemo(() => {
    return LearningRepository.getComponents() || [];
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (slug) {
      fetchAssetsAndParts(slug);
    }
  }, [slug, fetchAssetsAndParts]);

  // Synchronize database parts to local state
  useEffect(() => {
    if (parts && parts.length > 0) {
      setLocalParts(parts);
    } else {
      setLocalParts([]);
    }
  }, [parts]);

  if (!component) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        <h3>Component not found: {slug}</h3>
        <Button variant="secondary" onClick={() => navigate('/admin/components')}>
          Back to list
        </Button>
      </div>
    );
  }

  // Handle master SVG file selection & client-side parsing
  const handleSvgUpload = async (e, assetType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Upload to Supabase Storage
      await uploadAsset(slug, storageFolder, file, assetType);

      // 2. If it is the master component SVG, parse and merge interactive layers
      if (assetType === 'component') {
        setIsParsing(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target.result;
          const parsedLayers = componentAssetService.parseSvgLayers(text);
          
          if (parsedLayers.length > 0) {
            // Merge parsed layers with existing local parts
            const mergedParts = [...localParts];
            parsedLayers.forEach(parsed => {
              const exists = mergedParts.some(p => p.svg_layer_id === parsed.id);
              if (!exists) {
                mergedParts.push({
                  svg_layer_id: parsed.id,
                  display_name: parsed.name,
                  part_type: '',
                  description: '',
                  linked_component_slug: '',
                  is_enabled: true,
                  sort_order: mergedParts.length
                });
              }
            });
            setLocalParts(mergedParts);
            showToast(`Detected and merged ${parsedLayers.length} interactive groups from SVG.`, 'info');
          } else {
            showToast('No interactive groups (<g id="...">) detected in the uploaded SVG.', 'warning');
          }
          setIsParsing(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error(err);
      setIsParsing(false);
    }
  };

  const handleUpdatePartField = (index, field, value) => {
    setLocalParts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleReorderPart = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === localParts.length - 1) return;

    const swapWith = direction === 'up' ? index - 1 : index + 1;
    setLocalParts(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[swapWith];
      copy[swapWith] = temp;
      
      // Update sort order values
      return copy.map((item, idx) => ({ ...item, sort_order: idx }));
    });
  };

  const handleSaveParts = async () => {
    try {
      await saveParts(slug, localParts);
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-generate asset properties
  const assetTypes = [
    { type: 'component', label: 'Master Component SVG', desc: 'The source master SVG layer used for general overview rendering' },
    { type: 'pinout', label: 'Pinout SVG', desc: 'Overlay SVG highlighting header connections and breakout pins' },
    { type: 'exploded', label: 'Exploded View SVG', desc: 'SVG splitting component internal layer structures' },
    { type: 'thumbnail', label: 'WebP Thumbnail', desc: 'Raster WebP image to display in general catalogs and grids' },
    { type: 'working_gif', label: 'Working Animation GIF', desc: 'GIF animation showcasing the internal working process of the component' }
  ];

  // Helper to extract assets from current state
  const getAssetRecord = (type) => assets.find(a => a.asset_type === type);

  const getPublicAssetUrl = (path) => {
    if (!path) return '';
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/component-assets/${path}`;
  };

  return (
    <div style={{ padding: '0 40px var(--space-8) 40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
        <div>
          <button 
            onClick={() => navigate('/admin/components')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: 0, marginBottom: '8px' }}
          >
            <span className="material-icons" style={{ fontSize: '14px' }}>arrow_back</span>
            Back to components
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>
            Configure Assets: {component.name}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Storage Path: component-assets/{storageFolder}/</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* Left Side: Uploads & Gallery */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
            🖼️ Asset Library
          </h3>
          
          {assetTypes.map(({ type, label, desc }) => {
            const record = getAssetRecord(type);
            
            return (
              <Card key={type} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff', display: 'block' }}>{label}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{desc}</span>
                  </div>
                  {record && (
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      v{record.version}
                    </span>
                  )}
                </div>

                {record ? (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* Preview box if SVG or Image */}
                    {type !== 'thumbnail' ? (
                      <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', padding: '8px' }}>
                        <img 
                          src={getPublicAssetUrl(record.storage_path)} 
                          alt={label}
                          style={{ maxHeight: '84px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', padding: '8px' }}>
                        <img 
                          src={getPublicAssetUrl(record.storage_path)} 
                          alt="Thumbnail preview"
                          style={{ maxHeight: '84px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {record.file_size ? `${(record.file_size / 1024).toFixed(1)} KB` : ''}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <label className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-icons" style={{ fontSize: '12px' }}>upload</span>
                          Replace
                          <input 
                            type="file" 
                            accept={
                              type === 'working_gif'
                                ? 'image/gif'
                                : type === 'thumbnail'
                                  ? 'image/webp,image/png,image/jpeg'
                                  : '.svg'
                            } 
                            onChange={(e) => handleSvgUpload(e, type)} 
                            style={{ display: 'none' }}
                          />
                        </label>
                        <Button 
                          variant="secondary" 
                          size="small"
                          style={{ color: 'var(--accent-crimson, #ef4444)', padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the ${type} asset?`)) {
                              deleteAsset(slug, type);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', padding: '24px', background: 'rgba(255,255,255,0.005)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>No asset uploaded yet.</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-icons" style={{ fontSize: '14px' }}>upload</span>
                        Upload Asset
                        <input 
                          type="file" 
                          accept={
                            type === 'working_gif'
                              ? 'image/gif'
                              : type === 'thumbnail'
                                ? 'image/webp,image/png,image/jpeg'
                                : '.svg'
                          } 
                          onChange={(e) => handleSvgUpload(e, type)} 
                          style={{ display: 'none' }}
                        />
                      </label>

                      {type !== 'component' && (
                        <Button
                          variant="secondary"
                          size="small"
                          style={{ border: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--accent-violet)' }}
                          onClick={() => {
                            showToast('AI pipeline generation triggers in Phase 2. Ensure master SVG is uploaded first.', 'info');
                          }}
                        >
                          🤖 AI Generate
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right Side: Interactive Parts Manager */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
              ⚙️ Interactive Parts Manager
            </h3>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setActiveTab('manager')}
                style={{
                  background: activeTab === 'manager' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  border: activeTab === 'manager' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                  color: activeTab === 'manager' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Part Rules
              </button>
              <button 
                onClick={() => {
                  const masterSvg = getAssetRecord('component');
                  if (!masterSvg) {
                    showToast('Upload a Master Component SVG to preview interactive layers.', 'warning');
                  } else {
                    setActiveTab('preview');
                  }
                }}
                style={{
                  background: activeTab === 'preview' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  border: activeTab === 'preview' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                  color: activeTab === 'preview' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Live SVG Preview
              </button>
            </div>
          </div>

          <Card style={{ padding: '24px' }}>
            {activeTab === 'preview' && getAssetRecord('component') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Hover over the layers below to test SVG interaction. Enabled items will link to selected learning pages.
                </span>
                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '360px', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <img 
                    src={getPublicAssetUrl(getAssetRecord('component').storage_path)} 
                    alt="Master Component Preview"
                    style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    Map layer groups extracted from SVG to interactive definitions.
                  </span>
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={handleSaveParts}
                    disabled={isParsing || localParts.length === 0}
                  >
                    Save Interactive Layout
                  </Button>
                </div>

                {isParsing ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Parsing SVG layers...
                  </div>
                ) : localParts.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                    No layers defined yet. Upload a Master Component SVG with id tags (e.g. &lt;g id="usb_port"&gt;) to extract interactive groups automatically.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '10px 8px' }}>SVG Group ID</th>
                          <th style={{ padding: '10px 8px' }}>Display Name</th>
                          <th style={{ padding: '10px 8px' }}>Part Type</th>
                          <th style={{ padding: '10px 8px' }}>Linked Page</th>
                          <th style={{ padding: '10px 8px', textAlign: 'center' }}>Active</th>
                          <th style={{ padding: '10px 8px', textAlign: 'center' }}>Order</th>
                          <th style={{ padding: '10px 8px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localParts.map((part, index) => (
                          <tr key={part.svg_layer_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>
                              {part.svg_layer_id}
                            </td>
                            <td style={{ padding: '10px 8px' }}>
                              <Input
                                value={part.display_name}
                                onChange={(e) => handleUpdatePartField(index, 'display_name', e.target.value)}
                                className="form-input"
                              />
                            </td>
                            <td style={{ padding: '10px 8px' }}>
                              <Input
                                value={part.part_type || ''}
                                placeholder="e.g. mcu, connector"
                                onChange={(e) => handleUpdatePartField(index, 'part_type', e.target.value)}
                                className="form-input"
                              />
                            </td>
                            <td style={{ padding: '10px 8px' }}>
                              <select
                                value={part.linked_component_slug || ''}
                                onChange={(e) => handleUpdatePartField(index, 'linked_component_slug', e.target.value)}
                                style={{
                                  background: 'rgba(0,0,0,0.3)',
                                  color: '#fff',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  width: '100%',
                                  outline: 'none'
                                }}
                              >
                                <option value="">— None —</option>
                                {allComponents.map(c => (
                                  <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={part.is_enabled !== false}
                                onChange={(e) => handleUpdatePartField(index, 'is_enabled', e.target.checked)}
                                style={{ accentColor: 'var(--accent-violet)', cursor: 'pointer' }}
                              />
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => handleReorderPart(index, 'up')}
                                  disabled={index === 0}
                                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                                >
                                  ▲
                                </button>
                                <button 
                                  onClick={() => handleReorderPart(index, 'down')}
                                  disabled={index === localParts.length - 1}
                                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: index === localParts.length - 1 ? 0.3 : 1 }}
                                >
                                  ▼
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  if (part.id) {
                                    if (confirm('Delete this part definition from database?')) {
                                      deletePart(part.id, slug);
                                    }
                                  } else {
                                    setLocalParts(prev => prev.filter((_, idx) => idx !== index));
                                  }
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-crimson, #ef4444)', cursor: 'pointer', fontSize: '11px' }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Video Build Guide Configuration card */}
          <Card style={{ padding: '24px', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
                ⚡ Video Build Guide Configuration
              </h3>
              {buildVideo && (
                <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  Active Build Video
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Video URL (YouTube)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="form-input"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleFetchTitle}
                    disabled={fetchingTitle || !videoUrl}
                  >
                    {fetchingTitle ? 'Fetching...' : 'Fetch Title'}
                  </Button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Video Title
                </label>
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Capacitor charge-discharge guide"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                {buildVideo && (
                  <Button
                    variant="secondary"
                    size="small"
                    style={{ color: 'var(--accent-crimson, #ef4444)' }}
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this build video guide?')) {
                        deleteBuildVideoInfo(slug);
                      }
                    }}
                  >
                    Remove Video
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveVideo}
                  disabled={!videoUrl}
                >
                  Save Video Guide
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
