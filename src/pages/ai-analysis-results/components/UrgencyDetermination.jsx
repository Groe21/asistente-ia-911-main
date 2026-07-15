import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const UrgencyDetermination = ({ urgencyData }) => {
  const getUrgencyDetails = (level) => {
    switch (level?.toLowerCase()) {
      case 'crítico':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          icon: 'AlertTriangle',
          description: 'Requiere atención médica inmediata',
          timeframe: 'Menos de 5 minutos'
        };
      case 'alto':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: 'AlertCircle',
          description: 'Atención médica urgente necesaria',
          timeframe: '15-30 minutos'
        };
      case 'moderado':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          icon: 'Info',
          description: 'Evaluación médica recomendada',
          timeframe: '1-2 horas'
        };
      case 'bajo':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          icon: 'CheckCircle',
          description: 'Monitoreo y cuidados básicos',
          timeframe: '4-6 horas'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Circle',
          description: 'Evaluación pendiente',
          timeframe: 'No determinado'
        };
    }
  };

  const urgencyDetails = getUrgencyDetails(urgencyData?.level);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Target" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Determinación de Urgencia
        </h2>
      </div>
      {/* Main Urgency Display */}
      <div className={`
        p-6 rounded-lg border-2 mb-6
        ${urgencyDetails?.bgColor} ${urgencyDetails?.borderColor}
      `}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`
              flex items-center justify-center w-16 h-16 rounded-full border-2
              ${urgencyDetails?.bgColor} ${urgencyDetails?.borderColor}
            `}>
              <Icon name={urgencyDetails?.icon} size={32} className={urgencyDetails?.color} />
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`text-2xl font-bold ${urgencyDetails?.color}`}>
                  {urgencyData?.level}
                </h3>
                <StatusIndicator 
                  status={urgencyData?.level?.toLowerCase() || 'normal'}
                  size="lg"
                />
              </div>
              <p className="text-foreground font-medium">
                {urgencyDetails?.description}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Tiempo de respuesta recomendado: {urgencyDetails?.timeframe}
              </p>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="text-center lg:text-right">
            <div className={`text-4xl font-bold ${urgencyDetails?.color}`}>
              {urgencyData?.confidence}%
            </div>
            <div className="text-sm text-muted-foreground">
              Confianza del Análisis
            </div>
          </div>
        </div>
      </div>
      {/* Decision Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="TrendingUp" size={18} className="text-primary" />
            <span>Factores de Escalamiento</span>
          </h4>
          <div className="space-y-2">
            {urgencyData?.escalatingFactors?.map((factor, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="ArrowUp" size={16} className="text-error mt-0.5" />
                <span className="text-sm text-foreground">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="TrendingDown" size={18} className="text-success" />
            <span>Factores Mitigantes</span>
          </h4>
          <div className="space-y-2">
            {urgencyData?.mitigatingFactors?.map((factor, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="ArrowDown" size={16} className="text-success mt-0.5" />
                <span className="text-sm text-foreground">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AI Reasoning */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Brain" size={18} className="text-primary" />
          <span>Razonamiento del Sistema IA</span>
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {urgencyData?.reasoning}
        </p>
      </div>
      {/* Alternative Considerations */}
      {urgencyData?.alternatives && urgencyData?.alternatives?.length > 0 && (
        <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
            <Icon name="GitBranch" size={18} className="text-accent" />
            <span>Consideraciones Alternativas</span>
          </h4>
          <div className="space-y-2">
            {urgencyData?.alternatives?.map((alt, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="ArrowRight" size={16} className="text-accent mt-0.5" />
                <span className="text-sm text-foreground">{alt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrgencyDetermination;