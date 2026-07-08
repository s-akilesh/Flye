import { trackEvent } from './analytics.js';

export const eventTracker = {
  /**
   * Tracks when a user views a project details page
   * @param {Object} project - The project model.
   */
  trackProjectView(project) {
    if (!project) return;
    trackEvent('project_view', {
      project_id: project.id,
      project_title: project.title,
      project_slug: project.slug,
      project_category: project.category || 'general'
    });
  },

  /**
   * Tracks when a user requests a kit/enquiry
   * @param {Object} project - The project model.
   * @param {string} enquiryType - The status / type of request.
   */
  trackProjectEnquiry(project, enquiryType) {
    trackEvent('project_enquiry_submit', {
      project_title: project?.title || 'Unknown',
      enquiry_type: enquiryType || 'general'
    });
  },

  /**
   * Tracks when a general contact request is sent
   * @param {string} method - Form submit method.
   */
  trackContactSubmission(method) {
    trackEvent('contact_form_submit', {
      method: method || 'form'
    });
  },

  /**
   * Tracks user interaction clicks on communication links
   * @param {string} recipient - The target phone/whatsapp recipient label.
   */
  trackWhatsAppClick(recipient) {
    trackEvent('whatsapp_click', {
      recipient: recipient || 'support'
    });
  },

  trackPhoneCall(phoneNumber) {
    trackEvent('phone_call_click', {
      phone: phoneNumber || 'support'
    });
  },

  trackEmailClick(emailAddress) {
    trackEvent('email_click', {
      email: emailAddress || 'support'
    });
  },

  /**
   * Tracks download of project documentation or resources
   * @param {string} fileName - File name string.
   * @param {string} fileType - File extension or category.
   */
  trackDownload(fileName, fileType) {
    trackEvent('resource_download', {
      file_name: fileName,
      file_type: fileType || 'pdf'
    });
  },

  /**
   * Tracks search query submissions
   * @param {string} query - The search query term.
   */
  trackSearch(query) {
    trackEvent('search', {
      search_term: query
    });
  },

  /**
   * Tracks filter adjustments
   * @param {string} filterType - Type of filter (e.g. categories, features).
   * @param {string} filterValue - Value chosen.
   */
  trackFilterApplied(filterType, filterValue) {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }
};
