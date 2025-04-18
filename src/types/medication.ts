
export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  customFrequency?: string;
  customDays?: string;
  selectedDaysOfWeek?: string[];
  reason?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  discontinuationReason?: string;
  foodInteractions?: string[];
  conditionInteractions?: string[];
  therapeuticDuplications?: string[];
  pregnancy?: string;
  breastfeeding?: string;
  url?: string;
  added_at?: string;
}

export interface MedicationTableItem {
  name: string;
  url: string;
  added_at: string;
}

export interface DrugSearchResult {
  id: string;
  name: string;
  description?: string;
}

export interface DrugDetails {
  id: string;
  name: string;
  description?: string;
  sideEffects?: string;
  dosage?: string;
  interactions?: string;
  pregnancy?: string;
}
