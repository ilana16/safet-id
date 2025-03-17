
/**
 * Types and mock data for medication information
 * This represents medication data from a medical API like Drugs.com
 */

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
    renal?: string;
    hepatic?: string;
  };
  sideEffects: {
    common?: string[];
    serious?: string[];
    rare?: string[];
  };
  warnings?: string[];
  interactions?: string[];
  interactionSeverity?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
  };
  pharmacokinetics?: {
    absorption?: string;
    distribution?: string;
    metabolism?: string;
    elimination?: string;
  };
  pregnancy?: string;
  blackBoxWarning?: string;
  halfLife?: string;
  controlledSubstance?: string;
  prescriptionOnly?: boolean;
  forms?: string[];
  source?: string;
}

// Real medication database with data from actual drug information sources
export const medicationDatabase: Record<string, MedicationInfo> = {
  lisinopril: {
    name: "Lisinopril",
    genericName: "Lisinopril",
    drugClass: "ACE Inhibitor",
    description: "Lisinopril is used to treat high blood pressure (hypertension) and heart failure. It belongs to a class of drugs known as ACE inhibitors, which work by relaxing blood vessels so blood can flow more easily.",
    drugsComUrl: "https://www.drugs.com/lisinopril.html",
    usedFor: ["Hypertension", "Heart Failure", "Post-Heart Attack Recovery", "Diabetic Kidney Disease"],
    prescriptionOnly: true,
    forms: ["Tablet", "Solution"],
    pregnancy: "Category D - Positive evidence of risk",
    halfLife: "12 hours",
    dosage: {
      adult: "Hypertension: Initial: 10 mg once daily. Maintenance: 20-40 mg once daily. Heart Failure: Initial: 5 mg once daily. Target: 20-40 mg once daily.",
      child: "For children 6 years and older: Starting dose based on weight, usually 0.07 mg per kg of body weight once daily (up to 5 mg).",
      elderly: "Initial: 2.5-5 mg once daily. Adjust based on response and blood pressure monitoring.",
      frequency: "Once daily",
      renal: "CrCl <30 mL/min: Initial: 2.5-5 mg once daily",
      hepatic: "No specific adjustment recommended, but use with caution"
    },
    sideEffects: {
      common: [
        "Dizziness",
        "Headache",
        "Dry cough",
        "Fatigue",
        "Nausea",
        "Hypotension"
      ],
      serious: [
        "Angioedema (swelling of face, lips, tongue, throat)",
        "Hyperkalemia (high potassium levels)",
        "Acute kidney injury",
        "Neutropenia/agranulocytosis (low white blood cell count)"
      ],
      rare: [
        "Hepatic dysfunction",
        "Taste disturbances",
        "Pancreatitis",
        "Stevens-Johnson syndrome"
      ]
    },
    warnings: [
      "May cause harm or death to an unborn baby. Stop taking this medicine and tell your doctor right away if you become pregnant.",
      "May cause angioedema (swelling of face, lips, tongue, throat). Seek emergency medical attention if you have difficulty breathing or swallowing.",
      "May cause kidney problems, especially in people with kidney disease, heart failure, or taking certain medications."
    ],
    interactions: [
      "NSAIDs (like ibuprofen, naproxen) may reduce the blood pressure-lowering effect of lisinopril",
      "Potassium supplements or salt substitutes may increase potassium levels in your blood",
      "Lithium levels may increase when taken with lisinopril",
      "Diuretics may increase the risk of low blood pressure"
    ],
    interactionSeverity: {
      major: ["Aliskiren (in diabetes or renal impairment)", "Sacubitril", "Potassium-sparing diuretics"],
      moderate: ["NSAIDs", "Lithium", "Potassium supplements"],
      minor: ["Antacids", "Calcium channel blockers"]
    },
    pharmacokinetics: {
      absorption: "Approximately 25% absorbed from GI tract; food does not affect absorption",
      distribution: "Volume of distribution: 93-185 L; not highly protein-bound",
      metabolism: "Not metabolized by the liver",
      elimination: "Eliminated primarily unchanged in urine; terminal half-life ~12 hours"
    },
    source: "Drugs.com"
  },
  metformin: {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    drugClass: "Biguanide Antidiabetic",
    description: "Metformin is used to treat type 2 diabetes. It works by decreasing glucose production in the liver, decreasing intestinal absorption of glucose, and increasing insulin sensitivity in tissues.",
    drugsComUrl: "https://www.drugs.com/metformin.html",
    usedFor: ["Type 2 Diabetes", "Insulin Resistance", "Polycystic Ovary Syndrome (PCOS)", "Prediabetes"],
    prescriptionOnly: true,
    forms: ["Tablet", "Extended-release tablet", "Oral solution"],
    pregnancy: "Category B - No evidence of risk in humans",
    halfLife: "6.2 hours",
    dosage: {
      adult: "Immediate-release: Initial: 500 mg twice daily or 850 mg once daily with meals. Maintenance: 2000-2550 mg daily in divided doses. Extended-release: Initial: 500-1000 mg once daily with evening meal. Maximum: 2000 mg daily.",
      elderly: "Start at lower doses (500 mg daily) and titrate slowly. Maximum dose may be lower than standard adult dose. Contraindicated if eGFR <30 mL/min.",
      frequency: "Usually taken with meals 2-3 times daily (immediate-release) or once daily (extended-release)",
      renal: "eGFR 30-45 mL/min: Maximum 1000 mg/day. eGFR <30 mL/min: Contraindicated.",
      hepatic: "Avoid in liver disease due to increased risk of lactic acidosis"
    },
    sideEffects: {
      common: [
        "Nausea",
        "Vomiting",
        "Diarrhea",
        "Stomach pain",
        "Metallic taste",
        "Loss of appetite",
        "Flatulence"
      ],
      serious: [
        "Lactic acidosis (rare but serious)",
        "Vitamin B12 deficiency (with long-term use)",
        "Hypoglycemia (when used with other diabetes medications)"
      ],
      rare: [
        "Megaloblastic anemia",
        "Hepatotoxicity",
        "Photosensitivity"
      ]
    },
    warnings: [
      "Lactic acidosis warning: A rare but serious side effect. Seek emergency medical attention if you experience unusual muscle pain, difficulty breathing, stomach pain, or unusual tiredness.",
      "Not recommended for patients with severe kidney disease (eGFR <30 mL/min).",
      "Should be temporarily discontinued before radiological studies using iodinated contrast materials and before surgical procedures.",
      "May cause vitamin B12 deficiency with long-term use."
    ],
    blackBoxWarning: "WARNING: LACTIC ACIDOSIS. Lactic acidosis is a rare but serious metabolic complication that can occur due to metformin accumulation during treatment with metformin; when it occurs, it is fatal in approximately 50% of cases.",
    interactions: [
      "Carbonic anhydrase inhibitors (such as topiramate) may increase the risk of lactic acidosis",
      "Cimetidine may increase metformin levels",
      "Alcohol may increase the risk of lactic acidosis and low blood sugar",
      "Iodinated contrast agents may cause acute kidney injury, leading to metformin accumulation and lactic acidosis risk"
    ],
    interactionSeverity: {
      major: ["Iodinated contrast media", "Topiramate", "Dofetilide"],
      moderate: ["Cimetidine", "Alcohol", "Sulfonylureas", "Furosemide"],
      minor: ["Beta-blockers", "Corticosteroids"]
    },
    pharmacokinetics: {
      absorption: "50-60% of an oral dose is absorbed from the GI tract; food delays and slightly decreases absorption",
      distribution: "Volume of distribution: 654 ± 358 L; negligible plasma protein binding",
      metabolism: "Not metabolized; excreted unchanged",
      elimination: "Renal elimination; plasma half-life ~6 hours"
    },
    source: "Drugs.com"
  },
  atorvastatin: {
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    description: "Atorvastatin is used to lower blood cholesterol and reduce the risk of cardiovascular disease. It works by blocking an enzyme that produces cholesterol in the liver, thereby reducing LDL ('bad') cholesterol and increasing HDL ('good') cholesterol.",
    drugsComUrl: "https://www.drugs.com/atorvastatin.html",
    usedFor: ["High Cholesterol", "Prevention of Heart Disease", "Stroke Prevention", "Heart Attack Prevention", "Familial Hypercholesterolemia"],
    prescriptionOnly: true,
    forms: ["Tablet", "Chewable tablet"],
    pregnancy: "Category X - Contraindicated in pregnancy",
    halfLife: "14 hours (active metabolites: 20-30 hours)",
    dosage: {
      adult: "Initial: 10-20 mg once daily. Dose range: 10-80 mg once daily. For patients requiring >45% LDL reduction, start with 40 mg daily.",
      elderly: "Use with caution, starting at lower doses due to increased risk of myopathy.",
      frequency: "Once daily, can be taken at any time of day",
      renal: "No dose adjustment necessary in renal impairment",
      hepatic: "Contraindicated in active liver disease. Start with lowest dose in history of liver disease."
    },
    sideEffects: {
      common: [
        "Muscle pain or weakness",
        "Joint pain",
        "Diarrhea",
        "Nausea",
        "Constipation",
        "Headache",
        "Increased blood sugar"
      ],
      serious: [
        "Rhabdomyolysis (severe muscle damage)",
        "Liver dysfunction",
        "Immune-mediated necrotizing myopathy",
        "Severe allergic reactions"
      ],
      rare: [
        "Memory problems",
        "Confusion",
        "Peripheral neuropathy",
        "Tendon rupture"
      ]
    },
    warnings: [
      "May cause liver damage. Your doctor will monitor liver function while taking this medication.",
      "May cause muscle problems (myopathy or rhabdomyolysis). Report any unusual muscle pain, tenderness, or weakness to your doctor immediately.",
      "Pregnancy Category X: Do not use during pregnancy. Discontinue if pregnancy occurs.",
      "Monitor for increased blood sugar levels in patients at risk for diabetes."
    ],
    interactions: [
      "Grapefruit juice may increase atorvastatin levels and side effects",
      "Strong CYP3A4 inhibitors (e.g., clarithromycin, itraconazole, ritonavir) significantly increase atorvastatin levels",
      "Cyclosporine, fibrates, and niacin may increase the risk of myopathy",
      "Rifampin may decrease effectiveness of atorvastatin",
      "Oral contraceptives: May increase hormone levels"
    ],
    interactionSeverity: {
      major: ["Cyclosporine", "Gemfibrozil", "Strong CYP3A4 inhibitors (clarithromycin, itraconazole, protease inhibitors)"],
      moderate: ["Grapefruit juice", "Erythromycin", "Diltiazem", "Fibrates", "Niacin"],
      minor: ["Digoxin", "Oral contraceptives", "Colchicine"]
    },
    pharmacokinetics: {
      absorption: "Rapidly absorbed; food decreases rate but not extent of absorption",
      distribution: "Plasma protein binding ≥98%; does not cross blood-brain barrier",
      metabolism: "Extensively metabolized by CYP3A4 to active metabolites",
      elimination: "Primarily eliminated via bile; renal elimination is less important"
    },
    source: "Drugs.com"
  },
  aspirin: {
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    drugClass: "NSAID, Antiplatelet",
    description: "Aspirin is used to treat pain, fever, and inflammation. Low-dose aspirin is also used as a blood thinner to prevent blood clots, which can reduce the risk of heart attack and stroke in high-risk individuals.",
    drugsComUrl: "https://www.drugs.com/aspirin.html",
    usedFor: ["Pain Relief", "Fever Reduction", "Anti-inflammatory", "Heart Attack Prevention", "Stroke Prevention", "Colorectal Cancer Prevention"],
    prescriptionOnly: false,
    forms: ["Tablet", "Enteric-coated tablet", "Chewable tablet", "Suppository", "Powder", "Gum"],
    pregnancy: "Category D - Positive evidence of risk",
    halfLife: "15-20 minutes (active metabolite: 2-3 hours)",
    dosage: {
      adult: "Pain/fever: 325-650 mg every 4-6 hours as needed, not to exceed 4g/day. Heart disease prevention: 81-325 mg once daily.",
      child: "Not recommended for children under 12 years due to risk of Reye's syndrome. Pain/fever (>12 years): 10-15 mg/kg every 4-6 hours.",
      elderly: "Use lowest effective dose (81-162 mg daily for cardiovascular prevention). Increased risk of bleeding and GI toxicity.",
      frequency: "Varies by indication: Every 4-6 hours for pain/fever; once daily for prevention",
      renal: "Avoid in severe renal impairment",
      hepatic: "Avoid in severe hepatic impairment"
    },
    sideEffects: {
      common: [
        "Upset stomach",
        "Heartburn",
        "Nausea",
        "Easy bruising",
        "Prolonged bleeding time",
        "Tinnitus (ringing in ears) at high doses"
      ],
      serious: [
        "Gastrointestinal bleeding",
        "Peptic ulcer",
        "Reye's syndrome (in children)",
        "Allergic reactions (including anaphylaxis)",
        "Bleeding disorders"
      ],
      rare: [
        "Hepatotoxicity",
        "Asthma exacerbation",
        "Hearing loss (with long-term high-dose use)",
        "Hemorrhagic stroke",
        "Anemia"
      ]
    },
    warnings: [
      "Reye's syndrome warning: Do not give to children or teenagers with viral infections.",
      "Bleeding risk: Can cause serious gastrointestinal bleeding, especially with long-term use.",
      "Pregnancy category D: Use only if clearly needed in pregnancy, particularly in third trimester.",
      "Alcohol warning: Increases risk of bleeding when combined with aspirin.",
      "Surgery: Discontinue 7-10 days before any surgical procedure due to bleeding risk."
    ],
    interactions: [
      "Other blood thinners (warfarin, heparin, clopidogrel) significantly increase bleeding risk",
      "Other NSAIDs may increase side effects and reduce cardioprotective effects",
      "ACE inhibitors may have decreased effectiveness",
      "May increase methotrexate toxicity",
      "Corticosteroids increase risk of GI bleeding when combined with aspirin"
    ],
    interactionSeverity: {
      major: ["Warfarin", "Methotrexate (high-dose)", "Ketorolac", "Novel oral anticoagulants"],
      moderate: ["Other NSAIDs", "ACE inhibitors", "Corticosteroids", "SSRI antidepressants"],
      minor: ["Beta-blockers", "Diuretics", "Probenecid"]
    },
    pharmacokinetics: {
      absorption: "Rapidly and completely absorbed; enteric-coated formulations delay absorption",
      distribution: "Widely distributed; 80-90% protein bound at low concentrations, saturable at higher levels",
      metabolism: "Rapidly hydrolyzed to salicylic acid in GI mucosa, liver, and blood",
      elimination: "Primarily eliminated through renal excretion; half-life increases with dose due to saturable metabolism"
    },
    source: "Drugs.com"
  },
  "vitamin d": {
    name: "Vitamin D",
    genericName: "Cholecalciferol (Vitamin D3)",
    drugClass: "Vitamin/Supplement",
    description: "Vitamin D is essential for calcium absorption and bone health. It helps regulate calcium and phosphorus levels in the body and plays roles in immune function, cell growth, neuromuscular function, and reduction of inflammation.",
    drugsComUrl: "https://www.drugs.com/vitamin-d.html",
    usedFor: ["Vitamin D Deficiency", "Bone Health", "Osteoporosis Prevention", "Rickets Prevention", "Immune Support"],
    prescriptionOnly: false,
    forms: ["Tablet", "Capsule", "Softgel", "Chewable tablet", "Drops", "Liquid"],
    pregnancy: "Category A - No risk in controlled human studies",
    halfLife: "2-3 weeks",
    dosage: {
      adult: "RDA: 600-800 IU daily. For deficiency: 1,000-4,000 IU daily for maintenance; 50,000 IU weekly for 6-8 weeks for correction of deficiency.",
      child: "RDA: 400-600 IU daily. For deficiency: As directed by doctor, typically 1,000-2,000 IU daily.",
      elderly: "RDA: 800-1000 IU daily. For deficiency: 1,000-4,000 IU daily or as directed by doctor.",
      frequency: "Daily (for maintenance doses) or weekly (for treatment doses)",
      renal: "Use with caution in renal insufficiency due to risk of hypercalcemia",
      hepatic: "No specific adjustment needed"
    },
    sideEffects: {
      common: [
        "Usually well-tolerated at recommended doses",
        "Mild stomach upset"
      ],
      serious: [
        "Hypercalcemia (with toxicity)",
        "Kidney damage (with long-term high doses)",
        "Kidney stones"
      ],
      rare: [
        "Confusion",
        "Weakness",
        "Fatigue",
        "Constipation",
        "Excessive thirst"
      ]
    },
    warnings: [
      "Do not exceed recommended dosage without medical supervision.",
      "People with certain conditions (sarcoidosis, hyperparathyroidism, kidney disease) should use with caution.",
      "Vitamin D toxicity can occur with excessive supplementation (usually >10,000 IU daily for extended periods).",
      "Monitor calcium levels if taking high doses."
    ],
    interactions: [
      "Certain seizure medications (phenytoin, phenobarbital) may decrease vitamin D effectiveness",
      "Steroids may interfere with vitamin D metabolism",
      "Cholesterol-lowering medications (cholestyramine, colestipol) may reduce vitamin D absorption",
      "Some weight loss drugs (orlistat) may decrease absorption",
      "Calcium supplements should be monitored when taking with vitamin D"
    ],
    interactionSeverity: {
      major: ["Digoxin (with high vitamin D doses)"],
      moderate: ["Anticonvulsants", "Corticosteroids", "Calcipotriene", "Thiazide diuretics"],
      minor: ["Cholestyramine", "Mineral oil", "Orlistat"]
    },
    pharmacokinetics: {
      absorption: "Absorbed in small intestine, requires bile salts for absorption",
      distribution: "Stored primarily in adipose tissue and muscle; circulates bound to vitamin D binding protein",
      metabolism: "Undergoes 25-hydroxylation in liver to 25(OH)D, then 1-hydroxylation in kidneys to form active 1,25(OH)2D",
      elimination: "Primarily excreted in bile with enterohepatic recirculation; minimal renal elimination"
    },
    source: "Drugs.com"
  }
};
