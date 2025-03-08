
interface ChangeLogEntry {
  section: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
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
      
      // For arrays of medication items, count them
      if (value[0] && (value[0].name !== undefined || value[0].doseTimes !== undefined)) {
        return `${value.length} item(s)`;
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
 * Logs changes made to medical profile
 */
export const logChanges = (section: string, changes: {field: string; oldValue: any; newValue: any}[]) => {
  // Only log if there are actual changes
  if (changes.length === 0) return;
  
  const filteredChanges = changes.filter(change => {
    // Skip if the values are the same
    if (JSON.stringify(change.oldValue) === JSON.stringify(change.newValue)) {
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
