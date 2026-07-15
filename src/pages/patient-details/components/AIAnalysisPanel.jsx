import React from 'react';
import Icon from '../../../components/AppIcon';

const AIAnalysisPanel = ({ analysis }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success bg-success/10';
    if (confidence >= 70) return 'text-accent bg-accent/10';
    if (confidence >= 50) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 90) return 'CheckCircle';
    if (confidence >= 70) return 'Info';
    if (confidence >= 50) return 'AlertCircle';
    return 'AlertTriangle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Brain" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Análisis de IA</h2>
          <p className="text-sm text-muted-foreground">Clasificación automática de síntomas</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Primary Classification */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Clasificación Principal</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getConfidenceColor(analysis?.primaryClassification?.confidence)}`}>
              <Icon name={getConfidenceIcon(analysis?.primaryClassification?.confidence)} size={14} />
              <span className="text-sm font-medium">{analysis?.primaryClassification?.confidence}%</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">{analysis?.primaryClassification?.condition}</p>
          <p className="text-muted-foreground text-sm">{analysis?.primaryClassification?.description}</p>
        </div>

        {/* Secondary Classifications */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Clasificaciones Secundarias</h3>
          <div className="space-y-3">
            {analysis?.secondaryClassifications?.map((classification, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{classification?.condition}</p>
                  <p className="text-sm text-muted-foreground">{classification?.description}</p>
                </div>
                <div className={`flex items-center space-x-2 px-2 py-1 rounded-full ${getConfidenceColor(classification?.confidence)}`}>
                  <Icon name={getConfidenceIcon(classification?.confidence)} size={12} />
                  <span className="text-xs font-medium">{classification?.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Factores de Riesgo Identificados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis?.riskFactors?.map((factor, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <div>
                  <p className="font-medium text-foreground">{factor?.factor}</p>
                  <p className="text-xs text-muted-foreground">Nivel: {factor?.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Reasoning */}
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="MessageSquare" size={16} />
            <span>Razonamiento del Análisis</span>
          </h3>
          <p className="text-foreground leading-relaxed">{analysis?.reasoning}</p>
        </div>

        {/* Processing Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Procesado: {analysis?.processedAt}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Cpu" size={14} />
            <span>Modelo: {analysis?.modelVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;