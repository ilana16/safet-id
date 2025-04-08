
import { toast } from '@/lib/toast';

/**
 * Searches for medications on Drugs.com via a simulated API
 * @param query Search term
 * @returns Promise with array of medication names
 */
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (query.length < 2) {
    return [];
  }
  
  try {
    // Simulate API search with common medications
    const commonMedications = [
      'Acetaminophen', 'Adderall', 'Albuterol', 'Alprazolam', 'Amoxicillin', 
      'Atorvastatin', 'Azithromycin', 'Benzonatate', 'Bupropion', 'Buspirone',
      'Cefdinir', 'Cephalexin', 'Ciprofloxacin', 'Citalopram', 'Clindamycin',
      'Cyclobenzaprine', 'Cymbalta', 'Doxycycline', 'Dupixent', 'Eliquis',
      'Entresto', 'Entyvio', 'Farxiga', 'Fentanyl', 'Gabapentin',
      'Humira', 'Hydrochlorothiazide', 'Hydroxychloroquine', 'Ibuprofen', 'Imbruvica',
      'Januvia', 'Jardiance', 'Kevzara', 'Keytruda', 'Levemir',
      'Levothyroxine', 'Lexapro', 'Lisinopril', 'Lofexidine', 'Loratadine',
      'Losartan', 'Lyrica', 'Metformin', 'Methotrexate', 'Metoprolol',
      'Naloxone', 'Naltrexone', 'Namzaric', 'Naproxen', 'Narcan',
      'Omeprazole', 'Onpattro', 'Opdivo', 'Ozempic', 'Pantoprazole',
      'Prednisone', 'Proair', 'Prozac', 'Qvar', 'Remicade',
      'Rybelsus', 'Saxenda', 'Seroquel', 'Sertraline', 'Simvastatin',
      'Skyrizi', 'Spiriva', 'Stelara', 'Stiolto', 'Suboxone',
      'Symbicort', 'Synthroid', 'Tamiflu', 'Tecfidera', 'Toujeo',
      'Tramadol', 'Trelegy', 'Trintellix', 'Trulicity', 'Tylenol',
      'Uceris', 'Ulesfia', 'Uloric', 'Ultane', 'Ultram',
      'Valacyclovir', 'Valium', 'Vascepa', 'Venlafaxine', 'Ventolin',
      'Viagra', 'Viibryd', 'Vimpat', 'Vistaril', 'Vraylar',
      'Vyvanse', 'Wellbutrin', 'Wixela', 'Xanax', 'Xarelto',
      'Xeljanz', 'Xolair', 'Xyrem', 'Yervoy', 'Yupelri',
      'Zanaflex', 'Zantac', 'Zarxio', 'Zelnorm', 'Zepatier',
      'Zithromax', 'Zofran', 'Zohydro', 'Zoloft', 'Zomig'
    ];
    
    // Search for matches
    const results = commonMedications.filter(med => 
      med.toLowerCase().includes(query.toLowerCase())
    );
    
    // Sort results by relevance (exact match first, then startsWith, then includes)
    return results.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const qLower = query.toLowerCase();
      
      if (aLower === qLower && bLower !== qLower) return -1;
      if (aLower !== qLower && bLower === qLower) return 1;
      
      if (aLower.startsWith(qLower) && !bLower.startsWith(qLower)) return -1;
      if (!aLower.startsWith(qLower) && bLower.startsWith(qLower)) return 1;
      
      return a.localeCompare(b);
    });
    
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching for medications');
    return [];
  }
};

/**
 * Generate a Drugs.com URL for a medication
 * @param drugName The name of the medication
 * @returns URL to the drugs.com page
 */
export const getDrugsComUrl = (drugName: string): string => {
  // Format drug name for URL
  const formattedDrug = drugName.trim().toLowerCase().replace(/\s+/g, '-');
  return `https://www.drugs.com/${formattedDrug}.html`;
};

/**
 * Get detailed information about a medication (simulated)
 * @param drugName The name of the medication
 * @returns Promise with drug information
 */
export const getDrugDetails = async (drugName: string) => {
  // This is a simulation - in a real app, this would fetch from an API
  return {
    name: drugName,
    description: `${drugName} is a simulated medication description. In a real application, this would contain detailed information fetched from a medical API or database.`,
    sideEffects: "Common side effects may include headache, nausea, dizziness. This is simulated data.",
    dosage: "Take as directed by your healthcare provider. This is simulated data.",
    interactions: "May interact with other medications. Consult with your doctor. This is simulated data.",
    pregnancy: "Consult with your healthcare provider before using during pregnancy. This is simulated data."
  };
};
