import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../constants/routes';
import { usePrintingProducts } from '../hooks/usePrintingProducts';
import { useToast } from '../context/ToastContext';

const SVG_MAP = {
  gears: <polygon points="32,8 56,22 56,50 32,58 8,50 8,22" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  case: (
    <>
      <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  claw: <path d="M12,24 C12,12 24,12 24,24 M36,24 C36,12 24,12 24,24 M24,24 L24,44" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  cone: <polygon points="32,6 60,54 4,54" stroke="currentColor" strokeWidth="1.5" fill="none" />
};

export const PrintingCatalog = () => {
  const navigate = useNavigate();
  const { printingProducts } = usePrintingProducts();
  const { showToast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState('all');
  const [material, setMaterial] = useState('pla');
  const [infill, setInfill] = useState(40);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState('3.50');
  const [orderedItem, setOrderedItem] = useState(null); // catalog orders
  const [printJobReceipt, setPrintJobReceipt] = useState(null); // estimator order

  // Calculate price dynamically
  const calculatePrice = () => {
    const materialMultipliers = {
      pla: 0.10,
      abs: 0.14,
      petg: 0.16,
      resin: 0.25
    };

    const multiplier = materialMultipliers[material] || 0.10;
    const baseWeight = uploadedFile ? Math.min(200, Math.floor(uploadedFile.size / 15000)) : 35;
    const finalWeight = Math.max(8, Math.floor(baseWeight * (0.4 + (infill / 100) * 0.6)));
    const priceGrams = finalWeight * multiplier;
    const baseCost = 3.50; // base cost in USD/INR scale
    
    // Map to INR price: multiplier * 80
    const totalINR = Math.round((priceGrams + baseCost) * 80);
    setEstimatedPrice(totalINR.toString());
  };

  useEffect(() => {
    calculatePrice();
  }, [material, infill, uploadedFile]);

  // File Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.stl,.obj,.3mf';
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        validateAndSetFile(e.target.files[0]);
      }
    };
    input.click();
  };

  const validateAndSetFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['stl', 'obj', '3mf'].includes(ext)) {
      showToast("Please upload an STL, OBJ, or 3MF model file.", "error");
      return;
    }
    setUploadedFile(file);
  };

  const handleInitProject = () => {
    if (!uploadedFile) {
      showToast("Please select or drag an STL model file to begin estimation.", "error");
      return;
    }

    setPrintJobReceipt({
      fileName: uploadedFile.name,
      fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      material: material.toUpperCase(),
      infill: `${infill}%`,
      price: estimatedPrice
    });
  };

  const filteredCatalog = activeTab === 'all' 
    ? printingProducts 
    : printingProducts.filter(item => item.category === activeTab);

  return (
    <motion.section
      className="portal-section"
      id="printing-portal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>3D Printing Services</h2>
            <p>Industrial Prototype Fabrication Terminal</p>
          </div>
        </div>
      </div>

      <div className="portal-content printing-grid">
        {/* Product Catalog View */}
        <div className="product-catalog">
          <div className="catalog-filters">
            <button
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Products
            </button>
            <button
              className={`filter-tab ${activeTab === 'prototypes' ? 'active' : ''}`}
              onClick={() => setActiveTab('prototypes')}
            >
              Prototypes
            </button>
            <button
              className={`filter-tab ${activeTab === 'educational' ? 'active' : ''}`}
              onClick={() => setActiveTab('educational')}
            >
              Educational
            </button>
          </div>
          
          <div className="catalog-cards">
            {filteredCatalog.map((item) => (
              <div className="product-card" key={item.id}>
                <div className="product-img">
                  <svg viewBox="0 0 64 64">{SVG_MAP[item.iconType]}</svg>
                </div>
                <div className="product-details">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  <div className="product-meta">
                    <span className="product-price">₹{item.price}</span>
                    <Button
                      type="button"
                      variant="secondary"
                      className="btn-order-catalog"
                      onClick={() => setOrderedItem(item)}
                    >
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Estimator Calculator */}
        <div className="service-calculator">
          <h3>Printing Cost Estimator</h3>
          
          {/* Drag & Drop Zone */}
          <div
            className={`upload-zone ${uploadedFile ? 'dragover' : ''}`}
            id="print-upload-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleFileClick}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
            <div className="upload-info">
              {uploadedFile ? (
                <>
                  <p style={{ color: 'var(--accent-blue)' }}>File Selected: {uploadedFile.name}</p>
                  <span>Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click to change</span>
                </>
              ) : (
                <>
                  <p>Upload model file</p>
                  <span>Drag STL, OBJ, or 3MF here</span>
                </>
              )}
            </div>
          </div>

          <div className="calc-row">
            <label htmlFor="calc-material">Material Filament</label>
            <select
              id="calc-material"
              className="form-select"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="pla">PLA - Structural, Bio-Degradable</option>
              <option value="abs">ABS - Impact Resistant, Industrial</option>
              <option value="petg">PETG - Highly Flexible, Chemical-proof</option>
              <option value="resin">RESIN - Extreme Detail, Smooth finish</option>
            </select>
          </div>

          <div className="calc-row">
            <label htmlFor="calc-infill">Infill Density: <span id="infill-val">{infill}%</span></label>
            <input
              type="range"
              id="calc-infill"
              min="10"
              max="100"
              value={infill}
              className="calc-input"
              style={{ padding: 0 }}
              onChange={(e) => setInfill(parseInt(e.target.value))}
            />
          </div>

          <div className="estimate-output">
            <div>
              <span className="mobile-price-lbl">Price Estimate</span>
              <div className="estimate-price" id="calc-price">₹{estimatedPrice}</div>
            </div>
            <Button
              type="button"
              variant="primary"
              className="btn-submit-calc"
              id="btn-submit-calc"
              onClick={handleInitProject}
            >
              Init Project
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Catalog Order Modal */}
      <Modal isOpen={orderedItem !== null} onClose={() => setOrderedItem(null)} className="modal-content purple">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h4>CATALOG ORDER SUBMITTED</h4>
        <p>Your request has been logged successfully. Summary receipt details below.</p>
        
        {orderedItem && (
          <div className="modal-receipt">
            <div className="receipt-row">
              <span>PRODUCT MODEL:</span>
              <span className="receipt-val">{orderedItem.title}</span>
            </div>
            <div className="receipt-row">
              <span>CATEGORY:</span>
              <span className="receipt-val">{orderedItem.category.toUpperCase()}</span>
            </div>
            <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
              <span>UNIT COST:</span>
              <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>
                ₹{orderedItem.price}
              </span>
            </div>
          </div>
        )}
        
        <Button variant="secondary" className="modal-btn" onClick={() => setOrderedItem(null)}>
          Close
        </Button>
      </Modal>

      {/* 2. Estimator Job Order Modal */}
      <Modal isOpen={printJobReceipt !== null} onClose={() => setPrintJobReceipt(null)} className="modal-content purple">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h4>PRINT JOB SUBMITTED</h4>
        <p>Your request has been logged successfully. Summary receipt details below.</p>
        
        {printJobReceipt && (
          <div className="modal-receipt">
            <div className="receipt-row">
              <span>MODEL FILE:</span>
              <span className="receipt-val" style={{ maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {printJobReceipt.fileName}
              </span>
            </div>
            <div className="receipt-row">
              <span>FILE SIZE:</span>
              <span className="receipt-val">{printJobReceipt.fileSize}</span>
            </div>
            <div className="receipt-row">
              <span>MATERIAL FIL:</span>
              <span className="receipt-val">{printJobReceipt.material}</span>
            </div>
            <div className="receipt-row">
              <span>INFILL:</span>
              <span className="receipt-val">{printJobReceipt.infill}</span>
            </div>
            <div className="receipt-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px' }}>
              <span>ESTIMATED COST:</span>
              <span className="receipt-val" style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>
                ₹{printJobReceipt.price}
              </span>
            </div>
          </div>
        )}
        
        <Button variant="secondary" className="modal-btn" onClick={() => setPrintJobReceipt(null)}>
          Close
        </Button>
      </Modal>
    </motion.section>
  );
};
