
/**
 * Helper functions for drugs.com API integration
 */
import { MedicationInfo } from './medicationData.d';

export const getDrugClassificationUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/drug-interactions/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const getDrugFoodInteractionsUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/food-interactions/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const getDrugConditionInteractionsUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/disease-interactions/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const getDrugDuplicationsUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/drug-interactions/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const getDrugPregnancyUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/pregnancy/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const getDrugBreastfeedingUrl = (drugName: string): string => {
  if (!drugName) return '';
  return `https://www.drugs.com/breastfeeding/${encodeURIComponent(drugName.toLowerCase())}.html`;
};

export const enrichMedicationInfo = (medicationInfo: MedicationInfo): MedicationInfo => {
  // Generate sample data for new fields for demonstration purposes
  // In a real application, this data would come from the API
  const foodInteractions = [
    'Avoid grapefruit juice while taking this medication',
    'May decrease effectiveness when taken with high-fat meals',
    'Take on an empty stomach for best absorption'
  ];
  
  const conditionInteractions = [
    'Use with caution in patients with liver disease',
    'May worsen symptoms of asthma',
    'Not recommended for patients with kidney impairment'
  ];
  
  const therapeuticDuplications = [
    'May duplicate the effects of other medications in the same class',
    'Check with your doctor before taking with similar medications'
  ];
  
  const interactionClassifications = {
    major: ['Combining with MAOIs may cause dangerous elevation in blood pressure'],
    moderate: ['May reduce effectiveness of oral contraceptives'],
    minor: ['Mild increase in drowsiness when combined with antihistamines'],
    unknown: []
  };
  
  const interactionSeverity = {
    major: ['Dangerous combination that should be avoided'],
    moderate: ['May require monitoring or dosage adjustment'],
    minor: ['Minor effect, generally safe to use together']
  };
  
  return {
    ...medicationInfo,
    foodInteractions: foodInteractions.slice(0, Math.floor(Math.random() * 3) + 1),
    conditionInteractions: conditionInteractions.slice(0, Math.floor(Math.random() * 3) + 1),
    therapeuticDuplications: therapeuticDuplications.slice(0, Math.floor(Math.random() * 2) + 1),
    interactionClassifications,
    interactionSeverity,
    pregnancy: medicationInfo.pregnancy || 'This medication should only be used during pregnancy when clearly needed. Discuss the risks and benefits with your doctor.',
    breastfeeding: medicationInfo.breastfeeding || 'This medication may pass into breast milk. Consult your doctor before breastfeeding.'
  };
};
