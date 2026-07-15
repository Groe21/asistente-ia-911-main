import React from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ 
  status = 'normal', 
  label = '', 
  count = 0, 
  showCount = false,
  size = 'default',
  className = ""
}) => {
  const statusConfig = {
    critical: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error',
      icon: 'AlertTriangle',
      label: 'Crítico',
      animate: true
    },
    high: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
      icon: 'AlertCircle',
      label: 'Alto',
      animate: false
    },
    moderate: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent',
      icon: 'Info',
      label: 'Moderado',
      animate: false
    },
    low: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      icon: 'CheckCircle',
      label: 'Bajo',
      animate: false
    },
    normal: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      icon: 'Circle',
      label: 'Normal',
      animate: false
    },
    offline: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      icon: 'WifiOff',
      label: 'Desconectado',
      animate: false
    },
    online: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      icon: 'Wifi',
      label: 'Conectado',
      animate: false
    }
  };

  const config = statusConfig?.[status] || statusConfig?.normal;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    default: 16,
    lg: 20
  };

  return (
    <div 
      className={`
        inline-flex items-center space-x-2 rounded-full border font-medium transition-clinical
        ${config?.bgColor} ${config?.borderColor} ${config?.color}
        ${sizeClasses?.[size]}
        ${config?.animate ? 'animate-medical-pulse' : ''}
        ${className}
      `}
      title={`Estado: ${label || config?.label}${showCount ? ` (${count})` : ''}`}
    >
      <Icon 
        name={config?.icon} 
        size={iconSizes?.[size]} 
        className={config?.animate ? 'animate-pulse' : ''} 
      />
      <span>{label || config?.label}</span>
      {showCount && count > 0 && (
        <span className={`
          inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 
          text-xs font-medium rounded-full
          ${config?.color === 'text-error' ? 'bg-error text-error-foreground' : 
            config?.color === 'text-warning' ? 'bg-warning text-warning-foreground' :
            config?.color === 'text-accent' ? 'bg-accent text-accent-foreground' :
            config?.color === 'text-success' ? 'bg-success text-success-foreground' :
            'bg-muted-foreground text-background'
          }
        `}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

// System Status Component for Navigation Bar
export const SystemStatusIndicator = ({ 
  systemStatus = 'online',
  criticalCases = 0,
  activeCases = 0,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* System Status */}
      <StatusIndicator 
        status={systemStatus} 
        size="sm"
      />
      
      {/* Critical Cases Alert */}
      {criticalCases > 0 && (
        <StatusIndicator 
          status="critical" 
          label="Críticos"
          count={criticalCases}
          showCount={true}
          size="sm"
        />
      )}
      
      {/* Active Cases Counter */}
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Icon name="Users" size={14} />
        <span className="font-medical-data">{activeCases}</span>
        <span className="hidden sm:inline">casos activos</span>
      </div>
    </div>
  );
};

export default StatusIndicator;