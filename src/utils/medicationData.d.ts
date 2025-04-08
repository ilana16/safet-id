
// Type definitions for medication data

export interface SideEffects {
  common?: string[];
  serious?: string[];
  rare?: string[]; // Added rare side effects property
}

export interface InteractionClassifications {
  major?: string[];
  moderate?: string[];
  minor?: string[];
  unknown?: string[]; // Added unknown interactions classification
}

export interface DosageInfo {
  adult?: string;
  child?: string;
  elderly?: string;
  frequency?: string;
  renal?: string;
  hepatic?: string;
}

export interface ATCClassification {
  code: string;
  name: string;
  level: number;
}

export interface MedicationInfo {
  id?: string;
  name: string;
  genericName?: string;
  drugClass?: string;
  description?: string;
  prescriptionOnly?: boolean;
  usedFor?: string[];
  warnings?: string[];
  sideEffects?: SideEffects;
  foodInteractions?: string[];
  conditionInteractions?: string[];
  therapeuticDuplications?: string[];
  interactionClassifications?: InteractionClassifications;
  interactions?: string[]; // Added drug interactions
  interactionSeverity?: { // Added interaction severity classification
    major?: string[];
    moderate?: string[];
    minor?: string[];
  };
  dosage?: DosageInfo; // Added dosage information
  forms?: string[];
  pregnancy?: string;
  breastfeeding?: string;
  halfLife?: string; // Added half-life information
  drugsComUrl?: string;
  source?: string;
  
  // New fields from additional APIs
  rxcui?: string;
  ndc?: string[];
  manufacturer?: string;
  productType?: string;
  routeOfAdministration?: string[];
  atcClassification?: ATCClassification[];
  
  // Database-related properties
  fromDatabase?: boolean; // Indicates if the data came from the database
  databaseSearchCount?: number; // Number of times this medication was searched
  
  // Additional identification properties
  imprints?: Array<{
    imprint_code?: string;
    image_url?: string;
    description?: string;
  }>;
  internationalNames?: Array<{
    country: string;
    name: string;
  }>;
  
  // Any other fields needed for the API or database operations
  [key: string]: any; // Allow for additional properties for flexibility
}

export interface MedicationFormData {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  notes?: string;
}

export interface LookupResult {
  found: boolean;
  medication: MedicationInfo | null;
  source: string;
}
