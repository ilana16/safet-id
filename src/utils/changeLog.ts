
interface ChangeLogEntry {
  section: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    formattedOldValue?: string;
    formattedNewValue?: string;
  }[];
}

/**
 * Formats a value for display in the logs
 */
const formatValueForLog = (value: any): string => {
  if (value === undefined || value === null) {
    return 'Not set';
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Empty list';
      
      // For arrays of medication items or other complex items
      if (value[0] && typeof value[0] === 'object') {
        const itemCount = value.length;
        
        // For medications, treatments, pregnancies, etc.
        if (value[0].name !== undefined || value[0].doseTimes !== undefined || 
            value[0].jobTitle !== undefined || value[0].type !== undefined ||
            value[0].year !== undefined || value[0].id !== undefined) {
          return `${itemCount} item(s)`;
        }
      }
      
      return JSON.stringify(value);
    }
    
    // For empty objects
    if (Object.keys(value).length === 0) {
      return 'Empty';
    }
    
    // Try to get a name or identifier for the object
    if (value.name) {
      return value.name;
    }
    
    return JSON.stringify(value);
  }
  
  return String(value);
};

/**
 * Deeply compares two values to determine if they are equal
 */
const deepCompare = (value1: any, value2: any): boolean => {
  // Handle primitives and nullish values
  if (value1 === value2) return true;
  if (value1 === null || value2 === null) return false;
  if (value1 === undefined || value2 === undefined) return false;
  if (typeof value1 !== 'object' || typeof value2 !== 'object') return false;
  
  // Handle arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    
    // For arrays of objects with IDs (like medications, treatments, etc.)
    if (value1.length > 0 && value1[0] && value1[0].id !== undefined) {
      // Create maps for quick lookup by id
      const map1 = new Map(value1.map(item => [item.id, item]));
      const map2 = new Map(value2.map(item => [item.id, item]));
      
      // Check if all ids match
      if (map1.size !== map2.size) return false;
      
      // Check each item by id
      for (const [id, item1] of map1.entries()) {
        const item2 = map2.get(id);
        if (!item2 || JSON.stringify(item1) !== JSON.stringify(item2)) {
          return false;
        }
      }
      
      return true;
    }
    
    // For simple arrays
    return JSON.stringify(value1) === JSON.stringify(value2);
  }
  
  // Handle objects
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepCompare(value1[key], value2[key])) return false;
  }
  
  return true;
};

/**
 * Logs changes made to medical profile
 */
export const logChanges = (section: string, changes: {field: string; oldValue: any; newValue: any}[]) => {
  // Only log if there are actual changes
  if (changes.length === 0) return;
  
  const filteredChanges = changes.filter(change => {
    // Skip if the values are the same using deep comparison
    if (deepCompare(change.oldValue, change.newValue)) {
      return false;
    }
    return true;
  });
  
  // Exit if no changes after filtering
  if (filteredChanges.length === 0) return;
  
  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem('medicalProfileChangeLogs') || '[]');
  
  // Process changes to add formatted values for display
  const processedChanges = filteredChanges.map(change => ({
    ...change,
    // Add formatted values for display
    formattedOldValue: formatValueForLog(change.oldValue),
    formattedNewValue: formatValueForLog(change.newValue)
  }));
  
  // Create new log entry
  const newEntry: ChangeLogEntry = {
    section,
    timestamp: new Date().toISOString(),
    changes: processedChanges
  };
  
  // Add new log entry
  const updatedLogs = [newEntry, ...existingLogs];
  
  // Store in localStorage
  localStorage.setItem('medicalProfileChangeLogs', JSON.stringify(updatedLogs));
  
  // Log for debugging
  console.log('Changes logged:', newEntry);
};

/**
 * Get all change logs
 */
export const getChangeLogs = (): ChangeLogEntry[] => {
  return JSON.parse(localStorage.getItem('medicalProfileChangeLogs') || '[]');
};

/**
 * Clear all change logs (useful for testing)
 */
export const clearChangeLogs = (): void => {
  localStorage.removeItem('medicalProfileChangeLogs');
  console.log('Change logs cleared');
};
