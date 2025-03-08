
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
  
  // Create new log entry
  const newEntry: ChangeLogEntry = {
    section,
    timestamp: new Date().toISOString(),
    changes: filteredChanges
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
