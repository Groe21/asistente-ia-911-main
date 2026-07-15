import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onRefresh, lastUpdate }) => {
  const navigate = useNavigate();

  const quickActionButtons = [
    {
      label: 'Registrar Paciente',
      icon: 'UserPlus',
      variant: 'default',
      action: () => navigate('/patient-registration'),
      description: 'Agregar nuevo caso de emergencia'
    },
    {
      label: 'Análisis IA',
      icon: 'Brain',
      variant: 'outline',
      action: () => navigate('/ai-analysis-results'),
      description: 'Ver resultados de análisis inteligente'
    },
    {
      label: 'Historial',
      icon: 'FileText',
      variant: 'outline',
      action: () => navigate('/case-history'),
      description: 'Revisar casos anteriores'
    },
    {
      label: 'Actualizar',
      icon: 'RefreshCw',
      variant: 'ghost',
      action: onRefresh,
      description: 'Refrescar datos del dashboard'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-clinical mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActionButtons?.map((button, index) => (
            <Button
              key={index}
              variant={button?.variant}
              onClick={button?.action}
              iconName={button?.icon}
              iconPosition="left"
              className="flex-shrink-0"
              title={button?.description}
            >
              {button?.label}
            </Button>
          ))}
        </div>

        {/* Last Update Info */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Última actualización:</span>
          <span className="font-medical-data text-foreground">
            {lastUpdate ? new Date(lastUpdate)?.toLocaleTimeString('es-ES') : 'Nunca'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;