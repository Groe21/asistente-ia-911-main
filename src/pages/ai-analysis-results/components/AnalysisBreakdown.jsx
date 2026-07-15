import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AnalysisBreakdown = ({ breakdownData }) => {
  const [activeTab, setActiveTab] = useState('categorization');

  const tabs = [
    {
      id: 'categorization',
      label: 'Categorización',
      icon: 'Grid3X3'
    },
    {
      id: 'riskFactors',
      label: 'Factores de Riesgo',
      icon: 'AlertTriangle'
    },
    {
      id: 'complications',
      label: 'Complicaciones',
      icon: 'TrendingUp'
    },
    {
      id: 'differential',
      label: 'Diagnóstico Diferencial',
      icon: 'GitBranch'
    }
  ];

  const getRiskLevel = (level) => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return 'text-error bg-error/10 border-error';
      case 'medio':
        return 'text-warning bg-warning/10 border-warning';
      case 'bajo':
        return 'text-success bg-success/10 border-success';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'text-error';
    if (probability >= 40) return 'text-warning';
    if (probability >= 20) return 'text-accent';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="BarChart3" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Desglose del Análisis
        </h2>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-clinical
              ${activeTab === tab?.id
                ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Categorization Tab */}
        {activeTab === 'categorization' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Categorías de Síntomas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {breakdownData?.categorization?.map((category, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{category?.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {category?.symptoms?.length} síntomas
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {category?.symptoms?.map((symptom, symIndex) => (
                        <div key={symIndex} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{symptom?.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`
                              w-2 h-2 rounded-full
                              ${getRiskLevel(symptom?.severity)?.split(' ')?.[0]}
                            `}></div>
                            <span className="text-xs text-muted-foreground">
                              {symptom?.weight}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Resumen de Categorización</h4>
              <p className="text-sm text-muted-foreground">
                {breakdownData?.categorizationSummary}
              </p>
            </div>
          </div>
        )}

        {/* Risk Factors Tab */}
        {activeTab === 'riskFactors' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Factores de Riesgo Identificados</h3>
              <div className="space-y-4">
                {breakdownData?.riskFactors?.map((factor, index) => (
                  <div key={index} className={`
                    p-4 border rounded-lg
                    ${getRiskLevel(factor?.level)}
                  `}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{factor?.name}</h4>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getRiskLevel(factor?.level)}
                      `}>
                        {factor?.level}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {factor?.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-medium text-foreground mb-2">Impacto:</h5>
                        <p className="text-xs text-muted-foreground">{factor?.impact}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-foreground mb-2">Mitigación:</h5>
                        <p className="text-xs text-muted-foreground">{factor?.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Complications Tab */}
        {activeTab === 'complications' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Complicaciones Potenciales</h3>
              <div className="space-y-4">
                {breakdownData?.complications?.map((complication, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{complication?.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">Probabilidad:</span>
                          <span className={`
                            text-xs font-medium
                            ${getProbabilityColor(complication?.probability)}
                          `}>
                            {complication?.probability}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Tiempo estimado</div>
                        <div className="text-sm font-medium text-foreground">
                          {complication?.timeframe}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {complication?.description}
                    </p>
                    
                    <div>
                      <h5 className="text-xs font-medium text-foreground mb-2">Signos de alerta:</h5>
                      <div className="flex flex-wrap gap-2">
                        {complication?.warningSigns?.map((sign, signIndex) => (
                          <span 
                            key={signIndex}
                            className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-md"
                          >
                            {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Differential Diagnosis Tab */}
        {activeTab === 'differential' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Diagnósticos Diferenciales</h3>
              <div className="space-y-4">
                {breakdownData?.differentialDiagnosis?.map((diagnosis, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{diagnosis?.condition}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">Probabilidad:</span>
                          <span className={`
                            text-xs font-medium
                            ${getProbabilityColor(diagnosis?.probability)}
                          `}>
                            {diagnosis?.probability}%
                          </span>
                        </div>
                      </div>
                      
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${diagnosis?.priority === 'Alta' ? 'bg-error/10 text-error' :
                          diagnosis?.priority === 'Media'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }
                      `}>
                        {diagnosis?.priority}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {diagnosis?.reasoning}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-medium text-foreground mb-2">Síntomas compatibles:</h5>
                        <div className="space-y-1">
                          {diagnosis?.supportingSymptoms?.map((symptom, symIndex) => (
                            <div key={symIndex} className="flex items-center space-x-2">
                              <Icon name="Check" size={12} className="text-success" />
                              <span className="text-xs text-foreground">{symptom}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-medium text-foreground mb-2">Pruebas sugeridas:</h5>
                        <div className="space-y-1">
                          {diagnosis?.suggestedTests?.map((test, testIndex) => (
                            <div key={testIndex} className="flex items-center space-x-2">
                              <Icon name="FileText" size={12} className="text-accent" />
                              <span className="text-xs text-foreground">{test}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisBreakdown;