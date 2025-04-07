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
  overdose?: {
    symptoms: string[];
    treatment: string;
    antidote?: string;
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
    overdose: {
      symptoms: [
        "Severe hypotension (dangerously low blood pressure)",
        "Dizziness",
        "Fainting",
        "Shock"
      ],
      treatment: "Treatment includes fluid resuscitation to increase blood volume and vasopressors for severe hypotension. Hemodialysis may help remove the drug from circulation.",
      antidote: "There is no specific antidote for lisinopril overdose."
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
    overdose: {
      symptoms: [
        "Lactic acidosis",
        "Severe hypoglycemia",
        "Nausea, vomiting",
        "Abdominal pain",
        "Hyperventilation",
        "Lethargy"
      ],
      treatment: "Immediate hospitalization with aggressive supportive care and monitoring of blood glucose levels. Hemodialysis may be necessary to remove metformin from the blood.",
      antidote: "No specific antidote. Hemodialysis can remove metformin and lactate."
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
    overdose: {
      symptoms: [
        "No specific symptoms known",
        "Possible liver enzyme elevation",
        "Muscle pain and weakness"
      ],
      treatment: "Supportive care with monitoring of liver function and creatine kinase levels. No specific treatment necessary in most cases."
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
    overdose: {
      symptoms: [
        "Tinnitus (ringing in ears)",
        "Hyperthermia (elevated body temperature)",
        "Hyperventilation",
        "Respiratory alkalosis followed by metabolic acidosis",
        "Nausea and vomiting",
        "Confusion",
        "Seizures",
        "Coma (in severe cases)"
      ],
      treatment: "Activated charcoal if taken recently, correction of acid-base and electrolyte disturbances, respiratory support, and seizure management.",
      antidote: "No specific antidote. Treatment is supportive."
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
    overdose: {
      symptoms: [
        "Hypercalcemia (high calcium levels)",
        "Nausea, vomiting",
        "Increased thirst",
        "Frequent urination",
        "Kidney stones",
        "Confusion",
        "Weakness"
      ],
      treatment: "Discontinue vitamin D supplementation, restrict calcium intake, increase fluid intake, and in severe cases, provide IV fluids and corticosteroids."
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
  },
  
  // New medications added below:
  levothyroxine: {
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    drugClass: "Thyroid Hormone",
    description: "Levothyroxine is used to treat hypothyroidism (low thyroid hormone). It replaces the thyroid hormone that your body would normally produce.",
    drugsComUrl: "https://www.drugs.com/levothyroxine.html",
    usedFor: ["Hypothyroidism", "Thyroid Cancer (after removal)", "Goiter", "Myxedema Coma"],
    prescriptionOnly: true,
    forms: ["Tablet", "Capsule", "Liquid", "Injectable solution"],
    pregnancy: "Category A - No risk in controlled human studies",
    halfLife: "6-7 days",
    dosage: {
      adult: "Initial: 25-50 mcg once daily. Increase by 25-50 mcg every 2-4 weeks as needed. Usual maintenance: 100-200 mcg daily.",
      child: "0-3 months: 10-15 mcg/kg/day; 3-6 months: 8-10 mcg/kg/day; 6-12 months: 6-8 mcg/kg/day; 1-5 years: 5-6 mcg/kg/day; 6-12 years: 4-5 mcg/kg/day; >12 years: 2-3 mcg/kg/day",
      elderly: "Initial: 12.5-25 mcg once daily. Increase by 12.5-25 mcg every 4-6 weeks as needed.",
      frequency: "Once daily, typically taken on an empty stomach 30-60 minutes before breakfast",
      renal: "No specific adjustment needed, but monitor thyroid function",
      hepatic: "No specific adjustment needed, but monitor thyroid function"
    },
    sideEffects: {
      common: [
        "Hair loss (usually temporary)",
        "Headache",
        "Insomnia",
        "Nervousness",
        "Irritability",
        "Increased appetite",
        "Weight loss"
      ],
      serious: [
        "Chest pain",
        "Rapid or irregular heartbeat",
        "Shortness of breath",
        "Severe headache",
        "Seizures"
      ],
      rare: [
        "Allergic reactions",
        "Fever",
        "Leg cramps",
        "Sensitivity to heat",
        "Excessive sweating"
      ]
    },
    overdose: {
      symptoms: [
        "Tachycardia (rapid heart rate)",
        "Chest pain",
        "Increased blood pressure",
        "Anxiety",
        "Nervousness",
        "Confusion",
        "Tremors",
        "Fever"
      ],
      treatment: "Reduce or temporarily discontinue levothyroxine, provide beta-blockers for symptomatic relief, and supportive care.",
      antidote: "No specific antidote. Treatment is supportive."
    },
    warnings: [
      "Not for weight loss treatment. Serious or life-threatening effects can occur when used in large doses for weight reduction.",
      "Patients with coronary artery disease: Start with low doses and increase gradually.",
      "Thyroid replacement may increase the need for antidiabetic medications in diabetic patients.",
      "Adrenal insufficiency must be corrected before starting levothyroxine therapy."
    ],
    interactions: [
      "Antacids, calcium, and iron supplements can decrease absorption (separate by 4 hours)",
      "Cholestyramine and colestipol can decrease absorption (separate by 4-6 hours)",
      "Oral anticoagulants: May increase anticoagulant effects",
      "Estrogens may increase thyroid-binding proteins and require dosage adjustment",
      "Seizure medications may alter metabolism of levothyroxine"
    ],
    interactionSeverity: {
      major: ["Imatinib", "Kinase inhibitors", "Amiodarone"],
      moderate: ["Warfarin", "Carbamazepine", "Phenytoin", "Rifampin", "Estrogens"],
      minor: ["Antacids", "Calcium supplements", "Iron supplements", "Sucralfate"]
    },
    pharmacokinetics: {
      absorption: "40-80% absorbed from GI tract; absorption occurs primarily in jejunum and ileum",
      distribution: "Highly protein-bound (99%) primarily to thyroxine-binding globulin",
      metabolism: "Deiodination in peripheral tissues to form T3 (active hormone)",
      elimination: "Primarily eliminated in feces through biliary excretion; small amount eliminated in urine"
    },
    source: "Drugs.com"
  },
  amlodipine: {
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    drugClass: "Calcium Channel Blocker",
    description: "Amlodipine is a calcium channel blocker used to treat high blood pressure (hypertension) and chest pain (angina). It works by relaxing blood vessels so blood can flow more easily.",
    drugsComUrl: "https://www.drugs.com/amlodipine.html",
    usedFor: ["Hypertension", "Coronary Artery Disease", "Angina", "Raynaud's Phenomenon"],
    prescriptionOnly: true,
    forms: ["Tablet", "Oral suspension"],
    pregnancy: "Category C - Risk cannot be ruled out",
    halfLife: "30-50 hours",
    dosage: {
      adult: "Hypertension/Angina: Initial: 5 mg once daily; may increase to 10 mg once daily. Small, fragile, or elderly patients may start with 2.5 mg once daily.",
      child: "6-17 years: 2.5-5 mg once daily. Doses >5 mg are not well studied in pediatric patients.",
      elderly: "Initial: 2.5 mg once daily, may increase gradually as needed.",
      frequency: "Once daily",
      renal: "No dosage adjustment required in renal impairment",
      hepatic: "Initial: 2.5 mg once daily in hepatic impairment"
    },
    sideEffects: {
      common: [
        "Peripheral edema (swelling of ankles/feet)",
        "Dizziness",
        "Flushing",
        "Headache",
        "Fatigue",
        "Nausea",
        "Palpitations"
      ],
      serious: [
        "Severe hypotension",
        "Worsening angina (when starting or increasing dose)",
        "Acute hepatic injury (rare)",
        "Severe peripheral edema"
      ],
      rare: [
        "Gingival hyperplasia (gum overgrowth)",
        "Jaundice",
        "Gynecomastia",
        "Depression",
        "Stevens-Johnson syndrome"
      ]
    },
    overdose: {
      symptoms: [
        "Excessive peripheral vasodilation",
        "Marked hypotension",
        "Reflex tachycardia",
        "Dizziness",
        "Shock"
      ],
      treatment: "Supportive care, administer activated charcoal if recently ingested, intravenous calcium, vasopressors for severe hypotension.",
      antidote: "No specific antidote. IV calcium may help reverse effects."
    },
    warnings: [
      "In patients with severe coronary artery disease, may increase risk of angina or heart attack when starting or increasing dose.",
      "Monitor for edema and hypotension, especially when initiating therapy or increasing dose.",
      "May worsen heart failure in some patients.",
      "Use caution in patients with liver disease."
    ],
    interactions: [
      "CYP3A4 inhibitors (ketoconazole, itraconazole, ritonavir) may increase amlodipine levels",
      "CYP3A4 inducers (rifampin, St. John's wort) may decrease amlodipine effectiveness",
      "May increase tacrolimus levels",
      "Simvastatin: Limit simvastatin dose to 20 mg daily when used with amlodipine"
    ],
    interactionSeverity: {
      major: ["Strong CYP3A4 inhibitors (clarithromycin, itraconazole)"],
      moderate: ["Simvastatin", "Cyclosporine", "Tacrolimus", "Cimetidine"],
      minor: ["Grapefruit juice", "Sildenafil", "NSAIDs"]
    },
    pharmacokinetics: {
      absorption: "Slowly and almost completely absorbed from GI tract; absolute bioavailability 64-90%",
      distribution: "Extensively bound to plasma proteins (93-98%)",
      metabolism: "Extensively metabolized in the liver via CYP3A4 to inactive metabolites",
      elimination: "Biphasic with a terminal elimination half-life of 30-50 hours; excreted primarily in urine"
    },
    source: "Drugs.com"
  },
  amoxicillin: {
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    drugClass: "Aminopenicillin Antibiotic",
    description: "Amoxicillin is a penicillin antibiotic used to treat bacterial infections, such as bronchitis, pneumonia, and infections of the ear, nose, throat, urinary tract, and skin. It works by stopping the growth of bacteria.",
    drugsComUrl: "https://www.drugs.com/amoxicillin.html",
    usedFor: ["Respiratory Tract Infections", "Ear Infections", "Urinary Tract Infections", "Skin Infections", "H. pylori Infection"],
    prescriptionOnly: true,
    forms: ["Capsule", "Tablet", "Chewable tablet", "Powder for oral suspension"],
    pregnancy: "Category B - No evidence of risk in humans",
    halfLife: "1-1.5 hours",
    dosage: {
      adult: "Mild/moderate infections: 250-500 mg every 8 hours or 500-875 mg every 12 hours. Severe infections: 875 mg every 12 hours or 500 mg every 8 hours.",
      child: "Children >3 months: 25-45 mg/kg/day in divided doses every 8-12 hours, depending on the infection severity.",
      elderly: "Reduce dose in elderly with significant renal impairment.",
      frequency: "Every 8 or 12 hours, depending on formulation and infection",
      renal: "CrCl 10-30 mL/min: Administer every 12 hours. CrCl <10 mL/min: Administer every 24 hours.",
      hepatic: "No specific adjustment needed"
    },
    sideEffects: {
      common: [
        "Diarrhea",
        "Nausea",
        "Vomiting",
        "Stomach pain",
        "Vaginal yeast infection",
        "Headache",
        "Rash"
      ],
      serious: [
        "Allergic reactions (hives, difficulty breathing, swelling of face/lips/tongue)",
        "Severe skin reactions (Stevens-Johnson syndrome)",
        "C. difficile-associated diarrhea",
        "Seizures"
      ],
      rare: [
        "Crystalluria (crystals in urine)",
        "Blood disorders (leukopenia, thrombocytopenia)",
        "Liver dysfunction",
        "Acute kidney injury"
      ]
    },
    overdose: {
      symptoms: [
        "Gastrointestinal symptoms (nausea, vomiting, diarrhea)",
        "Crystalluria",
        "Neuromuscular hyperirritability",
        "Seizures (in high doses)"
      ],
      treatment: "Supportive care, maintain hydration. Hemodialysis may be beneficial in severe cases.",
      antidote: "No specific antidote."
    },
    warnings: [
      "Hypersensitivity reactions: Can cause serious, sometimes fatal, hypersensitivity reactions in patients with penicillin allergy.",
      "C. difficile-associated diarrhea: May range from mild diarrhea to fatal colitis. Consider in patients who present with diarrhea during or after treatment.",
      "Prolonged use may result in fungal or bacterial superinfection.",
      "May cause false positive results for urine glucose tests."
    ],
    interactions: [
      "Probenecid increases amoxicillin levels by reducing renal excretion",
      "May reduce the effectiveness of oral contraceptives",
      "Allopurinol increases risk of skin rash",
      "May affect INR when used with warfarin"
    ],
    interactionSeverity: {
      major: ["Methotrexate (increased toxicity)"],
      moderate: ["Probenecid", "Oral contraceptives", "Warfarin", "Allopurinol"],
      minor: ["Live bacterial vaccines"]
    },
    pharmacokinetics: {
      absorption: "Rapidly absorbed from the GI tract (75-90%), not affected significantly by food",
      distribution: "Low protein binding (17-20%); distributes into most tissues and body fluids",
      metabolism: "Limited hepatic metabolism (approximately 10%)",
      elimination: "Primarily excreted unchanged in urine; elimination half-life 1-1.5 hours"
    },
    source: "Drugs.com"
  },
  sertraline: {
    name: "Sertraline",
    genericName: "Sertraline Hydrochloride",
    drugClass: "Selective Serotonin Reuptake Inhibitor (SSRI)",
    description: "Sertraline is an antidepressant in the SSRI class used to treat major depressive disorder, obsessive-compulsive disorder, panic disorder, PTSD, social anxiety disorder, and premenstrual dysphoric disorder. It works by increasing serotonin levels in the brain.",
    drugsComUrl: "https://www.drugs.com/sertraline.html",
    usedFor: ["Depression", "Obsessive-Compulsive Disorder", "Panic Disorder", "PTSD", "Social Anxiety Disorder", "Premenstrual Dysphoric Disorder"],
    prescriptionOnly: true,
    forms: ["Tablet", "Oral solution"],
    pregnancy: "Category C - Risk cannot be ruled out",
    halfLife: "26 hours",
    dosage: {
      adult: "Depression/OCD: Initial: 50 mg once daily. Maintenance: 50-200 mg once daily. Panic Disorder: Initial: 25 mg once daily for 1 week, then 50 mg once daily. Maximum: 200 mg once daily.",
      child: "OCD (ages 6-12): Initial: 25 mg once daily. Maintenance: 25-200 mg once daily. OCD (ages 13-17): Initial: 50 mg once daily. Maintenance: 50-200 mg once daily.",
      elderly: "Start at lower doses and titrate slowly.",
      frequency: "Once daily, morning or evening",
      renal: "Use with caution in severe renal impairment",
      hepatic: "Use lower dose or less frequent dosing in hepatic impairment"
    },
    sideEffects: {
      common: [
        "Nausea",
        "Diarrhea or loose stools",
        "Dry mouth",
        "Drowsiness",
        "Insomnia",
        "Dizziness",
        "Fatigue",
        "Sexual dysfunction"
      ],
      serious: [
        "Serotonin syndrome",
        "Increased risk of suicidal thoughts (especially in young adults)",
        "Abnormal bleeding",
        "Hyponatremia",
        "Seizures"
      ],
      rare: [
        "Angle-closure glaucoma",
        "QT prolongation",
        "SIADH (syndrome of inappropriate antidiuretic hormone)",
        "Stevens-Johnson syndrome"
      ]
    },
    overdose: {
      symptoms: [
        "Drowsiness",
        "Vomiting",
        "Tachycardia",
        "Tremor",
        "Dizziness",
        "Seizures",
        "QT prolongation",
        "Serotonin syndrome"
      ],
      treatment: "Ensure airway, breathing, and circulation. Activated charcoal if recently ingested. Supportive care and monitoring.",
      antidote: "No specific antidote."
    },
    warnings: [
      "Suicidality: Monitor for worsening depression or emergence of suicidal thoughts, especially during initial treatment or dose changes.",
      "Serotonin syndrome: Can be life-threatening. Risk increases with concomitant use of other serotonergic drugs.",
      "Activation of mania/hypomania: Screen for bipolar disorder before starting treatment.",
      "Discontinuation syndrome: Gradually taper dose when stopping treatment."
    ],
    blackBoxWarning: "WARNING: SUICIDAL THOUGHTS AND BEHAVIORS. Antidepressants increase the risk of suicidal thoughts and behaviors in pediatric and young adult patients. Monitor closely for worsening and emergence of suicidal thoughts and behaviors.",
    interactions: [
      "MAOIs: Do not use within 14 days of MAOIs due to risk of serotonin syndrome",
      "Other serotonergic drugs (triptans, SSRIs, SNRIs, lithium, tramadol): Increased risk of serotonin syndrome",
      "Drugs affecting coagulation (NSAIDs, aspirin, warfarin): Increased bleeding risk",
      "CYP2D6 substrates (including some antipsychotics and antiarrhythmics): May increase levels of these medications"
    ],
    interactionSeverity: {
      major: ["MAOIs", "Pimozide", "Linezolid", "Methylene blue IV"],
      moderate: ["Triptans", "Other SSRIs/SNRIs", "Tramadol", "Warfarin", "NSAIDs", "Cimetidine"],
      minor: ["Alcohol", "Diazepam", "Tolbutamide"]
    },
    pharmacokinetics: {
      absorption: "Well absorbed from GI tract; food increases bioavailability",
      distribution: "Protein binding approximately 98%",
      metabolism: "Extensively metabolized in the liver, primarily by CYP2B6, CYP2C19, CYP2C9, and CYP3A4",
      elimination: "Elimination half-life approximately 26 hours; excreted as metabolites in urine and feces"
    },
    source: "Drugs.com"
  },
  montelukast: {
    name: "Montelukast",
    genericName: "Montelukast Sodium",
    drugClass: "Leukotriene Receptor Antagonist",
    description: "Montelukast is used to prevent and treat symptoms of asthma and seasonal allergies, and to prevent exercise-induced bronchoconstriction. It works by blocking leukotrienes, substances that cause inflammation in the lungs and tightening of airway muscles.",
    drugsComUrl: "https://www.drugs.com/montelukast.html",
    usedFor: ["Asthma", "Seasonal Allergic Rhinitis", "Exercise-induced Bronchoconstriction", "Perennial Allergic Rhinitis"],
    prescriptionOnly: true,
    forms: ["Tablet", "Chewable tablet", "Oral granules"],
    pregnancy: "Category B - No evidence of risk in humans",
    halfLife: "2.7-5.5 hours",
    dosage: {
      adult: "Asthma/Allergic Rhinitis (≥15 years): 10 mg once daily. Exercise-induced bronchoconstriction: 10 mg at least 2 hours before exercise; do not take another dose within 24 hours.",
      child: "6-14 years: 5 mg chewable tablet once daily. 2-5 years: 4 mg chewable tablet or oral granules once daily. 12-23 months: 4 mg oral granules once daily.",
      elderly: "No dose adjustment needed",
      frequency: "Once daily, usually in the evening for asthma",
      renal: "No dose adjustment needed",
      hepatic: "Use with caution in severe hepatic impairment"
    },
    sideEffects: {
      common: [
        "Headache",
        "Fatigue",
        "Abdominal pain",
        "Cough",
        "Influenza",
        "Fever",
        "Upper respiratory infection"
      ],
      serious: [
        "Neuropsychiatric events (agitation, depression, suicidal thoughts)",
        "Eosinophilic conditions (Churg-Strauss syndrome)",
        "Systemic eosinophilia",
        "Hepatic dysfunction"
      ],
      rare: [
        "Anaphylaxis",
        "Angioedema",
        "Erythema multiforme",
        "Stevens-Johnson syndrome"
      ]
    },
    overdose: {
      symptoms: [
        "Thirst",
        "Somnolence",
        "Mydriasis",
        "Hyperkinesia",
        "Abdominal pain"
      ],
      treatment: "Supportive treatment; monitor and maintain airway, oxygenation, and vital signs.",
      antidote: "No specific antidote."
    },
    warnings: [
      "Neuropsychiatric events: Monitor for behavioral changes, depression, and suicidal thoughts or behavior.",
      "Not for acute asthma attacks: Not indicated for treatment of acute bronchospasm.",
      "Phenylketonurics: Chewable tablets contain phenylalanine.",
      "Systemic eosinophilia, sometimes with vasculitis (Churg-Strauss syndrome), may occur with reduction of oral corticosteroid therapy."
    ],
    blackBoxWarning: "WARNING: SERIOUS NEUROPSYCHIATRIC EVENTS. Serious neuropsychiatric events have been reported in patients taking montelukast. The benefits may not outweigh the risks in some patients, particularly those with mild symptoms that can be adequately treated with other medications.",
    interactions: [
      "Strong CYP3A4 inducers (phenobarbital, rifampin) may decrease montelukast levels",
      "Phenobarbital may decrease the AUC of montelukast",
      "No clinically significant interactions with prednisone, prednisolone, or oral contraceptives",
      "No dose adjustment needed when used with theophylline"
    ],
    interactionSeverity: {
      major: [],
      moderate: ["Phenobarbital", "Rifampin", "Other strong CYP3A4 inducers"],
      minor: ["Prednisone", "Theophylline"]
    },
    pharmacokinetics: {
      absorption: "Rapidly absorbed after oral administration; food effect minimal",
      distribution: "Highly bound to plasma proteins (>99%)",
      metabolism: "Extensively metabolized by CYP3A4 and CYP2C9 in the liver",
      elimination: "Primarily excreted in bile; terminal half-life 2.7-5.5 hours"
    },
    source: "Drugs.com"
  }
};
