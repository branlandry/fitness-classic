// @ts-nocheck
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Upload, Info } from 'lucide-react';
import Papa from 'papaparse';

// Updated biomarker structure with new CSV content
const biomarkerStructure = {
  "Circulation & Endurance Systems": {
    description: "Blood markers that reveal how effectively your cardiovascular and neurological systems deliver oxygen, clear metabolic waste, and maintain the mental drive essential for consistent training performance. These indicators show whether the body's foundational systems can support demanding endurance work and sustained training motivation.",
    groups: {
      "Vascular & Blood Flow": {
        description: "Blood markers that reveal cardiovascular system readiness for training demands, showing how efficiently nutrients reach working muscles and waste products are cleared during exercise. These indicators determine whether circulation can support higher training volumes and faster recovery between sessions.",
        subgroups: {
          "Endothelial activation & vessel health": {
            description: "Blood markers reflecting blood vessel lining integrity that determine circulation efficiency and cardiovascular training capacity.",
            markers: ["Intercellular adhesion molecule 1", "L-selectin", "Cadherin-5", "Thrombospondin-1", "Angiogenin", "Vasorin", "von Willebrand Factor", "Pigment epithelium-derived factor", "Fibronectin"],
            coaching: {
              optimal: {
                implication: "Blood markers showing healthy vessel function support efficient nutrient delivery, better endurance, and superior recovery.",
                action: "Incorporate higher-volume cardio, longer training sessions, and faster-paced conditioning work.",
                healthContext: "Healthy vessel markers show lower risk of hypertension and improved circulation."
              },
              needsSupport: {
                action: "Moderate aerobic exercise with gradual intensity increases, monitor blood pressure responses, focus on consistency over intensity.",
                tips: "Track blood pressure trends, discuss cardiovascular-supporting foods, progress gradually with heart rate monitoring.",
                healthContext: "Poor vessel markers may indicate increased risk of hypertension and reduced circulation."
              },
              needsAttention: {
                action: "Prioritize gentle aerobic exercise, avoid extreme intensities, focus on blood flow activities.",
                tips: "Suggest foods that support vessel health, stress management, and gradual cardiovascular progression.",
                healthContext: "Poor vessel markers may indicate increased risk of hypertension and reduced circulation."
              }
            }
          },
          "Nitric oxide & vasodilation": {
            description: "Blood markers supporting blood vessel dilation and circulation enhancement that directly impact muscle pumps, endurance capacity, and exercise performance.",
            markers: ["Arginine", "Citrulline", "Ornithine", "Asymmetric dimethylarginine", "Acetyl-Ornithine"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting nitric oxide production enhance muscle pumps, endurance, and exercise capacity.",
                action: "Push cardiovascular limits with interval training, circuit work, and high-volume resistance protocols.",
                healthContext: "Healthy nitric oxide markers show improved exercise capacity and cardiovascular health."
              },
              needsSupport: {
                action: "Steady-state cardio with brief intervals, include nitric oxide supporting foods, progress intensity based on response.",
                tips: "Include beets and leafy greens, teach proper breathing during exercise, monitor exercise tolerance.",
                healthContext: "Poor nitric oxide markers may indicate reduced exercise capacity and cardiovascular concerns."
              },
              needsAttention: {
                action: "Focus on gentle cardio, avoid extreme intensities, suggest foods that support nitric oxide production.",
                tips: "Recommend beet juice, leafy greens, proper breathing patterns, and gradual intensity increases.",
                healthContext: "Poor nitric oxide markers may indicate reduced exercise capacity and cardiovascular concerns."
              }
            }
          },
          "Coagulation & clot regulation": {
            description: "Blood markers reflecting circulation safety and clotting balance that determine training intensity tolerance and injury recovery potential.",
            markers: ["Fibrinogen alpha chain", "Fibrinogen beta chain", "Fibrinogen gamma chain", "Prothrombin", "Coagulation factor IX", "Coagulation factor X", "Coagulation factor XI", "Coagulation factor XII", "Coagulation factor XIII A chain", "Coagulation factor XIII B chain", "Plasminogen", "Protein S", "Antithrombin-III"],
            coaching: {
              optimal: {
                implication: "Blood clotting markers in optimal range support safer high-intensity training, better tissue repair, and reduced injury downtime.",
                action: "Progress confidently with demanding workouts, knowing circulation and healing are well-supported.",
                healthContext: "Healthy clotting regulation shows lower risk of cardiovascular events or healing issues."
              },
              needsSupport: {
                action: "Regular movement with dynamic components, avoid prolonged static holds, monitor circulation during longer sessions.",
                tips: "Encourage regular movement breaks, consider compression wear for longer activities, stay well-hydrated.",
                healthContext: "Poor clotting regulation may signal increased risk of cardiovascular events or healing issues."
              },
              needsAttention: {
                action: "Avoid prolonged static positions, emphasize dynamic warm-ups, limit high-impact activities.",
                tips: "Encourage movement breaks, compression wear during travel, and hydration monitoring.",
                healthContext: "Poor clotting regulation may signal increased risk of cardiovascular events or healing issues."
              }
            }
          }
        }
      },
      "Mental & Neural Readiness": {
        description: "Blood markers reflecting neurotransmitter production and brain chemistry balance that directly impact training motivation, stress resilience, and workout consistency. These indicators show whether neurological systems support challenging training and maintain positive training mindset.",
        subgroups: {
          "Serotonin & mood": {
            description: "Blood markers supporting mood stability, training motivation, and positive mindset that directly impact program adherence and workout consistency.",
            markers: ["Serotonin", "Tryptophan", "Kynurenine"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting serotonin production promote consistent motivation, positive mindset, and better program adherence.",
                action: "Leverage good mood stability - try new challenges, group fitness, or mentally demanding training protocols.",
                healthContext: "Healthy serotonin markers show improved mood stability and sleep quality."
              },
              needsSupport: {
                action: "Maintain enjoyable exercise variety, track mood responses to training, use social support when possible.",
                tips: "Monitor mood patterns with training, encourage outdoor activities when possible, track sleep quality.",
                healthContext: "Low serotonin markers may indicate mood issues, sleep disruption, and reduced motivation."
              },
              needsAttention: {
                action: "Keep workouts fun and social, avoid monotonous routines, focus on mood-boosting activities.",
                tips: "Monitor training enjoyment, encourage outdoor exercise, and track sleep quality alongside mood.",
                healthContext: "Low serotonin markers may indicate mood issues, sleep disruption, and reduced motivation."
              }
            }
          },
          "GABA & relaxation": {
            description: "Blood markers supporting stress management, recovery readiness, and nervous system balance that determine training stress tolerance and adaptation capacity.",
            markers: ["Gamma-aminobutyric acid"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting relaxation pathways allow better stress management, deeper recovery, and sustainable training.",
                action: "Take advantage of good stress resilience - add challenging workouts knowing recovery will be effective.",
                healthContext: "Healthy GABA markers show improved stress management and recovery capacity."
              },
              needsSupport: {
                action: "Balance challenging work with adequate recovery, include relaxation techniques, avoid overstimulating environments.",
                tips: "Teach basic stress management techniques, create calm training environments, monitor stress responses.",
                healthContext: "Low GABA support may indicate anxiety, sleep issues, and impaired stress recovery."
              },
              needsAttention: {
                action: "Emphasize relaxation techniques, yoga, meditation, and avoid overstimulating training environments.",
                tips: "Teach breathing techniques, promote calm training spaces, and monitor stress responses.",
                healthContext: "Low GABA support may indicate anxiety, sleep issues, and impaired stress recovery."
              }
            }
          },
          "Dopaminergic precursors": {
            description: "Blood markers supporting motivation, focus, and drive that directly impact training intensity, skill acquisition, and consistent workout performance.",
            markers: ["Tyrosine", "Phenylalanine"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting dopamine production enhance motivation, focus, and drive for consistent training.",
                action: "Leverage high motivation - introduce challenging skills, competitive elements, or complex movement patterns.",
                healthContext: "Healthy dopamine precursors show improved motivation and movement control."
              },
              needsSupport: {
                action: "Maintain engaging variety in training, use goal-setting and progress tracking, avoid overtraining that impacts motivation.",
                tips: "Use achievement-based programs, track progress visibly, include variety and challenge progression.",
                healthContext: "Low dopamine precursors may indicate reduced motivation, mood, and movement control."
              },
              needsAttention: {
                action: "Focus on enjoyable, low-pressure activities. Avoid overtraining that could further impact motivation.",
                tips: "Use variety, social support, and achievable micro-goals to rebuild training enthusiasm.",
                healthContext: "Low dopamine precursors may indicate reduced motivation, mood, and movement control."
              }
            }
          }
        }
      }
    }
  },
  "Performance & Muscular Systems": {
    description: "Blood markers reflecting your body's muscle-building machinery, energy production capacity, and strength development potential. These indicators reveal whether cellular processes are primed for muscle growth, optimal workout fueling, and progressive training demands.",
    groups: {
      "Muscle & Strength Systems": {
        description: "Blood markers revealing protein synthesis capacity, muscle building potential, and strength development readiness. These indicators show whether cellular processes can support progressive muscle-building protocols and handle increased training volumes for optimal strength gains.",
        subgroups: {
          "Muscle protein turnover": {
            description: "Blood markers reflecting the balance between muscle building and breakdown processes that determine training volume tolerance and strength development potential.",
            markers: ["Methylhistidine", "Creatine", "Creatinine", "Insulin-like growth factor-binding protein 2", "Insulin-like growth factor-binding protein 3", "Insulin-like growth factor-binding protein complex acid labile subunit"],
            coaching: {
              optimal: {
                implication: "Blood markers of protein synthesis and breakdown in balance allow optimal muscle growth, strength gains, and injury prevention.",
                action: "Implement progressive muscle-building protocols, higher training volumes, and advanced progression strategies.",
                healthContext: "Healthy muscle protein markers show proper muscle maintenance and growth capacity."
              },
              needsSupport: {
                action: "Focus on consistent resistance training with adequate recovery, monitor protein intake, avoid excessive volume temporarily.",
                tips: "Track strength progression closely, ensure adequate protein and rest, consider periodizing volume.",
                healthContext: "Imbalanced muscle protein markers may indicate muscle loss risk, weakness, or slower healing."
              },
              needsAttention: {
                action: "Focus on muscle preservation with adequate protein, avoid excessive volume, prioritize recovery.",
                tips: "Monitor strength progression, ensure adequate rest between sessions, and discuss protein intake.",
                healthContext: "Imbalanced muscle protein markers may indicate muscle loss risk, weakness, or slower healing."
              }
            }
          },
          "Amino acids for synthesis": {
            description: "Blood markers providing essential building blocks for muscle protein synthesis that directly impact recovery speed, muscle growth, and training adaptation.",
            markers: ["Leucine", "Isoleucine", "Valine", "Lysine", "Methionine", "Histidine", "Glutamine"],
            coaching: {
              optimal: {
                implication: "Blood amino acid levels in optimal ranges support muscle building, faster recovery, and better training adaptation.",
                action: "Maximize muscle-building potential with progressive overload, higher training frequencies, and skill development.",
                healthContext: "Healthy amino acid status supports optimal muscle growth, immune function, and tissue repair."
              },
              needsSupport: {
                action: "Maintain consistent protein intake with complete amino acid profiles, moderate training volume, focus on recovery quality.",
                tips: "Discuss protein timing around workouts, ensure complete protein sources, monitor recovery indicators.",
                healthContext: "Poor amino acid status may indicate impaired muscle growth, immune function, and tissue repair."
              },
              needsAttention: {
                action: "Ensure adequate protein intake, avoid excessive volume, focus on recovery-supportive training.",
                tips: "Discuss complete proteins, timing around workouts, and signs of inadequate recovery.",
                healthContext: "Poor amino acid status may indicate impaired muscle growth, immune function, and tissue repair."
              }
            }
          },
          "Polyamines & growth support": {
            description: "Blood markers supporting cellular growth, tissue repair, and training adaptation that determine recovery capacity and progression potential.",
            markers: ["Spermidine", "Putrescine"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting polyamine pathways facilitate muscle growth, tissue repair, and training adaptation.",
                action: "Leverage growth-supportive environment with progressive overload, skill acquisition, and tissue-building protocols.",
                healthContext: "Healthy polyamine levels support cellular growth, healing, immune function, and regeneration."
              },
              needsSupport: {
                action: "Focus on lifestyle factors that support natural production: adequate sleep, stress management, moderate training loads.",
                tips: "Emphasize sleep quality and stress reduction, monitor training recovery, discuss growth-supporting foods.",
                healthContext: "Low polyamines may indicate impaired growth, healing, immune function, and cellular regeneration."
              },
              needsAttention: {
                action: "Support natural production with adequate sleep, moderate training loads, and nutrient-dense foods.",
                tips: "Monitor recovery markers, ensure adequate rest, and discuss foods that support cellular growth.",
                healthContext: "Low polyamines may indicate impaired growth, healing, immune function, and cellular regeneration."
              }
            }
          }
        }
      },
      "Energy Systems & Fueling": {
        description: "Blood markers that reveal metabolic efficiency for different fuel sources during exercise, showing how well carbohydrates, fats, and cellular energy pathways support workout performance. These indicators determine optimal nutrition timing and training intensity based on metabolic readiness.",
        subgroups: {
          "Glucose & carbohydrate metabolism": {
            description: "Blood markers reflecting carbohydrate processing efficiency and energy availability that determine workout fueling strategies and training intensity tolerance.",
            markers: ["Glucose", "Alanine"],
            coaching: {
              optimal: {
                implication: "Blood glucose and related markers in healthy ranges provide steady energy, better endurance, and improved body composition.",
                action: "Capitalize on metabolic health - vary training intensities and experiment with different fueling strategies.",
                healthContext: "Healthy glucose handling supports steady energy and reduced risk of metabolic issues."
              },
              needsSupport: {
                action: "Focus on blood sugar stability with consistent meal timing, moderate intensity training, monitor energy levels.",
                tips: "Teach carbohydrate timing principles, monitor energy patterns, adjust training based on fueling status.",
                healthContext: "Poor glucose handling may indicate energy crashes, weight issues, and metabolic concerns."
              },
              needsAttention: {
                action: "Stabilize blood sugar with consistent meals, avoid fasted high-intensity work, emphasize steady-state cardio.",
                tips: "Teach carb timing principles, monitor energy levels, and adjust training based on fueling status.",
                healthContext: "Poor glucose handling may indicate energy crashes, weight issues, and metabolic concerns."
              }
            }
          },
          "Lipid transport & HDL function": {
            description: "Blood markers reflecting fat metabolism efficiency and cardiovascular health that support endurance performance and hormone production for training.",
            markers: ["Apolipoprotein A-I", "Apolipoprotein A-II", "Apolipoprotein A-IV", "Apolipoprotein C-I", "Apolipoprotein C-II", "Apolipoprotein C-III", "Phospholipid transfer protein", "Clusterin", "Zinc-alpha-2-glycoprotein"],
            coaching: {
              optimal: {
                implication: "Blood lipid profiles in healthy ranges support cardiovascular endurance, hormone production, and efficient energy use.",
                action: "Push cardiovascular training boundaries with confidence in circulation and heart health markers.",
                healthContext: "Healthy lipid markers support cardiovascular health and efficient energy metabolism."
              },
              needsSupport: {
                action: "Focus on moderate aerobic exercise and resistance training, include heart-healthy fats, avoid extreme dietary restrictions.",
                tips: "Recommend heart-healthy fats, discuss cholesterol-supporting foods, track cardiovascular improvements.",
                healthContext: "Poor lipid markers may indicate heart disease risk and compromised hormone function."
              },
              needsAttention: {
                action: "Emphasize moderate aerobic exercise, resistance training, and avoid extreme dietary restrictions.",
                tips: "Recommend heart-healthy fats, discuss cholesterol-friendly foods, and track cardiovascular improvements.",
                healthContext: "Poor lipid markers may indicate heart disease risk and compromised hormone function."
              }
            }
          },
          "Osmolytes & one-carbon metabolism": {
            description: "Blood markers supporting cellular hydration, metabolic efficiency, and energy production that directly impact training capacity and recovery quality.",
            markers: ["Betaine", "Choline", "Taurine", "Trimethylamine N-oxide"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting cellular hydration and methylation promote energy production, recovery, and training capacity.",
                action: "Take advantage of optimal cellular function - increase training complexity and metabolic demands.",
                healthContext: "Healthy osmolyte and methylation markers support energy production and cellular function."
              },
              needsSupport: {
                action: "Focus on hydration consistency, include B-vitamin rich foods, moderate alcohol intake, monitor training in heat.",
                tips: "Teach hydration strategies, discuss B-vitamin sources, monitor hydration status during training.",
                healthContext: "Poor osmolytes may indicate fatigue, cognitive issues, and impaired recovery."
              },
              needsAttention: {
                action: "Emphasize hydration, B-vitamin rich foods, limit alcohol, and avoid dehydrating training conditions.",
                tips: "Teach proper hydration strategies, monitor hydration status, and discuss micronutrient intake.",
                healthContext: "Poor osmolytes may indicate fatigue, cognitive issues, and impaired recovery."
              }
            }
          }
        }
      }
    }
  },
  "Recovery & Resilience Systems": {
    description: "Blood markers that indicate how well your body's repair mechanisms, anti-inflammatory systems, and structural maintenance processes respond to training stress. These indicators show whether recovery systems can handle increased training loads and support consistent adaptation over time.",
    groups: {
      "Recovery & Adaptation": {
        description: "Blood markers reflecting inflammatory control, antioxidant capacity, and tissue repair efficiency after training stress. These indicators show whether recovery mechanisms can handle higher training frequencies and support consistent positive adaptations.",
        subgroups: {
          "Inflammation & immune readiness": {
            description: "Blood markers reflecting inflammatory control and immune system function that determine training frequency tolerance and consistent workout availability.",
            markers: ["C-reactive protein", "Serum amyloid A-4 protein", "Alpha-1-acid glycoprotein 1", "Alpha-1-antichymotrypsin", "Alpha-1-antitrypsin", "Alpha-1B-glycoprotein", "Leucine-rich alpha-2-glycoprotein 1", "Lipopolysaccharide-binding protein", "Serum amyloid P-component", "Protein S100-A9", "Complement C3", "Complement C4-B", "Complement factor B", "Complement factor H"],
            coaching: {
              optimal: {
                implication: "Blood inflammatory markers in controlled ranges allow proper training adaptations, faster recovery, and consistent availability.",
                action: "Maximize training stimulus knowing recovery and adaptation processes are functioning well.",
                healthContext: "Controlled inflammation supports proper immune function and training adaptation."
              },
              needsSupport: {
                action: "Moderate training loads with extra recovery focus, include anti-inflammatory foods, monitor for overreaching signs.",
                tips: "Track recovery metrics carefully, recommend anti-inflammatory foods like omega-3s, monitor training response.",
                healthContext: "Elevated inflammation may indicate weakened immunity, slower recovery, and overreaching risk."
              },
              needsAttention: {
                action: "Prioritize anti-inflammatory activities: gentle movement, sleep, stress reduction, and nutrient-dense foods.",
                tips: "Track recovery metrics, recommend omega-3 rich foods, and monitor for signs of overreaching.",
                healthContext: "Elevated inflammation may indicate weakened immunity, slower recovery, and overreaching risk."
              }
            }
          },
          "Tissue repair & ECM remodeling": {
            description: "Blood markers reflecting structural tissue repair and remodeling capacity that determine training progression safety and injury prevention potential.",
            markers: ["Fibronectin", "Vitronectin", "Lumican", "Fibulin-1", "Extracellular matrix protein 1", "Proteoglycan 4", "Tetranectin", "trans-OH-Proline"],
            coaching: {
              optimal: {
                implication: "Blood markers supporting tissue repair promote injury prevention, strength development, and training progression.",
                action: "Advance training complexity and intensity, knowing tissue adaptation and repair processes are robust.",
                healthContext: "Healthy tissue repair markers support injury recovery and structural adaptations."
              },
              needsSupport: {
                action: "Focus on progressive loading with adequate recovery, include tissue-supporting nutrition, monitor tissue response to training.",
                tips: "Monitor tissue response carefully, progress loading gradually, discuss protein and micronutrient needs.",
                healthContext: "Poor tissue repair markers may indicate chronic injury risk, reduced performance, and structural concerns."
              },
              needsAttention: {
                action: "Allow longer recovery periods, emphasize gentle loading, and support repair with appropriate nutrition.",
                tips: "Monitor tissue response to training, progress gradually, and discuss adequate protein and micronutrients.",
                healthContext: "Poor tissue repair markers may indicate chronic injury risk, reduced performance, and structural concerns."
              }
            }
          },
          "Oxidative stress balance": {
            description: "MBlood markers reflecting cellular stress management and antioxidant capacity that determine training intensity tolerance and recovery efficiency.",
            markers: ["Glutathione peroxidase 3", "Peroxiredoxin-2", "Ceruloplasmin", "Methionine-Sulfoxide"],
            coaching: {
              optimal: {
                implication: "Blood markers showing proper antioxidant balance support training adaptation, cellular health, and exercise improvements.",
                action: "Push training boundaries safely, knowing cellular repair mechanisms are handling exercise stress effectively.",
                healthContext: "Balanced oxidative stress supports healthy aging and cellular function."
              },
              needsSupport: {
                action: "Moderate high-intensity training, include antioxidant-rich foods, focus on gentle movement with adequate recovery.",
                tips: "Encourage colorful vegetables and fruits, monitor fatigue levels, avoid excessive training volume.",
                healthContext: "Poor oxidative balance may indicate accelerated aging, impaired recovery, and disease risk."
              },
              needsAttention: {
                action: "Reduce high-intensity training, emphasize antioxidant-rich foods, and focus on gentle movement.",
                tips: "Encourage colorful vegetables, monitor fatigue levels, and avoid excessive training volume.",
                healthContext: "Poor oxidative balance may indicate accelerated aging, impaired recovery, and disease risk."
              }
            }
          }
        }
      },
      "Joint & Connective Tissue": {
        description: "Blood markers revealing structural tissue health, bone density markers, and connective tissue turnover that determine injury risk and loading capacity. These indicators show whether joints and connective tissues can safely handle high-impact training and heavy resistance work.",
        subgroups: {
          "Cartilage/bone markers": {
            description: "Blood markers reflecting bone density and cartilage health that determine high-impact training capacity and joint loading tolerance.",
            markers: ["Cartilage acidic protein 1", "Alpha-2-HS-glycoprotein", "Fetuin-B", "Tetranectin"],
            coaching: {
              optimal: {
                implication: "Blood markers of bone and cartilage metabolism in healthy ranges support joint health, power development, and injury resilience.",
                action: "Safely incorporate high-impact activities, plyometrics, and heavy resistance training for bone strengthening.",
                healthContext: "Healthy bone/cartilage markers support joint health and injury resistance."
              },
              needsSupport: {
                action: "Include moderate weight-bearing exercises and low-impact activities, monitor joint comfort, progress loading gradually.",
                tips: "Discuss calcium, vitamin D, and protein needs, monitor joint comfort, progress gradually.",
                healthContext: "Poor bone/cartilage markers may indicate fracture risk and joint health concerns."
              },
              needsAttention: {
                action: "Emphasize low-impact activities, weight-bearing exercises, and joint-supportive movements.",
                tips: "Discuss calcium and vitamin D importance, monitor joint comfort, and progress loading gradually.",
                healthContext: "Poor bone/cartilage markers may indicate fracture risk and joint health concerns."
              }
            }
          },
          "Collagen turnover": {
            description: "Blood markers reflecting connective tissue health and remodeling that determine injury risk and capacity for demanding movement patterns.",
            markers: ["trans-OH-Proline", "Lumican", "Fibulin-1"],
            coaching: {
              optimal: {
                implication: "Blood markers of collagen synthesis in healthy ranges support joint stability, injury prevention, and tissue repair.",
                action: "Confidently progress with demanding training, knowing connective tissue adaptation is well-supported.",
                healthContext: "Healthy collagen markers support joint stability and injury prevention."
              },
              needsSupport: {
                action: "Include mobility work and moderate loading, support with collagen-building nutrition, monitor joint health closely.",
                tips: "Recommend vitamin C rich foods, monitor joint health, emphasize movement quality over quantity.",
                healthContext: "Poor collagen markers may indicate joint instability risk, injury potential, and poor healing."
              },
              needsAttention: {
                action: "Focus on mobility work, gentle loading, collagen-supporting nutrition, and avoid repetitive high-stress movements.",
                tips: "Recommend vitamin C rich foods, monitor joint health, and emphasize movement quality over quantity.",
                healthContext: "Poor collagen markers may indicate joint instability risk, injury potential, and poor healing."
              }
            }
          }
        }
      }
    }
  }
};

// Helper functions (unchanged from original)
function colorWeight(color) {
  const c = (color || "").toLowerCase();
  if (c === "red") return 4;
  if (c === "yellow") return 2;
  if (c === "blue" || c === "green") return 1;
  return 1;
}

function aggregateWeightedScore(markers) {
  let num = 0;
  let den = 0;
  
  for (const m of markers) {
    if (m.score === null || m.score === undefined || Number.isNaN(m.score)) continue;
    
    const w = colorWeight(m.color);
    num += Number(m.score) * w;
    den += 100 * w;
  }
  
  if (den === 0) return null;
  
  return Math.floor((num / den) * 100);
}

function parseIncomingScore(r) {
  const cand = [r.SCORE, r.BiomarkerScore, r.BIOMARKER_SCORE];
  for (const c of cand) {
    if (c === undefined || c === null || c === "") continue;
    const s = String(c).trim();
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) continue;
    const v = Number(s);
    if (Number.isFinite(v)) return Math.max(0, Math.min(100, Math.floor(v)));
  }
  return null;
}

function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}

const SCORE_BANDS = [
  { min: 0, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
  { min: 50, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
  { min: 51, label: "WHITE I", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
  { min: 52, label: "YELLOW", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
  { min: 53, label: "YELLOW I", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
  { min: 54, label: "YELLOW II", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
  { min: 55, label: "YELLOW III", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
  { min: 56, label: "ORANGE", bg: "#ffa500", text: "text-gray-900", category: "needs attention" },
  { min: 57, label: "ORANGE I", bg: "#ffa500", text: "text-gray-900", category: "needs attention" },
  { min: 58, label: "ORANGE II", bg: "#ffa500", text: "text-gray-900", category: "needs attention" },
  { min: 59, label: "ORANGE III", bg: "#ffa500", text: "text-gray-900", category: "needs attention" },
  { min: 60, label: "BLUE", bg: "#0000ff", text: "text-white", category: "needs attention" },
  { min: 61, label: "BLUE I", bg: "#0000ff", text: "text-white", category: "needs attention" },
  { min: 62, label: "BLUE II", bg: "#0000ff", text: "text-white", category: "needs attention" },
  { min: 64, label: "BLUE III", bg: "#0000ff", text: "text-white", category: "needs attention" },
  { min: 66, label: "PURPLE", bg: "#800080", text: "text-white", category: "needs attention" },
  { min: 68, label: "PURPLE I", bg: "#800080", text: "text-white", category: "needs attention" },
  { min: 70, label: "PURPLE II", bg: "#800080", text: "text-white", category: "needs attention" },
  { min: 72, label: "PURPLE III", bg: "#800080", text: "text-white", category: "needs attention" },
  { min: 74, label: "BROWN", bg: "#8B4513", text: "text-white", category: "needs support" },
  { min: 76, label: "BROWN I", bg: "#8B4513", text: "text-white", category: "needs support" },
  { min: 78, label: "BROWN II", bg: "#8B4513", text: "text-white", category: "needs support" },
  { min: 80, label: "BROWN III", bg: "#8B4513", text: "text-white", category: "needs support" },
  { min: 82, label: "BLACK", bg: "#000000", text: "text-white", category: "needs support" },
  { min: 84, label: "BLACK I", bg: "#000000", text: "text-white", category: "needs support" },
  { min: 86, label: "BLACK II", bg: "#000000", text: "text-white", category: "needs support" },
  { min: 88, label: "BLACK III", bg: "#000000", text: "text-white", category: "needs support" },
  { min: 90, label: "RED", bg: "#ff0000", text: "text-white", category: "optimal" },
  { min: 92, label: "RED I", bg: "#ff0000", text: "text-white", category: "optimal" },
  { min: 94, label: "RED II", bg: "#ff0000", text: "text-white", category: "optimal" },
  { min: 96, label: "RED III", bg: "#ff0000", text: "text-white", category: "optimal" },
  { min: 98, label: "RED IV", bg: "#ff0000", text: "text-white", category: "optimal" },
  { min: 100, label: "RED V", bg: "#ff0000", text: "text-white", category: "optimal" },
];

function scoreBandLabel(score) {
  if (score === null || score === undefined || !Number.isFinite(score)) return null;
  const s = Math.floor(score);
  let best = null;
  for (const band of SCORE_BANDS) {
    if (s >= band.min) best = band;
  }
  return best;
}

function getScoreCategory(score) {
  const band = scoreBandLabel(score);
  return band ? band.category : null;
}

function colorLabel(color) {
  switch ((color || "").toLowerCase()) {
    case "blue":
    case "green":
      return { text: "In range", className: "bg-gray-100 text-gray-800" };
    case "yellow":
      return { text: "Borderline", className: "bg-gray-100 text-gray-800" };
    case "red":
      return { text: "Out of range", className: "bg-gray-100 text-gray-800" };
    default:
      return { text: "No data", className: "bg-gray-100 text-gray-600" };
  }
}

// Components
const ScoreBar = ({ score }) => {
  const pct = typeof score === "number" && isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  const band = scoreBandLabel(score);
  
  return (
    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden relative border border-gray-400">
      <div 
        className="h-5" 
        style={{ 
          width: `${pct}%`, 
          backgroundColor: band ? band.bg : "#e5e7eb" 
        }} 
      />
      {band && (
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${band.text}`}>
          {band.label}
        </span>
      )}
      {score === null && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-600">
          no data
        </span>
      )}
    </div>
  );
};

const Uploader = ({ onFile, error }) => {
  const [dragOver, setDragOver] = useState(false);
  
  return (
    <div className="mb-6">
      <div className="rounded-xl border bg-white p-5 shadow">
        <div className="mb-1 text-sm font-medium text-gray-900">Upload Client Biomarker Data</div>
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
          <Info className="h-4 w-4" />
          CSV with columns: MEASURE_NAME, LAB_CONCENTRATION, COLOR, SCORE
        </div>
        <label
          className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-sm transition ${
            dragOver ? "bg-gray-50" : "bg-white"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onFile(file);
          }}
        >
          <Upload className="h-5 w-5" />
          Drop CSV here or click to choose
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

const BiomarkerCard = ({ subgroup, clientData, isSelected, onSelect }) => {
  const markerDetails = subgroup.markers.map(markerName => {
    const clientRow = clientData.get(markerName);
    return {
      name: markerName,
      color: clientRow?.COLOR || "",
      labConcentration: clientRow?.LAB_CONCENTRATION || "no data",
      score: clientRow ? parseIncomingScore(clientRow) : null
    };
  });

  const aggregatedScore = aggregateWeightedScore(markerDetails);
  const scoreCategory = getScoreCategory(aggregatedScore);
  const coaching = subgroup.coaching;
  
  return (
    <div 
      className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-400 border-2 shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-700">{subgroup.name}</h4>
{/*            {aggregatedScore !== null && (
              <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Score: {aggregatedScore}
              </span>
            )}*/}
          </div>
          <div className="text-xs text-gray-500 mt-1">{markerDetails.length} marker{markerDetails.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20">
            <ScoreBar score={aggregatedScore} />
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
        </div>
      </div>
      
      {isSelected && (
        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <span className="font-medium text-sm">About this subgroup:</span>
            <p className="text-gray-700 text-sm mt-1">{subgroup.description}</p>
          </div>

          {scoreCategory && coaching && (
            <div className={`border rounded p-3 ${
              scoreCategory === 'optimal' ? 'border-green-200' :
              scoreCategory === 'needs support' ? 'border-yellow-200' :
              'border-red-200'
            }`}>
              <div className="space-y-2 text-sm">
                {/* Health Context */}
                {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                             scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.healthContext && (
                  <div>
                    <span className="font-medium">Health Context:</span>
                    <p className="text-gray-700 mt-1">
                      {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                               scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].healthContext}
                    </p>
                  </div>
                )}
                
                {/* Fitness Impact */}
                {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                             scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.implication && (
                  <div>
                    <span className="font-medium">Fitness Impact:</span>
                    <p className="text-gray-700 mt-1">
                      {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                               scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].implication}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Training Actions:</span>
                  <p className="text-gray-700 mt-1">
                    {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                             scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].action}
                  </p>
                </div>
                
                {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                         scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.tips && (
                  <div>
                    <span className="font-medium">Coach Tips:</span>
                    <p className="text-gray-700 mt-1">
                      {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                               scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].tips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded p-3">
            <span className="font-medium text-sm mb-2 block">Individual Markers ({markerDetails.length}):</span>
            <div className="space-y-2">
              {markerDetails.map((marker, idx) => {
                const statusLabel = colorLabel(marker.color);
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {marker.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {marker.labConcentration !== "no data" ? `Lab value: ${marker.labConcentration}` : "No data available"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(statusLabel.text === "Borderline" || statusLabel.text === "Out of range") && (
                        <span
                          className={`font-bold ${
                            statusLabel.text === "Borderline" ? "text-yellow-500" : "text-red-500"
                          }`}
                        >
                          ⚠
                        </span>
                      )}
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        {statusLabel.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PersonalizedCoachingGuide Component
const PersonalizedCoachingGuide = ({ enrichedData }) => {
  const getCoachingGuidance = (score) => {
    const category = getScoreCategory(score);
    if (category === 'optimal') return 'optimal';
    if (category === 'needs support') return 'needsSupport';
    return 'needsAttention';
  };

  return (
    <div className="bg-white border rounded-lg p-6" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="text-center mb-8 border-b-2 border-blue-500 pb-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Personalized Biomarker Coaching Guide</h1>
        <p className="text-gray-600">System-Based Training Approach • Customized for This Client</p>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-bold text-gray-900 mb-3">System-Based Coaching Principles</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>→ Assess patterns within each system to identify focus areas.</li>
          <li>→ Address foundational systems before pushing performance.</li>
          <li>→ Use system patterns to guide periodization and training emphasis.</li>
          <li>→ Remember: This is for fitness guidance, not medical diagnosis.</li>
          <li>→ Start conservative and progress based on client response.</li>
          <li>→ Monitor subjective feelings alongside objective markers.</li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 items-stretch content-start">
        {enrichedData.map((supergroup) => (
          <div key={supergroup.name} className="border-2 border-gray-300 rounded-lg p-3 bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col shadow-sm">
            <div className="text-center border-b-2 border-blue-300 pb-3 mb-4" style={{ minHeight: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 className="font-bold text-gray-900 text-sm mb-2 bg-blue-100 px-2 py-1 rounded">{supergroup.name}</h3>
              <div className="flex-1 flex items-center justify-center" style={{ minHeight: '110px' }}>
                <p className="text-xs text-gray-600 italic leading-tight text-center overflow-hidden">{supergroup.description}</p>
              </div>
            </div>

            {supergroup.groups.map((group) => (
              <div key={group.name} className="mb-4 flex-1">
                <h4 className="font-bold text-xs text-white bg-gray-700 px-2 py-1 rounded mb-3" style={{ minHeight: '24px' }}>
                  {group.name}
                </h4>

                {group.subgroups.map((subgroup) => {
                  const guidanceType = getCoachingGuidance(subgroup.score);
                  const coaching = subgroup.coaching?.[guidanceType];
                  
                  if (subgroup.score === null || subgroup.score === undefined) {
                    return (
                      <div key={subgroup.name} className="mb-4 text-xs bg-white rounded border border-gray-200 p-2" style={{ minHeight: '180px' }}>
                        <div className="font-bold text-gray-800 mb-2 text-center bg-gray-100 rounded px-1" style={{ minHeight: '24px' }}>
                          • {subgroup.name}
                        </div>
                        
                        <div className="mb-2" style={{ minHeight: '40px' }}>
                          <span className="font-bold text-gray-800 text-xs bg-gray-200 px-1 rounded">HEALTH</span>
                          <div className="text-gray-700 ml-2 leading-tight">{subgroup.description}</div>
                        </div>

                        <div className="mb-2 text-center" style={{ minHeight: '50px' }}>
                          <span className="font-bold text-xs text-gray-600 bg-gray-300 px-2 py-1 rounded border-2 border-dashed border-gray-400">
                            INSUFFICIENT DATA
                          </span>
                          <div className="text-gray-600 ml-2 leading-tight mt-2 italic">
                            No biomarker data available for personalized guidance.
                          </div>
                        </div>

                        <div style={{ minHeight: '40px' }}>
                          <div></div>
                        </div>
                      </div>
                    );
                  }
                  
                  if (!coaching) return null;

                  return (
                    <div key={subgroup.name} className="mb-4 text-xs bg-white rounded border border-gray-200 p-2" style={{ minHeight: '180px' }}>
                      <div className="font-bold text-gray-800 mb-2 text-center bg-gray-100 rounded px-1" style={{ minHeight: '24px' }}>
                        • {subgroup.name}
                      </div>
                      
                      {/* Health Context */}
                      {coaching.healthContext && (
                        <div className="mb-2" style={{ minHeight: '40px' }}>
                          <span className="font-bold text-gray-800 text-xs bg-gray-200 px-1 rounded">HEALTH</span>
                          <div className="text-gray-700 ml-2 leading-tight">{coaching.healthContext}</div>
                        </div>
                      )}

                      {/* Status and Action */}
                      <div className="mb-2" style={{ minHeight: '50px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          {(guidanceType === 'needsAttention' || guidanceType === 'needsSupport') && (
                            <span
                              className={`font-bold ${
                                guidanceType === 'needsAttention' ? 'text-yellow-500' : 'text-red-500'
                              }`}
                            >
                              ⚠
                            </span>
                          )}
                          <span className="font-bold text-xs text-gray-800 bg-gray-200 px-1 rounded">
                            {guidanceType === 'optimal'
                              ? 'OPTIMAL'
                              : guidanceType === 'needsSupport'
                              ? 'SUPPORT'
                              : 'ATTENTION'}
                          </span>
                        </div>
                          <div className="text-gray-700 ml-2 leading-tight">
                            {coaching.implication || coaching.action}
                          </div>
                      </div>

                      {/* Tips */}
                      <div style={{ minHeight: '40px' }}>
                        {coaching.tips ? (
                          <>
                            <span className="font-bold text-gray-800 text-xs bg-gray-300 px-1 rounded">TIPS</span>
                            <div className="text-gray-700 ml-2 leading-tight">{coaching.tips}</div>
                          </>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-600 border-t pt-4">
        <p><strong>Important:</strong> This guide is for fitness professionals to interpret biomarker patterns for training optimization. Always work within scope of practice. For medical concerns, refer to healthcare providers.</p>
      </div>
    </div>
  );
};

export default function BiomarkerApp() {
  const [clientRows, setClientRows] = useState(null);
  const [expandedSupergroups, setExpandedSupergroups] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedBiomarker, setSelectedBiomarker] = useState(null);
  const [error, setError] = useState(null);
  const [showCoachingGuide, setShowCoachingGuide] = useState(false);

  const clientMap = useMemo(() => {
    const map = new Map();
    if (clientRows) {
      for (const r of clientRows) {
        if (!r.MEASURE_NAME) continue;
        map.set(r.MEASURE_NAME, r);
      }
    }
    return map;
  }, [clientRows]);

  const enrichedData = useMemo(() => {
    return Object.entries(biomarkerStructure).map(([supergroupName, supergroupData]) => {
      const enrichedGroups = Object.entries(supergroupData.groups).map(([groupName, groupData]) => {
        const enrichedSubgroups = Object.entries(groupData.subgroups).map(([subgroupName, subgroupData]) => {
          const markerDetails = subgroupData.markers.map(markerName => {
            const clientRow = clientMap.get(markerName);
            return {
              name: markerName,
              color: clientRow?.COLOR || "",
              score: clientRow ? parseIncomingScore(clientRow) : null
            };
          });
          
          const subgroupScore = aggregateWeightedScore(markerDetails);
          
          return {
            name: subgroupName,
            description: subgroupData.description,
            markers: subgroupData.markers,
            coaching: subgroupData.coaching,
            markerDetails,
            score: subgroupScore
          };
        });

        const allGroupMarkers = enrichedSubgroups.flatMap(s => s.markerDetails);
        const groupScore = aggregateWeightedScore(allGroupMarkers);
          
        return {
          name: groupName,
          description: groupData.description,
          subgroups: enrichedSubgroups,
          score: groupScore
        };
      });

      const allSupergroupMarkers = enrichedGroups.flatMap(g => g.subgroups).flatMap(s => s.markerDetails);
      const supergroupScore = aggregateWeightedScore(allSupergroupMarkers);
        
      return {
        name: supergroupName,
        description: supergroupData.description,
        groups: enrichedGroups,
        score: supergroupScore
      };
    });
  }, [clientMap]);

  const onClientUpload = async (file) => {
    try {
      setError(null);
      if (!file) return;
      const rows = await parseCsv(file);
      if (!rows.length) throw new Error("CSV contained no data");
      if (!Object.prototype.hasOwnProperty.call(rows[0] || {}, "MEASURE_NAME")) {
        throw new Error('Client CSV missing required column: "MEASURE_NAME"');
      }
      setClientRows(rows.filter((r) => r.MEASURE_NAME));
    } catch (e) {
      setError(e?.message || "Failed to parse client CSV");
    }
  };

  const toggleSupergroup = (supergroupName) => {
    setExpandedSupergroups(prev => ({
      ...prev,
      [supergroupName]: !prev[supergroupName]
    }));
  };

  const toggleGroup = (supergroupName, groupName) => {
    const key = `${supergroupName}-${groupName}`;
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Molecular You Biomarker Guide</h1>
              <p className="text-gray-600">Blood Biomarker Interpretation by Physiological Systems</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>For Coaches:</strong> This guide organizes blood biomarkers by physiological systems to help you understand how different markers work together. Upload client CSV data to see personalized scores and recommendations.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">System-Based Coaching Approach:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Assess patterns</strong> within each supergroup to identify primary focus areas</li>
              <li>• <strong>Address foundational systems</strong> (Recovery & Circulation) before pushing performance</li>
              <li>• <strong>Use group patterns</strong> to guide periodization and training emphasis</li>
              <li>• <strong>Remember:</strong> you're interpreting for fitness guidance, not medical diagnosis</li>
              <li>• <strong>Navigation:</strong> Click any section header to expand/collapse - multiple sections can be open at once</li>
            </ul>
          </div>

          <Uploader onFile={onClientUpload} error={error} />

          {clientRows && (
            <div className="mt-6 bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Personalized Coaching Guide</h3>
                  <p className="text-sm text-gray-600">Generate a custom coaching reference based on this client's biomarker results</p>
                </div>
                <button
                  onClick={() => setShowCoachingGuide(!showCoachingGuide)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {showCoachingGuide ? 'Hide Guide' : 'Generate Guide'}
                </button>
              </div>
              
              {showCoachingGuide && (
                <div className="border-t pt-4">
                  <PersonalizedCoachingGuide enrichedData={enrichedData} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {enrichedData.map((supergroupData) => {
            const isSupergroupExpanded = expandedSupergroups[supergroupData.name];
            const groupCount = supergroupData.groups.length;
            
            return (
              <div key={supergroupData.name} className="bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => toggleSupergroup(supergroupData.name)}
                  className="w-full bg-gray-100 text-gray-900 px-6 py-4 rounded-t-lg flex items-center justify-between hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">{supergroupData.name}</h2>
{/*                    {clientRows && (
                      <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Score: {supergroupData.score !== null ? supergroupData.score : 'no data'}
                      </span>
                    )}*/}
                  </div>
                  <div className="flex items-center gap-3">
                    {clientRows && (
                      <div className="w-32">
                        <ScoreBar score={supergroupData.score} />
                      </div>
                    )}
                    <span className="text-sm opacity-75">
                      {groupCount} group{groupCount !== 1 ? 's' : ''}
                    </span>
                    {isSupergroupExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>

                {isSupergroupExpanded && (
                  <div className="p-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">{supergroupData.description}</p>
                    </div>

                    {supergroupData.groups.map((groupData) => {
                      const groupKey = `${supergroupData.name}-${groupData.name}`;
                      const isGroupExpanded = expandedGroups[groupKey];
                      const subgroupCount = groupData.subgroups.length;

                      return (
                        <div key={groupData.name} className="mb-6 last:mb-0">
                          <button
                            onClick={() => toggleGroup(supergroupData.name, groupData.name)}
                            className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{groupData.name}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                              {clientRows && (
                                <div className="w-24">
                                  <ScoreBar score={groupData.score} />
                                </div>
                              )}
                              <span className="text-sm opacity-75">
                                {subgroupCount} subgroup{subgroupCount !== 1 ? 's' : ''}
                              </span>
                              {isGroupExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                          </button>

                          {isGroupExpanded && (
                            <div className="mt-4">
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-700">{groupData.description}</p>
                              </div>

                              <div className="space-y-2">
                                {groupData.subgroups.map((subgroup, index) => (
                                  <BiomarkerCard
                                    key={index}
                                    subgroup={subgroup}
                                    clientData={clientMap}
                                    isSelected={selectedBiomarker === `${supergroupData.name}-${groupData.name}-${index}`}
                                    onSelect={() => setSelectedBiomarker(
                                      selectedBiomarker === `${supergroupData.name}-${groupData.name}-${index}` 
                                        ? null 
                                        : `${supergroupData.name}-${groupData.name}-${index}`
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}