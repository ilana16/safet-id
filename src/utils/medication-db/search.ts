
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 15000; // 15 seconds

/**
 * Performs a search for medications in the database or external API with timeout
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  let abortController: AbortController | undefined;
  
  try {
    console.log(`Performing medication search for: ${query}`);
    
    // First try to search in the database
    try {
      const { data: dbResults } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(10);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found results in database:', dbResults.length);
        return dbResults.map(result => result.name);
      }
    } catch (dbError) {
      console.error('Error searching database:', dbError);
      // Continue to fallback search even if database search fails
    }
    
    // Skip the API search and go straight to fallback search
    console.log('Going straight to fallback search due to Drugs.com API limitations');
    return await fallbackSearch(query);
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    const isTimeout = error instanceof Error && 
      (error.message.includes('timed out') || 
       error.message.includes('abort') ||
       error.name === 'AbortError');
       
    toast.error(isTimeout
      ? 'Search request timed out. Please try again.'
      : 'Error searching for medications');
    
    // Use fallback search in case of any error
    return await fallbackSearch(query);
  } finally {
    // Clean up abort controller if needed
    if (abortController) {
      try {
        abortController.abort();
      } catch (e) {
        // Ignore errors from aborting after completion
      }
    }
  }
};

/**
 * Fallback search function that returns common medications matching the query
 * Used when the API search fails or times out
 * 
 * @param query Search query string
 * @returns Array of medication names matching the query
 */
const fallbackSearch = async (query: string): Promise<string[]> => {
  console.log('Using fallback search for:', query);
  
  // Expanded list of common medications for better search results
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
    'Minoxidil', 'Montelukast', 'Morphine', 'Nabumetone', 'Nifedipine',
    'Nitrofurantoin', 'Norvasc', 'Olmesartan', 'Oxycontin', 'Paroxetine',
    'Penicillin', 'Phenytoin', 'Plavix', 'Quetiapine', 'Ramipril',
    'Ranitidine', 'Risperdal', 'Rosuvastatin', 'Spiriva', 'Tamsulosin',
    'Tramadol', 'Valacyclovir', 'Valium', 'Valsartan', 'Venlafaxine',
    'Ventolin', 'Verapamil', 'Wellbutrin', 'Xarelto', 'Zestril',
    'Amitriptyline', 'Aricept', 'Celebrex', 'Cozaar', 'Cymbalta',
    'Effexor', 'Flomax', 'Fosamax', 'Glucophage', 'Januvia',
    'Keppra', 'Lamictal', 'Lyrica', 'Methotrexate', 'Neurontin',
    'Paxil', 'Premarin', 'Pristiq', 'Protonix', 'Remicade',
    'Seroquel', 'Singulair', 'Topamax', 'Toprol', 'Zetia'
  ];
  
  // Filter based on query (case-insensitive)
  const lowercaseQuery = query.toLowerCase();
  
  // First try direct matching (starts with)
  let results = commonMedications.filter(med => 
    med.toLowerCase().startsWith(lowercaseQuery)
  );
  
  // If not enough results, add medications that include the query string
  if (results.length < 10) {
    const additionalResults = commonMedications.filter(med => 
      !med.toLowerCase().startsWith(lowercaseQuery) && 
      med.toLowerCase().includes(lowercaseQuery)
    );
    
    results = [...results, ...additionalResults];
  }
  
  // Sort alphabetically and limit to 10 results
  return results.slice(0, 10);
};
