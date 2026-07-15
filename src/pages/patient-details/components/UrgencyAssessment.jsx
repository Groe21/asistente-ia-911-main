import React from 'react';
import Icon from '../../../components/AppIcon';

const UrgencyAssessment = ({ urgencyData }) => {
  const getUrgencyConfig = (level) => {
    switch (level?.toLowerCase()) {
      case 'crítico':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          icon: 'AlertTriangle',
          animate: true
        };
      case 'alto':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: 'AlertCircle',
          animate: false
        };
      case 'moderado':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          icon: 'Info',
          animate: false
        };
      case 'bajo':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          icon: 'CheckCircle',
          animate: false
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Circle',
          animate: false
        };
    }
  };

  const config = getUrgencyConfig(urgencyData?.level);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${config?.bgColor}`}>
          <Icon name={config?.icon} size={24} className={config?.color} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Evaluación de Urgencia</h2>
          <p className="text-sm text-muted-foreground">Nivel asignado y acciones recomendadas</p>
        </div>
      </div>
      {/* Urgency Level Display */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${config?.bgColor} ${config?.borderColor} ${config?.animate ? 'animate-medical-pulse' : ''}`}>
        <div className="text-center">
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${config?.bgColor} ${config?.borderColor} border`}>
            <Icon name={config?.icon} size={32} className={config?.color} />
            <span className={`text-2xl font-bold ${config?.color}`}>{urgencyData?.level?.toUpperCase()}</span>
          </div>
          <p className={`mt-3 text-lg font-medium ${config?.color}`}>
            Puntuación: {urgencyData?.score}/100
          </p>
        </div>
      </div>
      {/* Recommended Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="CheckSquare" size={20} />
          <span>Acciones Recomendadas</span>
        </h3>
        
        <div className="space-y-3">
          {urgencyData?.recommendedActions?.map((action, index) => (
            <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg border ${
              action?.priority === 'Inmediata' ? 'bg-error/5 border-error/20' :
              action?.priority === 'Urgente' ? 'bg-warning/5 border-warning/20' :
              action?.priority === 'Moderada'? 'bg-accent/5 border-accent/20' : 'bg-success/5 border-success/20'
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                action?.priority === 'Inmediata' ? 'bg-error text-error-foreground' :
                action?.priority === 'Urgente' ? 'bg-warning text-warning-foreground' :
                action?.priority === 'Moderada' ? 'bg-accent text-accent-foreground' :
                'bg-success text-success-foreground'
              }`}>
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{action?.action}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action?.priority === 'Inmediata' ? 'bg-error/10 text-error' :
                    action?.priority === 'Urgente' ? 'bg-warning/10 text-warning' :
                    action?.priority === 'Moderada'? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
                  }`}>
                    {action?.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
                {action?.timeframe && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Tiempo estimado: {action?.timeframe}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Additional Considerations */}
      {urgencyData?.considerations && urgencyData?.considerations?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} />
            <span>Consideraciones Adicionales</span>
          </h3>
          <div className="space-y-2">
            {urgencyData?.considerations?.map((consideration, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="ArrowRight" size={16} className="text-muted-foreground mt-0.5" />
                <p className="text-sm text-foreground">{consideration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrgencyAssessment;