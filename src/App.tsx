import { useState, useMemo } from 'react';
import { Upload, Palette } from 'lucide-react';
import { biomarkerStructure } from './config/biomarker_structure';

// Try to import scoring constants, with fallback if not available
let SCORE_BANDS, scoreBandLabel;
try {
  const scoringConstants = require('./config/scoring_constants');
  SCORE_BANDS = scoringConstants.SCORE_BANDS;
  scoreBandLabel = scoringConstants.scoreBandLabel;
} catch (e) {
  // Fallback if scoring_constants is not available
  SCORE_BANDS = [
    { min: 0, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
    { min: 49, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
    { min: 60, label: "YELLOW", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
    { min: 70, label: "ORANGE", bg: "#ffa500", text: "text-gray-900", category: "needs support" },
    { min: 80, label: "BLUE", bg: "#0000ff", text: "text-white", category: "needs support" },
    { min: 90, label: "PURPLE", bg: "#800080", text: "text-white", category: "needs support" },
    { min: 98, label: "BROWN", bg: "#8B4513", text: "text-white", category: "optimal" },
    { min: 99, label: "BLACK", bg: "#000000", text: "text-white", category: "optimal" },
    { min: 100, label: "RED", bg: "#ff0000", text: "text-white", category: "optimal" },
  ];
  
  scoreBandLabel = (score) => {
    if (score === null || score === undefined || !Number.isFinite(score)) return null;
    const s = Math.floor(score);
    let best = null;
    for (const band of SCORE_BANDS) {
      if (s >= band.min) best = band;
    }
    return best;
  };
}

// CSV Parser
function parseCsv(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Scoring functions
function parseIncomingScore(row) {
  if (!row) return null;
  
  const scoreFields = ['SCORE', 'BiomarkerScore', 'BIOMARKER_SCORE'];
  for (const field of scoreFields) {
    if (row[field] !== undefined && row[field] !== null && row[field] !== "") {
      const score = Number(String(row[field]).trim());
      if (Number.isFinite(score)) {
        return Math.max(0, Math.min(100, Math.floor(score)));
      }
    }
  }
  return null;
}

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

function getScoreCategory(score) {
  if (score === null || score === undefined) return 'no-data';
  if (score >= 91) return 'optimal';
  if (score >= 70) return 'needs-support';
  return 'needs-attention';
}

// Color scheme definitions
const MOLECULAR_YOU_COLORS = {
  optimal: '#3FB6DC',
  'needs-support': '#FFC800', 
  'needs-attention': '#CF3616',
  'no-data': '#9ca3af'
};

// Helper function to get color based on scheme and category/score
function getCategoryColor(category, colorScheme, score = null) {
  if (colorScheme === 'level-method' && score !== null) {
    // For Level Method, use actual score bands
    const band = scoreBandLabel(score);
    return band ? band.bg : '#9ca3af';
  }
  
  // For Molecular You, use simplified category colors
  return MOLECULAR_YOU_COLORS[category] || MOLECULAR_YOU_COLORS['no-data'];
}

// Helper functions for Level Method badge styling
function getBadgeStyles(category, colorScheme) {
  if (colorScheme === 'level-method') {
    // For Level Method, use neutral styling since we can't determine exact score at category level
    return {
      backgroundColor: '#e5e7eb',
      color: '#374151'
    };
  }
  
  // For Molecular You, use category-specific colors
  switch(category) {
    case 'optimal': return { backgroundColor: '#E8F8FC', color: '#2B7A8C' };
    case 'needs-support': return { backgroundColor: '#FFF8E1', color: '#CC9900' };
    case 'needs-attention': return { backgroundColor: '#FDEEE9', color: '#A42B11' };
    default: return { backgroundColor: '#f1f5f9', color: '#64748b' };
  }
}

function getDetailPanelBgColor(category, colorScheme) {
  if (colorScheme === 'level-method') {
    // For Level Method, use neutral grey backgrounds to ensure all score band colors are visible
    return '#F3F4F6';
  }
  
  // For Molecular You, use category-specific backgrounds
  switch(category) {
    case 'needs-attention': return '#FEF2F2';
    case 'needs-support': return '#FFFBEB';
    case 'optimal': return '#F0F9FF';
    default: return '#F9FAFB';
  }
}

// Utility function to format numeric values
function formatBiomarkerValue(value) {
  if (!value || value === "No data") return "No data";
  
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num.toFixed(2);
  }
  
  return value;
}

// Ring component for the executive summary
const ScoreRing = ({ score, label, onClick, isActive, colorScheme }) => {
  const category = getScoreCategory(score);
  const circumference = 327;
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference;
  const color = getCategoryColor(category, colorScheme, score);
  
  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-200 hover:scale-105 ${isActive ? 'scale-105' : ''}`}
      onClick={onClick}
    >
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" className={`fill-none stroke-8 ${
          colorScheme === 'level-method' ? 'stroke-gray-400' : 'stroke-gray-200'
        }`}/>
        <circle 
          cx="60" cy="60" r="52" 
          className="fill-none stroke-8 rounded transition-all duration-700"
          style={{ stroke: color }}
          strokeDasharray="327"
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="text-2xl font-bold"
          style={{ color }}
        >
          {score !== null ? score : '--'}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-wider ${
          colorScheme === 'level-method' ? 'text-gray-600' : 'text-gray-500'
        }`}>Score</div>
      </div>
      <div 
        className="mt-3 text-center font-semibold"
        style={{ color }}
      >
        {label}
      </div>
    </div>
  );
};

// Group card component
const GroupCard = ({ group, system, isExpanded, onToggle, onSubgroupClick, colorScheme }) => {
  const category = getScoreCategory(group.score);
  const color = getCategoryColor(category, colorScheme, group.score);
  const badgeStyles = getBadgeStyles(category, colorScheme);

  return (
    <div 
      className={`rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-lg ${
        isExpanded ? 'shadow-xl' : ''
      } ${colorScheme === 'level-method' 
        ? 'bg-gray-200 border-gray-400' 
        : 'bg-white border-gray-200'
      }`}
    >      
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex-1 pr-4">{group.name}</h3>
          <div className="flex items-center gap-2">
            <div 
              className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap"
              style={badgeStyles}
            >
              {category === 'optimal' ? 'Optimal' :
               category === 'needs-support' ? 'Needs Support' :
               category === 'needs-attention' ? 'Needs Attention' : 'No Data'}
            </div>
            <div 
              className="text-2xl font-bold"
              style={{ color }}
            >
              {group.score !== null ? group.score : '--'}
            </div>
            <div className={`text-gray-400 transition-transform duration-200 text-sm ml-2 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`px-4 pb-4 border-t ${
          colorScheme === 'level-method' ? 'border-gray-500' : 'border-gray-100'
        }`}>
          <div className="pt-4">
            <p className={`text-sm leading-relaxed mb-4 ${
              colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-600'
            }`}>{group.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {group.subgroups.map((subgroup, idx) => {
                const subCategory = getScoreCategory(subgroup.score);
                const subColor = getCategoryColor(subCategory, colorScheme, subgroup.score);
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all duration-200 ${
                      colorScheme === 'level-method' 
                        ? 'bg-gray-300 border-gray-500 hover:bg-gray-400 hover:border-gray-600' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubgroupClick(subgroup, group.name, system);
                    }}
                  >
                    <div className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                      {subgroup.name}
                    </div>
                    <div 
                      className="text-xl font-bold mb-1"
                      style={{ color: subColor }}
                    >
                      {subgroup.score !== null ? subgroup.score : '--'}
                    </div>
                    <div className={`text-xs ${
                      colorScheme === 'level-method' ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {subgroup.markers.length} biomarkers
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

// Detail panel component
const DetailPanel = ({ subgroup, group, system, onClose, clientData, colorScheme }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['needs-attention', 'needs-support']));

  if (!subgroup) return null;

  const markerDetails = subgroup.markers.map(markerName => {
    const clientRow = clientData.get(markerName);
    const score = clientRow ? parseIncomingScore(clientRow) : null;
    const color = clientRow?.COLOR || "";
    const value = clientRow?.LAB_CONCENTRATION || "No data";
    
    return {
      name: markerName,
      score,
      value,
      color: color.toLowerCase()
    };
  });

  // Group markers by their COLOR field, not score category
  const groupedMarkers = {
    'needs-attention': markerDetails.filter(m => m.color === 'red'),
    'needs-support': markerDetails.filter(m => m.color === 'yellow'),
    'optimal': markerDetails.filter(m => m.color === 'green'),
    'no-data': markerDetails.filter(m => !m.color || (m.color !== 'red' && m.color !== 'yellow' && m.color !== 'green'))
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'needs-attention': return 'Needs Attention';
      case 'needs-support': return 'Needs Support';
      case 'optimal': return 'Optimal';
      default: return 'No Data';
    }
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 border-l shadow-2xl z-50 overflow-y-auto ${
      colorScheme === 'level-method'
        ? 'bg-gray-200 border-gray-500'
        : 'bg-white border-gray-200'
    }`}>
      <div className={`sticky top-0 border-b p-6 z-10 ${
        colorScheme === 'level-method'
          ? 'bg-gray-200 border-gray-500'
          : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg font-bold ${
            colorScheme === 'level-method' 
              ? 'hover:bg-gray-400' 
              : 'hover:bg-gray-100'
          }`}
        >
          ×
        </button>
        <div className="pr-12">
          <h2 className="text-2xl font-bold text-gray-900">{subgroup.name}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className={`mb-8 p-4 rounded-xl border ${
          colorScheme === 'level-method' 
            ? 'bg-gray-300 border-gray-500' 
            : 'bg-gray-50 border-gray-100'
        }`}>
          <p className={`text-sm leading-relaxed mb-6 ${
            colorScheme === 'level-method' ? 'text-gray-800' : 'text-gray-900'
          }`}>
            {subgroup.description}
          </p>
          
          {(() => {
            // Use the pre-calculated subgroup score from the enriched data
            const subgroupScore = subgroup.score;
            const scoreCategory = getScoreCategory(subgroupScore);
            
            // Get coaching data from biomarker structure - need to find it in the original structure
            let coaching = null;
            
            // Search through the biomarker structure to find the coaching data
            Object.values(biomarkerStructure).forEach(supergroupData => {
              Object.values(supergroupData.groups).forEach(groupData => {
                Object.entries(groupData.subgroups).forEach(([subgroupName, subgroupData]) => {
                  if (subgroupName === subgroup.name) {
                    coaching = subgroupData.coaching;
                  }
                });
              });
            });
            
            console.log('Debug - subgroup name:', subgroup.name);
            console.log('Debug - subgroupScore:', subgroupScore);
            console.log('Debug - scoreCategory:', scoreCategory);
            console.log('Debug - coaching data:', coaching);
            
            if (!coaching || !scoreCategory || scoreCategory === 'no-data') {
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Debug Info:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      Score: {subgroupScore}, Category: {scoreCategory}, Has Coaching: {coaching ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              );
            }
            
            const coachingKey = scoreCategory === 'optimal' ? 'optimal' : 
                              scoreCategory === 'needs-support' ? 'needsSupport' : 'needsAttention';
            const coachingData = coaching[coachingKey];
            
            console.log('Debug - coachingKey:', coachingKey);
            console.log('Debug - coachingData:', coachingData);
            
            if (!coachingData) {
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Debug Info:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      No coaching data found for key: {coachingKey}
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="space-y-4">
                {coachingData.healthContext && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Health Context:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      {coachingData.healthContext}
                    </p>
                  </div>
                )}
                
                {coachingData.implication && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Training Impact:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      {coachingData.implication}
                    </p>
                  </div>
                )}
                
                {coachingData.action && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Recommended Actions:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      {coachingData.action}
                    </p>
                  </div>
                )}
                
                {coachingData.tips && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Coach Tips:</h4>
                    <p className={`text-sm leading-relaxed ${
                      colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      {coachingData.tips}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="space-y-4">
          {Object.entries(groupedMarkers).map(([category, markers]) => {
            if (markers.length === 0) return null;
            
            const isExpanded = expandedCategories.has(category);
            // For color-based categories, use the category to determine color
            let categoryColor;
            switch(category) {
              case 'needs-attention': categoryColor = MOLECULAR_YOU_COLORS['needs-attention']; break;
              case 'needs-support': categoryColor = MOLECULAR_YOU_COLORS['needs-support']; break;
              case 'optimal': categoryColor = MOLECULAR_YOU_COLORS['optimal']; break;
              default: categoryColor = MOLECULAR_YOU_COLORS['no-data']; break;
            }
            
            return (
              <div key={category} className={`border rounded-lg ${
                colorScheme === 'level-method' ? 'border-gray-400' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full p-4 text-left transition-colors ${
                    colorScheme === 'level-method' 
                      ? 'hover:bg-gray-300' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      />
                      <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                        {getCategoryLabel(category)} ({markers.length})
                      </h3>
                    </div>
                    <div className={`text-gray-400 transition-transform duration-200 text-sm ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className={`px-4 pb-4 border-t ${
                    colorScheme === 'level-method' ? 'border-gray-400' : 'border-gray-200'
                  }`}>
                    <div className="space-y-3 pt-3">
                      {markers.map((marker, idx) => {
                        // Use the category (based on color) for styling, not the score
                        let markerColor, backgroundColor;
                        
                        if (colorScheme === 'level-method') {
                          // For Level Method, still use score-based coloring for the score display
                          const markerCategory = getScoreCategory(marker.score);
                          markerColor = getCategoryColor(markerCategory, colorScheme, marker.score);
                          backgroundColor = '#E5E7EB';
                        } else {
                          // For Molecular You, use category-based coloring
                          switch(category) {
                            case 'needs-attention': 
                              markerColor = MOLECULAR_YOU_COLORS['needs-attention'];
                              backgroundColor = '#FEF2F2';
                              break;
                            case 'needs-support': 
                              markerColor = MOLECULAR_YOU_COLORS['needs-support'];
                              backgroundColor = '#FFFBEB';
                              break;
                            case 'optimal': 
                              markerColor = MOLECULAR_YOU_COLORS['optimal'];
                              backgroundColor = '#F0F9FF';
                              break;
                            default: 
                              markerColor = MOLECULAR_YOU_COLORS['no-data'];
                              backgroundColor = '#F9FAFB';
                              break;
                          }
                        }
                        
                        return (
                          <div 
                            key={idx} 
                            className={`rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                              colorScheme === 'level-method' ? 'hover:bg-gray-400' : ''
                            }`}
                            style={{ 
                              backgroundColor,
                              borderColor: colorScheme === 'level-method' ? '#9CA3AF' : markerColor + '30'
                            }}
                          >
                            <div className="p-3">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-3">
                                  {marker.name}
                                </h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`text-xs uppercase tracking-wide ${
                                    colorScheme === 'level-method' ? 'text-gray-600' : 'text-gray-500'
                                  }`}>Score:</span>
                                  <div 
                                    className="text-lg font-bold"
                                    style={{ color: markerColor }}
                                  >
                                    {marker.score !== null ? marker.score : '--'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className={`mt-2 text-xs ${
                                colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-600'
                              }`}>
                                <span className="font-medium">Your Value:</span>
                                <span className="ml-1 font-mono">
                                  {formatBiomarkerValue(marker.value)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

// Main App Component
export default function BiomarkerApp() {
  const [clientRows, setClientRows] = useState(null);
  const [error, setError] = useState(null);
  const [focusedSystem, setFocusedSystem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [colorScheme, setColorScheme] = useState('molecular-you');

  const clientMap = useMemo(() => {
    const map = new Map();
    if (clientRows) {
      for (const r of clientRows) {
        if (r.MEASURE_NAME) {
          map.set(r.MEASURE_NAME, r);
        }
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
            const score = clientRow ? parseIncomingScore(clientRow) : null;
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setError(null);
      const rows = await parseCsv(file);
      
      if (!rows.length) {
        throw new Error("CSV contained no data");
      }
      
      if (!rows[0].MEASURE_NAME) {
        throw new Error('CSV missing required column: "MEASURE_NAME"');
      }
      
      setClientRows(rows.filter(r => r.MEASURE_NAME));
    } catch (e) {
      setError(e.message || "Failed to parse CSV file");
    }
  };

  const handleSystemFocus = (systemName) => {
    if (focusedSystem === systemName) {
      setFocusedSystem(null);
      setExpandedGroups(new Set());
    } else {
      setFocusedSystem(systemName);
      const systemGroups = enrichedData.find(s => s.name === systemName)?.groups || [];
      if (systemGroups.length > 0) {
        setExpandedGroups(new Set([`${systemName}-${systemGroups[0].name}`]));
      }
    }
  };

  const handleGroupToggle = (systemName, groupName) => {
    const key = `${systemName}-${groupName}`;
    const newExpanded = new Set(expandedGroups);
    
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      if (!focusedSystem) {
        newExpanded.clear();
      }
      newExpanded.add(key);
    }
    
    setExpandedGroups(newExpanded);
  };

  const handleSubgroupClick = (subgroup, groupName, systemName) => {
    setSelectedSubgroup({ subgroup, group: groupName, system: systemName });
  };

  const getSummaryTagline = () => {
    const scores = enrichedData.map(s => s.score).filter(s => s !== null);
    if (scores.length === 0) return "Upload biomarker data to see your personalized fitness insights";
    
    const optimal = [];
    const needsSupport = [];
    const needsAttention = [];
    
    enrichedData.forEach(system => {
      if (system.score !== null) {
        const category = getScoreCategory(system.score);
        if (category === 'optimal') optimal.push(system.name);
        else if (category === 'needs-support') needsSupport.push(system.name);
        else if (category === 'needs-attention') needsAttention.push(system.name);
      }
    });
    
    // If all systems have the same status
    if (optimal.length === 3) return "All systems are optimal.";
    if (needsSupport.length === 3) return "All systems need support.";
    if (needsAttention.length === 3) return "All systems need attention.";
    
    // Build status message for mixed scenarios
    const parts = [];
    
    if (optimal.length > 0) {
      const systemText = optimal.length === 1 ? 'system is' : 'systems are';
      parts.push(`${optimal.join(' and ')} ${systemText} optimal`);
    }
    
    if (needsSupport.length > 0) {
      const systemText = needsSupport.length === 1 ? 'system needs' : 'systems need';
      parts.push(`${needsSupport.join(' and ')} ${systemText} support`);
    }
    
    if (needsAttention.length > 0) {
      const systemText = needsAttention.length === 1 ? 'system needs' : 'systems need';
      parts.push(`${needsAttention.join(' and ')} ${systemText} attention`);
    }
    
    return parts.join('. ') + '.';
  };

  return (
    <div className={`min-h-screen p-5 ${
      colorScheme === 'level-method' 
        ? 'bg-gradient-to-br from-gray-300 to-gray-400' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Fitness Biomarkers</h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-600'
          }`}>
            Science-backed insights to optimize your training, recovery, and performance
          </p>
        </div>

        <div className={`rounded-2xl p-6 mb-8 shadow-sm border ${
          colorScheme === 'level-method'
            ? 'bg-gray-200 border-gray-400'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Upload Your Data</h2>
              <p className={`text-sm ${
                colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-600'
              }`}>Upload a CSV file with biomarker data to get started</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border">
                <Palette className="w-4 h-4 text-blue-600" />
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                >
                  <option value="molecular-you">Molecular You</option>
                  <option value="level-method">Level Method</option>
                </select>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className={`rounded-2xl p-8 mb-8 shadow-sm border ${
          colorScheme === 'level-method'
            ? 'bg-gray-200 border-gray-400'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">System Overview</h2>
            <div className={`text-lg font-medium ${
              colorScheme === 'level-method' ? 'text-gray-700' : 'text-gray-600'
            }`}>
              {getSummaryTagline()}
            </div>
          </div>
          
          <div className="flex justify-center gap-12">
            {enrichedData.map((supergroup) => (
              <ScoreRing
                key={supergroup.name}
                score={supergroup.score}
                label={supergroup.name}
                onClick={() => handleSystemFocus(supergroup.name)}
                isActive={focusedSystem === supergroup.name}
                colorScheme={colorScheme}
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Health</h2>
            <div className="space-y-4">
              {enrichedData.find(s => s.name === 'Health')?.groups.map((group) => {
                const key = `Health-${group.name}`;
                const isExpanded = expandedGroups.has(key);
                
                return (
                  <GroupCard
                    key={key}
                    group={group}
                    system="Health"
                    isExpanded={isExpanded}
                    onToggle={() => handleGroupToggle('Health', group.name)}
                    onSubgroupClick={handleSubgroupClick}
                    colorScheme={colorScheme}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
            <div className="space-y-4">
              {enrichedData.find(s => s.name === 'Performance')?.groups.map((group) => {
                const key = `Performance-${group.name}`;
                const isExpanded = expandedGroups.has(key);
                
                return (
                  <GroupCard
                    key={key}
                    group={group}
                    system="Performance"
                    isExpanded={isExpanded}
                    onToggle={() => handleGroupToggle('Performance', group.name)}
                    onSubgroupClick={handleSubgroupClick}
                    colorScheme={colorScheme}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Recovery</h2>
            <div className="space-y-4">
              {enrichedData.find(s => s.name === 'Recovery')?.groups.map((group) => {
                const key = `Recovery-${group.name}`;
                const isExpanded = expandedGroups.has(key);
                
                return (
                  <GroupCard
                    key={key}
                    group={group}
                    system="Recovery"
                    isExpanded={isExpanded}
                    onToggle={() => handleGroupToggle('Recovery', group.name)}
                    onSubgroupClick={handleSubgroupClick}
                    colorScheme={colorScheme}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {selectedSubgroup && (
          <DetailPanel
            subgroup={selectedSubgroup.subgroup}
            group={selectedSubgroup.group}
            system={selectedSubgroup.system}
            onClose={() => setSelectedSubgroup(null)}
            clientData={clientMap}
            colorScheme={colorScheme}
          />
        )}
      </div>
    </div>
  );
}