
// Export all medication database functions from this file
export { incrementMedicationSearchCount } from './core';
export { saveMedicationToDb } from './save';
export { getMedicationFromDb } from './retrieve';
export { performMedicationSearch } from './search';

// Import other necessary functions
import { getDrugsComUrl } from '../drugsComApi';
export { getDrugsComUrl };
