
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
  
  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem('medicalProfileChangeLogs') || '[]');
  
  // Create new log entry
  const newEntry: ChangeLogEntry = {
    section,
    timestamp: new Date().toISOString(),
    changes
  };
  
  // Add new log entry
  const updatedLogs = [newEntry, ...existingLogs];
  
  // Store in localStorage
  localStorage.setItem('medicalProfileChangeLogs', JSON.stringify(updatedLogs));
};

/**
 * Get all change logs
 */
export const getChangeLogs = (): ChangeLogEntry[] => {
  return JSON.parse(localStorage.getItem('medicalProfileChangeLogs') || '[]');
};
