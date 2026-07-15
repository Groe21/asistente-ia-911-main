import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SymptomAnalysis = ({ symptomsData }) => {
  const [expandedSymptom, setExpandedSymptom] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'crítico':
        return 'text-error bg-error/10 border-error';
      case 'alto':
        return 'text-warning bg-warning/10 border-warning';
      case 'moderado':
        return 'text-accent bg-accent/10 border-accent';
      case 'bajo':
        return 'text-success bg-success/10 border-success';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'crítico':
        return 'AlertTriangle';
      case 'alto':
        return 'AlertCircle';
      case 'moderado':
        return 'Info';
      case 'bajo':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Search" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Análisis de Síntomas
        </h2>
      </div>
      {/* Original Symptoms Input */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Síntomas Reportados:</h3>
        <p className="text-foreground leading-relaxed">
          {symptomsData?.originalInput}
        </p>
      </div>
      {/* Processed Symptoms */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground mb-4">Síntomas Identificados por IA:</h3>
        
        {symptomsData?.processedSymptoms?.map((symptom, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-clinical"
              onClick={() => setExpandedSymptom(expandedSymptom === index ? null : index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border
                  ${getSeverityColor(symptom?.severity)}
                `}>
                  <Icon name={getSeverityIcon(symptom?.severity)} size={16} />
                </div>
                
                <div>
                  <div className="font-medium text-foreground">{symptom?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Severidad: {symptom?.severity} • Confianza: {symptom?.confidence}%
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${getSeverityColor(symptom?.severity)}
                `}>
                  {symptom?.category}
                </span>
                
                <Icon 
                  name={expandedSymptom === index ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-muted-foreground" 
                />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSymptom === index && (
              <div className="px-4 pb-4 border-t border-border bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Descripción:</h4>
                    <p className="text-sm text-muted-foreground">
                      {symptom?.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Palabras Clave Detectadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {symptom?.keywords?.map((keyword, keyIndex) => (
                        <span 
                          key={keyIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medical-data"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {symptom?.relatedConditions && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Condiciones Relacionadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {symptom?.relatedConditions?.map((condition, condIndex) => (
                        <span 
                          key={condIndex}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* AI Processing Notes */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Notas del Procesamiento IA:</h4>
            <p className="text-sm text-muted-foreground">
              {symptomsData?.processingNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalysis;