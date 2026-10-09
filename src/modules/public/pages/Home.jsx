import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../projects/hooks/useProjects';
import { printingInventoryService } from '../../printing-inventory/services/printingInventoryService';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../shared/context/ToastContext';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Footer } from '../../../shared/components/layout/Footer';
import { masterDataService } from '../../../shared/services/masterDataService';
import { reviewService, getInitials, getAvatarBg } from '../../../shared/services/reviewService';
import { storageService } from '../../../shared/services/storageService';
import { ROUTES } from '../../../shared/constants/routes';
import { useSettings } from '../../settings/hooks/useSettings';
import { useCart } from '../../../shared/context/CartContext';
import { SEO, PageType, generateSEO } from '../../../shared/seo';

const BACKDROP_ROTATIONS = ['-4deg', '4.5deg', '-5deg', '4deg', '-4.5deg', '3.5deg'];
const BACKDROP_GRADIENTS = [
  'linear-gradient(135deg, #00dfa2 0%, #0284c7 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
];

const getSliderImageUrl = (val) => {
  if (!val) return '';
  if (val.startsWith('http://') || val.startsWith('https://')) return val;
  const clean = val.startsWith('/') ? val.substring(1) : val;
  const storagePath = clean.startsWith('landingscreen-slider/') ? clean : `landingscreen-slider/${clean}`;
  return storageService.getPublicUrl('website-assets', storagePath) || val;
};

export const Home = () => {
  const navigate = useNavigate();
  const { projects, isLoading: isProjectsLoading } = useProjects();
  const [dbPrintingProducts, setDbPrintingProducts] = useState([]);
  const [isPrintingLoading, setIsPrintingLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [dbReviews, setDbReviews] = useState([]);
  const [s3SliderFiles, setS3SliderFiles] = useState(null);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const customMfgImage = '/svc_resin.jpg';
  const [activeHeroCardIdx, setActiveHeroCardIdx] = useState(0);
  const { addEnquiry, isProcessing } = useEnquiries();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const seoProps = generateSEO(PageType.HOME);

  // Dynamic Background Slider Cards driven directly from S3 Storage (website-assets/landingscreen-slider)
  const defaultInitialCards = useMemo(() => {
    return [
      {
        id: 'initial-slider-1',
        title: 'Educational Tabletop Solar Tracker Kit',
        tag: 'Precision Engineering',
        image: storageService.getPublicUrl('website-assets', 'landingscreen-slider/Educational Tabletop Solar Tracker Kit.png')
      },
      {
        id: 'initial-slider-2',
        title: 'Ivory Ganesha on a Walnut Console',
        tag: 'Custom 3D Prints',
        image: storageService.getPublicUrl('website-assets', 'landingscreen-slider/Ivory Ganesha on a Walnut Console.png')
      },
      {
        id: 'initial-slider-3',
        title: 'Warm Fairy-Lit Shelf with Navy Monogram',
        tag: 'Bespoke Creations',
        image: storageService.getPublicUrl('website-assets', 'landingscreen-slider/Warm fairy-lit shelf with navy monogram.png')
      }
    ];
  }, []);

  // Background showcase images loaded from Supabase S3 bucket (website-assets/products-banner) with fallback
  const s3ProductShowcaseBg = useMemo(() => {
    return storageService.getPublicUrl('website-assets', 'products-banner/product_showcase_bg.jpg') || '/svc_batch.jpg';
  }, []);

  const s3ProjectKitsBg = useMemo(() => {
    return storageService.getPublicUrl('website-assets', 'products-banner/project_kits_bg.jpg') || '/kit_hw.jpg';
  }, []);

  const s3CustomWorkflowBg = useMemo(() => {
    return storageService.getPublicUrl('website-assets', 'products-banner/custom_workflow_bg.jpg') || '/svc_enclosure.jpg';
  }, []);

  const heroCards = useMemo(() => {
    if (s3SliderFiles && s3SliderFiles.length > 0) {
      const valid = s3SliderFiles
        .map((item, idx) => {
          const publicUrl = item.image || (item.name ? storageService.getPublicUrl('website-assets', `landingscreen-slider/${item.name}`) : '');
          const rawName = item.name || (typeof item.image === 'string' ? item.image.split('/').pop().split('?')[0] : '');
          const formattedTitle = item.title || (rawName
            ? decodeURIComponent(rawName)
                .replace(/\.[^/.]+$/, '')
                .replace(/^slider-[\d]+-/, '')
                .replace(/[_-]+/g, ' ')
            : 'Flyen Precision Engineering');

          return {
            id: item.id || `s3-slider-${idx}`,
            title: formattedTitle || 'Flyen Precision Engineering',
            tag: item.tag || 'Precision Engineering',
            image: publicUrl
          };
        })
        .filter(asset => asset.image && !failedImages.has(asset.image));

      if (valid.length > 0) return valid.slice(0, 3);
    }
    return defaultInitialCards.filter(asset => asset.image && !failedImages.has(asset.image)).slice(0, 3);
  }, [s3SliderFiles, failedImages, defaultInitialCards]);

  // Fetch real published 3D print products, categories, reviews, and S3 homepage slider files
  useEffect(() => {
    let isMounted = true;
    const fetchPrintsAndCategories = async () => {
      try {
        const printsPromise = printingInventoryService.getPublishedProducts();
        const catsPromise = masterDataService.getCategories();
        const reviewsPromise = reviewService.getAll();
        const hpAssetsPromise = masterDataService.getValues('homepage_assets').catch(() => []);
        const s3FilesPromise = storageService.listFiles('website-assets', 'landingscreen-slider').catch(() => []);
        const [prints, cats, reviews, hpAssets, s3Files] = await Promise.all([
          printsPromise,
          catsPromise,
          reviewsPromise,
          hpAssetsPromise,
          s3FilesPromise
        ]);

        if (isMounted) {
          setDbPrintingProducts(prints || []);
          setDbCategories(cats || []);
          setDbReviews(reviews || []);

          // 1. Direct S3 bucket folder website-assets/landingscreen-slider is the primary live source
          if (Array.isArray(s3Files) && s3Files.length > 0) {
            const validImages = s3Files
              .filter(f => 
                f.name && 
                !f.name.startsWith('.') && 
                /\.(jpe?g|png|webp|svg|gif|avif)$/i.test(f.name)
              )
              .map((file, idx) => {
                const rawUrl = storageService.getPublicUrl('website-assets', `landingscreen-slider/${file.name}`);
                const version = file.updated_at ? new Date(file.updated_at).getTime() : Date.now();
                const publicUrl = rawUrl ? `${rawUrl}?v=${version}` : '';
                const cleanName = file.name
                  .replace(/\.[^/.]+$/, '')
                  .replace(/^slider-[\d]+-/, '')
                  .replace(/[_-]+/g, ' ');

                return {
                  id: file.id || `s3-slider-${idx}`,
                  name: file.name,
                  title: cleanName || 'Flyen Precision Engineering',
                  image: publicUrl,
                  tag: 'Precision Engineering'
                };
              });

            if (validImages.length > 0) {
              setS3SliderFiles(validImages);
              return;
            }
          }

          // 2. Fallback to master_data homepage_assets if S3 bucket listing returned empty
          if (Array.isArray(hpAssets) && hpAssets.length > 0) {
            const activeSliderAssets = hpAssets
              .filter(a => a.is_active && (a.value || a.image_url))
              .map((a, idx) => {
                const imgUrl = a.value || a.image_url;
                const fileName = typeof imgUrl === 'string' ? imgUrl.split('/').pop().split('?')[0] : '';
                const formattedTitle = (a.description || fileName)
                  .replace(/\.[^/.]+$/, '')
                  .replace(/^slider-[\d]+-/, '')
                  .replace(/[_-]+/g, ' ');

                return {
                  id: a.id || `hp-asset-${idx}`,
                  name: fileName,
                  title: formattedTitle || 'Flyen Precision Engineering',
                  image: imgUrl,
                  tag: 'Precision Engineering'
                };
              });

            if (activeSliderAssets.length > 0) {
              setS3SliderFiles(activeSliderAssets);
              return;
            }
          }

          setS3SliderFiles([]);
        }
      } catch (err) {
        console.error("Failed to load 3D print products, categories, or reviews for Home screen:", err);
      } finally {
        if (isMounted) {
          setIsPrintingLoading(false);
          setIsCategoriesLoading(false);
        }
      }
    };
    fetchPrintsAndCategories();
    return () => { isMounted = false; };
  }, []);

  // Background slide rotation interval (every 3 seconds)
  useEffect(() => {
    if (!heroCards || heroCards.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroCardIdx((prev) => (prev + 1) % heroCards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroCards.length]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Detailed project request form states
  const [orderedProject, setOrderedProject] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [projectStatus, setProjectStatus] = useState('Not Started yet');
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactPrefix, setContactPrefix] = useState('+91');
  const [formErrors, setFormErrors] = useState({});
  const [projectBudget, setProjectBudget] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [needDocument, setNeedDocument] = useState('Yes');
  const [needPresentation, setNeedPresentation] = useState('Yes');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [projectRemarks, setProjectRemarks] = useState('');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'success'

  // Dynamic categories computed from DB master_data
  const categoryList = useMemo(() => {
    // Filter active categories that have show_in_home enabled
    let list = dbCategories.filter(c => c.is_active && c.show_in_home);
    if (list.length === 0) {
      // Fallback to active categories if none marked specifically for home
      list = dbCategories.filter(c => c.is_active);
    }
    if (list.length === 0) {
      return [];
    }

    return list.map(cat => {
      const is3d = cat.type === '3d_print_category';
      const route = is3d
        ? `${ROUTES.PRINTING}?category=${encodeURIComponent(cat.key || cat.value)}`
        : `${ROUTES.PROJECTS}?category=${encodeURIComponent(cat.value || cat.key)}`;

      const img = cat.image_url || '';

      return {
        id: cat.id || cat.key,
        title: cat.value,
        image: img,
        route
      };
    });
  }, [dbCategories]);

  // Featured ready-made engineering project kits from DB (up to 4 cards)
  const readyMadeProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    return projects.slice(0, 4).map((p, idx) => {
      let img = '';
      if (p.images?.main) {
        img = p.images.main;
      } else if (Array.isArray(p.images) && p.images.length > 0) {
        const first = p.images[0];
        img = typeof first === 'string' ? first : (first?.url || first?.image_url || '');
      } else if (typeof p.images === 'string' && p.images.trim()) {
        img = p.images;
      } else if (p.imageUrl || p.image_url) {
        img = p.imageUrl || p.image_url;
      }

      const formattedPrice = p.price 
        ? (p.currency === 'USD' ? `$${p.price}` : `₹${Number(p.price).toLocaleString('en-IN')}`)
        : 'Price On Request';

      return {
        id: p.id,
        title: p.title,
        category: p.category ? String(p.category).toUpperCase() : 'ENGINEERING KIT',
        price: formattedPrice,
        badge: p.badge || (idx === 0 ? 'FEATURED' : ''),
        image: img,
        type: 'project',
        slug: p.slug
      };
    });
  }, [projects]);

  // Featured 3D Printing Products & Parts from DB (up to 4 cards)
  const readyMadePrintingProducts = useMemo(() => {
    if (!dbPrintingProducts || dbPrintingProducts.length === 0) return [];

    return dbPrintingProducts.slice(0, 4).map((pr, idx) => {
      let img = '';
      if (pr.primary_image_url) {
        img = pr.primary_image_url;
      } else if (Array.isArray(pr.images) && pr.images.length > 0) {
        const primary = pr.images.find(i => i.is_primary) || pr.images[0];
        img = primary?.image_url || primary?.url || (typeof primary === 'string' ? primary : '');
      } else if (pr.image) {
        img = pr.image;
      }

      const formattedPrice = pr.contact_for_price 
        ? 'Price On Request' 
        : (pr.price ? `₹${Number(pr.price).toLocaleString('en-IN')}` : 'Price On Request');

      return {
        id: `print-${pr.id}`,
        title: pr.name || pr.title || 'Precision 3D Part',
        category: pr.category ? String(pr.category).toUpperCase() : '3D PRINTING',
        price: formattedPrice,
        badge: pr.badge || (idx === 0 ? 'FEATURED' : ''),
        image: img,
        type: 'printing',
        idNum: pr.id
      };
    });
  }, [dbPrintingProducts]);

  // Verified maker & student testimonials (Trust factor) from Supabase / Review Service
  const testimonialList = useMemo(() => {
    if (dbReviews && dbReviews.length > 0) {
      const activeFeatured = dbReviews.filter(r => r.status === 'approved' && r.show_in_home !== false);
      const listToUse = activeFeatured.length > 0 ? activeFeatured : dbReviews.filter(r => r.status === 'approved');
      if (listToUse.length > 0) {
        return listToUse.map(r => ({
          id: r.id,
          name: r.name,
          rating: Number(r.rating) || 5,
          project: r.project || '3D Printing & Project',
          avatarText: r.avatar_text || getInitials(r.name),
          avatarBg: r.avatar_bg || getAvatarBg(r.name),
          avatarUrl: r.avatar_url || '',
          quote: r.comment
        }));
      }
    }

    return [
      {
        id: 't-1',
        name: 'Akash Sharma',
        rating: 5,
        project: 'Autonomous Rover Kit',
        avatarText: 'AS',
        avatarBg: '#0d9488',
        avatarUrl: '',
        quote: 'The hardware was 100% pre-tested and ready to run. Every motor driver and sensor worked out of the box with the provided schematics. Helped our team secure top marks in our capstone review!'
      },
      {
        id: 't-2',
        name: 'Sneha Reddy',
        rating: 5,
        project: 'Custom Drone Chassis',
        avatarText: 'SR',
        avatarBg: '#f97316',
        avatarUrl: '',
        quote: 'Got our custom drone chassis and sensor brackets 3D printed with 0.1mm layer tolerance. The PETG parts arrived within 48 hours and fit our brushless motors flawlessly.'
      },
      {
        id: 't-3',
        name: 'Vikram Patel',
        rating: 5,
        project: 'Industrial IoT Edge Node',
        avatarText: 'VP',
        avatarBg: '#3b82f6',
        avatarUrl: '',
        quote: 'Flyen saved us weeks of component sourcing and debugging. The live debug guidance from their hardware mentors was invaluable when calibrating our ESP32 gateway.'
      },
      {
        id: 't-4',
        name: 'Pooja Nair',
        rating: 5,
        project: 'Custom Batch 3D Prints',
        avatarText: 'PN',
        avatarBg: '#8b5cf6',
        avatarUrl: '',
        quote: 'Ordered 15 personalized engraved keepsake boxes for our tech fest. The print precision, surface finish, and snap-fit hinges exceeded everyone’s expectations.'
      },
      {
        id: 't-5',
        name: 'Karthik Verma',
        rating: 5,
        project: 'Solar Energy Monitor Kit',
        avatarText: 'KV',
        avatarBg: '#10b981',
        avatarUrl: '',
        quote: 'The Smart Solar MPPT Tracking package came with clean documentation and complete wiring guides. Highly recommended for students who want industrial-standard hardware!'
      }
    ];
  }, [dbReviews]);

  // Dynamic review statistics computed from real customer feedback
  const reviewStats = useMemo(() => {
    const validReviews = dbReviews && dbReviews.length > 0 ? dbReviews.filter(r => r.status === 'approved') : [];
    if (validReviews.length > 0) {
      return reviewService.calculateStats(validReviews);
    }
    return reviewService.calculateStats(testimonialList);
  }, [dbReviews, testimonialList]);

  const customerRatingDisplay = reviewStats?.averageRating || '4.9';

  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev === 0 ? testimonialList.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev === testimonialList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev < testimonialList.length - 1 ? prev + 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonialList.length]);

  const handleOpenFormModal = (status, proj = null) => {
    setProjectStatus(status);
    setOrderedProject(proj);
    setRequestorName('');
    setContactNumber('');
    setContactPrefix('+91');
    setFormErrors({});
    setProjectBudget(proj?.price ? String(proj.price).replace(/[^\d]/g, '') : '');
    setSubmissionDate('');
    setNeedDocument('Yes');
    setNeedPresentation('Yes');
    setCustomProjectTitle(proj ? (proj.title || proj.name) : (typeof status === 'string' && !status.includes('Choosed') ? status : ''));
    setProjectRemarks('');
    setOrderStep('input');
    setIsOpenModal(true);
  };

  const handleOpenOrderModal = (proj) => {
    handleOpenFormModal('Choosed Flyen Project', proj);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to Flyen project inspiration!', 'success');
    setNewsletterEmail('');
  };

  const is3DPrintContext = useMemo(() => {
    if (!projectStatus) return false;
    const s = String(projectStatus).toLowerCase();
    return s.includes('3d') || s.includes('print') || s.includes('manufacturing');
  }, [projectStatus]);

  const handleRequestSubmit = async () => {
    const newErrors = {};
    if (!requestorName.trim()) newErrors.requestorName = true;
    
    const isPhoneValid = contactPrefix === '+91' 
      ? contactNumber.length === 10 
      : (contactNumber.length >= 7 && contactNumber.length <= 15);
      
    if (!isPhoneValid) newErrors.contactNumber = true;

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      showToast('Please fill in all mandatory fields correctly.', 'error');
      return;
    }

    setFormErrors({});

    const titleToUse = projectStatus === 'Choosed Flyen Project' 
      ? (orderedProject?.title || customProjectTitle)
      : (customProjectTitle || (typeof projectStatus === 'string' ? projectStatus : 'Custom Project / 3D Printing Quote'));

    // Serialize all details cleanly into notes
    const serializedNotes = [
      `Project Status: ${projectStatus}`,
      `Budget: ${projectBudget ? `₹${projectBudget}` : 'Not specified'}`,
      submissionDate ? `Submission Date: ${submissionDate}` : '',
      !is3DPrintContext && `Need Document: ${needDocument}`,
      !is3DPrintContext && `Need Presentation Support: ${needPresentation}`,
      projectRemarks.trim() ? `Remarks: ${projectRemarks}` : ''
    ].filter(Boolean).join('\n');

    try {
      await addEnquiry({
        name: requestorName,
        mobile: `${contactPrefix}${contactNumber}`,
        projectId: orderedProject?.id || '',
        projectTitle: titleToUse || 'Custom Project Enquiry',
        price: projectBudget || orderedProject?.price || '',
        notes: serializedNotes,
        userId: user?.id || null
      });
      setOrderStep('confirmed');
      showToast('Your quote request has been successfully submitted!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
      <SEO {...seoProps} page={PageType.HOME} />
      <motion.main
        id="main-gateway"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0', 
          paddingBottom: '0',
          width: '100%',
          maxWidth: '100%',
          minHeight: 'calc(100vh - 120px)',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}
      >
        
        {/* ========================================================================
            1. HERO SECTION 2.0 (HIGH IMPACT VISUALS + VALUE PILLARS)
            ======================================================================== */}
        <section className="flyen-dark-section flyen-hero-section-full">
          {/* Dynamic Full-Bleed Background Image Slider (Rotates every 3 seconds) */}
          <div className="flyen-hero-bg-container" aria-hidden="true">
            <AnimatePresence initial={false} mode="sync">
              {heroCards && heroCards.length > 0 && (
                <motion.div
                  key={`hero-bg-slide-${activeHeroCardIdx % heroCards.length}-${heroCards[activeHeroCardIdx % heroCards.length]?.image}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
                    scale: { duration: 3.5, ease: 'easeOut' }
                  }}
                  className="flyen-hero-bg-slide"
                >
                  <img
                    src={heroCards[activeHeroCardIdx % heroCards.length]?.image}
                    alt="Flyen 3D Printing & Project Engineering"
                    className="flyen-hero-bg-img"
                    onError={(e) => {
                      const currentCard = heroCards[activeHeroCardIdx % heroCards.length];
                      if (currentCard?.fallback && e.target.src !== currentCard.fallback && !e.target.src.endsWith(currentCard.fallback)) {
                        e.target.src = currentCard.fallback;
                      } else if (currentCard?.image) {
                        setFailedImages(prev => {
                          const next = new Set(prev);
                          next.add(currentCard.image);
                          return next;
                        });
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* High-End Dark Tech Gradient Overlay */}
            <div className="flyen-hero-bg-overlay" />
          </div>

          {/* Right Screen Edge Vertically Center-Aligned 3-Dot Navigation */}
          {heroCards && heroCards.length > 1 && (
            <div className="flyen-hero-vertical-nav" aria-label="Slider navigation">
              {heroCards.slice(0, 3).map((card, idx) => (
                <button
                  key={card.id || idx}
                  type="button"
                  onClick={() => setActiveHeroCardIdx(idx)}
                  className={`flyen-hero-v-dot ${idx === (activeHeroCardIdx % heroCards.length) ? 'active' : ''}`}
                  title={`Slide ${idx + 1}: ${card.title || 'Slide'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="flyen-section-container flyen-hero-main-container">
            <div className="flyen-hero-stage">
              <div className="flyen-hero-text-wrap">
                <h1 className="flyen-hero-title-2">
                  Made with <span className="flyen-hero-teal-text">Purpose.</span>
                </h1>

                <p className="flyen-hero-sub-2">
                  Thoughtfully designed 3D-printed products, custom creations, and practical solutions made for everyday use, learning, making, and more.
                </p>

                <div className="flyen-hero-cta-row">
                  <button 
                    type="button" 
                    className="flyen-btn-teal"
                    onClick={() => navigate(ROUTES.PROJECTS)}
                  >
                    Explore Products
                  </button>

                  <button 
                    type="button" 
                    className="flyen-btn-outline"
                    onClick={() => handleOpenFormModal('Custom 3D Printing Quote')}
                  >
                    Get Custom 3D Quote
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Landing Screen KPI Strip - Always Visible on Landing */}
          <div className="flyen-hero-kpi-integrated">
            <div className="flyen-hero-kpi-inner">
              <div className="flyen-kpi-card">
                <div className="flyen-kpi-number">250+</div>
                <div className="flyen-kpi-label">Projects Delivered</div>
              </div>

              <div className="flyen-kpi-divider" />

              <div className="flyen-kpi-card">
                <div className="flyen-kpi-number">15+</div>
                <div className="flyen-kpi-label">Custom Prints</div>
              </div>

              <div className="flyen-kpi-divider" />

              <div className="flyen-kpi-card">
                <div className="flyen-kpi-number">
                  {customerRatingDisplay}<span className="flyen-kpi-star">★</span>
                </div>
                <div className="flyen-kpi-label">Customer Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
            2. POPULAR CATEGORIES (CARD GRID)
            ======================================================================== */}
        <section className="flyen-category-section">
          <div className="flyen-section-container">
            <div className="flyen-category-header-row">
              <h2 className="flyen-category-section-heading">Category</h2>
            </div>

            <div className="flyen-categories-grid">
              {isCategoriesLoading ? (
                [1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="flyen-category-card" style={{ opacity: 0.6 }}>
                    <div className="flyen-category-thumb" style={{ background: 'var(--sys-surface-hover)' }} />
                    <div style={{ height: '14px', width: '70%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }} />
                  </div>
                ))
              ) : (
                categoryList.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="flyen-category-card"
                    onClick={() => navigate(cat.route)}
                    title={cat.title}
                  >
                    <div className="flyen-category-thumb">
                      {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.title} 
                          className="flyen-category-img" 
                          loading="lazy" 
                        />
                      ) : (
                        <div className="flyen-category-fallback-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--txt-muted)' }}>
                          <span className="material-icons" style={{ fontSize: '36px' }}>category</span>
                        </div>
                      )}
                    </div>
                    <span className="flyen-category-label-below">{cat.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================
            3. FULL-SCREEN SHOWCASE 1: 3D PRINTED PARTS & PROTOTYPING
            ======================================================================== */}
        <section className="flyen-fullscreen-showcase-section">
          <div 
            className="flyen-fullscreen-showcase-bg"
            style={{ backgroundImage: `url(${s3ProductShowcaseBg})` }}
          />
          <div className="flyen-fullscreen-showcase-overlay" />
          <div className="flyen-section-container flyen-fullscreen-showcase-container">
            <div className="flyen-fullscreen-showcase-content">
              <h2 className="flyen-fullscreen-showcase-title">
                Precision in Every Print.
              </h2>
              <p className="flyen-fullscreen-showcase-desc">
                Quality 3D-printed parts, custom pieces, and functional products made with carefully selected materials and precise printing for reliable results.
              </p>
              <div className="flyen-showcase-specs">
                <span className="flyen-showcase-spec-tag">Multiple Materials</span>
                <span className="flyen-showcase-spec-tag">Custom Designs</span>
                <span className="flyen-showcase-spec-tag">Quality Finish</span>
              </div>
              <div className="flyen-fullscreen-showcase-actions">
                <button 
                  type="button" 
                  className="flyen-btn-teal"
                  onClick={() => navigate(ROUTES.PRINTING)}
                >
                  Explore 3D Catalog
                </button>
                <button 
                  type="button" 
                  className="flyen-btn-outline"
                  onClick={() => handleOpenFormModal('Custom 3D Printing Quote')}
                >
                  Instant Quote
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
            4. FULL-SCREEN SHOWCASE 2: READY-MADE PROJECT KITS & HARDWARE
            ======================================================================== */}
        <section className="flyen-fullscreen-showcase-section">
          <div 
            className="flyen-fullscreen-showcase-bg"
            style={{ backgroundImage: `url(${s3ProjectKitsBg})` }}
          />
          <div className="flyen-fullscreen-showcase-overlay" />
          <div className="flyen-section-container flyen-fullscreen-showcase-container">
            <div className="flyen-fullscreen-showcase-content">
              <h2 className="flyen-fullscreen-showcase-title">
                Ready-Made Project Kits & IoT Systems
              </h2>
              <p className="flyen-fullscreen-showcase-desc">
                Pre-tested hardware packages, sensor suites, and microcontroller bundles with complete schematics, source code, and guides.
              </p>
              <div className="flyen-showcase-specs">
                <span className="flyen-showcase-spec-tag">Plug & Play</span>
                <span className="flyen-showcase-spec-tag">Verified Schematics</span>
                <span className="flyen-showcase-spec-tag">Full Documentation</span>
              </div>
              <div className="flyen-fullscreen-showcase-actions">
                <button 
                  type="button" 
                  className="flyen-btn-teal"
                  onClick={() => navigate(ROUTES.PROJECTS)}
                >
                  View Project Kits
                </button>
                <button 
                  type="button" 
                  className="flyen-btn-outline"
                  onClick={() => handleOpenFormModal('Custom Project Kit Quote')}
                >
                  Instant Quote
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
            5. TESTIMONIALS & TRUST FACTOR (SPEECH-BUBBLE SLIDER UI)
            ======================================================================== */}
        <section className="flyen-testimonials-section">
          <div className="flyen-section-container">
            {/* Header Row: Top-Left Title & Badge + Top-Right "What our makers are saying" & Navigation */}
            <div className="flyen-testi-header-row">
              <div className="flyen-testi-header-left">
                <h2 className="flyen-testi-main-title">
                  Reviews from <span>real makers</span>
                </h2>
              </div>

              <div className="flyen-testi-header-right">
                <div className="flyen-testi-right-title-wrap">
                  <span className="flyen-testi-right-sub">What our makers are saying</span>
                </div>

                <div className="flyen-testi-nav-bar">
                  <button 
                    type="button" 
                    className="flyen-testi-arrow-btn"
                    onClick={handlePrevTestimonial}
                    aria-label="Previous review"
                  >
                    <span className="material-icons">arrow_back</span>
                  </button>
                  
                  <div className="flyen-testi-progress-track">
                    <div 
                      className="flyen-testi-progress-thumb" 
                      style={{ 
                        width: `${100 / testimonialList.length}%`,
                        transform: `translateX(${activeTestimonialIdx * 100}%)`
                      }} 
                    />
                  </div>

                  <button 
                    type="button" 
                    className="flyen-testi-arrow-btn"
                    onClick={handleNextTestimonial}
                    aria-label="Next review"
                  >
                    <span className="material-icons">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Carousel Viewport spanning full width */}
            <div className="flyen-testi-carousel-viewport">
              <div 
                className="flyen-testi-cards-track"
                style={{ transform: `translateX(calc(-${activeTestimonialIdx} * var(--testi-step, 33.333%)))` }}
              >
                {testimonialList.map((t) => (
                  <div key={t.id} className="flyen-testi-slide-item">
                    {/* Speech Bubble Card */}
                    <div className="flyen-testi-bubble-card">
                      <p className="flyen-testi-bubble-text">"{t.quote}"</p>
                      <div className="flyen-testi-bubble-stars">
                        {[...Array(t.rating)].map((_, i) => (
                          <span key={i} className="material-icons" style={{ fontSize: '18px' }}>star</span>
                        ))}
                      </div>
                      {/* Speech bubble downward notch */}
                      <div className="flyen-testi-bubble-notch" />
                    </div>

                    {/* Author Info below bubble */}
                    <div className="flyen-testi-author-row">
                      <div 
                        className="flyen-testi-author-avatar"
                        style={{
                          background: t.avatarUrl ? 'transparent' : t.avatarBg,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          t.avatarText
                        )}
                      </div>
                      <div className="flyen-testi-author-details">
                        <h4 className="flyen-testi-author-name">{t.name}</h4>
                        {t.project && (
                          <span className="flyen-testi-author-tag">{t.project}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Leave Review Button with Border */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                type="button"
                className="flyen-review-cta-btn"
                onClick={() => navigate(ROUTES.FEEDBACK || '/feedback')}
              >
                <span>Share your review</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================
            6. HOW CUSTOM ORDERS WORK (CENTER-ALIGNED BANNER WITH S3 BACKGROUND)
            ======================================================================== */}
        <section className="flyen-workflow-showcase-section">
          <div 
            className="flyen-workflow-showcase-bg"
            style={{ backgroundImage: `url(${s3CustomWorkflowBg})` }}
          />
          <div className="flyen-workflow-showcase-overlay" />
          <div className="flyen-section-container flyen-workflow-showcase-container">
            <div className="flyen-workflow-header flyen-workflow-header-center">
              <h2 className="flyen-workflow-title">How Custom Orders Work.</h2>
              <p className="flyen-workflow-sub">Simple 4-step workflow from your initial 3D model to doorstep delivery</p>
              <div className="flyen-workflow-actions">
                <button 
                  type="button" 
                  className="flyen-btn-outline"
                  onClick={() => handleOpenFormModal('Custom Order Workflow')}
                >
                  Know More
                </button>
              </div>
            </div>
          </div>
        </section>



        {/* Request a Quote Modal */}
        <Modal 
          isOpen={isOpenModal} 
          onClose={() => setIsOpenModal(false)}
          className="modal-content purple"
          style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
        >
          {orderStep === 'input' ? (
            <>
              {/* Fixed Header with Glass/Milk Background */}
              <div style={{
                padding: '24px 24px 16px 24px',
                background: 'var(--sys-surface-elevated)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--sys-divider)',
                zIndex: 10,
                flexShrink: 0
              }}>
                <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--txt-primary)' }}>REQUEST A QUOTE</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                  Fill in your details below. Our technical team will coordinate with you.
                </p>
              </div>

              {/* Scrollable Middle Content */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', width: '100%' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={requestorName}
                      onChange={(e) => {
                        setRequestorName(e.target.value);
                        if (formErrors.requestorName) setFormErrors(prev => ({ ...prev, requestorName: false }));
                      }}
                      className={`form-input ${formErrors.requestorName ? 'error-state' : ''}`}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
                    <div className={`phone-input-container ${formErrors.contactNumber ? 'error-state' : ''}`}>
                      <select
                        className="phone-prefix-select"
                        value={contactPrefix}
                        onChange={(e) => {
                          setContactPrefix(e.target.value);
                          const isValid = e.target.value === '+91' ? contactNumber.length === 10 : (contactNumber.length >= 7 && contactNumber.length <= 15);
                          setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderRight: '1px solid var(--sys-border)',
                          color: 'var(--txt-primary)',
                          padding: '0 8px',
                          height: '100%',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="+1" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+1</option>
                        <option value="+91" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+91</option>
                        <option value="+44" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+44</option>
                        <option value="+61" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+61</option>
                        <option value="+81" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+81</option>
                        <option value="+33" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+33</option>
                        <option value="+971" style={{ background: 'var(--sys-surface)', color: 'var(--txt-primary)' }}>+971</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={contactNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setContactNumber(val);
                          const isValid = contactPrefix === '+91' ? val.length === 10 : (val.length >= 7 && val.length <= 15);
                          setFormErrors(prev => ({ ...prev, contactNumber: !isValid }));
                        }}
                        style={{
                          flex: 1,
                          height: '100%',
                          background: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                          padding: '0 14px',
                          color: 'var(--txt-primary)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                        maxLength={15}
                      />
                    </div>
                    {formErrors.contactNumber && (
                      <span style={{ color: 'var(--status-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        Please enter a valid number
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Estimated Budget (₹)</label>
                    <Input
                      type="text"
                      placeholder="e.g. 5000"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value.replace(/\D/g, ''))}
                      className="form-input"
                    />
                  </div>

                  {!is3DPrintContext && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Submission Date</label>
                        <Input
                          type="date"
                          value={submissionDate}
                          onChange={(e) => setSubmissionDate(e.target.value)}
                          onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                          className="form-input"
                          style={{ colorScheme: 'dark', height: '38px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Document?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setNeedDocument('Yes')}
                            style={{
                              flex: 1,
                              height: '38px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.25s',
                              background: needDocument === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                              border: needDocument === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                              color: needDocument === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                            }}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setNeedDocument('No')}
                            style={{
                              flex: 1,
                              height: '38px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.25s',
                              background: needDocument === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                              border: needDocument === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                              color: needDocument === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                            }}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Presentation Support?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setNeedPresentation('Yes')}
                            style={{
                              flex: 1,
                              height: '38px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.25s',
                              background: needPresentation === 'Yes' ? 'rgba(139, 92, 246, 0.15)' : 'var(--interaction-hover)',
                              border: needPresentation === 'Yes' ? '1px solid var(--brand-primary)' : '1px solid var(--sys-border)',
                              color: needPresentation === 'Yes' ? 'var(--brand-primary)' : 'var(--txt-secondary)'
                            }}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setNeedPresentation('No')}
                            style={{
                              flex: 1,
                              height: '38px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.25s',
                              background: needPresentation === 'No' ? 'rgba(239, 68, 68, 0.15)' : 'var(--interaction-hover)',
                              border: needPresentation === 'No' ? '1px solid var(--status-error)' : '1px solid var(--sys-border)',
                              color: needPresentation === 'No' ? 'var(--status-error)' : 'var(--txt-secondary)'
                            }}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginTop: '4px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--txt-muted)', fontWeight: 'bold' }}>Additional Remarks / Requirements</label>
                  <textarea
                    placeholder="Specify any custom requirements, components needed, timeline, or notes..."
                    value={projectRemarks}
                    onChange={(e) => setProjectRemarks(e.target.value)}
                    className="form-input"
                    rows={3}
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--txt-primary)',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div style={{
                padding: '16px 24px 24px 24px',
                background: 'var(--sys-surface-elevated)',
                borderTop: '1px solid var(--sys-divider)',
                display: 'flex',
                gap: '12px',
                zIndex: 10,
                flexShrink: 0
              }}>
                <Button variant="secondary" onClick={() => setIsOpenModal(false)} disabled={isProcessing} style={{ flex: 1, height: '42px' }}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 1, height: '42px' }}
                  disabled={isProcessing}
                  onClick={handleRequestSubmit}
                >
                  {isProcessing ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </>
          ) : (
            <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div className="modal-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span className="material-icons" style={{ fontSize: '32px' }}>check</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>QUOTE REQUEST CONFIRMED</h4>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--txt-muted)' }}>
                Your quote request has been received. We'll reach out to <strong style={{ color: 'var(--brand-accent)' }}>{requestorName}</strong> ({contactNumber}) shortly.
              </p>

              {(orderedProject || customProjectTitle || projectBudget) && (
                <div className="modal-receipt" style={{ width: '100%', background: 'var(--interaction-hover)', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
                  <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--txt-muted)' }}>PROJECT / REQUIREMENT:</span>
                    <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{orderedProject?.title || customProjectTitle || projectStatus}</span>
                  </div>
                  <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--txt-muted)' }}>CONTACT:</span>
                    <span className="receipt-val" style={{ color: 'var(--txt-primary)', fontWeight: 'bold' }}>{contactNumber}</span>
                  </div>
                  {projectBudget && (
                    <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--sys-divider)', paddingTop: '8px', marginTop: '8px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--txt-muted)' }}>ESTIMATED BUDGET:</span>
                      <span className="receipt-val" style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>₹{projectBudget}</span>
                    </div>
                  )}
                </div>
              )}

              <Button variant="secondary" onClick={() => setIsOpenModal(false)} style={{ width: '100%', maxWidth: '200px' }}>
                Close
              </Button>
            </div>
          )}
        </Modal>

      </motion.main>
      <Footer />
    </>
  );
};