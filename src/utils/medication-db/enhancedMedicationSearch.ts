
import { toast } from 'sonner';

/**
 * Enhanced search function with a comprehensive medication database
 * 
 * @param query Search query string
 * @returns Array of medication names matching the query
 */
export const enhancedMedicationSearch = async (query: string): Promise<string[]> => {
  console.log('Using enhanced medication database search for:', query);
  
  // Comprehensive list of common medications stored as a Set for faster lookups
  const commonMedicationsSet = new Set([
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
  ]);

  // Convert set to array for searching
  const commonMedications = Array.from(commonMedicationsSet);
  
  try {
    // Filter based on query (case-insensitive)
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (lowercaseQuery.length < 2) {
      return [];
    }
    
    // Use a faster approach - filter once and sort by relevance
    const startsWith = [];
    const includes = [];
    
    // Use a more efficient approach to searching
    for (const med of commonMedications) {
      const lowerMed = med.toLowerCase();
      if (lowerMed.startsWith(lowercaseQuery)) {
        startsWith.push(med);
      } else if (lowerMed.includes(lowercaseQuery)) {
        includes.push(med);
      }
      
      // Early exit if we have enough results
      if (startsWith.length + includes.length >= 20) {
        break;
      }
    }
    
    // Combine results with priority to those that start with the query
    const results = [...startsWith, ...includes];
    
    // Return unique results limited to 15
    return results.slice(0, 15);
  } catch (error) {
    console.error('Error in enhanced medication search:', error);
    toast.error('Error searching medication database');
    return [];
  }
};
