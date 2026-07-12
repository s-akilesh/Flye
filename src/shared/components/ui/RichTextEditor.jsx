import React, { useRef, useEffect } from 'react';

/**
 * RichTextEditor - A premium, lightweight React WYSIWYG editor
 * using HTML5 contentEditable. Styled to match the Flyen theme.
 */
export const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Sync value from props to editor innerHTML (only when different to prevent cursor jumping)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const addCodeBlock = () => {
    const selection = window.getSelection().toString();
    if (selection) {
      const codeHtml = `<pre><code>${selection}</code></pre>`;
      executeCommand('insertHTML', codeHtml);
    } else {
      executeCommand('insertHTML', '<pre><code>Code block</code></pre>');
    }
  };

  const addImage = () => {
    const url = prompt("Enter Image URL (optional, or press OK for placeholder):");
    const imageUrl = url || 'src/assets/projects/smart-home/main.svg';
    executeCommand('insertHTML', `<img src="${imageUrl}" alt="Embedded Image" style="max-width: 100%; border-radius: 6px; margin: var(--space-3) 0;" />`);
  };

  return (
    <div className="rich-text-editor card-glass" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--sys-border)' }}>
      {/* Toolbar */}
      <div className="rte-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '6px', borderBottom: '1px solid var(--sys-divider)', background: 'var(--interaction-hover)' }}>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h3>')} title="Heading 3" className="rte-btn">H3</button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h4>')} title="Heading 4" className="rte-btn">H4</button>
        <div className="rte-divider" />
        <button type="button" onClick={() => executeCommand('bold')} title="Bold" className="rte-btn" style={{ fontWeight: 'bold' }}>B</button>
        <button type="button" onClick={() => executeCommand('italic')} title="Italic" className="rte-btn" style={{ fontStyle: 'italic' }}>I</button>
        <button type="button" onClick={() => executeCommand('underline')} title="Underline" className="rte-btn" style={{ textDecoration: 'underline' }}>U</button>
        <div className="rte-divider" />
        <button type="button" onClick={() => executeCommand('insertUnorderedList')} title="Bullet List" className="rte-btn">• List</button>
        <button type="button" onClick={() => executeCommand('insertOrderedList')} title="Numbered List" className="rte-btn">1. List</button>
        <div className="rte-divider" />
        <button type="button" onClick={addLink} title="Insert Link" className="rte-btn">🔗 Link</button>
        <button type="button" onClick={addCodeBlock} title="Code Block" className="rte-btn">💻 Code</button>
        <button type="button" onClick={addImage} title="Embed Image" className="rte-btn">🖼️ Image</button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rte-content"
        placeholder={placeholder || "Start writing structured description..."}
        style={{
          minHeight: '220px',
          padding: 'var(--space-4)',
          outline: 'none',
          color: 'var(--txt-primary)',
          fontSize: '14.5px',
          lineHeight: '1.6',
          overflowY: 'auto'
        }}
      />
    </div>
  );
};
