import emailjs from '@emailjs/browser';

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
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;

    // } catch (error) {
    //   console.error("Status:", error.status);
    //   console.error("Text:", error.text);
    //   console.error("Full Error:", error);
    //   return false;
    // }

  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS Admin] Failed to send email:', error);
    }
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
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('[EmailJS User] Failed to send email:', error);
    }
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
