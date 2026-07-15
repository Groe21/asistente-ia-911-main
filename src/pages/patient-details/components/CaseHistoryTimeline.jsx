import React from 'react';
import Icon from '../../../components/AppIcon';

const CaseHistoryTimeline = ({ timeline }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'registro':
        return 'UserPlus';
      case 'análisis':
        return 'Brain';
      case 'actualización':
        return 'RefreshCw';
      case 'nota':
        return 'FileText';
      case 'acción':
        return 'Activity';
      default:
        return 'Circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'registro':
        return 'text-success bg-success/10 border-success';
      case 'análisis':
        return 'text-primary bg-primary/10 border-primary';
      case 'actualización':
        return 'text-accent bg-accent/10 border-accent';
      case 'nota':
        return 'text-warning bg-warning/10 border-warning';
      case 'acción':
        return 'text-error bg-error/10 border-error';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
          <Icon name="Clock" size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Historial del Caso</h2>
          <p className="text-sm text-muted-foreground">Cronología de eventos y actualizaciones</p>
        </div>
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {timeline?.map((event, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getEventColor(event?.type)}`}>
                <Icon name={getEventIcon(event?.type)} size={20} />
              </div>
              
              {/* Event Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-foreground">{event?.title}</h3>
                  <span className="text-sm text-muted-foreground font-medical-data">
                    {formatTime(event?.timestamp)}
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-3">{event?.description}</p>
                
                {/* Event Details */}
                {event?.details && (
                  <div className="bg-muted rounded-lg p-3">
                    {event?.details?.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2 mb-2 last:mb-0">
                        <Icon name="ArrowRight" size={14} className="text-muted-foreground mt-0.5" />
                        <span className="text-sm text-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* User Info */}
                {event?.user && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Icon name="User" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Por: {event?.user}</span>
                    {event?.role && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{event?.role}</span>
                      </>
                    )}
                  </div>
                )}
                
                {/* Status Change */}
                {event?.statusChange && (
                  <div className="flex items-center space-x-2 mt-3 p-2 bg-accent/5 border border-accent/20 rounded">
                    <Icon name="ArrowRight" size={14} className="text-accent" />
                    <span className="text-sm text-foreground">
                      Estado cambió de <span className="font-medium">{event?.statusChange?.from}</span> a{' '}
                      <span className="font-medium">{event?.statusChange?.to}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Timeline Footer */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} />
            <span>Caso iniciado: {formatTime(timeline?.[timeline?.length - 1]?.timestamp)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={14} />
            <span>{timeline?.length} eventos registrados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseHistoryTimeline;