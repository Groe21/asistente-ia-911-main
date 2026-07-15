import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const AnalysisHeader = ({ patientData, analysisData }) => {
  const getUrgencyIcon = (level) => {
    switch (level?.toLowerCase()) {
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
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Patient Information */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
            <Icon name="Brain" size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Análisis IA Completado
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-muted-foreground">Paciente:</span>
              <span className="font-medium text-foreground">{patientData?.name}</span>
              <span className="font-medical-data text-muted-foreground">
                ID: {patientData?.id}
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Procesado el</div>
            <div className="font-medical-data text-foreground">
              {analysisData?.processedAt}
            </div>
          </div>
          
          <StatusIndicator 
            status={analysisData?.urgencyLevel?.toLowerCase() || 'normal'}
            label={analysisData?.urgencyLevel}
            size="lg"
          />
        </div>
      </div>
      {/* Analysis Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {analysisData?.confidenceScore}%
            </div>
            <div className="text-sm text-muted-foreground">Confianza del Análisis</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {analysisData?.symptomsProcessed}
            </div>
            <div className="text-sm text-muted-foreground">Síntomas Procesados</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {analysisData?.riskFactors}
            </div>
            <div className="text-sm text-muted-foreground">Factores de Riesgo</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;