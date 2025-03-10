
// This is a simplified medication database for demo purposes
// In a production app, this would connect to a proper API like drugs.com

interface MedicationInfo {
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
}

// Sample medication database
const medicationDatabase: Record<string, MedicationInfo> = {
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
    }
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
    }
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
    }
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
    }
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
    }
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

export type { MedicationInfo };
