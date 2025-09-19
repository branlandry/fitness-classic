// biomarkerStructure.ts - Static biomarker data structure
export const biomarkerStructure = {
  "Health": {
    description: "Markers that reveal how effectively your cardiovascular and neurological systems deliver oxygen, clear metabolic waste, and maintain the mental drive essential for consistent training performance. These indicators show whether the body's foundational systems can support demanding endurance work and sustained training motivation.",
    groups: {
      "Cardiovascular Health": {
        description: "Markers that reveal cardiovascular system readiness for training demands, showing how efficiently nutrients reach working muscles and waste products are cleared during exercise. These indicators determine whether circulation can support higher training volumes and faster recovery between sessions.",
        subgroups: {
          "Blood Vessel Health": {
            description: "Markers reflecting blood vessel lining health. They determine blood circulation efficiency and cardiovascular training capacity.",
            markers: ["Intercellular adhesion molecule 1", "L-selectin", "Cadherin-5", "Thrombospondin-1", "Angiogenin", "Vasorin", "von Willebrand Factor", "Pigment epithelium-derived factor", "Fibronectin"],
            coaching: {
              optimal: {
                implication: "Healthy blood vessel function supports efficient nutrient delivery, better endurance, and superior recovery.",
                action: "Incorporate higher-volume cardio, longer training sessions, and faster-paced conditioning work.",
                healthContext: "Healthy vessel markers lower your risk of hypertension and help improve circulation."
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
          "Blood Flow Capacity": {
            description: "Markers supporting blood vessel dilation and circulation. They directly impact muscle pumps, endurance capacity, and exercise performance.",
            markers: ["Arginine", "Citrulline", "Ornithine", "Asymmetric dimethylarginine", "Acetyl-Ornithine"],
            coaching: {
              optimal: {
                implication: "Healthy blood flow markers enhance muscle pumps, endurance, and exercise capacity.",
                action: "Push cardiovascular limits with interval training, circuit work, and high-volume resistance protocols.",
                healthContext: "Healthy blood flow markers show improved exercise capacity and overall cardiovascular health."
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
          "Clotting Balance": {
            description: "Markers reflecting blood clotting balance. They determine training intensity tolerance and injury recovery potential.",
            markers: ["Fibrinogen alpha chain", "Fibrinogen beta chain", "Fibrinogen gamma chain", "Prothrombin", "Coagulation factor IX", "Coagulation factor X", "Coagulation factor XI", "Coagulation factor XII", "Coagulation factor XIII A chain", "Coagulation factor XIII B chain", "Plasminogen", "Protein S", "Antithrombin-III"],
            coaching: {
              optimal: {
                implication: "Optimal blood clotting markers support safer high-intensity training, better tissue repair, and reduced injury downtime.",
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
        description: "Markers reflecting neurotransmitter production and brain chemistry balance that directly impact training motivation, stress resilience, and workout consistency. They show whether neurological systems support challenging training and ability to maintain a positive training mindset.",
        subgroups: {
          "Training Motivation": {
            description: "Markers supporting mood stability, training motivation, and positive mindset that directly impact program adherence and workout consistency.",
            markers: ["Serotonin", "Tryptophan", "Kynurenine"],
            coaching: {
              optimal: {
                implication: "Optimal training motivation markers promote consistent motivation, positive mindset, and better program adherence.",
                action: "Leverage good mood stability - try new challenges, group fitness, or mentally demanding training protocols.",
                healthContext: "Healthy training motivation markers show improved mood stability and sleep quality."
              },
              needsSupport: {
                action: "Maintain enjoyable exercise variety, track mood responses to training, use social support when possible.",
                tips: "Monitor mood patterns with training, encourage outdoor activities when possible, track sleep quality.",
                healthContext: "Abnormal training motivation markers may indicate mood issues, sleep disruption, and reduced motivation."
              },
              needsAttention: {
                action: "Keep workouts fun and social, avoid monotonous routines, focus on mood-boosting activities.",
                tips: "Monitor training enjoyment, encourage outdoor exercise, and track sleep quality alongside mood.",
                healthContext: "Abnormal training motivation markers may indicate mood issues, sleep disruption, and reduced motivation."
              }
            }
          },
          "Stress Recovery": {
            description: "Markers supporting stress management, recovery readiness, and nervous system balance that determine training stress tolerance and adaptation capacity.",
            markers: ["Gamma-aminobutyric acid"],
            coaching: {
              optimal: {
                implication: "Markers supporting stress recovery allow better stress management, deeper recovery, and sustainable training.",
                action: "Take advantage of good stress resilience - add challenging workouts knowing recovery will be effective.",
                healthContext: "Healthy GABA markers show improved stress management and recovery capacity."
              },
              needsSupport: {
                action: "Balance challenging work with adequate recovery, include relaxation techniques, avoid overstimulating environments.",
                tips: "Teach basic stress management techniques, create calm training environments, monitor stress responses.",
                healthContext: "Low stress reocovery support may indicate anxiety, sleep issues, and impaired stress recovery."
              },
              needsAttention: {
                action: "Emphasize relaxation techniques, yoga, meditation, and avoid overstimulating training environments.",
                tips: "Teach breathing techniques, promote calm training spaces, and monitor stress responses.",
                healthContext: "Low stress recovery support may indicate anxiety, sleep issues, and impaired stress recovery."
              }
            }
          },
          "Mental Drive": {
            description: "Markers supporting motivation, focus, and drive. They impact training intensity, skill acquisition, and consistent workout performance.",
            markers: ["Tyrosine", "Phenylalanine"],
            coaching: {
              optimal: {
                implication: "Markers supporting dopamine production enhance motivation, focus, and drive for consistent training.",
                action: "Leverage high motivation - introduce challenging skills, competitive elements, or complex movement patterns.",
                healthContext: "Healthy mental drive markers show improved motivation and movement control."
              },
              needsSupport: {
                action: "Maintain engaging variety in training, use goal-setting and progress tracking, avoid overtraining that impacts motivation.",
                tips: "Use achievement-based programs, track progress visibly, include variety and challenge progression.",
                healthContext: "Low mental drive markers may indicate reduced motivation, mood, and movement control."
              },
              needsAttention: {
                action: "Focus on enjoyable, low-pressure activities. Avoid overtraining that could further impact motivation.",
                tips: "Use variety, social support, and achievable micro-goals to rebuild training enthusiasm.",
                healthContext: "Low mental drive markers may indicate reduced motivation, mood, and movement control."
              }
            }
          }
        }
      }
    }
  },
  "Performance": {
    description: "Markers reflecting your body's muscle-building machinery, energy production capacity, and strength development potential. These indicators reveal whether cellular processes are primed for muscle growth, optimal workout fueling, and progressive training demands.",
    groups: {
      "Muscle & Strength Systems": {
        description: "Markers revealing protein synthesis capacity, muscle building potential, and strength development readiness. These indicators show whether cellular processes can support progressive muscle-building protocols and handle increased training volumes for optimal strength gains.",
        subgroups: {
          "Muscle Building": {
            description: "Markers reflecting the balance between muscle building and breakdown processes that determine training volume tolerance and strength development potential.",
            markers: ["Methylhistidine", "Creatine", "Creatinine", "Insulin-like growth factor-binding protein 2", "Insulin-like growth factor-binding protein 3", "Insulin-like growth factor-binding protein complex acid labile subunit"],
            coaching: {
              optimal: {
                implication: "Markers of protein synthesis and breakdown in balance allow optimal muscle growth, strength gains, and injury prevention.",
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
          "Building Blocks": {
            description: "Markers providing essential building blocks for muscle protein synthesis. They directly impact recovery speed, muscle growth, and training adaptation.",
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
          "Growth Support": {
            description: "Markers supporting cellular growth, tissue repair, and training adaptation that determine recovery capacity and progression potential.",
            markers: ["Spermidine", "Putrescine"],
            coaching: {
              optimal: {
                implication: "arkers supporting polyamine pathways facilitate muscle growth, tissue repair, and training adaptation.",
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
        description: "Markers that reveal metabolic efficiency for different fuel sources during exercise, showing how well carbohydrates, fats, and cellular energy pathways support workout performance. These indicators determine optimal nutrition timing and training intensity based on metabolic readiness.",
        subgroups: {
          "Carb metabolism": {
            description: "Markers reflecting carbohydrate processing efficiency and energy availability that determine workout fueling strategies and training intensity tolerance.",
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
          "Fat Metabolism": {
            description: "Markers reflecting fat metabolism efficiency and cardiovascular health that support endurance performance and hormone production for training.",
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
          "Cellular Energy": {
            description: "Markers supporting cellular hydration, metabolic efficiency, and energy production that directly impact training capacity and recovery quality.",
            markers: ["Betaine", "Choline", "Taurine", "Trimethylamine N-oxide"],
            coaching: {
              optimal: {
                implication: "Markers supporting cellular hydration and methylation promote energy production, recovery, and training capacity.",
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
  "Recovery": {
    description: "Markers that indicate how well your body's repair mechanisms, anti-inflammatory systems, and structural maintenance processes respond to training stress. These indicators show whether recovery systems can handle increased training loads and support consistent adaptation over time.",
    groups: {
      "Recovery & Adaptation": {
        description: "Markers reflecting inflammatory control, antioxidant capacity, and tissue repair efficiency after training stress. These indicators show whether recovery mechanisms can handle higher training frequencies and support consistent positive adaptations.",
        subgroups: {
          "Inflammation & Immune readiness": {
            description: "Markers reflecting inflammatory control and immune system function that determine training frequency tolerance and consistent workout availability.",
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
          "Tissue Repair": {
            description: "Markers reflecting structural tissue repair and remodeling capacity that determine training progression safety and injury prevention potential.",
            markers: ["Fibronectin", "Vitronectin", "Lumican", "Fibulin-1", "Extracellular matrix protein 1", "Proteoglycan 4", "Tetranectin", "trans-OH-Proline"],
            coaching: {
              optimal: {
                implication: "Markers supporting tissue repair promote injury prevention, strength development, and training progression.",
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
          "Stress Defense": {
            description: "Markers reflecting cellular stress management and antioxidant capacity that determine training intensity tolerance and recovery efficiency.",
            markers: ["Glutathione peroxidase 3", "Peroxiredoxin-2", "Ceruloplasmin", "Methionine-Sulfoxide"],
            coaching: {
              optimal: {
                implication: "Markers showing proper antioxidant balance support training adaptation, cellular health, and exercise improvements.",
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
        description: "Markers revealing structural tissue health, bone density markers, and connective tissue turnover that determine injury risk and loading capacity. These indicators show whether joints and connective tissues can safely handle high-impact training and heavy resistance work.",
        subgroups: {
          "Cartilage & Bone Health": {
            description: "Markers reflecting bone density and cartilage health that determine high-impact training capacity and joint loading tolerance.",
            markers: ["Cartilage acidic protein 1", "Alpha-2-HS-glycoprotein", "Fetuin-B", "Tetranectin"],
            coaching: {
              optimal: {
                implication: "Markers of bone and cartilage metabolism in healthy ranges support joint health, power development, and injury resilience.",
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
          "Joint Health": {
            description: "Markers reflecting connective tissue health and remodeling that determine injury risk and capacity for demanding movement patterns.",
            markers: ["trans-OH-Proline", "Lumican", "Fibulin-1"],
            coaching: {
              optimal: {
                implication: "Markers of collagen synthesis in healthy ranges support joint stability, injury prevention, and tissue repair.",
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