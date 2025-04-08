
import { MedicationInfo } from './medicationData.d';
import { saveMedicationToDb } from './medicationDbUtils';
import { toast } from 'sonner';

// Base URL for Elsevier Drug Info API
const ELSEVIER_API_BASE = 'https://api.elsevier.com/content/drug/v1';

/**
 * Fetches medication information from Elsevier Drug Info API
 * 
 * @param drugName Name of the drug to look up
 * @returns Promise resolving to MedicationInfo object or null if not found
 */
export const fetchElsevierDrugInfo = async (drugName: string): Promise<MedicationInfo | null> => {
  if (!drugName || drugName.trim() === '') {
    return null;
  }

  try {
    console.log('Fetching medication info from Elsevier for:', drugName);
    
    // In a production environment, this would be a real API call to Elsevier's API
    // For simulation purposes, we'll create a placeholder response with simulated delay
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a simulated response for demonstration purposes
    const medicationInfo: MedicationInfo = {
      name: drugName,
      genericName: `Generic ${drugName}`,
      description: `${drugName} is a medication used to treat various conditions according to Elsevier drug database.`,
      drugClass: 'Based on Elsevier classification',
      prescriptionOnly: true,
      usedFor: ['Treatment based on Elsevier data'],
      warnings: ['Consult Elsevier database for complete warnings'],
      sideEffects: {
        common: ['Headache', 'Nausea'],
        serious: ['Consult Elsevier for serious side effects'],
        rare: []
      },
      interactions: ['May interact with other medications - see Elsevier database'],
      dosage: {
        adult: 'As prescribed based on Elsevier guidelines',
        child: 'As prescribed based on Elsevier guidelines',
        elderly: 'As prescribed based on Elsevier guidelines',
        frequency: 'As prescribed'
      },
      forms: ['Tablet', 'Capsule'],
      pregnancy: 'Consult Elsevier database for pregnancy information',
      breastfeeding: 'Consult Elsevier database for breastfeeding information',
      foodInteractions: ['Consult Elsevier database for food interactions'],
      conditionInteractions: ['Consult Elsevier database for condition interactions'],
      therapeuticDuplications: ['Consult Elsevier database for therapeutic duplications'],
      interactionClassifications: {
        major: ['See Elsevier database for major interactions'],
        moderate: ['See Elsevier database for moderate interactions'],
        minor: ['See Elsevier database for minor interactions'],
        unknown: []
      },
      interactionSeverity: {
        major: ['See Elsevier database for major severity interactions'],
        moderate: ['See Elsevier database for moderate severity interactions'],
        minor: ['See Elsevier database for minor severity interactions']
      },
      source: 'Elsevier Drug Info API'
    };
    
    return medicationInfo;
  } catch (error) {
    console.error('Error fetching Elsevier drug information:', error);
    toast.error('Error fetching medication information from Elsevier');
    return null;
  }
};

/**
 * Performs a search in the Elsevier database for medications matching the query
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performElsevierSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // In a real implementation, this would search the Elsevier API
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Common medications in the Elsevier database
    const commonMedications = [
      'Lisinopril', 'Metformin', 'Amlodipine', 'Simvastatin',
      'Omeprazole', 'Levothyroxine', 'Atorvastatin', 'Metoprolol',
      'Losartan', 'Albuterol', 'Gabapentin', 'Hydrochlorothiazide',
      'Furosemide', 'Sertraline', 'Escitalopram', 'Fluoxetine',
      'Tramadol', 'Duloxetine', 'Pantoprazole', 'Citalopram'
    ];
    
    // Filter medications based on the search query
    return commonMedications.filter(med => 
      med.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching Elsevier medications:', error);
    return [];
  }
};
