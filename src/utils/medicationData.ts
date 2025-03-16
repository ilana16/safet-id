
export interface MedicationInfo {
  name: string;
  genericName?: string;
  description: string;
  drugsComUrl?: string;
  drugClass?: string;
  usedFor?: string[];
  dosage: {
    adult: string;
    child?: string;
    elderly?: string;
    frequency?: string;
  };
  sideEffects?: string[];
  warnings?: string[];
  interactions?: string[];
  source?: string;
}

// Mock database for the demo
export const medicationDatabase: Record<string, MedicationInfo> = {
  lisinopril: {
    name: "Lisinopril",
    genericName: "Lisinopril",
    drugClass: "ACE Inhibitor",
    description: "Lisinopril is used to treat high blood pressure (hypertension) and heart failure. It belongs to a class of drugs known as ACE inhibitors, which work by relaxing blood vessels.",
    drugsComUrl: "https://www.drugs.com/lisinopril.html",
    usedFor: ["Hypertension", "Heart Failure", "Post-Heart Attack Recovery", "Diabetic Kidney Disease"],
    dosage: {
      adult: "Initial: 10 mg once daily. Maintenance: 20-40 mg once daily.",
      child: "For children 6 years and older: Starting dose based on weight, usually 0.07 mg per kg of body weight once daily.",
      elderly: "Initial: 2.5-5 mg once daily. Adjust based on response.",
      frequency: "Once daily"
    },
    sideEffects: [
      "Dizziness",
      "Headache",
      "Dry cough",
      "Low blood pressure",
      "Increased potassium levels",
      "Fatigue"
    ],
    warnings: [
      "May cause harm or death to an unborn baby. Stop taking this medicine and tell your doctor right away if you become pregnant.",
      "May cause angioedema (swelling of face, lips, tongue, throat). Seek emergency medical attention if you have difficulty breathing or swallowing.",
      "May cause kidney problems, especially in people with kidney disease, heart failure, or taking certain medications."
    ],
    interactions: [
      "NSAIDs (like ibuprofen, naproxen) may reduce the blood pressure-lowering effect of lisinopril",
      "Potassium supplements or salt substitutes may increase potassium levels in your blood",
      "Lithium levels may increase when taken with lisinopril"
    ],
    source: "Drugs.com"
  },
  metformin: {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    drugClass: "Biguanide Antidiabetic",
    description: "Metformin is used to treat type 2 diabetes. It works by decreasing glucose production in the liver and increasing insulin sensitivity in tissues.",
    drugsComUrl: "https://www.drugs.com/metformin.html",
    usedFor: ["Type 2 Diabetes", "Insulin Resistance", "Polycystic Ovary Syndrome (PCOS)"],
    dosage: {
      adult: "Initial: 500 mg twice daily or 850 mg once daily with meals. Maintenance: 2000-2550 mg daily in divided doses.",
      elderly: "Start at lower doses and titrate slowly. Monitor kidney function regularly.",
      frequency: "Usually taken with meals 2-3 times daily"
    },
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Stomach pain",
      "Metallic taste",
      "Decreased vitamin B12 levels"
    ],
    warnings: [
      "Lactic acidosis: A rare but serious side effect. Seek emergency medical attention if you experience unusual muscle pain, difficulty breathing, stomach pain, or unusual tiredness.",
      "Not recommended for patients with severe kidney disease.",
      "Should be temporarily discontinued before radiological studies using iodinated contrast materials."
    ],
    interactions: [
      "Carbonic anhydrase inhibitors (such as topiramate) may increase the risk of lactic acidosis",
      "Cimetidine may increase metformin levels",
      "Alcohol may increase the risk of lactic acidosis and low blood sugar"
    ],
    source: "Drugs.com"
  },
  atorvastatin: {
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    description: "Atorvastatin is used to lower blood cholesterol and reduce the risk of cardiovascular disease. It works by blocking an enzyme that produces cholesterol in the liver.",
    drugsComUrl: "https://www.drugs.com/atorvastatin.html",
    usedFor: ["High Cholesterol", "Prevention of Heart Disease", "Stroke Prevention", "Heart Attack Prevention"],
    dosage: {
      adult: "Initial: 10-20 mg once daily. Maintenance: 10-80 mg once daily.",
      elderly: "Use with caution, starting at lower doses.",
      frequency: "Once daily, can be taken at any time of day"
    },
    sideEffects: [
      "Muscle pain or weakness",
      "Joint pain",
      "Diarrhea",
      "Nausea",
      "Elevated liver enzymes",
      "Headache"
    ],
    warnings: [
      "May cause liver damage. Your doctor will monitor liver function while taking this medication.",
      "May cause muscle problems (myopathy or rhabdomyolysis). Report any unusual muscle pain, tenderness, or weakness to your doctor.",
      "Pregnancy Category X: Do not use during pregnancy."
    ],
    interactions: [
      "Grapefruit juice may increase atorvastatin levels",
      "Certain antibiotics and antifungals may increase the risk of muscle problems",
      "Cyclosporine, fibrates, and niacin may increase the risk of myopathy"
    ],
    source: "Drugs.com"
  },
  aspirin: {
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    drugClass: "NSAID, Antiplatelet",
    description: "Aspirin is used to treat pain, fever, and inflammation. Low-dose aspirin is also used as a blood thinner to prevent blood clots.",
    drugsComUrl: "https://www.drugs.com/aspirin.html",
    usedFor: ["Pain Relief", "Fever Reduction", "Anti-inflammatory", "Heart Attack Prevention", "Stroke Prevention"],
    dosage: {
      adult: "Pain/fever: 325-650 mg every 4-6 hours. Heart disease prevention: 81-325 mg once daily.",
      child: "Not recommended for children under 12 years due to risk of Reye's syndrome.",
      elderly: "Use lowest effective dose. Increased risk of bleeding.",
      frequency: "Varies by indication"
    },
    sideEffects: [
      "Upset stomach",
      "Heartburn",
      "Easy bruising or bleeding",
      "Ringing in ears",
      "Allergic reactions",
      "Gastrointestinal bleeding"
    ],
    warnings: [
      "Reye's syndrome: Do not give to children or teenagers with viral infections.",
      "Bleeding risk: Can cause serious gastrointestinal bleeding.",
      "Pregnancy category D: Use only if clearly needed in pregnancy.",
      "Alcohol warning: Increases risk of bleeding when combined with aspirin."
    ],
    interactions: [
      "Other blood thinners increase bleeding risk",
      "Other NSAIDs may increase side effects",
      "ACE inhibitors may have decreased effectiveness",
      "May increase methotrexate toxicity"
    ],
    source: "Drugs.com"
  },
  "vitamin d": {
    name: "Vitamin D",
    genericName: "Cholecalciferol (Vitamin D3)",
    drugClass: "Vitamin/Supplement",
    description: "Vitamin D is essential for calcium absorption and bone health. It also plays roles in immune function, cell growth, and inflammation reduction.",
    drugsComUrl: "https://www.drugs.com/vitamin-d.html",
    usedFor: ["Vitamin D Deficiency", "Bone Health", "Osteoporosis Prevention", "Immune Support"],
    dosage: {
      adult: "RDA: 600-800 IU daily. For deficiency: 1,000-4,000 IU daily or as directed by doctor.",
      child: "RDA: 400-600 IU daily. For deficiency: As directed by doctor.",
      elderly: "RDA: 800 IU daily. For deficiency: 1,000-4,000 IU daily or as directed by doctor.",
      frequency: "Daily"
    },
    sideEffects: [
      "Usually well-tolerated at recommended doses",
      "High doses may cause nausea, vomiting",
      "Excessive intake may cause hypercalcemia",
      "Kidney stones with prolonged high doses"
    ],
    warnings: [
      "Do not exceed recommended dosage without medical supervision.",
      "People with certain conditions (sarcoidosis, hyperparathyroidism, kidney disease) should use with caution.",
      "Vitamin D toxicity can occur with excessive supplementation."
    ],
    interactions: [
      "Certain seizure medications may decrease vitamin D effectiveness",
      "Steroids may interfere with vitamin D metabolism",
      "Cholesterol-lowering medications may reduce absorption",
      "Some weight loss drugs may decrease absorption"
    ],
    source: "Drugs.com"
  }
};
