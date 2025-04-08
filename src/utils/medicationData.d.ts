
export interface MedicationInfo {
  name: string;
  genericName?: string;
  description: string;
  usedFor?: string[];
  prescriptionOnly?: boolean;
  drugClass?: string;
  dosage?: {
    adult?: string;
    child?: string;
    elderly?: string;
    frequency?: string;
    renal?: string;
    hepatic?: string;
  };
  interactions?: string[];
  warnings?: string[];
  sideEffects?: {
    common?: string[];
    serious?: string[];
    rare?: string[];
  };
  drugsComUrl?: string;
  forms?: string[];
  pregnancy?: string;
  breastfeeding?: string;
  foodInteractions?: string[];
  conditionInteractions?: string[];
  therapeuticDuplications?: string[];
  interactionClassifications?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
    unknown?: string[];
  };
  overdose?: {
    symptoms: string[];
    treatment: string;
    antidote?: string;
  };
  blackBoxWarning?: string;
  halfLife?: string;
  controlledSubstance?: string;
  pharmacokinetics?: {
    absorption?: string;
    distribution?: string;
    metabolism?: string;
    elimination?: string;
  };
  source?: string;
}

export interface MedicationDatabase {
  [key: string]: MedicationInfo;
}
