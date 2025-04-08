
// This file is maintained for backward compatibility
// It re-exports all functions from the new modular structure

export {
  incrementMedicationSearchCount,
  saveMedicationToDb,
  getMedicationFromDb,
  performMedicationSearch,
  getDrugsComUrl
} from './medication-db';
