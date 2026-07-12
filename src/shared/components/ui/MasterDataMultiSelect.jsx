import React, { useState, useEffect, useRef } from 'react';
import { masterDataService } from '../../services/masterDataService.js';

export const MasterDataMultiSelect = ({
  type,
  selectedValues = [],
  onChange,
  placeholder = 'Select Options',
  label,
  required = false,
  allowAdd = true
}) => {
  const [options, setOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newValueName, setNewValueName] = useState('');
  const wrapperRef = useRef(null);

  // Load active master data values
  const loadOptions = async () => {
    try {
      const data = await masterDataService.getValues(type);
      setOptions(data);
    } catch (err) {
      console.error(`[MasterDataMultiSelect] Failed to load values for type ${type}:`, err);
    }
  };

  useEffect(() => {
    loadOptions();
  }, [type]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setShowAddNew(false);
        setNewValueName('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value) => {
    let nextValues;
    if (selectedValues.includes(value)) {
      nextValues = selectedValues.filter(v => v !== value);
    } else {
      nextValues = [...selectedValues, value];
    }
    // Sort, unique, and filter using centralized helper
    const parsed = masterDataService.parseMultiSelect(nextValues);
    onChange(parsed);
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!newValueName.trim()) return;
    try {
      await masterDataService.ensureValueExists(type, newValueName);
      masterDataService.refresh(type); // Invalidate cache
      
      const updated = await masterDataService.getValues(type);
      setOptions(updated);

      const cleanValue = masterDataService.normalizeValue(newValueName);
      const nextValues = masterDataService.parseMultiSelect([...selectedValues, cleanValue]);
      onChange(nextValues);

      setNewValueName('');
      setShowAddNew(false);
    } catch (err) {
      console.error(`[MasterDataMultiSelect] Failed to add value:`, err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNew(e);
    }
  };

  const cleanLabel = (val) => {
    return val;
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="form-input"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          cursor: 'pointer',
          width: '100%',
          height: '38px',
          paddingTop: 0,
          paddingBottom: 0
        }}
      >
        <span style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '90%',
          color: selectedValues.length > 0 ? 'var(--txt-primary)' : 'var(--txt-muted)',
          fontSize: '13px'
        }}>
          {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
        </span>
        <span style={{
          transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          display: 'inline-block',
          fontSize: '10px',
          color: 'var(--txt-muted)'
        }}>
          ▼
        </span>
      </button>

      {dropdownOpen && (
        <div
          className="card-glass"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '8px 0',
            border: '1px solid var(--sys-border)',
            background: 'var(--sys-surface-elevated)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {options.map((item) => {
            const isSelected = selectedValues.includes(item.value);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  userSelect: 'none',
                  margin: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--interaction-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => handleToggle(item.value)}
              >
                <span style={{ fontSize: '13px', color: isSelected ? 'var(--txt-primary)' : 'var(--txt-secondary)' }}>
                  {cleanLabel(item.value)}
                </span>
                {isSelected && (
                  <span className="material-icons" style={{ fontSize: '16px', color: 'var(--brand-primary)' }}>check</span>
                )}
              </div>
            );
          })}

          {options.length === 0 && !showAddNew && (
            <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--txt-muted)', textAlign: 'center' }}>
              No options found
            </div>
          )}

          {allowAdd && (
            <>
              {!showAddNew ? (
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    borderTop: '1px solid var(--sys-divider)',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowAddNew(true); }}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      height: '30px',
                      padding: '0 8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '12px' }}>add</span>
                    Add New Option
                  </button>
                </div>
              ) : (
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    borderTop: '1px solid var(--sys-divider)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Enter new option..."
                    className="form-input"
                    value={newValueName}
                    onChange={(e) => setNewValueName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ height: '30px', fontSize: '12px', width: '100%', padding: '0 8px', background: 'var(--input-bg)', color: 'var(--txt-primary)', border: '1px solid var(--input-border)', borderRadius: '4px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="btn-primary"
                      style={{ flex: 1, height: '26px', fontSize: '11px', padding: 0 }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddNew(false); setNewValueName(''); }}
                      className="btn-secondary"
                      style={{ flex: 1, height: '26px', fontSize: '11px', padding: 0 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
