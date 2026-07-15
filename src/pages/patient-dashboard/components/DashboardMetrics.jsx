import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total de Casos',
      value: metrics?.totalCases,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Casos Críticos',
      value: metrics?.criticalCases,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: '+3',
      changeType: 'negative'
    },
    {
      title: 'Casos Moderados',
      value: metrics?.moderateCases,
      icon: 'AlertCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '+8',
      changeType: 'neutral'
    },
    {
      title: 'Casos Leves',
      value: metrics?.lowCases,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+15',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 shadow-clinical hover:shadow-clinical-lg transition-clinical"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {metric?.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {metric?.value}
              </p>
              <div className="flex items-center mt-2">
                <span className={`
                  text-xs font-medium
                  ${metric?.changeType === 'positive' ? 'text-success' : 
                    metric?.changeType === 'negative'? 'text-error' : 'text-muted-foreground'}
                `}>
                  {metric?.change} desde ayer
                </span>
              </div>
            </div>
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-lg
              ${metric?.bgColor}
            `}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                className={metric?.color}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;