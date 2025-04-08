
import { importDrugWithRelationships, DrugImportData } from './importDrug';

/**
 * Example function to import a sample drug
 */
export const importSampleDrug = async (): Promise<void> => {
  // Example drug data matching the format from the Python script
  const sampleDrug: DrugImportData = {
    name: "Acetaminophen",
    slug: "acetaminophen",
    consumer_info: "Acetaminophen is a pain reliever and fever reducer.",
    side_effects: "Rare but serious side effects include liver problems.",
    dosage: "Adults: 325-650 mg every 4-6 hours as needed, not exceeding 3000 mg per day.",
    pregnancy: "Generally considered safe when used as directed.",
    breastfeeding: "Compatible with breastfeeding in usual doses.",
    classification: "Non-opioid analgesic",
    drug_class: "Analgesic and antipyretic",
    generic: "acetaminophen",
    otc: true,
    interactions: {
      major: ["Alcohol (chronic use)", "Warfarin"],
      moderate: ["Carbamazepine", "Isoniazid"],
      minor: ["Caffeine"],
      unknown: [],
      food_interactions: ["Alcohol"],
      condition_interactions: ["Liver disease", "Alcoholism"],
      therapeutic_duplications: ["Other acetaminophen-containing products"]
    },
    imprints: [
      {
        imprint_code: "TYLENOL",
        image_url: null,
        description: "White oval tablet"
      }
    ],
    international_names: [
      {
        country: "UK",
        name: "Paracetamol"
      },
      {
        country: "Spain",
        name: "Paracetamol"
      }
    ]
  };
  
  // Import the drug with all its relationships
  const drugId = await importDrugWithRelationships(sampleDrug);
  
  if (drugId) {
    console.log(`Drug imported successfully with ID: ${drugId}`);
  } else {
    console.error("Drug import failed");
  }
};
