import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Ver Dashboard',
      description: 'Revisar casos activos y estadísticas',
      icon: 'LayoutDashboard',
      action: () => navigate('/patient-dashboard'),
      variant: 'outline'
    },
    {
      title: 'Historial de Casos',
      description: 'Consultar registros anteriores',
      icon: 'FileText',
      action: () => navigate('/case-history'),
      variant: 'outline'
    },
    {
      title: 'Análisis IA',
      description: 'Ver resultados de análisis previos',
      icon: 'Brain',
      action: () => navigate('/ai-analysis-results'),
      variant: 'outline'
    }
  ];

  const emergencyContacts = [
    {
      service: 'Ambulancia',
      number: '112',
      icon: 'Truck',
      color: 'text-error'
    },
    {
      service: 'Bomberos',
      number: '080',
      icon: 'Flame',
      color: 'text-warning'
    },
    {
      service: 'Policía',
      number: '091',
      icon: 'Shield',
      color: 'text-accent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Zap" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        </div>

        <div className="grid gap-3">
          {quickActions?.map((action, index) => (
            <Button
              key={index}
              variant={action?.variant}
              onClick={action?.action}
              iconName={action?.icon}
              iconPosition="left"
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-medium">{action?.title}</div>
                <div className="text-xs opacity-75">{action?.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Emergency Contacts */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
            <Icon name="Phone" size={20} className="text-error" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Contactos de Emergencia</h3>
        </div>

        <div className="space-y-3">
          {emergencyContacts?.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center space-x-3">
                <Icon name={contact?.icon} size={18} className={contact?.color} />
                <span className="font-medium text-foreground">{contact?.service}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medical-data text-lg font-bold text-foreground">{contact?.number}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(`tel:${contact?.number}`, '_self')}
                >
                  <Icon name="Phone" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-warning">Simulación Educativa</div>
              <div className="text-muted-foreground">Estos números son para referencia. En emergencias reales, contacte los servicios locales.</div>
            </div>
          </div>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
            <Icon name="Activity" size={20} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Estado del Sistema</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Análisis IA</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success">Operativo</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base de Datos</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-success">Conectado</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Última actualización</span>
            <span className="text-sm font-medical-data text-muted-foreground">
              {new Date()?.toLocaleTimeString('es-ES')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;