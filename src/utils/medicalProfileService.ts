
/**
 * Medical Profile Service
 * 
 * A centralized service for handling all medical profile data operations
 */

// Custom event for data changes across components
export const MEDICAL_DATA_CHANGE_EVENT = 'medicalDataChange';

// Get all section names
export const getSectionNames = (): string[] => {
  return [
    'personal', 'history', 'medications', 'allergies', 'immunizations', 
    'social', 'reproductive', 'mental', 'functional', 'cultural'
  ];
};

/**
 * Get the window object key for a section
 */
export const getWindowKeyForSection = (section: string): string => {
  switch (section) {
    case 'personal': return 'personalFormData';
    case 'history': return 'historyFormData';
    case 'medications': return 'medicationsFormData';
    case 'allergies': return 'allergiesFormData';
    case 'immunizations': return 'immunizationsFormData';
    case 'social': return 'socialHistoryFormData';
    case 'reproductive': return 'reproductiveHistoryFormData';
    case 'mental': return 'mentalHealthFormData';
    case 'functional': return 'functionalStatusFormData';
    case 'cultural': return 'culturalPreferencesFormData';
    default: return '';
  }
};

/**
 * Load data for a specific section
 */
export const loadSectionData = (sectionName: string): any => {
  try {
    console.log(`Loading ${sectionName} data from storage`);

    // First check sessionStorage for fresher in-memory data
    const sessionData = sessionStorage.getItem(`${sectionName}FormData`);
    let sectionData: any = {};
    
    if (sessionData) {
      try {
        sectionData = JSON.parse(sessionData);
        console.log(`Found ${sectionName} data in sessionStorage:`, sectionData);
      } catch (e) {
        console.error(`Error parsing ${sectionName} session data:`, e);
      }
    }
    
    // If no sessionStorage data or it's empty, try localStorage
    if (!sectionData || Object.keys(sectionData).length === 0) {
      // Get data from localStorage (source of truth)
      const profileData = getMedicalProfile();
      sectionData = profileData[sectionName] || {};
      console.log(`Loaded ${sectionName} data from localStorage:`, sectionData);
    }

    // Update window object 
    const windowKey = getWindowKeyForSection(sectionName);
    if (windowKey) {
      (window as any)[windowKey] = {...sectionData};
      console.log(`Set ${sectionName} data in window.${windowKey}:`, sectionData);
    }

    // Also update sessionStorage for backup
    sessionStorage.setItem(`${sectionName}FormData`, JSON.stringify(sectionData));

    return sectionData;
  } catch (error) {
    console.error(`Error loading ${sectionName} data:`, error);
    return {};
  }
};

/**
 * Save data for a specific section
 */
export const saveSectionData = (sectionName: string, formData?: any): boolean => {
  try {
    console.log(`Saving ${sectionName} data`);

    // Get the data either from parameter or window object
    const windowKey = getWindowKeyForSection(sectionName);
    let dataToSave = formData;

    if (!dataToSave && windowKey) {
      dataToSave = (window as any)[windowKey] || {};
    }

    if (!dataToSave) {
      console.warn(`No data found for ${sectionName} to save`);
      return false;
    }

    // Special handling for allergies section (array data)
    if (sectionName === 'allergies' && Array.isArray(dataToSave.allergies)) {
      dataToSave = {
        ...dataToSave,
        allergies: JSON.stringify(dataToSave.allergies)
      };
    }

    // Get the full medical profile
    const medicalProfile = getMedicalProfile();

    // Add metadata
    const updatedData = {
      ...dataToSave,
      lastUpdated: new Date().toISOString(),
      completed: true
    };

    // Update the profile with the new section data
    const updatedProfile = {
      ...medicalProfile,
      [sectionName]: updatedData
    };

    // Save back to localStorage
    localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
    
    // Update window object
    if (windowKey) {
      (window as any)[windowKey] = {...updatedData};
    }

    // Also update sessionStorage
    sessionStorage.setItem(`${sectionName}FormData`, JSON.stringify(updatedData));

    // Notify other components about the data change
    window.dispatchEvent(new CustomEvent(MEDICAL_DATA_CHANGE_EVENT, {
      detail: { section: sectionName, timestamp: new Date().toISOString() }
    }));

    console.log(`Saved ${sectionName} data successfully`);
    return true;
  } catch (error) {
    console.error(`Error saving ${sectionName} data:`, error);
    return false;
  }
};

/**
 * Get the full medical profile from localStorage
 */
export const getMedicalProfile = (): Record<string, any> => {
  try {
    const profileJson = localStorage.getItem('medicalProfile');
    return profileJson ? JSON.parse(profileJson) : {};
  } catch (error) {
    console.error('Error getting medical profile:', error);
    return {};
  }
};

/**
 * Load all section data at once
 */
export const loadAllSectionData = (): Record<string, any> => {
  try {
    console.log('Loading all medical profile data');
    const medicalProfile = getMedicalProfile();

    // Check sessionStorage first for each section (may have fresher data)
    getSectionNames().forEach(section => {
      const sessionData = sessionStorage.getItem(`${section}FormData`);
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          if (parsedData && Object.keys(parsedData).length > 0) {
            // If the session data is newer, use it instead
            const sessionTimestamp = new Date(parsedData.lastUpdated || 0).getTime();
            const localTimestamp = new Date(medicalProfile[section]?.lastUpdated || 0).getTime();
            
            if (sessionTimestamp >= localTimestamp) {
              medicalProfile[section] = parsedData;
              console.log(`Using newer session data for ${section}`);
            }
          }
        } catch (e) {
          console.error(`Error parsing ${section} session data:`, e);
        }
      }
    });

    // Load each section into window objects
    getSectionNames().forEach(section => {
      if (medicalProfile[section]) {
        const windowKey = getWindowKeyForSection(section);
        if (windowKey) {
          (window as any)[windowKey] = {...medicalProfile[section]};
          // Update sessionStorage
          sessionStorage.setItem(`${section}FormData`, JSON.stringify(medicalProfile[section]));
        }
      }
    });

    return medicalProfile;
  } catch (error) {
    console.error('Error loading all medical profile data:', error);
    return {};
  }
};

/**
 * Save all section data from window objects
 */
export const saveAllSectionData = (): void => {
  console.log('Saving all section data');
  
  const medicalProfile = getMedicalProfile();
  let hasChanges = false;
  
  getSectionNames().forEach(section => {
    // First check window objects
    const windowKey = getWindowKeyForSection(section);
    if (windowKey && (window as any)[windowKey]) {
      const sectionData = (window as any)[windowKey];
      
      // Special handling for allergies
      let processedData = sectionData;
      if (section === 'allergies' && Array.isArray(sectionData.allergies)) {
        processedData = {
          ...sectionData,
          allergies: JSON.stringify(sectionData.allergies)
        };
      }
      
      medicalProfile[section] = {
        ...processedData,
        lastUpdated: new Date().toISOString(),
        completed: true
      };
      
      // Also update sessionStorage
      sessionStorage.setItem(`${section}FormData`, JSON.stringify(medicalProfile[section]));
      
      hasChanges = true;
    }
    // Then check sessionStorage as fallback
    else {
      const sessionData = sessionStorage.getItem(`${section}FormData`);
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          if (parsedData && Object.keys(parsedData).length > 0) {
            // Check if it's newer than localStorage data
            const sessionTimestamp = new Date(parsedData.lastUpdated || 0).getTime();
            const localTimestamp = new Date(medicalProfile[section]?.lastUpdated || 0).getTime();
            
            if (sessionTimestamp > localTimestamp) {
              medicalProfile[section] = parsedData;
              hasChanges = true;
            }
          }
        } catch (e) {
          console.error(`Error parsing ${section} session data:`, e);
        }
      }
    }
  });
  
  if (hasChanges) {
    localStorage.setItem('medicalProfile', JSON.stringify(medicalProfile));
    console.log('All section data saved to localStorage');
  }
};

/**
 * Set up automatic saving at regular intervals
 */
export const initializeAutoSave = (intervalMs = 30000): () => void => {
  console.log(`Setting up auto-save every ${intervalMs}ms`);
  
  const intervalId = setInterval(() => {
    console.log('Auto-saving all medical profile data');
    saveAllSectionData();
  }, intervalMs);
  
  return () => clearInterval(intervalId);
};

/**
 * Initialize data sync listeners for cross-tab/window updates
 */
export const initializeDataSyncListeners = (): () => void => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'medicalProfile' && e.newValue) {
      try {
        console.log('Storage event detected - medical profile changed in another tab');
        const newData = JSON.parse(e.newValue);
        
        // Update all window objects and session storage
        Object.keys(newData).forEach(section => {
          const windowKey = getWindowKeyForSection(section);
          if (windowKey) {
            (window as any)[windowKey] = {...newData[section]};
            sessionStorage.setItem(`${section}FormData`, JSON.stringify(newData[section]));
            
            // Notify components about the data change
            window.dispatchEvent(new CustomEvent(MEDICAL_DATA_CHANGE_EVENT, {
              detail: { section, timestamp: new Date().toISOString() }
            }));
          }
        });
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
};
