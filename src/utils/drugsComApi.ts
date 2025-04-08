import { toast } from 'sonner';

/**
 * Basic search function for Drugs.com
 * This is a fallback method when the database search doesn't yield results
 * 
 * @param query Search query for medications
 * @returns Array of medication names
 */
export async function searchDrugsCom(query: string): Promise<string[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    // First try to use our API endpoint if it's configured
    try {
      const apiUrl = `/api/medications?query=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map(med => med.name);
        }
      }
    } catch (apiError) {
      console.log('API search unavailable, falling back to local implementation');
      // Silently continue to fallback if API search fails
    }
    
    // Fallback to local implementation with common medications
    // This is a highly simplified version just to provide something when the API is unavailable
    const commonMedications = [
      "Acetaminophen", "Adderall", "Albuterol", "Amitriptyline", "Amlodipine", 
      "Amoxicillin", "Ativan", "Atorvastatin", "Azithromycin", "Benzonatate",
      "Bisoprolol", "Budesonide", "Bupropion", "Buspirone", "Carvedilol", 
      "Cephalexin", "Cetirizine", "Ciprofloxacin", "Citalopram", "Clindamycin",
      "Clonazepam", "Clonidine", "Cyclobenzaprine", "Cymbalta", "Dexamethasone",
      "Diazepam", "Diclofenac", "Dicyclomine", "Diltiazem", "Diphenhydramine",
      "Doxycycline", "Duloxetine", "Enalapril", "Escitalopram", "Esomeprazole", 
      "Estradiol", "Famotidine", "Fluoxetine", "Fluticasone", "Furosemide",
      "Gabapentin", "Glipizide", "Hydrochlorothiazide", "Hydroxyzine", "Ibuprofen",
      "Insulin", "Levothyroxine", "Lexapro", "Lisinopril", "Loratadine",
      "Lorazepam", "Losartan", "Meloxicam", "Metformin", "Methylprednisolone",
      "Metoprolol", "Metronidazole", "Mirtazapine", "Montelukast", "Morphine",
      "Naproxen", "Omeprazole", "Ondansetron", "Oxycodone", "Pantoprazole",
      "Paroxetine", "Penicillin", "Prednisone", "Pregabalin", "Propranolol",
      "Quetiapine", "Ramipril", "Ranitidine", "Sertraline", "Simvastatin",
      "Spironolactone", "Sumatriptan", "Tamsulosin", "Tizanidine", "Tramadol",
      "Trazodone", "Valacyclovir", "Venlafaxine", "Verapamil", "Warfarin",
      "Xanax", "Zoloft"
    ];
    
    const query_lower = query.toLowerCase();
    const filteredMeds = commonMedications.filter(med => 
      med.toLowerCase().includes(query_lower)
    ).sort((a, b) => {
      // Sort by how closely they match the query
      const a_index = a.toLowerCase().indexOf(query_lower);
      const b_index = b.toLowerCase().indexOf(query_lower);
      
      // Favor exact matches and matches at the beginning of words
      if (a_index === 0 && b_index !== 0) return -1;
      if (a_index !== 0 && b_index === 0) return 1;
      
      // Otherwise sort alphabetically
      return a.localeCompare(b);
    });
    
    return filteredMeds.slice(0, 10);
  } catch (error) {
    console.error('Error searching for medications:', error);
    return [];
  }
}
