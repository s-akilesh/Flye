import { sanitizeHtml, sanitizePrototype } from './security.js';

// 1. Export Projects to Excel
export const exportProjectsToExcel = async (projects) => {
  const XLSX = await import('xlsx');
  const data = projects.map(proj => ({
    Title: proj.title,
    Description: proj.description,
    "Full Description": proj.fullDescription || '',
    Price: proj.price,
    Currency: proj.currency || 'INR',
    Level: proj.projectLevel || '',
    Difficulty: proj.difficulty || '',
    Technology: proj.technology || '',
    Category: proj.category || '',
    "Build Time": proj.buildTime || '',
    Badge: proj.badge || '',
    Features: Array.isArray(proj.features) ? proj.features.join(', ') : '',
    "Search Keywords": Array.isArray(proj.searchKeywords) ? proj.searchKeywords.join(', ') : '',
    "Video URL": proj.videoUrl || '',
    Resources: proj.resources ? JSON.stringify(proj.resources) : '[]',
    Components: Array.isArray(proj.components) ? proj.components.join(', ') : '',
    Specifications: proj.specifications ? JSON.stringify(proj.specifications) : '{}',
    "Stock Status": proj.stockStatus || 'in-stock',
    Featured: proj.featured ? 'Yes' : 'No',
    Status: proj.status || 'draft',
    "How It Works": proj.howItWorks || '',
    Applications: Array.isArray(proj.applications) ? proj.applications.join(', ') : '',
    Benefits: Array.isArray(proj.benefits) ? proj.benefits.join(', ') : '',
    "Estimated Delivery": proj.estimatedDelivery || '',
    "WhatsApp Number": proj.whatsappNumber || '',
    Slug: proj.slug || '',
    "ID": proj.id || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
  
  XLSX.writeFile(workbook, `flyen_projects_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// 2. Download Project Excel Template (Multi-sheet)
export const downloadProjectTemplate = async () => {
  const XLSX = await import('xlsx');
  // Sheet 1: Project Template with sample row
  const templateData = [
    {
      Title: "Smart Home Automation System",
      Description: "An IoT based home automation system using Arduino and Wi-Fi.",
      "Full Description": "<h3>Introduction</h3><p>This project allows you to control home appliances remotely...</p>",
      Price: 2499,
      Category: "automation",
      Technology: "Arduino",
      "Search Keywords": "iot, home automation, arduino, smart home",
      Featured: "Yes",
      Status: "active",
      Slug: "smart-home-automation-system"
    }
  ];

  // Sheet 2: Detailed instructions
  const instructionsData = [
    {
      "Field Name": "Title",
      "Required": "Yes",
      "Type": "Text",
      "Description": "Name of the project kit. Example: 'Smart Home Automation System'."
    },
    {
      "Field Name": "Description",
      "Required": "Yes",
      "Type": "Text",
      "Description": "Short subtitle/summary of the project. Example: 'An IoT based home automation system...'"
    },
    {
      "Field Name": "Full Description",
      "Required": "No",
      "Type": "HTML / Text",
      "Description": "Detailed rich-text HTML string. Example: '<h3>Introduction</h3><p>Detailed guide...</p>'"
    },
    {
      "Field Name": "Price",
      "Required": "No",
      "Type": "Number",
      "Description": "Unit cost in INR (digits only). Example: 2499."
    },
    {
      "Field Name": "Category",
      "Required": "No",
      "Type": "Text",
      "Description": "Category code (e.g. 'automation', 'iot', 'robotics', 'gps-gsm')."
    },
    {
      "Field Name": "Technology",
      "Required": "No",
      "Type": "Text",
      "Description": "Main microcontroller used. Example: 'Arduino'."
    },
    {
      "Field Name": "Search Keywords",
      "Required": "No",
      "Type": "Comma-Separated Text",
      "Description": "List of tags for search matching. Example: 'iot, home, arduino'."
    },
    {
      "Field Name": "Featured",
      "Required": "No",
      "Type": "Text (Yes/No)",
      "Description": "Highlight pin on landing page. Example: 'Yes'."
    },
    {
      "Field Name": "Status",
      "Required": "No",
      "Type": "Text (active/draft/coming-soon/archived)",
      "Description": "Publication state. Example: 'active'."
    },
    {
      "Field Name": "Slug",
      "Required": "No",
      "Type": "Text",
      "Description": "Custom URL path. Leave blank to auto-generate from Title. Example: 'smart-home-automation-system'."
    }
  ];

  const workbook = XLSX.utils.book_new();

  const worksheetTemplate = XLSX.utils.json_to_sheet(templateData);
  XLSX.utils.book_append_sheet(workbook, worksheetTemplate, "Template");

  const worksheetInstructions = XLSX.utils.json_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(workbook, worksheetInstructions, "Instructions");
  
  XLSX.writeFile(workbook, "flyen_projects_template.xlsx");
};

// 3. Export Enquiries to Excel
export const exportEnquiriesToExcel = async (enquiries) => {
  const XLSX = await import('xlsx');

  const parseNotes = (notes) => {
    const data = {
      projectStatus: '-',
      budget: '-',
      submissionDate: '-',
      needDocument: '-',
      needPresentation: '-',
      remarks: ''
    };

    if (!notes) return data;

    const lines = notes.split('\n');
    lines.forEach(line => {
      if (line.startsWith('Project Status:')) {
        data.projectStatus = line.replace('Project Status:', '').trim();
      } else if (line.startsWith('Budget:')) {
        data.budget = line.replace('Budget:', '').trim();
      } else if (line.startsWith('Submission Date:')) {
        data.submissionDate = line.replace('Submission Date:', '').trim();
      } else if (line.startsWith('Need Document:')) {
        data.needDocument = line.replace('Need Document:', '').trim();
      } else if (line.startsWith('Need Presentation Support:')) {
        data.needPresentation = line.replace('Need Presentation Support:', '').trim();
      } else if (line.startsWith('Remarks:')) {
        data.remarks = line.replace('Remarks:', '').trim();
      }
    });

    return data;
  };

  const data = enquiries.map(enq => {
    const parsed = parseNotes(enq.notes);
    return {
      "Project Title": enq.projectTitle || 'General Consultation',
      "Customer Name": enq.name || '',
      "Mobile": enq.mobile || '',
      "Project Status": parsed.projectStatus,
      "Budget": parsed.budget,
      "Submission Date": parsed.submissionDate,
      "Document Needed": parsed.needDocument,
      "Presentation Support": parsed.needPresentation,
      "Remarks": parsed.remarks || (enq.notes && !enq.notes.includes('Project Status:') ? enq.notes : ''),
      "Base Price": enq.price || '-',
      "Lead Status": enq.status || 'new',
      "Created Date": enq.createdAt ? new Date(enq.createdAt).toLocaleString('en-IN') : 'N/A',
      "Updated Date": enq.updatedAt ? new Date(enq.updatedAt).toLocaleString('en-IN') : 'N/A'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
  
  XLSX.writeFile(workbook, `flyen_enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// Helper to generate a URL-friendly slug
export const generateSlugHelper = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 4. Parse Excel Data Rows to Schema Payloads
export const parseImportedProjects = (jsonData) => {
  const sanitizedData = sanitizePrototype(jsonData);
  return sanitizedData.map((row, index) => {
    const getVal = (keys) => {
      for (const k of keys) {
        if (row[k] !== undefined) return row[k];
      }
      return undefined;
    };

    const title = getVal(["Title", "title", "Project Name", "name"]);
    const description = getVal(["Description", "description", "Short Description", "summary"]);
    const rawFullDesc = getVal(["Full Description", "fullDescription", "full_description", "details"]);
    const fullDescription = rawFullDesc !== undefined ? sanitizeHtml(String(rawFullDesc)) : undefined;
    const price = getVal(["Price", "price", "cost"]);
    const currency = getVal(["Currency", "currency"]) || 'INR';
    const projectLevel = getVal(["Level", "level", "projectLevel", "project_level"]) || 'Engineering';
    const difficulty = getVal(["Difficulty", "difficulty"]) || 'intermediate';
    const technology = getVal(["Technology", "technology", "controller"]) || 'Arduino';
    const category = getVal(["Category", "category"]) || 'automation';
    const buildTime = getVal(["Build Time", "buildTime", "build_time"]) || '6-8 Hours';
    const badge = getVal(["Badge", "badge"]) || '';
    const stockStatus = getVal(["Stock Status", "stockStatus", "stock_status"]) || 'in-stock';
    const featuredVal = getVal(["Featured", "featured"]);
    const status = getVal(["Status", "status"]) || 'draft';
    const howItWorks = getVal(["How It Works", "howItWorks", "how_it_works"]) || 'This system reads sensor/input coordinates and communicates commands to actuator outputs.';
    const estimatedDelivery = getVal(["Estimated Delivery", "estimatedDelivery", "estimated_delivery"]) || '3-5 Business Days';
    const whatsappNumber = getVal(["WhatsApp Number", "whatsappNumber", "whatsapp_number", "phone"]) || '919876543210';
    const slugInput = getVal(["Slug", "slug"]);

    // Helper to parse arrays from comma separated or JSON string
    const parseArray = (val) => {
      if (!val) return [];
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            return JSON.parse(trimmed);
          } catch (e) {}
        }
        return trimmed.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (Array.isArray(val)) return val;
      return [val];
    };

    // Helper to parse object from JSON string
    const parseObject = (val, defaultVal = {}) => {
      if (!val) return defaultVal;
      if (typeof val === 'object') return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultVal;
      }
    };

    const features = parseArray(getVal(["Features", "features"]));
    const searchKeywords = parseArray(getVal(["Search Keywords", "searchKeywords", "keywords"]));
    const components = parseArray(getVal(["Components", "components", "hardware"]));
    const applications = parseArray(getVal(["Applications", "applications"]));
    const benefits = parseArray(getVal(["Benefits", "benefits"]));
    const resources = parseObject(getVal(["Resources", "resources"]), []);
    const specifications = parseObject(getVal(["Specifications", "specifications"]), {});

    const finalApps = applications.length > 0 ? applications : [
      'Educational physical setups for lab research',
      'Custom prototyping designs for innovator kits',
      'Academic engineering project implementations'
    ];

    const finalBenefits = benefits.length > 0 ? benefits : [
      'Ready-to-assemble structured components',
      'Validated wiring diagrams and code bases',
      '24/7 technical query troubleshooting support'
    ];

    const featured = featuredVal === true || String(featuredVal).toLowerCase() === 'yes' || String(featuredVal) === '1';

    // Generate slug automatically if missing
    let finalSlug = '';
    if (slugInput && String(slugInput).trim() !== '') {
      finalSlug = generateSlugHelper(String(slugInput));
    } else if (title && String(title).trim() !== '') {
      finalSlug = generateSlugHelper(String(title));
    }

    return {
      rowIndex: index + 2, // Excel rows are 1-indexed, plus 1 for header row
      title: title !== undefined ? String(title).trim() : '',
      description: description !== undefined ? String(description).trim() : '',
      fullDescription: fullDescription !== undefined ? String(fullDescription).trim() : '',
      price: price !== undefined ? Number(price) : 0,
      currency,
      projectLevel,
      difficulty,
      technology,
      category,
      buildTime,
      badge,
      features: features.length > 0 ? features : ['hardware', 'code', 'circuit', 'docs', 'support'],
      searchKeywords,
      components,
      applications: finalApps,
      benefits: finalBenefits,
      resources,
      specifications: Object.keys(specifications).length > 0 ? specifications : {
        controller: technology || 'Arduino Uno',
        sensors: 'Standard configuration',
        communication: category === 'iot' ? 'Wi-Fi' : category === 'gps-gsm' ? 'GSM' : 'None',
        operatingVoltage: '5V DC',
        programmingLanguage: 'C++'
      },
      stockStatus,
      featured,
      status,
      howItWorks,
      estimatedDelivery,
      whatsappNumber,
      slug: finalSlug
    };
  });
};

// 5. Export Activity Logs to Excel
export const exportActivityLogsToExcel = async (logs) => {
  const XLSX = await import('xlsx');
  const data = logs.map(log => ({
    "Log ID": `LOG-${log.id.slice(0, 8).toUpperCase()}`,
    "Time": log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : 'N/A',
    "User": log.profiles?.full_name || 'System',
    "Module": log.module,
    "Action": log.action,
    "Description": log.description,
    "Status": log.status,
    "Severity": log.severity,
    "Source": log.source,
    "Entity Type": log.entity_type || '-',
    "Entity ID": log.entity_id || '-',
    "User Agent": log.user_agent || '-',
    "Session ID": log.session_id || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");
  
  XLSX.writeFile(workbook, `flyen_activity_logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

