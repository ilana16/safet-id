
import { toast } from 'sonner';

/**
 * Enhanced search function with a comprehensive medication database
 * 
 * @param query Search query string
 * @returns Array of medication names matching the query
 */
export const enhancedMedicationSearch = async (query: string): Promise<string[]> => {
  console.log('Using enhanced medication database search for:', query);
  
  // Early exit for short queries
  const lowercaseQuery = query.toLowerCase().trim();
  if (lowercaseQuery.length < 2) {
    return [];
  }
  
  try {
    // Comprehensive list of common medications stored as a Set for faster lookups
    const commonMedications = [
      'Acetaminophen', 'Adderall', 'Albuterol', 'Alprazolam', 'Amoxicillin', 
      'Atorvastatin', 'Azithromycin', 'Benzonatate', 'Bupropion', 'Buspirone',
      'Cefdinir', 'Cephalexin', 'Ciprofloxacin', 'Citalopram', 'Clindamycin', 
      'Clonazepam', 'Cyclobenzaprine', 'Diazepam', 'Doxycycline', 'Duloxetine',
      'Escitalopram', 'Fluoxetine', 'Gabapentin', 'Hydrochlorothiazide', 'Hydroxyzine',
      'Ibuprofen', 'Levothyroxine', 'Lisinopril', 'Loperamide', 'Loratadine',
      'Lorazepam', 'Losartan', 'Metformin', 'Metoprolol', 'Metronidazole',
      'Naproxen', 'Omeprazole', 'Ondansetron', 'Oxycodone', 'Pantoprazole',
      'Prednisone', 'Propranolol', 'Sertraline', 'Simvastatin', 'Trazodone',
      'Vitamin D', 'Warfarin', 'Zoloft', 'Zolpidem', 'Abilify', 'Lipitor',
      'Nexium', 'Prozac', 'Xanax', 'Zantac', 'Advil', 'Tylenol', 'Motrin',
      'Allegra', 'Claritin', 'Zyrtec', 'Ambien', 'Viagra', 'Cialis', 
      'Humira', 'Eliquis', 'Synthroid', 'Crestor', 'Vyvanse', 'Lantus',
      'Amlodipine', 'Aspirin', 'Atenolol', 'Carvedilol', 'Diclofenac',
      'Digoxin', 'Diltiazem', 'Diphenhydramine', 'Furosemide', 'Glipizide',
      'Hydralazine', 'Hydrocodone', 'Insulin', 'Lamotrigine', 'Latanoprost',
      'Levothroid', 'Lexapro', 'Meloxicam', 'Methotrexate', 'Methylprednisolone',
      'Minoxidil', 'Montelukast', 'Morphine', 'Nabumetone', 'Nifedipine'
    ];

    // Direct matches first (exact or starts-with)
    const exactMatch = commonMedications.find(
      med => med.toLowerCase() === lowercaseQuery
    );
    
    if (exactMatch) {
      console.log('Found exact match:', exactMatch);
      return [exactMatch]; // Return immediately on exact match
    }
    
    // Starts with matches
    const startsWithResults = commonMedications.filter(med => 
      med.toLowerCase().startsWith(lowercaseQuery)
    );
    
    // Contains matches (but doesn't start with)
    const includesResults = commonMedications.filter(med => 
      !med.toLowerCase().startsWith(lowercaseQuery) && 
      med.toLowerCase().includes(lowercaseQuery)
    );
    
    // Combine results with priority to those that start with the query
    const results = [...startsWithResults, ...includesResults];
    console.log(`Enhanced search found ${results.length} results for "${query}"`);
    
    // Return unique results limited to 15
    return results.slice(0, 15);
    
  } catch (error) {
    console.error('Error in enhanced medication search:', error);
    toast.error('Error searching medication database');
    return [];
  }
};
