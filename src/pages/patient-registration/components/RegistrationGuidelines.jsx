import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationGuidelines = () => {
  const guidelines = [
    {
      icon: 'FileText',
      title: 'Información Precisa',
      description: 'Complete todos los campos requeridos con información exacta del paciente'
    },
    {
      icon: 'Clock',
      title: 'Registro Rápido',
      description: 'El sistema está optimizado para registro rápido durante emergencias simuladas'
    },
    {
      icon: 'Brain',
      title: 'Análisis IA',
      description: 'La IA analizará automáticamente los síntomas para determinar el nivel de urgencia'
    },
    {
      icon: 'AlertTriangle',
      title: 'Clasificación de Urgencia',
      description: 'Recibirá una clasificación automática: Crítico, Alto, Moderado o Bajo'
    }
  ];

  const tips = [
    'Sea específico al describir los síntomas observados',
    'Incluya información sobre el estado de conciencia',
    'Mencione cualquier lesión visible o sangrado',
    'Indique si hay dificultades respiratorias',
    'Describa el nivel de dolor reportado por el paciente'
  ];

  return (
    <div className="space-y-6">
      {/* Guidelines Card */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
            <Icon name="Info" size={20} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Guía de Registro</h3>
        </div>

        <div className="grid gap-4">
          {guidelines?.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full mt-0.5">
                <Icon name={guideline?.icon} size={16} className="text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{guideline?.title}</h4>
                <p className="text-sm text-muted-foreground">{guideline?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tips Card */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
            <Icon name="Lightbulb" size={20} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Consejos para Síntomas</h3>
        </div>

        <ul className="space-y-2">
          {tips?.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Emergency Protocols */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
            <Icon name="Shield" size={20} className="text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Protocolos de Emergencia</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="font-medium text-error">Crítico:</span>
              <span className="text-muted-foreground ml-1">Paro cardíaco, trauma severo, hemorragia masiva</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="font-medium text-warning">Alto:</span>
              <span className="text-muted-foreground ml-1">Dificultad respiratoria severa, dolor torácico</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="font-medium text-accent">Moderado:</span>
              <span className="text-muted-foreground ml-1">Fracturas, dolor abdominal, fiebre alta</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="font-medium text-success">Bajo:</span>
              <span className="text-muted-foreground ml-1">Heridas menores, síntomas leves</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationGuidelines;