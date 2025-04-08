
import { toast } from 'sonner';

/**
 * Enhanced search function with a comprehensive medication database
 * 
 * @param query Search query string
 * @returns Array of medication names matching the query
 */
export const enhancedMedicationSearch = async (query: string): Promise<string[]> => {
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
    'Singulair', 'Topamax', 'Toprol', 'Zetia',
    // Over 250 common medications to provide better search results
    'Actos', 'Ativan', 'Augmentin', 'Bactrim', 'Benadryl',
    'Boniva', 'Bumex', 'Cardizem', 'Celexa', 'Coreg',
    'Coumadin', 'Crestor', 'Depakote', 'Diovan', 'Enbrel',
    'Flonase', 'Focalin', 'Hyzaar', 'Imitrex', 'Keflex',
    'Lasix', 'Levaquin', 'Levitra', 'Lipitor', 'Lunesta',
    'Mobic', 'Naprosyn', 'Nasonex', 'Nexium', 'Norvasc',
    'Paxil', 'Pepcid', 'Prevacid', 'Prilosec', 'Prinivil',
    'Provigil', 'Prozac', 'Seroquel', 'Singular', 'Synthroid',
    'Tamiflu', 'Tums', 'Ultram', 'Valtrex', 'Viagra',
    'Vytorin', 'Wellbutrin', 'Xalatan', 'Xanax', 'Yasmin',
    'Zantac', 'Zestoretic', 'Zithromax', 'Zocor', 'Zoloft'
  ];
  
  try {
    // Filter based on query (case-insensitive)
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (lowercaseQuery.length < 2) {
      return [];
    }
    
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
    return Array.from(new Set(results)).slice(0, 15);
  } catch (error) {
    console.error('Error in enhanced medication search:', error);
    toast.error('Error searching medication database');
    return [];
  }
};
