import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineEntry = ({ entry, isLast = false }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'registro':
        return 'UserPlus';
      case 'analisis_ia':
        return 'Brain';
      case 'cambio_estado':
        return 'RefreshCw';
      case 'intervencion':
        return 'Stethoscope';
      case 'nota':
        return 'FileText';
      case 'exportacion':
        return 'Download';
      default:
        return 'Circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'registro':
        return 'text-success bg-success/10 border-success';
      case 'analisis_ia':
        return 'text-accent bg-accent/10 border-accent';
      case 'cambio_estado':
        return 'text-warning bg-warning/10 border-warning';
      case 'intervencion':
        return 'text-primary bg-primary/10 border-primary';
      case 'nota':
        return 'text-muted-foreground bg-muted border-border';
      case 'exportacion':
        return 'text-secondary bg-secondary/10 border-secondary';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getUrgencyBadge = (level) => {
    if (!level) return null;
    
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (level?.toLowerCase()) {
      case 'crítico':
        return `${baseClasses} bg-error/10 text-error`;
      case 'alto':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'moderado':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'bajo':
        return `${baseClasses} bg-success/10 text-success`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="relative flex items-start space-x-4 pb-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
      )}
      {/* Event Icon */}
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-full border-2 
        ${getEventColor(entry?.tipo)}
      `}>
        <Icon name={getEventIcon(entry?.tipo)} size={20} />
      </div>
      {/* Event Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-card border border-border rounded-lg p-4 shadow-clinical-sm">
          {/* Event Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-foreground">{entry?.titulo}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {entry?.timestamp}
                </span>
                {entry?.usuario && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {entry?.usuario}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {entry?.nivelUrgencia && (
              <span className={getUrgencyBadge(entry?.nivelUrgencia)}>
                {entry?.nivelUrgencia}
              </span>
            )}
          </div>

          {/* Event Description */}
          <p className="text-sm text-foreground mb-3">
            {entry?.descripcion}
          </p>

          {/* Event Details */}
          {entry?.detalles && (
            <div className="bg-muted rounded-md p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(entry?.detalles)?.map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key?.replace('_', ' ')}:
                    </span>
                    <span className="font-medical-data text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {entry?.acciones && entry?.acciones?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {entry?.acciones?.map((accion, index) => (
                <button
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-clinical"
                >
                  <Icon name={accion?.icono} size={12} />
                  <span>{accion?.texto}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEntry;