import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const SUPPORT_NAV_ITEMS = [
  {
    path: ROUTES.SHIPPING_DELIVERY || '/shipping-and-delivery',
    label: 'Shipping and Delivery',
    icon: 'local_shipping'
  },
  {
    path: ROUTES.RETURNS_CANCELLATIONS || '/returns-and-cancellations',
    label: 'Returns and Cancellations',
    icon: 'assignment_return'
  },
  {
    path: ROUTES.PERSONALISED_ORDER_POLICY || '/personalised-order-policy',
    label: 'Personalised-Order Policy',
    icon: 'tune'
  },
  {
    path: ROUTES.CUSTOM_BULK_ENQUIRIES || '/custom-printing-and-bulk-enquiries',
    label: 'Custom Printing & Bulk Enquiries',
    icon: 'inventory_2'
  },
  {
    path: ROUTES.PRIVACY_POLICY || '/privacy-policy',
    label: 'Privacy Policy',
    icon: 'shield'
  },
  {
    path: ROUTES.TERMS_CONDITIONS || '/terms-and-conditions',
    label: 'Terms and Conditions',
    icon: 'gavel'
  }
];

export const SupportLayout = ({
  badge = 'SUPPORT & POLICIES',
  title,
  description,
  version = '1.0.0',
  lastUpdated,
  children
}) => {
  return (
    <div className="flyen-support-page-root">
      <div className="flyen-support-container">
        
        {/* Top Header Banner */}
        <div className="flyen-support-header">
          <div className="flyen-support-badge-row">
            <span className="flyen-support-badge">{badge}</span>
          </div>
          <h1 className="flyen-support-title">{title}</h1>
          {description && <p className="flyen-support-desc">{description}</p>}
          <div className="flyen-support-meta-bar">
            <span>Version {version}</span>
            <span className="flyen-support-meta-dot">•</span>
            <span>Last Updated: {lastUpdated || 'October 2026'}</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Sticky Sidebar Navigation + Content Area */}
        <div className="flyen-support-grid">
          
          {/* Sidebar Navigation */}
          <aside className="flyen-support-sidebar">
            <div className="flyen-support-nav-card">
              <span className="flyen-support-nav-heading">SUPPORT DIRECTORY</span>
              <nav className="flyen-support-nav-list">
                {SUPPORT_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flyen-support-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="material-icons-outlined flyen-support-nav-icon">
                      {item.icon}
                    </span>
                    <span className="flyen-support-nav-text">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Need Direct Help Card */}
            <div className="flyen-support-help-card">
              <span className="material-icons-outlined flyen-support-help-icon">
                support_agent
              </span>
              <h4 className="flyen-support-help-title">Need Direct Assistance?</h4>
              <p className="flyen-support-help-desc">
                Have specific requirements or questions regarding your order? Our engineering team is here to assist.
              </p>
              <Link to={ROUTES.CONTACT} className="flyen-support-help-btn">
                Contact Support
              </Link>
            </div>
          </aside>

          {/* Main Document Content Area */}
          <main className="flyen-support-content-area">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
};
