import React, { createContext, useState, useEffect } from 'react';
import { ProjectRepository } from '../data/ProjectRepository';

export const EnquiryContext = createContext();

const LOCAL_STORAGE_KEY = 'flyen_enquiries';

export const EnquiryProvider = ({ children }) => {
  const [enquiries, setEnquiries] = useState([]);

  // Load and migrate enquiries from localStorage on mount
  useEffect(() => {
    const migrateAndLoad = async () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          let parsed = JSON.parse(stored);
          let migrated = false;

          // Fetch projects for fallback price lookup if needed
          let projects = [];
          try {
            projects = await ProjectRepository.getAll();
          } catch (pe) {
            console.error('Failed to load projects for migration', pe);
          }

          parsed = parsed.map((enq) => {
            const updated = { ...enq };
            
            // 1. requestorName -> name
            if (enq.requestorName && !enq.name) {
              updated.name = enq.requestorName;
              delete updated.requestorName;
              migrated = true;
            }

            // 2. contactNumber -> mobile
            if (enq.contactNumber && !enq.mobile) {
              updated.mobile = enq.contactNumber;
              delete updated.contactNumber;
              migrated = true;
            }

            // 3. Normalize status: new, contacted, qualified, closed
            if (enq.status) {
              const statusMap = {
                'Pending': 'new',
                'Contacted': 'contacted',
                'Resolved': 'qualified',
                'Cancelled': 'closed',
                'pending': 'new',
                'resolved': 'qualified',
                'cancelled': 'closed'
              };
              if (statusMap[enq.status]) {
                updated.status = statusMap[enq.status];
                migrated = true;
              }
            }

            // 4. Ensure updatedAt
            if (!enq.updatedAt) {
              updated.updatedAt = enq.createdAt || new Date().toISOString();
              migrated = true;
            }

            // 5. Ensure notes
            if (updated.notes === undefined) {
              updated.notes = '';
              migrated = true;
            }

            // 6. Ensure price exists (fallback to database lookup)
            if (updated.price === undefined) {
              const found = projects.find((p) => p.id?.toString() === updated.projectId?.toString());
              updated.price = found ? found.price : '';
              migrated = true;
            }

            return updated;
          });

          if (migrated) {
            setEnquiries(parsed);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
          } else {
            setEnquiries(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load enquiries from localStorage', e);
      }
    };

    migrateAndLoad();
  }, []);

  const saveEnquiries = (updatedList) => {
    setEnquiries(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save enquiries to localStorage', e);
    }
  };

  const addEnquiry = (enquiryData) => {
    const newEnquiry = {
      id: enquiryData.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: enquiryData.projectId || '',
      projectTitle: enquiryData.projectTitle || '',
      name: enquiryData.name || '',
      mobile: enquiryData.mobile || '',
      price: enquiryData.price || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: enquiryData.notes || ''
    };
    
    const updated = [newEnquiry, ...enquiries];
    saveEnquiries(updated);
    return newEnquiry;
  };

  const updateEnquiry = (id, fields) => {
    const updated = enquiries.map((enq) => {
      if (enq.id === id) {
        return {
          ...enq,
          ...fields,
          updatedAt: new Date().toISOString()
        };
      }
      return enq;
    });
    saveEnquiries(updated);
  };

  const deleteEnquiry = (id) => {
    const updated = enquiries.filter((enq) => enq.id !== id);
    saveEnquiries(updated);
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        addEnquiry,
        updateEnquiry,
        deleteEnquiry
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};
