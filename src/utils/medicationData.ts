
// This is a simplified medication database for demo purposes
// In a production app, this would connect to a proper API like drugs.com

export interface MedicationInfo {
  name: string;
  genericName?: string;
  description: string;
  usedFor: string[];
  sideEffects: string[];
  interactions: string[];
  warnings: string[];
  dosage: {
    adult: string;
    child?: string;
    elderly?: string;
  };
  image?: string;
  drugsComUrl?: string; // Added for linking to Drugs.com
}

// Sample medication database
export const medicationDatabase: Record<string, MedicationInfo> = {
  "lisinopril": {
    name: "Lisinopril",
    genericName: "Lisinopril",
    description: "Lisinopril is an ACE inhibitor that is used to treat high blood pressure (hypertension) and heart failure.",
    usedFor: ["High blood pressure", "Heart failure", "Improving survival after heart attacks"],
    sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue", "Nausea"],
    interactions: ["Potassium supplements", "Potassium-sparing diuretics", "NSAIDs", "Lithium"],
    warnings: [
      "May cause harm to an unborn baby",
      "Can cause angioedema (swelling of face, lips, throat)",
      "May cause kidney problems"
    ],
    dosage: {
      adult: "Initial: 10mg once daily. Maintenance: 20-40mg once daily.",
      elderly: "Initial: 2.5-5mg once daily."
    },
    drugsComUrl: "https://www.drugs.com/lisinopril.html"
  },
  "metformin": {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    description: "Metformin is a biguanide medication used to treat type 2 diabetes mellitus.",
    usedFor: ["Type 2 diabetes", "Insulin resistance", "PCOS (off-label)"],
    sideEffects: ["Nausea", "Diarrhea", "Stomach pain", "Metallic taste", "Vitamin B12 deficiency"],
    interactions: ["Contrast dyes", "Certain diabetes medications", "Alcohol"],
    warnings: [
      "Can cause lactic acidosis (rare but serious)",
      "Should be temporarily stopped before surgery or certain medical tests",
      "Not for patients with kidney disease"
    ],
    dosage: {
      adult: "Initial: 500mg twice daily. Maximum: 2550mg per day in divided doses.",
      elderly: "Lower doses may be needed due to decreased kidney function."
    },
    drugsComUrl: "https://www.drugs.com/metformin.html"
  },
  "atorvastatin": {
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    description: "Atorvastatin is a statin medication used to prevent cardiovascular disease and treat high cholesterol levels.",
    usedFor: ["High cholesterol", "Prevention of cardiovascular disease", "Stroke prevention"],
    sideEffects: ["Muscle pain", "Joint pain", "Digestive problems", "Increased blood sugar"],
    interactions: ["Certain antibiotics", "Antifungal medications", "Other cholesterol medications", "Grapefruit juice"],
    warnings: [
      "Can cause liver problems",
      "May cause muscle damage (rhabdomyolysis)",
      "Should be used with caution in people with diabetes"
    ],
    dosage: {
      adult: "Initial: 10-20mg once daily. Maintenance: 10-80mg once daily."
    },
    drugsComUrl: "https://www.drugs.com/atorvastatin.html"
  },
  "levothyroxine": {
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    description: "Levothyroxine is a thyroid hormone used to treat hypothyroidism.",
    usedFor: ["Hypothyroidism", "Thyroid hormone replacement", "Thyroid cancer (as adjunct)"],
    sideEffects: ["Headache", "Insomnia", "Nervousness", "Sweating", "Changes in appetite"],
    interactions: ["Calcium supplements", "Iron supplements", "Antacids", "Certain seizure medications"],
    warnings: [
      "Not for weight loss",
      "May worsen heart disease",
      "Dose adjustments may be needed during pregnancy"
    ],
    dosage: {
      adult: "Initial: 25-50mcg once daily. Adjusted based on lab results.",
      elderly: "Initial: 12.5-25mcg once daily."
    },
    drugsComUrl: "https://www.drugs.com/levothyroxine.html"
  },
  "amoxicillin": {
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    description: "Amoxicillin is a penicillin antibiotic used to treat bacterial infections.",
    usedFor: ["Respiratory infections", "Ear infections", "Urinary tract infections", "Skin infections"],
    sideEffects: ["Diarrhea", "Nausea", "Vomiting", "Rash"],
    interactions: ["Probenecid", "Certain blood thinners", "Other antibiotics"],
    warnings: [
      "May cause allergic reactions in penicillin-sensitive individuals",
      "Can lead to antibiotic resistance if misused",
      "May reduce effectiveness of birth control pills"
    ],
    dosage: {
      adult: "250-500mg every 8 hours or 500-875mg every 12 hours, depending on infection.",
      child: "20-90mg/kg/day divided into 2-3 doses, depending on infection and age."
    },
    drugsComUrl: "https://www.drugs.com/amoxicillin.html"
  },
  "amlodipine": {
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    description: "Amlodipine is a calcium channel blocker that dilates blood vessels and improves blood flow.",
    usedFor: ["High blood pressure", "Coronary artery disease", "Angina (chest pain)"],
    sideEffects: ["Swelling in ankles or feet", "Dizziness", "Flushing", "Headache", "Fatigue"],
    interactions: ["Grapefruit juice", "Simvastatin", "Certain antifungal medications", "Cyclosporine"],
    warnings: [
      "May cause increased angina or heart attack with sudden discontinuation",
      "Use with caution in severe liver disease",
      "Monitor blood pressure regularly"
    ],
    dosage: {
      adult: "Initial: 5mg once daily. Maximum: 10mg once daily.",
      elderly: "Initial: 2.5mg once daily."
    },
    drugsComUrl: "https://www.drugs.com/amlodipine.html"
  },
  "hydrochlorothiazide": {
    name: "Hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    description: "Hydrochlorothiazide is a thiazide diuretic (water pill) that helps prevent your body from absorbing too much salt.",
    usedFor: ["High blood pressure", "Fluid retention", "Edema", "Heart failure"],
    sideEffects: ["Increased urination", "Low potassium levels", "Dizziness", "Increased blood sugar", "Increased cholesterol"],
    interactions: ["Lithium", "Digoxin", "NSAIDs", "Diabetes medications"],
    warnings: [
      "Can cause electrolyte imbalances (particularly potassium)",
      "Increased sun sensitivity",
      "May affect blood sugar in diabetics"
    ],
    dosage: {
      adult: "12.5-50mg once daily.",
      elderly: "12.5-25mg once daily."
    },
    drugsComUrl: "https://www.drugs.com/hydrochlorothiazide.html"
  },
  "aspirin": {
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    description: "Aspirin is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, fever, and inflammation.",
    usedFor: ["Pain relief", "Fever reduction", "Anti-inflammatory", "Heart attack prevention"],
    sideEffects: ["Stomach upset", "Heartburn", "Nausea", "Stomach bleeding", "Tinnitus (ringing in ears)"],
    interactions: ["Blood thinners", "Other NSAIDs", "Corticosteroids", "Some antidepressants"],
    warnings: [
      "Can cause stomach bleeding",
      "Should not be given to children (risk of Reye's syndrome)",
      "Not recommended during pregnancy"
    ],
    dosage: {
      adult: "325-650mg every 4-6 hours as needed for pain. 81-325mg daily for heart attack prevention."
    },
    drugsComUrl: "https://www.drugs.com/aspirin.html"
  },
  "ibuprofen": {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    description: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.",
    usedFor: ["Pain relief", "Fever reduction", "Inflammation", "Menstrual cramps"],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness", "Mild headache", "Nausea"],
    interactions: ["Aspirin", "Blood pressure medications", "Diuretics", "Blood thinners"],
    warnings: [
      "Increased risk of heart attack and stroke",
      "Can cause stomach bleeding",
      "May cause kidney problems with long-term use"
    ],
    dosage: {
      adult: "200-400mg every 4-6 hours as needed, not to exceed 3200mg per day.",
      child: "Varies by weight and age."
    },
    drugsComUrl: "https://www.drugs.com/ibuprofen.html"
  }
};

// Function to search medications
export const searchMedications = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  return Object.keys(medicationDatabase).filter(key => 
    key.toLowerCase().includes(normalizedQuery) || 
    medicationDatabase[key].name.toLowerCase().includes(normalizedQuery) ||
    (medicationDatabase[key].genericName && 
     medicationDatabase[key].genericName!.toLowerCase().includes(normalizedQuery))
  );
};

// Function to get medication details
export const getMedicationInfo = (medicationKey: string): MedicationInfo | null => {
  return medicationDatabase[medicationKey.toLowerCase()] || null;
};
