
/**
 * Medical Profile Service
 * 
 * A utility service that handles loading, saving, and synchronizing medical profile data
 * between localStorage, sessionStorage, and the window object.
 */

// Define a custom event for data changes
export const MEDICAL_DATA_CHANGE_EVENT = 'medicalDataChange';

/**
 * Load data for a specific section from storage
 */
export const loadSectionData = (sectionName: string): any => {
  try {
    console.log(`Loading ${sectionName} data`);
    
    // Create a timestamp for this data loading operation
    const loadTimestamp = new Date().toISOString();
    
    // First check if localStorage has data (source of truth)
    const savedProfileJson = localStorage.getItem('medicalProfile');
    let localData = null;
    
    if (savedProfileJson) {
      const savedProfile = JSON.parse(savedProfileJson);
      if (savedProfile && savedProfile[sectionName]) {
        localData = savedProfile[sectionName];
        console.log(`Found ${sectionName} in localStorage:`, localData);
      }
    }
    
    // Also check sessionStorage
    const sessionKey = `${sectionName}FormData`;
    const sessionData = sessionStorage.getItem(sessionKey);
    let sessionParsed = null;
    
    if (sessionData) {
      try {
        sessionParsed = JSON.parse(sessionData);
        console.log(`Found ${sectionName} in sessionStorage:`, sessionParsed);
      } catch (e) {
        console.error(`Error parsing ${sectionName} session data:`, e);
      }
    }
    
    // Determine which data is more recent and use that
    let dataToUse = null;
    
    if (localData && sessionParsed) {
      const localTime = new Date(localData.lastUpdated || 0).getTime();
      const sessionTime = new Date(sessionParsed.lastUpdated || 0).getTime();
      
      dataToUse = localTime >= sessionTime ? localData : sessionParsed;
      console.log('Using more recent data, timestamp comparison:', { localTime, sessionTime });
    } else {
      dataToUse = localData || sessionParsed || {};
    }
    
    // Get the window object key for this section
    const windowKey = getWindowKeyForSection(sectionName);
    
    // Set the data in window object for the form to use
    if (windowKey) {
      (window as any)[windowKey] = dataToUse;
      console.log(`Setting ${sectionName} data in window object:`, dataToUse);
    }
    
    // Update session storage to match
    sessionStorage.setItem(sessionKey, JSON.stringify({
      ...dataToUse,
      _loadTimestamp: loadTimestamp
    }));
    
    return dataToUse;
  } catch (error) {
    console.error(`Error loading ${sectionName} data:`, error);
    return {};
  }
};

/**
 * Save data for a specific section to storage
 */
export const saveSectionData = (sectionName: string, formData?: any): boolean => {
  try {
    const windowKey = getWindowKeyForSection(sectionName);
    let currentFormData = formData;
    
    if (!currentFormData && windowKey) {
      currentFormData = (window as any)[windowKey];
    }
    
    if (!currentFormData) {
      console.log(`No form data found for ${sectionName} with key ${windowKey}`);
      return false;
    }
    
    console.log(`Saving ${sectionName} data:`, currentFormData);
    
    // Handle special case for allergies section that might have array data
    if (sectionName === 'allergies' && Array.isArray(currentFormData.allergies)) {
      currentFormData = {
        ...currentFormData,
        allergies: JSON.stringify(currentFormData.allergies)
      };
    }
    
    const timestamp = new Date().toISOString();
    const dataToSave = {
      ...currentFormData,
      lastUpdated: timestamp
    };
    
    // Save to sessionStorage
    const sessionKey = `${sectionName}FormData`;
    sessionStorage.setItem(sessionKey, JSON.stringify(dataToSave));
    
    // Save to localStorage
    const existingProfileJson = localStorage.getItem('medicalProfile');
    const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
    
    localStorage.setItem('medicalProfile', JSON.stringify({
      ...existingProfile,
      [sectionName]: dataToSave
    }));
    
    // Update window object
    if (windowKey) {
      (window as any)[windowKey] = dataToSave;
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent(MEDICAL_DATA_CHANGE_EVENT, {
      detail: { section: sectionName, timestamp }
    }));
    
    return true;
  } catch (error) {
    console.error(`Error saving ${sectionName} data:`, error);
    return false;
  }
};

/**
 * Save all current section data from window objects to storage
 */
export const saveAllSectionData = (): void => {
  const sections = [
    'personal', 'history', 'medications', 'allergies', 'immunizations', 
    'social', 'reproductive', 'mental', 'functional', 'cultural'
  ];
  
  sections.forEach(section => {
    const windowKey = getWindowKeyForSection(section);
    if (windowKey && (window as any)[windowKey]) {
      saveSectionData(section);
      console.log(`Auto-saved ${section} data`);
    }
  });
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
 * Load all section data at once
 */
export const loadAllSectionData = (): Record<string, any> => {
  try {
    const savedProfileJson = localStorage.getItem('medicalProfile');
    if (!savedProfileJson) return {};
    
    const savedProfile = JSON.parse(savedProfileJson);
    console.log('Loaded full profile data:', savedProfile);
    
    // Sync all data to sessionStorage and window objects
    Object.keys(savedProfile).forEach(section => {
      const windowKey = getWindowKeyForSection(section);
      if (windowKey) {
        (window as any)[windowKey] = savedProfile[section];
        sessionStorage.setItem(`${section}FormData`, JSON.stringify(savedProfile[section]));
      }
    });
    
    return savedProfile;
  } catch (error) {
    console.error('Error loading full medical profile data:', error);
    return {};
  }
};

// Set up automatic saving at regular intervals
export const initializeAutoSave = (intervalMs = 30000): () => void => {
  const intervalId = setInterval(() => {
    saveAllSectionData();
  }, intervalMs);
  
  // Return a cleanup function
  return () => clearInterval(intervalId);
};

// Set up event listeners for data changes across tabs and windows
export const initializeDataSyncListeners = (): () => void => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'medicalProfile' && e.newValue) {
      try {
        const newData = JSON.parse(e.newValue);
        Object.keys(newData).forEach(section => {
          const windowKey = getWindowKeyForSection(section);
          if (windowKey) {
            (window as any)[windowKey] = newData[section];
            sessionStorage.setItem(`${section}FormData`, JSON.stringify(newData[section]));
            
            // Dispatch event to notify components about the change
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
  
  // Clean up function
  return () => window.removeEventListener('storage', handleStorageChange);
};
