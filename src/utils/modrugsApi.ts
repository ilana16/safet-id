
import { toast } from '@/lib/toast';
import { multiSourceMedicationSearch, getEnhancedDrugDetails } from './multiSourceMedicationApi';
import { searchDrugsCom } from './drugsComApi';
import { MedicationInfo } from './medicationData.d';

// Available data sources
export type MedicationDataSource = 'drugs-com' | 'rxnorm' | 'openfda' | 'who-atc' | 'multi-source';

// Set default data source
let currentDataSource: MedicationDataSource = 'multi-source';

/**
 * Change the medication data source used for lookups
 */
export const setMedicationDataSource = (source: MedicationDataSource): void => {
  currentDataSource = source;
  localStorage.setItem('medication_data_source', source);
  toast.success(`Medication data source set to ${source}`);
};

/**
 * Get the current medication data source
 */
export const getMedicationDataSource = (): MedicationDataSource => {
  const savedSource = localStorage.getItem('medication_data_source') as MedicationDataSource | null;
  return savedSource || currentDataSource;
};

/**
 * Search for medications using the selected data source
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  const dataSource = getMedicationDataSource();
  
  try {
    switch (dataSource) {
      case 'drugs-com':
        const drugsComResults = await searchDrugsCom(query);
        return drugsComResults.map(result => result.name);
      
      case 'multi-source':
      default:
        return await multiSourceMedicationSearch(query);
    }
  } catch (error) {
    console.error(`Error searching medications using ${dataSource}:`, error);
    toast.error('Error searching medications');
    return [];
  }
};

/**
 * Get detailed information about a medication using the selected data source
 */
export const getMedicationInfo = async (drugName: string): Promise<MedicationInfo | null> => {
  const dataSource = getMedicationDataSource();
  
  try {
    switch (dataSource) {
      case 'drugs-com': {
        const { getDrugDetails } = await import('./drugsComApi');
        const formattedName = drugName.toLowerCase().replace(/\s+/g, '-');
        return await getDrugDetails(formattedName);
      }
      
      case 'multi-source':
      default:
        return await getEnhancedDrugDetails(drugName);
    }
  } catch (error) {
    console.error(`Error getting medication info using ${dataSource}:`, error);
    toast.error('Error retrieving medication information');
    return null;
  }
};
