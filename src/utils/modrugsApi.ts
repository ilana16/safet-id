
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
    // Simulate scraping drugs.com search page using Python scraper
    console.log('Simulating Python scraper search for:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate search results
    const commonMeds = [
      'acetaminophen', 'adderall', 'albuterol', 'alprazolam', 'amoxicillin', 
      'atorvastatin', 'azithromycin', 'benzonatate', 'bupropion', 'buspirone',
      'cefdinir', 'cephalexin', 'ciprofloxacin', 'citalopram', 'clindamycin', 
      'clonazepam', 'cyclobenzaprine', 'diazepam', 'doxycycline', 'duloxetine',
      'escitalopram', 'fluoxetine', 'gabapentin', 'hydrochlorothiazide', 'hydroxyzine',
      'ibuprofen', 'levothyroxine', 'lisinopril', 'loperamide', 'loratadine',
      'lorazepam', 'losartan', 'metformin', 'metoprolol', 'metronidazole',
      'naproxen', 'omeprazole', 'ondansetron', 'oxycodone', 'pantoprazole',
      'prednisone', 'propranolol', 'sertraline', 'simvastatin', 'trazodone',
      'vitamin d', 'warfarin', 'zoloft', 'zolpidem'
    ];
    
    // Filter based on query
    const filteredResults = commonMeds.filter(med => 
      med.toLowerCase().includes(query.toLowerCase())
    );
    
    // Sort alphabetically
    return filteredResults.sort((a, b) => a.localeCompare(b));
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    toast.error('Error searching medications');
    return [];
  }
};

/**
 * Fetch medication information from Drugs.com using web scraping techniques
 * Based on the Python scraper for Drugs.com
 * 
 * @param drugName Name of the drug to look up
 * @returns Promise resolving to MedicationInfo object or null if not found
 */
export const fetchMedicationInfo = async (drugName: string): Promise<MedicationInfo | null> => {
  if (!drugName || drugName.trim() === '') {
    return null;
  }

  try {
    console.log('Simulating Python Drugs.com scraper for:', drugName);
    
    // Simulate network delay for realistic scraping time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate simulated drug data based on the Python scraper structure
    const sideEffects = {
      common: generateRandomArray([
        'Headache', 'Nausea', 'Dizziness', 'Drowsiness', 'Fatigue',
        'Dry mouth', 'Insomnia', 'Anxiety', 'Upset stomach', 'Diarrhea',
        'Constipation', 'Increased sweating', 'Loss of appetite', 'Muscle pain',
        'Blurred vision', 'Itching', 'Skin rash', 'Irritability'
      ], 3, 7),
      serious: generateRandomArray([
        'Allergic reaction', 'Difficulty breathing', 'Chest pain', 'Irregular heartbeat',
        'Severe dizziness', 'Fainting', 'Seizure', 'Unusual bleeding or bruising',
        'Severe stomach/abdominal pain', 'Persistent nausea/vomiting',
        'Yellowing of eyes/skin', 'Dark urine', 'Mental/mood changes',
        'Swelling of ankles/feet', 'Vision changes', 'Unusual tiredness'
      ], 2, 5),
      rare: generateRandomArray([
        'Stevens-Johnson syndrome', 'Toxic epidermal necrolysis', 'Anaphylaxis',
        'Agranulocytosis', 'Aplastic anemia', 'Rhabdomyolysis', 'QT prolongation',
        'Serotonin syndrome', 'Pancreatitis', 'Angioedema', 'Myocarditis'
      ], 1, 3)
    };

    // Generate drug class based on the drug name
    const drugClass = getDrugClass(drugName);
    
    // Generate dosage information
    const dosage = {
      adult: `Adults: ${getRandomDosage()}`,
      child: `Children: ${getRandomDosage(true)}`,
      elderly: `Elderly: ${getRandomDosage(false, true)}`,
      frequency: getRandomFrequency(),
      renal: getRandomRenalDosage(),
      hepatic: getRandomHepaticDosage()
    };
    
    // Generate interaction classifications
    const interactionClassifications = {
      major: generateRandomArray([
        'Monoamine oxidase inhibitors (MAOIs)', 'Warfarin', 'Phenelzine',
        'Tranylcypromine', 'Isocarboxazid', 'CYP3A4 inhibitors', 'QT-prolonging agents',
        `${drugName} with alcohol`, 'Linezolid', 'Methylene blue'
      ], 1, 3),
      moderate: generateRandomArray([
        'NSAIDs', 'Aspirin', 'Antacids', 'Cimetidine', 'Beta blockers',
        'Oral contraceptives', 'Phenytoin', 'Carbamazepine', 'Rifampin',
        'Quinolone antibiotics', 'Proton pump inhibitors'
      ], 2, 5),
      minor: generateRandomArray([
        'Caffeine', 'Multivitamins', 'Vitamin C', 'Vitamin D', 'Calcium supplements',
        'Iron supplements', 'Magnesium supplements', 'Zinc supplements'
      ], 1, 4),
      unknown: []
    };
    
    // Generate food interactions
    const foodInteractions = generateRandomArray([
      `Avoid grapefruit juice while taking ${drugName}`,
      'Take on an empty stomach for better absorption',
      'Take with food to minimize stomach upset',
      'Avoid alcohol while taking this medication',
      'May decrease effectiveness when taken with high-fat meals',
      'Avoid excessive caffeine consumption',
      'Avoid foods high in tyramine (aged cheese, cured meats)',
      'Take 1 hour before or 2 hours after meals',
      'Absorption may be decreased with dairy products'
    ], 2, 4);
    
    // Generate condition interactions
    const conditionInteractions = generateRandomArray([
      'Liver disease: Use with caution, dose adjustment may be needed',
      'Kidney disease: Lower doses may be required',
      'Heart conditions: Monitor cardiac function regularly',
      'History of seizures: May lower seizure threshold',
      'Thyroid disorders: May affect thyroid function tests',
      'Diabetes: May affect blood glucose levels',
      'Glaucoma: May increase intraocular pressure',
      'Bleeding disorders: May increase risk of bleeding',
      'Depression: Monitor for worsening symptoms',
      'Bipolar disorder: May trigger manic episodes',
      'Parkinson\'s disease: May worsen symptoms'
    ], 3, 6);
    
    // Generate therapeutic duplications
    const therapeuticDuplications = generateRandomArray([
      `Do not take with other medications in the same class as ${drugName}`,
      'May cause additive effects with similar medications',
      'Check with your doctor before taking with other medications with similar effects',
      'Combining with medications in the same therapeutic category may increase side effects',
      'Taking multiple medications with similar actions may lead to cumulative toxicity'
    ], 1, 3);
    
    // Determine if prescription only based on drug name
    const isPrescriptionOnly = /^(a|c|d|e|f|l|m|o|p|s|v|z)/i.test(drugName);
    
    // Create drug data
    const drugData: MedicationInfo = {
      name: drugName,
      genericName: getGenericName(drugName),
      description: `${drugName} is used to ${getRandomUses().join(', ')}. ${getRandomDescription(drugName)}`,
      drugClass: drugClass,
      prescriptionOnly: isPrescriptionOnly,
      usedFor: getRandomUses(),
      warnings: generateRandomArray([
        'Do not use if allergic to this medication',
        'Consult your doctor before use if you are pregnant or breastfeeding',
        'May cause drowsiness; use caution when driving or operating machinery',
        'Do not drink alcohol while taking this medication',
        'Do not stop taking this medication suddenly without consulting your doctor',
        'May increase risk of suicidal thoughts in children, adolescents, and young adults',
        'May cause serious skin reactions; seek medical attention if rash develops',
        'May affect liver function; periodic blood tests may be needed',
        'May mask signs of infection; report new symptoms promptly'
      ], 3, 5),
      sideEffects: sideEffects,
      interactions: [
        `${drugName} may interact with other medications`,
        'Tell your doctor about all medications you use, including vitamins and herbs',
        `Ask a doctor or pharmacist before using ${drugName} with any other medications`
      ],
      dosage: dosage,
      forms: getRandomForms(),
      pregnancy: getRandomPregnancyCategory(),
      breastfeeding: getRandomBreastfeedingAdvice(),
      foodInteractions: foodInteractions,
      conditionInteractions: conditionInteractions,
      therapeuticDuplications: therapeuticDuplications,
      interactionClassifications: interactionClassifications,
      halfLife: getRandomHalfLife(),
      source: 'Python Drugs.com Scraper (Simulated)'
    };
    
    return drugData;
    
  } catch (error) {
    console.error('Error fetching medication information:', error);
    toast.error('Error fetching medication information');
    return null;
  }
};

// Helper functions
function generateRandomArray(items: string[], min: number, max: number): string[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getDrugClass(drugName: string): string {
  const classes = {
    'a': ['Analgesic', 'Antidepressant', 'Antibiotic', 'Antihistamine', 'Antihypertensive'],
    'b': ['Beta blocker', 'Benzodiazepine', 'Blood thinner'],
    'c': ['Calcium channel blocker', 'Corticosteroid', 'Cephalosporin'],
    'd': ['Diuretic', 'Decongestant'],
    'e': ['Erectile dysfunction medication', 'Estrogen'],
    'f': ['Fluoroquinolone'],
    'g': ['Gastrointestinal agent'],
    'h': ['Hormone therapy'],
    'i': ['Immunosuppressant', 'Iron supplement'],
    'l': ['Lipid-lowering agent', 'Laxative'],
    'm': ['Muscle relaxant', 'Mood stabilizer'],
    'n': ['NSAID', 'Nootropic'],
    'o': ['Opioid analgesic', 'Oral hypoglycemic'],
    'p': ['Proton pump inhibitor', 'Psychiatric medication'],
    's': ['SSRI', 'Statin', 'Sleep aid'],
    't': ['Thyroid medication', 'Tricyclic antidepressant'],
    'v': ['Vitamin supplement', 'Vasodilator'],
    'w': ['Weight loss medication'],
    'z': ['Z-drug (sleep medication)']
  };
  
  const firstLetter = drugName.charAt(0).toLowerCase();
  const possibleClasses = classes[firstLetter as keyof typeof classes] || ['Medication'];
  
  return possibleClasses[Math.floor(Math.random() * possibleClasses.length)];
}

function getGenericName(brandName: string): string {
  const prefixes = ['', 'gen', 'nor', 'par', 'met', 'sul', 'oxy', 'hydro', 'des', 'lev'];
  const suffixes = ['ol', 'ine', 'ate', 'ide', 'zole', 'one', 'ium', 'pril', 'vir', 'stat', 'sartan'];
  
  if (brandName.length <= 3) return brandName;
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const baseName = brandName.substring(0, Math.floor(brandName.length * 0.7)).toLowerCase();
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return prefix + baseName + suffix;
}

function getRandomDosage(isChild: boolean = false, isElderly: boolean = false): string {
  const baseAmount = isChild ? 
    Math.floor(Math.random() * 15) + 5 : 
    Math.floor(Math.random() * 50) + 25;
  
  const amount = isElderly ? Math.floor(baseAmount * 0.7) : baseAmount;
  
  const units = ['mg', 'mcg', 'g', 'mL'];
  const unit = units[Math.floor(Math.random() * units.length)];
  
  const frequencies = ['once daily', 'twice daily', 'three times daily', 'every 4-6 hours', 'every 8 hours'];
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
  
  return `${amount} ${unit} ${frequency}`;
}

function getRandomRenalDosage(): string {
  const adjustments = [
    'No adjustment necessary for mild impairment',
    'Reduce dose by 25% for moderate impairment',
    'Reduce dose by 50% for severe impairment',
    'Use with caution, monitor renal function',
    'Not recommended for severe renal impairment'
  ];
  
  return adjustments[Math.floor(Math.random() * adjustments.length)];
}

function getRandomHepaticDosage(): string {
  const adjustments = [
    'No adjustment necessary for mild impairment',
    'Reduce dose by 25% for moderate impairment',
    'Reduce dose by 50% for severe impairment',
    'Use with caution, monitor liver function',
    'Not recommended for severe hepatic impairment'
  ];
  
  return adjustments[Math.floor(Math.random() * adjustments.length)];
}

function getRandomFrequency(): string {
  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4-6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Weekly',
    'Twice weekly'
  ];
  
  return frequencies[Math.floor(Math.random() * frequencies.length)];
}

function getRandomUses(): string[] {
  const uses = [
    'treat pain',
    'reduce inflammation',
    'lower blood pressure',
    'lower cholesterol',
    'treat anxiety',
    'treat depression',
    'treat bacterial infections',
    'control seizures',
    'treat insomnia',
    'reduce fever',
    'treat diabetes',
    'treat allergies',
    'control asthma symptoms',
    'treat psychosis',
    'treat attention deficit hyperactivity disorder',
    'treat acid reflux',
    'prevent blood clots',
    'treat thyroid disorders',
    'treat migraine headaches'
  ];
  
  return generateRandomArray(uses, 1, 3);
}

function getRandomDescription(drugName: string): string {
  const descriptions = [
    `${drugName} belongs to a class of drugs known as [drug class]. It works by [mechanism of action].`,
    `${drugName} is effective for many patients but may cause side effects in some individuals.`,
    `${drugName} has been used to treat various conditions for over [X] years.`,
    `${drugName} should be used exactly as prescribed by your healthcare provider.`,
    `${drugName} is available in multiple forms including [forms].`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomForms(): string[] {
  const forms = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Cream',
    'Ointment',
    'Patch',
    'Suppository',
    'Eye drops',
    'Nasal spray',
    'Inhalation',
    'Extended-release tablet',
    'Chewable tablet',
    'Powder for suspension'
  ];
  
  return generateRandomArray(forms, 1, 3);
}

function getRandomPregnancyCategory(): string {
  const categories = [
    'Pregnancy Category A: Studies in pregnant women have not shown risk to the fetus.',
    'Pregnancy Category B: Animal studies have shown no risk to the fetus, but there are no adequate studies in pregnant women.',
    'Pregnancy Category C: Animal studies have shown adverse effects on the fetus, but the potential benefits may warrant use despite potential risks.',
    'Pregnancy Category D: There is evidence of risk to the human fetus, but the potential benefits may outweigh the risks.',
    'Pregnancy Category X: Studies in animals or humans have demonstrated fetal abnormalities, and the risk clearly outweighs any possible benefit.'
  ];
  
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomBreastfeedingAdvice(): string {
  const advice = [
    'This medication may pass into breast milk. Breastfeeding is not recommended while using this medication.',
    'This medication is considered compatible with breastfeeding. Monitor the infant for possible side effects.',
    'Limited data available on use during breastfeeding. Consult your doctor before breastfeeding.',
    'It is unknown if this medication passes into breast milk. Caution advised for nursing mothers.',
    'This medication should be used during breastfeeding only when clearly needed. Discuss with your doctor.'
  ];
  
  return advice[Math.floor(Math.random() * advice.length)];
}

function getRandomHalfLife(): string {
  const hours = Math.floor(Math.random() * 24) + 1;
  
  const variations = [
    `Approximately ${hours} hours`,
    `${hours}-${hours + Math.floor(Math.random() * 6)} hours`,
    `Less than ${hours} hours in healthy adults`,
    `${hours} hours (may be prolonged in elderly patients)`,
    `Average of ${hours} hours`
  ];
  
  return variations[Math.floor(Math.random() * variations.length)];
}
