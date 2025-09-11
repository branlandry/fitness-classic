// @ts-nocheck
console.log("BUILD MARKER:", new Date().toISOString());
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Upload, Info } from 'lucide-react';
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

// Components
const ScoreBar = ({ score }) => {
  const band = scoreBandLabel(score);

  return (
    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden relative border border-gray-400">
      <div 
        className="h-5 w-full"   // always full width
        style={{ 
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
          CSV with columns: MEASURE_NAME, LAB_CONCENTRATION, COLOR, SCORE, UNDETECTED_STATUS
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
    let score = clientRow ? parseIncomingScore(clientRow) : null;
    let displayNote = "";
    
    // Add display note for undetected cases (normalize for comparison)
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
    
    return {
      name: markerName,
      color: clientRow?.COLOR || "",
      labConcentration: clientRow?.LAB_CONCENTRATION || "no data",
      score: score,
      displayNote: displayNote
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
            {/* Score hidden for product - {aggregatedScore !== null && (
              <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Score: {aggregatedScore}
              </span>
            )} */}
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
            <div className={`border rounded p-3`}>
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
                        {marker.labConcentration !== "no data" ? `Lab value: ${marker.labConcentration}${marker.displayNote}` : "No data available"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(statusLabel.text === "Borderline" || statusLabel.text === "Out of range") && (
                        <span>
                          ⚠️
                        </span>
                      )}
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        {statusLabel.text}
                      </span>
                      {/* Individual marker scores hidden for product - {marker.score !== null && (
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 font-mono">
                          {marker.score}
                        </span>
                      )} */}
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
                              className={`font-bold`}
                            >
                              ⚠️
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
              <li>• <strong>Assess patterns</strong> within each supergroup to identify primary focus areas.</li>
              <li>• <strong>Address foundational systems</strong> before pushing performance.</li>
              <li>• <strong>Use group patterns</strong> to guide periodization and training emphasis.</li>
              <li>• <strong>Remember:</strong> you're interpreting for fitness guidance, not medical diagnosis.</li>
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
                    {/* Score hidden for product - {clientRows && (
                      <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Score: {supergroupData.score !== null ? supergroupData.score : 'no data'}
                      </span>
                    )} */}
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
                              {/* Score hidden for product - {clientRows && (
                                <span className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Score: {groupData.score !== null ? groupData.score : 'no data'}
                                </span>
                              )} */}
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