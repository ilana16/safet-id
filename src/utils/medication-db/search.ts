
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 15000; // 15 seconds

/**
 * Performs a search for medications in the database with enhanced fallback
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    console.log(`Performing medication search for: ${query}`);
    
    // First try to search in the database
    try {
      const { data: dbResults } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(15);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found results in database:', dbResults.length);
        return dbResults.map(result => result.name);
      }
    } catch (dbError) {
      console.error('Error searching database:', dbError);
    }
    
    // Use enhanced local medication database search
    console.log('Using enhanced medication database search');
    return await enhancedMedicationSearch(query);
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    toast.error('Error searching for medications');
    
    // Even on error, provide results from enhanced search
    return await enhancedMedicationSearch(query);
  }
};

/**
 * Enhanced search function with a comprehensive medication database
 * 
 * @param query Search query string
 * @returns Array of medication names matching the query
 */
const enhancedMedicationSearch = async (query: string): Promise<string[]> => {
  console.log('Using enhanced medication database search for:', query);
  
  // Comprehensive list of common medications
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
    'Keppra', 'Lamictal', 'Lyrica', 'Neurontin', 'Paxil',
    'Premarin', 'Pristiq', 'Protonix', 'Remicade', 'Seroquel',
    'Singulair', 'Topamax', 'Toprol', 'Zetia', 'Actos', 'Ativan',
    'Augmentin', 'Bactrim', 'Benadryl', 'Boniva', 'Bumex',
    'Cardizem', 'Celexa', 'Coreg', 'Coumadin', 'Crestor',
    'Depakote', 'Diovan', 'Enbrel', 'Flonase', 'Focalin',
    'Hyzaar', 'Imitrex', 'Keflex', 'Lasix', 'Levaquin',
    'Levitra', 'Lipitor', 'Lunesta', 'Mobic', 'Naprosyn',
    'Nasonex', 'Nexium', 'Norvasc', 'Paxil', 'Pepcid',
    'Prevacid', 'Prilosec', 'Prinivil', 'Provigil', 'Prozac',
    'Seroquel', 'Singular', 'Synthroid', 'Tamiflu', 'Tums',
    'Ultram', 'Valtrex', 'Viagra', 'Vytorin', 'Wellbutrin',
    'Xalatan', 'Xanax', 'Yasmin', 'Zantac', 'Zestoretic',
    'Zithromax', 'Zocor', 'Zoloft', 'Aciphex', 'Ambien',
    'Atacand', 'Avapro', 'Avodart', 'Biaxin', 'Caduet',
    'Chantix', 'Cialis', 'Concerta', 'Cosopt', 'Cozaar',
    'Detrol', 'Diflucan', 'Dilantin', 'Effexor', 'Elavil',
    'Estrace', 'Femara', 'Fosamax', 'Glucophage', 'Glucotrol',
    'Humulin', 'Hytrin', 'Inderal', 'Januvia', 'Klonopin',
    'Lantus', 'Lexapro', 'Lipitor', 'Lotensin', 'Lotrel',
    'Lyrica', 'Macrobid', 'Methotrexate', 'Mevacor', 'Micardis',
    'Mircette', 'Motrin', 'Namenda', 'Neurontin', 'Nexium',
    'Niaspan', 'Ortho Tri-Cyclen', 'Plavix', 'Plendil', 'Prandin',
    'Pravachol', 'Premarin', 'Prevacid', 'Prilosec', 'Prinivil',
    'Procardia', 'Protonix', 'Provera', 'Prozac', 'Risperdal',
    'Ritalin', 'Robitussin', 'Seroquel', 'Singulair', 'Strattera',
    'Synthroid', 'Tegretol', 'Toprol', 'Tricor', 'Tylenol',
    'Ultram', 'Valtrex', 'Viagra', 'Vytorin', 'Wellbutrin',
    'Xalatan', 'Zetia', 'Zithromax', 'Zocor', 'Zoloft', 'Zyprexa',
    'Zyrtec', 'Advair', 'Calan', 'Cordarone', 'Coversyl', 'Demulen',
    'Desyrel', 'Diabeta', 'Diflucan', 'Elimite', 'Estradiol'
  ];
  
  // Filter based on query (case-insensitive)
  const lowercaseQuery = query.toLowerCase();
  
  // First try direct matching (starts with)
  let results = commonMedications.filter(med => 
    med.toLowerCase().startsWith(lowercaseQuery)
  );
  
  // If not enough results, add medications that include the query string
  if (results.length < 15) {
    const additionalResults = commonMedications.filter(med => 
      !med.toLowerCase().startsWith(lowercaseQuery) && 
      med.toLowerCase().includes(lowercaseQuery)
    );
    
    results = [...results, ...additionalResults];
  }
  
  // Sort alphabetically and limit to 15 results
  return results.slice(0, 15);
};
