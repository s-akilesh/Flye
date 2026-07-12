import { notificationService } from '../../../shared/services/notificationService.js';

/**
 * Sends a notification email to the Flyen admin using EmailJS.
 * 
 * @param {Object} data - The form submission data.
 * @param {string} data.name - Submitter's name.
 * @param {string} data.phone - Submitter's mobile number.
 * @param {string} data.email - Submitter's email address.
 * @param {string} data.category - The query category.
 * @param {string} data.subject - The query subject.
 * @param {string} data.message - The detailed message.
 * @returns {Promise<boolean>} Resolves to true if the email sent successfully, false otherwise.
 */
export const sendAdminNotification = async (data) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS Admin] Configuration missing in environment variables.');
    }
    notificationService.email.deliveryFailed(data.email, 'Configuration missing in environment variables').catch(err => {
      console.error('[emailService] Failed to create email delivery failed notification:', err);
    });
    return false;
  }

  const templateParams = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    category: data.category,
    subject: data.subject,
    message: data.message,
    submitted_date: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    })
  };

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS Admin] Failed to send email:', error);
    }
    notificationService.email.deliveryFailed(data.email, error?.text || error?.message || 'EmailJS rejected send').catch(err => {
      console.error('[emailService] Failed to create email delivery failed notification:', err);
    });
    return false;
  }
};

/**
 * Sends a confirmation receipt email to the user using EmailJS.
 * 
 * @param {Object} data - The form submission data.
 * @param {string} data.name - Submitter's name.
 * @param {string} data.phone - Submitter's mobile number.
 * @param {string} data.email - Submitter's email address.
 * @param {string} data.category - The query category.
 * @param {string} data.subject - The query subject.
 * @param {string} data.message - The detailed message.
 * @returns {Promise<boolean>} Resolves to true if the email sent successfully, false otherwise.
 */
export const sendUserConfirmation = async (data) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS User] Configuration missing in environment variables.');
    }
    notificationService.email.deliveryFailed(data.email, 'Configuration missing in environment variables').catch(err => {
      console.error('[emailService] Failed to create email delivery failed notification:', err);
    });
    return false;
  }

  const templateParams = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    category: data.category,
    subject: data.subject,
    message: data.message,
    to_email: data.email
  };

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS User] Failed to send email:', error);
    }
    notificationService.email.deliveryFailed(data.email, error?.text || error?.message || 'EmailJS rejected send').catch(err => {
      console.error('[emailService] Failed to create email delivery failed notification:', err);
    });
    return false;
  }
};

// Existing emailService wrapper to maintain compatibility with other modules if imported
export const emailService = {
  sendContactEmail: async (contactData) => {
    const data = {
      name: contactData.name,
      phone: contactData.mobileNumber,
      email: contactData.email,
      category: contactData.category,
      subject: contactData.subject,
      message: contactData.message
    };
    const adminOk = await sendAdminNotification(data);
    if (adminOk) {
      await sendUserConfirmation(data);
    }
    return adminOk;
  }
};
