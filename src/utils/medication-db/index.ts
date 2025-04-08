
// Export all medication database functions from this file
export { incrementMedicationSearchCount } from './core';
export { saveMedicationToDb } from './save';
export { getMedicationFromDb } from './retrieve';
export { performMedicationSearch, enhancedMedicationSearch } from './search';

// Export utilities for working with Drugs.com
export { getDrugsComUrl } from '../drugsComApi';

// Export types for drug imprints and international names
export type DrugImprint = {
  imprint_code: string | null;
  image_url: string | null;
  description: string | null;
};

export type InternationalName = {
  country: string;
  name: string;
};
