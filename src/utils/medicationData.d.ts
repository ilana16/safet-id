
export interface MedicationInfo {
  name: string;
  genericName?: string;
  description?: string;
  drugClass?: string;
  prescriptionOnly?: boolean;
  usedFor?: string[];
  warnings?: string[];
  sideEffects?: {
    common: string[];
    serious: string[];
    rare?: string[];
  };
  interactions?: string[];
  dosage?: {
    adult?: string;
    child?: string;
    elderly?: string;
    frequency?: string;
    renal?: string;
    hepatic?: string;
  };
  forms?: string[];
  pregnancy?: string;
  breastfeeding?: string;
  drugsComUrl?: string;
  foodInteractions?: string[];
  conditionInteractions?: string[];
  therapeuticDuplications?: string[];
  source?: string;
  interactionClassifications?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
    unknown?: string[];
  };
  interactionSeverity?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
  };
  // New properties for database integration
  fromDatabase?: boolean;
  databaseSearchCount?: number;
  halfLife?: string;
  overdose?: {
    symptoms?: string[];
    treatment?: string;
    antidote?: string;
  };
  blackBoxWarning?: string;
  pharmacokinetics?: {
    absorption?: string;
    distribution?: string;
    metabolism?: string;
    elimination?: string;
  };
}

export interface MedicationDatabase {
  [key: string]: MedicationInfo;
}
