
// Type definitions for medication data

export interface SideEffects {
  common?: string[];
  serious?: string[];
}

export interface InteractionClassifications {
  major?: string[];
  moderate?: string[];
  minor?: string[];
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
  source?: string;
  forms?: string[];
  pregnancy?: string;
  breastfeeding?: string;
  drugsComUrl?: string;
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
