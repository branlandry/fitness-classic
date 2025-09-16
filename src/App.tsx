// @ts-nocheck
console.log("BUILD MARKER:", new Date().toISOString());
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Upload, Info, User, Activity, Heart, Zap, Shield, Download, ClipboardList } from 'lucide-react';
import { biomarkerStructure } from './config/biomarker_structure'
import { SCORE_BANDS, colorLabel } from './config/scoring_constants'
import { 
  colorWeight, 
  aggregateWeightedScore, 
  parseIncomingScore, 
  scoreBandLabel, 
  getScoreCategory 
} from './utils/score_calculations';
import { parseCsv } from './utils/csv_parser';
import { recommendationsData, getRecommendationsForBiomarker } from './config/recommendations_data';

// Components
const ScoreCircle = ({ score, size = "large" }) => {
  const band = scoreBandLabel(score);
  const sizeClasses = size === "small" ? "w-6 h-6" : "w-8 h-8";
  
  return (
    <div className={`${sizeClasses} rounded-full border`}
         style={{ 
           backgroundColor: band ? band.bg : "#e5e7eb",
           borderColor: "#d1d5db"
         }}>
    </div>
  );
};

const StatusBadge = ({ color }) => {
  const statusLabel = colorLabel(color);
  
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      {statusLabel.text}
    </span>
  );
};

const BiomarkerRow = ({ marker, clientData }) => {
  const clientRow = clientData.get(marker);
  let score = clientRow ? parseIncomingScore(clientRow) : null;
  let displayNote = "";
  
  const undetectedStatus = (clientRow?.UNDETECTED_STATUS || "").toString().toLowerCase().trim();
  const color = (clientRow?.COLOR || "").toString().toLowerCase().trim();
  
  if (undetectedStatus === 'below_loq') {
    if (color === 'green') {
      displayNote = " (below detection limit - optimal)";
    } else {
      displayNote = " (below detection limit)";
    }
  } else if (undetectedStatus === 'below_lod') {
    if (color === 'green') {
      displayNote = " (below limit of detection - optimal)";
    } else {
      displayNote = " (below limit of detection)";
    }
  }
  
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{marker}</div>
        <div className="text-sm text-gray-500">
          {clientRow?.LAB_CONCENTRATION ? `Result: ${clientRow.LAB_CONCENTRATION}${displayNote}` : "No data available"}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge color={clientRow?.COLOR || ""} />
      </div>
    </div>
  );
};

// ActionPlan Component - ONE SIMPLE CHANGE: Use actual LEVEL from CSV instead of hardcoded 'high'
const ActionPlan = ({ clientData }) => {
  const actionPlan = useMemo(() => {
    if (clientData.size === 0) return [];

    // Create a pool of all applicable recommendations
    const recommendationPool = new Map();
    
    // Iterate through all client biomarkers
    for (const [biomarkerName, clientRow] of clientData) {
      const color = (clientRow?.COLOR || "").toString().toLowerCase().trim();
      const level = (clientRow?.LEVEL || "").toString().toLowerCase().trim(); // Read actual level from CSV
      
      // Determine if biomarker is problematic and get weight
      let weight = 0;
      if (color === 'red') weight = 1;
      else if (color === 'yellow') weight = 0.5;
      
      // Skip if biomarker is in normal range
      if (weight === 0) continue;
      
      // CHANGED: Use actual level from CSV instead of hardcoded 'high'
      // Skip if no level data
      if (!level) continue;
      
      // Get recommendations for this biomarker using actual level from CSV
      const recommendations = getRecommendationsForBiomarker(biomarkerName, level);
      
      recommendations.forEach(rec => {
        const key = `${rec.action}_${rec.name}`;
        
        if (!recommendationPool.has(key)) {
          recommendationPool.set(key, {
            action: rec.action,
            name: rec.name,
            totalWeight: 0,
            targetBiomarkers: []
          });
        }
        
        const poolItem = recommendationPool.get(key);
        poolItem.totalWeight += weight;
        poolItem.targetBiomarkers.push({
          name: biomarkerName,
          color: color,
          weight: weight,
          level: level  // Add level to display data
        });
      });
    }
    
    // Convert to array and sort by total weight (descending), then alphabetically
    const sortedRecommendations = Array.from(recommendationPool.values())
      .sort((a, b) => {
        if (b.totalWeight !== a.totalWeight) {
          return b.totalWeight - a.totalWeight;
        }
        return `${a.action} ${a.name}`.localeCompare(`${b.action} ${b.name}`);
      });
    
    console.log(`Returning top 5 recommendations from ${sortedRecommendations.length} total`);
    
    // Return top 5
    return sortedRecommendations.slice(0, 5);
  }, [clientData]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Action Plan</h1>
        <p className="text-gray-600">
          Top dietary recommendations based on your biomarker results.
        </p>
      </div>

      {clientData.size === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">No Client Data Loaded</h3>
          </div>
          <p className="text-blue-800 text-sm">
            Upload a CSV file with client biomarker data to see personalized action plan recommendations.
          </p>
        </div>
      ) : actionPlan.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">All Biomarkers In Range</h3>
          </div>
          <p className="text-green-800 text-sm">
            Great! All your biomarkers appear to be in normal ranges. No specific dietary recommendations needed at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {actionPlan.map((recommendation, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {index + 1}. {recommendation.action.charAt(0).toUpperCase() + recommendation.action.slice(1)} {recommendation.name}
                </h3>
                <div className="text-sm text-gray-600">
                  Targets {recommendation.targetBiomarkers.length} biomarker{recommendation.targetBiomarkers.length !== 1 ? 's' : ''} | Weight Score: {recommendation.totalWeight}
                  {recommendation.targetBiomarkers.length > 0 }
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Target Biomarkers:</h4>
                <div className="space-y-1">
                  {recommendation.targetBiomarkers.map((biomarker, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{biomarker.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          biomarker.color === 'red',
                          biomarker.color === 'yellow', 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {biomarker.color === 'red' ? 'Out of range' : 
                           biomarker.color === 'yellow' ? 'Borderline' : 'In range'}
                          {biomarker.level && (
                            <span className="ml-1 font-medium">({biomarker.level})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PersonalizedCoachingGuide Component (for download)
const PersonalizedCoachingGuide = ({ enrichedData }) => {
  const getCoachingGuidance = (score) => {
    const category = getScoreCategory(score);
    if (category === 'optimal') return 'optimal';
    if (category === 'needs support') return 'needsSupport';
    return 'needsAttention';
  };

  return (
    <div className="bg-white p-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
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
                            <span className="font-bold">⚠️</span>
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

const downloadCoachingGuide = (enrichedData) => {
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Personalized Biomarker Coaching Guide</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .no-print { display: none !important; }
        @media print {
          body { margin: 0; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #3b82f6; padding-bottom: 1rem;">
        <h1 style="font-size: 1.5rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.5rem;">Personalized Biomarker Coaching Guide</h1>
        <p style="color: #6b7280;">System-Based Training Approach • Customized for This Client</p>
      </div>
      
      <div style="margin-bottom: 2rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem;">
        <h2 style="font-weight: bold; color: #111827; margin-bottom: 0.75rem;">System-Based Coaching Principles</h2>
        <ul style="font-size: 0.875rem; color: #374151; margin: 0; padding-left: 1.5rem;">
          <li>→ Assess patterns within each system to identify focus areas.</li>
          <li>→ Address foundational systems before pushing performance.</li>
          <li>→ Use system patterns to guide periodization and training emphasis.</li>
          <li>→ Remember: This is for fitness guidance, not medical diagnosis.</li>
          <li>→ Start conservative and progress based on client response.</li>
          <li>→ Monitor subjective feelings alongside objective markers.</li>
        </ul>
      </div>
      
      <div style="text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
        <p><strong>Important:</strong> This guide is for fitness professionals to interpret biomarker patterns for training optimization. Always work within scope of practice. For medical concerns, refer to healthcare providers.</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 2rem;">
        <button onclick="window.print()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">Print Guide</button>
        <button onclick="window.close()" style="background: #6b7280; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; margin-left: 0.5rem;">Close</button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

const ExecutiveSummary = ({ enrichedData, clientData }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Biomarker Overview</h1>
        <p className="text-gray-600">
          System-based biomarker analysis for training optimization and health insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {enrichedData.map((supergroup) => {
          const icon = supergroup.name === "Health" ? Heart : 
                      supergroup.name === "Performance" ? Zap : Shield;
          const IconComponent = icon;
          
          return (
            <div key={supergroup.name} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{supergroup.name}</h3>
                <ScoreCircle score={supergroup.score} />
              </div>
              <p className="text-sm text-gray-600 mb-4">{supergroup.description}</p>
              
              <div className="space-y-2">
                {supergroup.groups.map((group) => (
                  <div key={group.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{group.name}</span>
                    <ScoreCircle score={group.score} size="small" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {clientData.size === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">No Client Data Loaded</h3>
          </div>
          <p className="text-blue-800 text-sm">
            Upload a CSV file with client biomarker data to see personalized scores and recommendations.
            Use the upload button in the top navigation to get started.
          </p>
        </div>
      )}
    </div>
  );
};

const SubgroupDetail = ({ subgroup, clientData }) => {
  const [biomarkersExpanded, setBiomarkersExpanded] = useState(false);
  
  const markerDetails = subgroup.markers.map(markerName => {
    const clientRow = clientData.get(markerName);
    let score = clientRow ? parseIncomingScore(clientRow) : null;
    
    return {
      name: markerName,
      color: clientRow?.COLOR || "",
      score: score
    };
  });

  const aggregatedScore = aggregateWeightedScore(markerDetails);
  const scoreCategory = getScoreCategory(aggregatedScore);
  const coaching = subgroup.coaching;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{subgroup.name}</h1>
          <ScoreCircle score={aggregatedScore} />
        </div>
        <p className="text-gray-600">{subgroup.description}</p>
      </div>

      {/* Coaching Section */}
      {scoreCategory && coaching && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Training Guidance</h3>
          <div className="space-y-3 text-sm">
            {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                     scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.healthContext && (
              <div>
                <span className="font-medium text-gray-900">Health Context:</span>
                <p className="text-gray-700 mt-1">
                  {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                           scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].healthContext}
                </p>
              </div>
            )}
            
            {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                     scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.implication && (
              <div>
                <span className="font-medium text-gray-900">Training Impact:</span>
                <p className="text-gray-700 mt-1">
                  {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                           scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].implication}
                </p>
              </div>
            )}
            
            <div>
              <span className="font-medium text-gray-900">Recommended Actions:</span>
              <p className="text-gray-700 mt-1">
                {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                         scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].action}
              </p>
            </div>
            
            {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                     scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention']?.tips && (
              <div>
                <span className="font-medium text-gray-900">Coach Tips:</span>
                <p className="text-gray-700 mt-1">
                  {coaching[scoreCategory === 'optimal' ? 'optimal' : 
                           scoreCategory === 'needs support' ? 'needsSupport' : 'needsAttention'].tips}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Biomarkers Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => setBiomarkersExpanded(!biomarkersExpanded)}
          className="w-full px-6 py-4 border-b border-gray-200 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Biomarkers ({markerDetails.length})</h3>
            {biomarkersExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
          </div>
        </button>
        
        {biomarkersExpanded && (
          <div>
            {subgroup.markers.map((marker, idx) => (
              <BiomarkerRow key={idx} marker={marker} clientData={clientData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ enrichedData, selectedItem, onSelectItem, onUpload, hasData }) => {
  const [expandedSupergroups, setExpandedSupergroups] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleSupergroup = (name) => {
    setExpandedSupergroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleGroup = (supergroupName, groupName) => {
    const key = `${supergroupName}-${groupName}`;
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="font-semibold text-gray-900">Biomarker Guide</h1>
        </div>
        
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="w-3 h-3" />
          Upload CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Overview */}
          <button
            onClick={() => onSelectItem(null)}
            className={`w-full text-left px-3 py-2 rounded-md mb-2 transition-colors ${
              selectedItem === null ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Overview</span>
            </div>
          </button>

          {/* Action Plan */}
          <button
            onClick={() => onSelectItem('action-plan')}
            className={`w-full text-left px-3 py-2 rounded-md mb-2 transition-colors ${
              selectedItem === 'action-plan' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="font-medium">Action Plan (beta)</span>
            </div>
          </button>

          {/* Supergroups */}
          {enrichedData.map((supergroup) => {
            const isSupergroupExpanded = expandedSupergroups[supergroup.name];
            const icon = supergroup.name === "Health" ? Heart : 
                        supergroup.name === "Performance" ? Zap : Shield;
            const IconComponent = icon;

            return (
              <div key={supergroup.name} className="mb-2">
                <button
                  onClick={() => toggleSupergroup(supergroup.name)}
                  className="w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-gray-100 text-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{supergroup.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasData && <ScoreCircle score={supergroup.score} size="small" />}
                      {isSupergroupExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {isSupergroupExpanded && (
                  <div className="ml-4 mt-1">
                    {supergroup.groups.map((group) => {
                      const groupKey = `${supergroup.name}-${group.name}`;
                      const isGroupExpanded = expandedGroups[groupKey];

                      return (
                        <div key={group.name} className="mb-1">
                          <button
                            onClick={() => toggleGroup(supergroup.name, group.name)}
                            className="w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-gray-50 text-gray-700 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span>{group.name}</span>
                              <div className="flex items-center gap-2">
                                {hasData && <ScoreCircle score={group.score} size="small" />}
                                {isGroupExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </div>
                            </div>
                          </button>

                          {isGroupExpanded && (
                            <div className="ml-4 mt-1">
                              {group.subgroups.map((subgroup, idx) => {
                                const subgroupKey = `${supergroup.name}-${group.name}-${idx}`;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => onSelectItem(subgroupKey)}
                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors text-xs ${
                                      selectedItem === subgroupKey 
                                        ? 'bg-blue-100 text-blue-900' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{subgroup.name}</span>
                                      {hasData && <ScoreCircle score={subgroup.score} size="small" />}
                                    </div>
                                  </button>
                                );
                              })}
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
};

export default function BiomarkerApp() {
  const [clientRows, setClientRows] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  const clientMap = useMemo(() => {
    const map = new Map();
    if (clientRows) {
      console.log("Building clientMap from", clientRows.length, "rows");
      
      const colorCounts = {};
      const levelCounts = {};
      
      for (const r of clientRows) {
        if (!r.MEASURE_NAME) continue;
        map.set(r.MEASURE_NAME, r);
        
        // Count colors and levels
        const color = (r.COLOR || '').toString().toLowerCase();
        const level = (r.LEVEL || '').toString().toLowerCase();
        colorCounts[color] = (colorCounts[color] || 0) + 1;
        levelCounts[level] = (levelCounts[level] || 0) + 1;
        
        // Log ALL red and yellow biomarkers
        if (color === 'red' || color === 'yellow') {
          console.log(`Found problematic biomarker: ${r.MEASURE_NAME}, COLOR: "${r.COLOR}", LEVEL: "${r.LEVEL}"`);
        }
      }
      
      console.log("ClientMap built with", map.size, "entries");
      console.log("Color distribution:", colorCounts);
      console.log("Level distribution:", levelCounts);
    }
    return map;
  }, [clientRows]);

  const enrichedData = useMemo(() => {
    return Object.entries(biomarkerStructure).map(([supergroupName, supergroupData]) => {
      const enrichedGroups = Object.entries(supergroupData.groups).map(([groupName, groupData]) => {
        const enrichedSubgroups = Object.entries(groupData.subgroups).map(([subgroupName, subgroupData]) => {
          const markerDetails = subgroupData.markers.map(markerName => {
            const clientRow = clientMap.get(markerName);
            let score = clientRow ? parseIncomingScore(clientRow) : null;
            
            return {
              name: markerName,
              color: clientRow?.COLOR || "",
              score: score
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
      if (!Object.prototype.hasOwnProperty.call(rows[0] || {}, "LEVEL")) {
        throw new Error('Client CSV missing required column: "LEVEL" - this field is needed to determine if biomarkers are high or low');
      }
      
      setClientRows(rows.filter((r) => r.MEASURE_NAME && r.LEVEL));
    } catch (e) {
      setError(e?.message || "Failed to parse client CSV");
    }
  };

  const getSelectedSubgroup = () => {
    if (!selectedItem) return null;
    
    const parts = selectedItem.split('-');
    if (parts.length !== 3) return null;
    
    const [supergroupName, groupName, subgroupIndex] = parts;
    const supergroup = enrichedData.find(s => s.name === supergroupName);
    if (!supergroup) return null;
    
    const group = supergroup.groups.find(g => g.name === groupName);
    if (!group) return null;
    
    return group.subgroups[parseInt(subgroupIndex)] || null;
  };

  const selectedSubgroup = getSelectedSubgroup();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        enrichedData={enrichedData}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        onUpload={onClientUpload}
        hasData={clientRows !== null}
      />
      
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {selectedSubgroup ? (
          <SubgroupDetail subgroup={selectedSubgroup} clientData={clientMap} />
        ) : selectedItem === 'action-plan' ? (
          <ActionPlan clientData={clientMap} />
        ) : (
          <ExecutiveSummary enrichedData={enrichedData} clientData={clientMap} />
        )}
      </div>
    </div>
  );
}