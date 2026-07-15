import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSummary = ({ stats }) => {
  const summaryCards = [
    {
      title: 'Total de Casos',
      value: stats?.totalCasos,
      icon: 'Users',
      color: 'text-primary bg-primary/10 border-primary',
      description: 'Pacientes registrados'
    },
    {
      title: 'Análisis IA Completados',
      value: stats?.analisisCompletados,
      icon: 'Brain',
      color: 'text-accent bg-accent/10 border-accent',
      description: 'Evaluaciones automáticas'
    },
    {
      title: 'Casos Críticos',
      value: stats?.casosCriticos,
      icon: 'AlertTriangle',
      color: 'text-error bg-error/10 border-error',
      description: 'Requieren atención inmediata'
    },
    {
      title: 'Intervenciones Médicas',
      value: stats?.intervencionesMedicas,
      icon: 'Stethoscope',
      color: 'text-success bg-success/10 border-success',
      description: 'Acciones realizadas'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {summaryCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 shadow-clinical-sm hover:shadow-clinical transition-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-lg border-2
              ${card?.color}
            `}>
              <Icon name={card?.icon} size={24} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {card?.value?.toLocaleString('es-ES')}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-1">
              {card?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {card?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;