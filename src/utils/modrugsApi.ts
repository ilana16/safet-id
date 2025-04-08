
import { MedicationInfo } from './medicationData.d';
import { toast } from 'sonner';

/**
 * Performs a search in the Drugs.com scraper for medications matching the query
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Import search function from the Drugs.com scraper API
    const { performDrugsComScraperSearch } = await import('./elsevierApi');
    
    // Search the Drugs.com scraper
    const results = await performDrugsComScraperSearch(query);
    
    // Sort results alphabetically
    return results.sort((a, b) => a.localeCompare(b));
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    toast.error('Error searching medications');
    return [];
  }
};

/**
 * Fetch medication information from Drugs.com using web scraping techniques
 * Based on https://github.com/miteoshi/Drugs.com-scrapper
 * 
 * @param drugName Name of the drug to look up
 * @returns Promise resolving to MedicationInfo object or null if not found
 */
export const fetchMedicationInfo = async (drugName: string): Promise<MedicationInfo | null> => {
  if (!drugName || drugName.trim() === '') {
    return null;
  }

  try {
    console.log('Fetching medication info using Drugs.com scraper for:', drugName);
    
    // In a production environment, this would call a backend API that runs the Python scraper
    // For our frontend demo, we'll use fetch API to get the HTML and parse it client-side
    
    // Normalize drug name for URL
    const normalizedDrugName = drugName.toLowerCase().replace(/\s+/g, '-');
    const url = `https://www.drugs.com/${normalizedDrugName}.html`;
    
    // Due to CORS restrictions, this direct fetch will not work in production
    // In a real app, you would use a CORS proxy or backend API
    // This is for demonstration purposes only
    console.log(`Note: Direct scraping from frontend will be blocked by CORS. This is a simulation.`);
    
    // Simulate a network delay and response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create simulated response based on the Python scraper structure
    const drugData = {
      name: drugName,
      genericName: `Generic ${drugName}`,
      description: `${drugName} is used to treat various conditions. This is sample data that simulates what would be returned by the Python scraper.`,
      drugClass: 'Sample Drug Class',
      prescriptionOnly: Math.random() > 0.5,
      usedFor: ['Sample condition 1', 'Sample condition 2'],
      warnings: ['Do not use if allergic', 'Consult your doctor before use'],
      sideEffects: {
        common: ['Headache', 'Nausea', 'Dizziness'],
        serious: ['Allergic reaction', 'Difficulty breathing']
      },
      interactions: [
        `${drugName} may interact with other medications`,
        'Tell your doctor about all medications you use'
      ],
      dosage: {
        adult: 'Take as directed by your doctor',
        child: 'Not recommended for children under 12',
        elderly: 'Reduced dosage may be needed'
      },
      forms: ['Tablet', 'Capsule'],
      pregnancy: 'Consult your doctor if pregnant or planning pregnancy',
      breastfeeding: 'Not recommended during breastfeeding',
      foodInteractions: ['Avoid alcohol', 'May be taken with or without food'],
      conditionInteractions: ['Liver disease', 'Kidney disease'],
      therapeuticDuplications: ['Similar medications should not be taken simultaneously'],
      interactionClassifications: {
        major: ['Drug A', 'Drug B'],
        moderate: ['Drug C', 'Drug D'],
        minor: ['Drug E']
      },
      halfLife: '12-24 hours',
      source: 'Drugs.com Scraper (Simulated)'
    };
    
    // Convert to MedicationInfo format
    const medicationInfo: MedicationInfo = {
      name: drugData.name,
      genericName: drugData.genericName,
      description: drugData.description,
      drugClass: drugData.drugClass,
      prescriptionOnly: drugData.prescriptionOnly,
      usedFor: drugData.usedFor,
      warnings: drugData.warnings,
      sideEffects: drugData.sideEffects,
      interactions: drugData.interactions,
      dosage: drugData.dosage,
      forms: drugData.forms,
      pregnancy: drugData.pregnancy,
      breastfeeding: drugData.breastfeeding,
      foodInteractions: drugData.foodInteractions,
      conditionInteractions: drugData.conditionInteractions,
      therapeuticDuplications: drugData.therapeuticDuplications,
      interactionClassifications: drugData.interactionClassifications,
      halfLife: drugData.halfLife,
      source: drugData.source
    };
    
    return medicationInfo;
    
  } catch (error) {
    console.error('Error fetching medication information:', error);
    toast.error('Error fetching medication information');
    return null;
  }
};
