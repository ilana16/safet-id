/**
 * Utility functions for consistent saving and loading of medical profile data
 */

/**
 * Gets the appropriate window object key for a section
 */
export const getSectionWindowKey = (section: string): string => {
  switch (section) {
    case 'personal': return 'personalFormData';
    case 'history': return 'historyFormData';
    case 'medications': return 'medicationsFormData';
    case 'allergies': return 'allergiesFormData';
    case 'social': return 'socialHistoryFormData';
    case 'reproductive': return 'reproductiveHistoryFormData';
    case 'mental': return 'mentalHealthFormData';
    case 'functional': return 'functionalStatusFormData';
    case 'cultural': return 'culturalPreferencesFormData';
    case 'preventative': return 'preventativeCareFormData';
    default: return '';
  }
};

/**
 * Formats a timestamp for display
 */
export const formatLastSaved = (timestamp: string | null) => {
  if (!timestamp) return null;
  
  try {
    const date = new Date(timestamp);
    
    // If the date is invalid, return null
    if (isNaN(date.getTime())) return null;
    
    // If it's today, just show the time
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && 
                       date.getMonth() === yesterday.getMonth() && 
                       date.getFullYear() === yesterday.getFullYear();
    
    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    console.error('Error formatting timestamp:', e);
    return null;
  }
};

/**
 * Loads section data with prioritizing session storage over localStorage
 */
export const loadSectionData = (section: string) => {
  try {
    // First check session storage (more up-to-date)
    const sessionKey = `${section}FormData`;
    const sessionData = sessionStorage.getItem(sessionKey);
    
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        console.log(`Loaded ${section} data from session storage:`, parsedData);
        
        // Update window object
        const windowKey = getSectionWindowKey(section);
        if (windowKey) {
          (window as any)[windowKey] = parsedData;
        }
        
        return {
          data: parsedData,
          lastSaved: parsedData.lastUpdated || null,
          source: 'session'
        };
      } catch (e) {
        console.error(`Error parsing session data for ${section}:`, e);
      }
    }
    
    // Fall back to localStorage
    const savedProfileJson = localStorage.getItem('medicalProfile');
    if (!savedProfileJson) {
      return { data: null, lastSaved: null, source: null };
    }
    
    const savedProfile = JSON.parse(savedProfileJson);
    if (savedProfile && savedProfile[section]) {
      const sectionData = savedProfile[section];
      console.log(`Loaded ${section} data from localStorage:`, sectionData);
      
      // Update window object
      const windowKey = getSectionWindowKey(section);
      if (windowKey) {
        (window as any)[windowKey] = sectionData;
        
        // Also update session storage for better persistence
        sessionStorage.setItem(sessionKey, JSON.stringify(sectionData));
      }
      
      return {
        data: sectionData,
        lastSaved: sectionData.lastUpdated || null,
        source: 'localStorage'
      };
    }
    
    return { data: null, lastSaved: null, source: null };
  } catch (error) {
    console.error(`Error loading ${section} data:`, error);
    return { data: null, lastSaved: null, source: 'error' };
  }
};

/**
 * Saves section data to both localStorage and sessionStorage
 */
export const saveSectionData = (section: string, data: any, logChangesFunction: Function) => {
  try {
    const existingProfileJson = localStorage.getItem('medicalProfile');
    const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
    const existingSectionData = existingProfile[section] || {};
    
    const saveTimestamp = new Date().toISOString();
    const dataWithTimestamp = {
      ...data,
      lastUpdated: saveTimestamp
    };
    
    // Calculate changes
    const changes: {field: string; oldValue: any; newValue: any}[] = [];
    
    if (typeof data === 'object' && data !== null) {
      // Handle different section data formats
      if (section === 'medications' || 
          section === 'social' || 
          section === 'reproductive' || 
          section === 'mental' || 
          section === 'functional' ||
          section === 'cultural' ||
          section === 'preventative' ||
          section === 'allergies') {
        
        Object.keys(data).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = data[key];
          
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (existingSectionData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData[key],
              newValue: value
            });
          }
        });
      }
    }
    
    // Update localStorage
    const updatedProfile = {
      ...existingProfile,
      [section]: dataWithTimestamp
    };
    
    localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
    
    // Update sessionStorage
    const sessionKey = `${section}FormData`;
    sessionStorage.setItem(sessionKey, JSON.stringify(dataWithTimestamp));
    
    // Log changes if any
    if (changes.length > 0 && logChangesFunction) {
      logChangesFunction(section, changes);
    }
    
    return {
      success: true,
      timestamp: saveTimestamp,
      changes: changes.length
    };
  } catch (error) {
    console.error(`Error saving ${section} data:`, error);
    return {
      success: false,
      error: error
    };
  }
};
