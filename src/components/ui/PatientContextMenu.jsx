import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PatientContextMenu = ({ 
  patientData = null, 
  onStatusUpdate = () => {}, 
  onAddNote = () => {},
  onViewHistory = () => {},
  className = ""
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const contextActions = [
    {
      label: 'Actualizar Estado',
      icon: 'RefreshCw',
      action: () => {
        onStatusUpdate(patientData?.id);
        setIsMenuOpen(false);
      },
      description: 'Cambiar estado de urgencia'
    },
    {
      label: 'Agregar Nota',
      icon: 'FileText',
      action: () => {
        onAddNote(patientData?.id);
        setIsMenuOpen(false);
      },
      description: 'Añadir observación médica'
    },
    {
      label: 'Ver Historial',
      icon: 'Clock',
      action: () => {
        onViewHistory(patientData?.id);
        setIsMenuOpen(false);
      },
      description: 'Revisar casos anteriores'
    },
    {
      label: 'Análisis IA',
      icon: 'Brain',
      action: () => {
        navigate('/ai-analysis-results', { 
          state: { patientId: patientData?.id } 
        });
        setIsMenuOpen(false);
      },
      description: 'Ejecutar análisis inteligente'
    }
  ];

  const getUrgencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'crítico':
        return 'text-error';
      case 'alto':
        return 'text-warning';
      case 'moderado':
        return 'text-accent';
      case 'bajo':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getUrgencyBadge = (level) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (level?.toLowerCase()) {
      case 'crítico':
        return `${baseClasses} bg-error/10 text-error animate-medical-pulse`;
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
    <div className={`bg-card border border-border rounded-lg p-4 shadow-clinical ${className}`}>
      {/* Patient Info Header */}
      {patientData && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
              <Icon name="User" size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {patientData?.name || 'Paciente Sin Nombre'}
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medical-data text-muted-foreground">
                  ID: {patientData?.id || 'N/A'}
                </span>
                {patientData?.urgencyLevel && (
                  <span className={getUrgencyBadge(patientData?.urgencyLevel)}>
                    {patientData?.urgencyLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Context Menu Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8"
            >
              <Icon name="MoreVertical" size={16} />
            </Button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-clinical-lg z-1050">
                <div className="py-2">
                  {contextActions?.map((action, index) => (
                    <button
                      key={index}
                      onClick={action?.action}
                      className="flex items-start space-x-3 w-full px-4 py-3 text-left hover:bg-muted transition-clinical"
                    >
                      <Icon name={action?.icon} size={16} className="mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-popover-foreground">
                          {action?.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {action?.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/patient-dashboard')}
          iconName="ArrowLeft"
          iconPosition="left"
          className="justify-start"
        >
          Volver
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={() => onStatusUpdate(patientData?.id)}
          iconName="RefreshCw"
          iconPosition="left"
          className="justify-start"
        >
          Actualizar
        </Button>
      </div>
      {/* Patient Status Summary */}
      {patientData && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Última actualización:</span>
              <div className="font-medical-data text-foreground">
                {patientData?.lastUpdate || new Date()?.toLocaleTimeString('es-ES')}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <div className={`font-medium ${getUrgencyColor(patientData?.urgencyLevel)}`}>
                {patientData?.status || 'En evaluación'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientContextMenu;