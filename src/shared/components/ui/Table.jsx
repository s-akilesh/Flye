import React from 'react';
import { Skeleton } from './Skeleton';

const getTextContent = (node) => {
  if (!node) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (node.props) {
    if (node.props.children) {
      return getTextContent(node.props.children);
    }
  }
  return '';
};

const isClampableText = (node) => {
  if (!node) return false;
  if (typeof node === 'string' || typeof node === 'number') return true;
  if (Array.isArray(node)) {
    return node.every(isClampableText);
  }
  if (node.props) {
    const type = node.type;
    if (typeof type === 'string') {
      if (['img', 'button', 'input', 'select', 'textarea', 'a'].includes(type)) return false;
      if (node.props.style && (node.props.style.display === 'flex' || node.props.style.display === 'grid')) {
        return false;
      }
    } else if (typeof type === 'function' || typeof type === 'object') {
      const typeName = type.name || (type.render && type.render.name) || '';
      if (['Button', 'Badge', 'Skeleton', 'Link'].includes(typeName)) {
        return false;
      }
    }
    return isClampableText(node.props.children);
  }
  return false;
};

const containsCheckbox = (node) => {
  if (!node) return false;
  if (node.props) {
    if (node.type === 'input' && node.props.type === 'checkbox') return true;
    if (node.props.children) {
      if (Array.isArray(node.props.children)) {
        return node.props.children.some(containsCheckbox);
      }
      return containsCheckbox(node.props.children);
    }
  }
  return false;
};

const clampTextNodes = (node) => {
  if (!node) return node;

  // If it's a plain string or number
  if (typeof node === 'string' || typeof node === 'number') {
    const textContent = String(node);
    if (!textContent.trim()) return node;
    return (
      <div
        title={textContent}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          maxHeight: '2.8em',
          lineHeight: '1.4'
        }}
      >
        {node}
      </div>
    );
  }

  // If it's a React element
  if (node.props) {
    const type = node.type;
    // Don't clamp interactive or semantic elements
    if (typeof type === 'string') {
      if (['img', 'button', 'input', 'select', 'textarea', 'a'].includes(type)) return node;
    } else if (typeof type === 'function' || typeof type === 'object') {
      const typeName = type.name || (type.render && type.render.name) || '';
      if (['Button', 'Badge', 'Skeleton', 'Link'].includes(typeName)) return node;
    }

    // Flex/grid containers: recurse into children but do not clamp the container itself
    if (node.props.style && (node.props.style.display === 'flex' || node.props.style.display === 'grid')) {
      if (node.props.children) {
        return React.cloneElement(node, {
          children: React.Children.map(node.props.children, clampTextNodes)
        });
      }
      return node;
    }

    // Normal element (like span): check if its own children are clampable
    const textContent = getTextContent(node.props.children);
    const hasClamping = textContent.trim() && isClampableText(node.props.children);
    if (hasClamping) {
      return (
        <div
          title={textContent}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            maxHeight: '2.8em',
            lineHeight: '1.4'
          }}
        >
          {node}
        </div>
      );
    } else if (node.props.children) {
      return React.cloneElement(node, {
        children: React.Children.map(node.props.children, clampTextNodes)
      });
    }
  }

  return node;
};

export const Table = ({
  headers = [], // array of string labels or object { label, style }
  data = [],
  renderRow,
  isLoading = false,
  emptyMessage = "No records found.",
  minWidth = "800px",
  onRowClick,
  className = ""
}) => {
  return (
    <div className={`tbl-scroll-wrap ${className}`} style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--sys-divider)', background: 'var(--sys-surface-elevated)' }}>
            {headers.map((header, idx) => {
              const label = typeof header === 'object' ? header.label : header;
              const style = typeof header === 'object' ? header.style : {};
              const isCheckbox = (label && typeof label === 'object' && containsCheckbox(label)) || style.width === '36px' || style.minWidth === '36px';

              return (
                <th
                  key={idx}
                  style={{
                    padding: '12px 20px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--txt-secondary)',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    minWidth: isCheckbox ? 'max-content' : '160px',
                    maxWidth: isCheckbox ? 'max-content' : '280px',
                    height: '48px',
                    boxSizing: 'border-box',
                    verticalAlign: 'middle',
                    ...style
                  }}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Render Skeleton rows matching header columns count
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid var(--sys-divider)' }}>
                {headers.map((_, cIdx) => {
                  const header = headers[cIdx];
                  const style = typeof header === 'object' ? header.style : {};
                  const label = typeof header === 'object' ? header.label : header;
                  const isCheckbox = (label && typeof label === 'object' && containsCheckbox(label)) || style.width === '36px' || style.minWidth === '36px';

                  return (
                    <td 
                      key={cIdx} 
                      style={{ 
                        padding: '12px 20px', 
                        minWidth: isCheckbox ? 'max-content' : '160px', 
                        maxWidth: isCheckbox ? 'max-content' : '280px',
                        height: '48px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Skeleton style={{ height: '16px', borderRadius: '4px', width: cIdx === 0 ? '70%' : '50%' }} />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: 'var(--txt-muted)',
                  fontSize: '13px'
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => {
              const rowContent = renderRow ? renderRow(item, idx) : null;
              if (!rowContent) return null;

              // Process each <td> child of the row to apply text clamping and tooltip automatically
              const processedChildren = React.Children.map(rowContent.props.children, (child, cIdx) => {
                if (!child || child.type !== 'td') return child;

                const textContent = getTextContent(child.props.children);
                const hasClamping = textContent.trim() && isClampableText(child.props.children);
                const isCheckbox = containsCheckbox(child.props.children) || (child.props.style && (child.props.style.width === '36px' || child.props.style.minWidth === '36px'));

                const cellStyle = {
                  padding: '12px 20px',
                  minWidth: isCheckbox ? 'max-content' : '160px',
                  maxWidth: isCheckbox ? 'max-content' : '280px',
                  height: '48px',
                  boxSizing: 'border-box',
                  verticalAlign: 'middle',
                  fontSize: '14px',
                  ...child.props.style
                };

                let clampedChildren = child.props.children;
                if (hasClamping) {
                  clampedChildren = (
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        maxHeight: '2.8em',
                        lineHeight: '1.4'
                      }}
                    >
                      {child.props.children}
                    </div>
                  );
                } else if (!isCheckbox) {
                  clampedChildren = React.Children.map(child.props.children, clampTextNodes);
                }

                return React.cloneElement(child, {
                  key: child.key || cIdx,
                  title: hasClamping ? (child.props.title || textContent) : child.props.title,
                  style: cellStyle,
                  children: clampedChildren
                });
              });

              // Clone the row element to safely inject classes, event-handlers, and processed cells
              return React.cloneElement(rowContent, {
                key: rowContent.key || idx,
                onClick: (e) => {
                  if (rowContent.props.onClick) rowContent.props.onClick(e);
                  if (onRowClick) onRowClick(item);
                },
                className: `admin-table-row ${rowContent.props.className || ''}`,
                style: {
                  borderBottom: '1px solid var(--sys-divider)',
                  cursor: onRowClick || rowContent.props.onClick ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                  ...rowContent.props.style
                },
                children: processedChildren
              });
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
