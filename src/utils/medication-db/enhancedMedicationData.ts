
import { MedicationInfo } from '../medicationData.d';
import { getDrugsComUrl } from '../drugsComApi';

/**
 * Returns enhanced medication data for common medications
 * 
 * @param medicationName The name of the medication
 * @returns Promise resolving to medication information
 */
export const getEnhancedMedicationData = async (medicationName: string): Promise<MedicationInfo | null> => {
  const normalizedName = medicationName.toLowerCase().trim();
  
  console.log(`Getting enhanced data for ${normalizedName}`);
  
  // Check for common medications
  if (normalizedName === 'levothyroxine' || normalizedName.includes('synthroid')) {
    return {
      name: "Levothyroxine",
      genericName: "Levothyroxine",
      description: "Levothyroxine is used to treat an underactive thyroid (hypothyroidism). It replaces or provides more thyroid hormone, which is normally produced by the thyroid gland.",
      drugClass: "Thyroid hormone",
      prescriptionOnly: true,
      usedFor: ["Hypothyroidism", "Thyroid hormone replacement therapy", "Thyroid cancer", "Goiter"],
      warnings: ["Take on an empty stomach", "Wait at least 30-60 minutes before eating", "Avoid taking with calcium, iron supplements, or antacids"],
      sideEffects: {
        common: ["Weight changes", "Headache", "Temporary hair loss", "Heat intolerance", "Fever", "Changes in menstrual periods"],
        serious: ["Chest pain", "Fast or irregular heartbeat", "Shortness of breath", "Seizures", "Severe headache", "Extreme fatigue"]
      },
      interactions: [
        "Antacids containing aluminum or magnesium", 
        "Calcium supplements",
        "Iron supplements",
        "Cholestyramine and colestipol",
        "Warfarin (blood thinner)",
        "Digoxin",
        "Diabetes medications"
      ],
      dosage: {
        adult: "Usually starts at 25-50 mcg daily, gradually increased",
        child: "Dosage based on weight and lab test results"
      },
      forms: ["Tablets", "Capsules"],
      interactionClassifications: {
        major: ["Warfarin", "Digoxin", "Antidiabetic agents"],
        moderate: ["Calcium supplements", "Iron supplements", "Antacids"],
        minor: ["Caffeine", "Theophylline"]
      },
      interactionSeverity: {
        major: ["Warfarin", "Digoxin"],
        moderate: ["Calcium supplements", "Iron supplements", "Antacids"],
        minor: ["Caffeine", "Theophylline"]
      },
      foodInteractions: ["Take on an empty stomach", "Certain foods can affect absorption"],
      conditionInteractions: ["Adrenal problems", "Heart disease", "Diabetes"],
      therapeuticDuplications: ["Other thyroid medications"],
      pregnancy: "Category A: Generally safe to use during pregnancy when needed",
      breastfeeding: "Compatible with breastfeeding; minimal amounts in breast milk",
      halfLife: "6-7 days",
      drugsComUrl: "https://www.drugs.com/levothyroxine.html",
      source: "Enhanced Medication Database"
    };
  }
  
  if (normalizedName === 'lisinopril' || normalizedName.includes('prinivil') || normalizedName.includes('zestril')) {
    return {
      name: "Lisinopril",
      genericName: "Lisinopril",
      description: "Lisinopril is used to treat high blood pressure (hypertension) and heart failure. It is also used to improve survival after a heart attack.",
      drugClass: "ACE inhibitor",
      prescriptionOnly: true,
      usedFor: ["High blood pressure", "Heart failure", "Improving survival after heart attack", "Kidney protection in diabetes"],
      warnings: ["May cause dizziness", "Can cause persistent dry cough", "May cause high potassium levels", "Can cause angioedema (swelling)"],
      sideEffects: {
        common: ["Dry cough", "Dizziness", "Headache", "Fatigue", "Diarrhea", "Decreased blood pressure"],
        serious: ["Angioedema", "High potassium levels", "Decreased kidney function", "Liver problems", "Low white blood cell count"]
      },
      interactions: [
        "Potassium supplements",
        "Potassium-sparing diuretics",
        "Lithium",
        "NSAIDs (like ibuprofen)",
        "Diabetes medications"
      ],
      dosage: {
        adult: "Starting dose 5-10 mg once daily, may be increased to 20-40 mg once daily",
        child: "Dosing based on weight and condition"
      },
      forms: ["Tablets"],
      interactionClassifications: {
        major: ["Potassium supplements", "Lithium"],
        moderate: ["NSAIDs", "Other blood pressure medications"],
        minor: ["Antacids"]
      },
      interactionSeverity: {
        major: ["Potassium supplements", "Lithium"],
        moderate: ["NSAIDs", "Other blood pressure medications"],
        minor: ["Antacids"]
      },
      foodInteractions: ["High-potassium foods should be consumed in moderation"],
      conditionInteractions: ["Kidney disease", "Liver disease", "Autoimmune diseases", "History of angioedema"],
      therapeuticDuplications: ["Other ACE inhibitors", "ARBs"],
      pregnancy: "Category D: Avoid in pregnancy, particularly in the second and third trimesters",
      breastfeeding: "Compatible with breastfeeding",
      halfLife: "12 hours",
      drugsComUrl: "https://www.drugs.com/lisinopril.html",
      source: "Enhanced Medication Database"
    };
  }
  
  // For other common medications, generate basic information
  const knownMedications = [
    "acetaminophen", "adderall", "albuterol", "alprazolam", "amoxicillin", 
    "atorvastatin", "azithromycin", "ibuprofen", "metformin", "sertraline"
  ];
  
  if (knownMedications.includes(normalizedName) || 
      knownMedications.some(med => normalizedName.includes(med))) {
    // Generate some basic information for common medications
    const capitalizedName = medicationName.charAt(0).toUpperCase() + medicationName.slice(1).toLowerCase();
    
    return {
      name: capitalizedName,
      genericName: capitalizedName,
      description: `${capitalizedName} is a commonly prescribed medication. For accurate and complete information, please consult with a healthcare professional.`,
      drugClass: "Information available in our database",
      prescriptionOnly: true,
      usedFor: ["Please consult with a healthcare professional for specific uses"],
      warnings: ["Always follow your healthcare provider's instructions", "Store medication properly", "Keep away from children"],
      sideEffects: {
        common: ["Common side effects vary by medication", "Not all patients experience side effects"],
        serious: ["Consult with a healthcare provider if you experience unexpected symptoms"]
      },
      interactions: ["May interact with other medications", "Discuss all medications with your healthcare provider"],
      dosage: {
        adult: "Dosage should be determined by healthcare provider",
        child: "Pediatric dosage should be determined by healthcare provider"
      },
      forms: ["Available in various forms"],
      interactionClassifications: {
        major: [],
        moderate: [],
        minor: []
      },
      interactionSeverity: {
        major: [],
        moderate: [],
        minor: []
      },
      foodInteractions: [],
      conditionInteractions: [],
      therapeuticDuplications: [],
      pregnancy: "Consult with healthcare provider before use during pregnancy",
      breastfeeding: "Consult with healthcare provider before use while breastfeeding",
      halfLife: "Information available in professional resources",
      drugsComUrl: getDrugsComUrl(medicationName),
      source: "Enhanced Medication Database"
    };
  }
  
  // For unknown medications
  return {
    name: medicationName,
    genericName: medicationName,
    description: `Information about ${medicationName} is available through professional healthcare resources. For accurate and complete information, please consult with a healthcare professional.`,
    drugClass: "Information available in professional resources",
    prescriptionOnly: false,
    usedFor: ["Consult with healthcare provider for specific uses"],
    warnings: ["Always consult with a healthcare professional before taking any medication"],
    sideEffects: {
      common: ["Consult with healthcare provider for specific side effects"],
      serious: ["Consult with healthcare provider for specific side effects"]
    },
    interactions: ["Consult with healthcare provider for potential interactions"],
    dosage: {
      adult: "Consult healthcare provider for correct dosage",
      child: "Consult healthcare provider for correct dosage"
    },
    forms: ["Information available in professional resources"],
    interactionClassifications: {
      major: [],
      moderate: [],
      minor: []
    },
    interactionSeverity: {
      major: [],
      moderate: [],
      minor: []
    },
    foodInteractions: [],
    conditionInteractions: [],
    therapeuticDuplications: [],
    pregnancy: "Consult healthcare provider before use during pregnancy",
    breastfeeding: "Consult healthcare provider before use while breastfeeding",
    halfLife: "Information available in professional resources",
    drugsComUrl: getDrugsComUrl(medicationName),
    source: "Enhanced Medication Database"
  };
};
