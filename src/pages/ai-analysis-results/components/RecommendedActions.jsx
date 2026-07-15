import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendedActions = ({ actionsData, onActionSelect }) => {
  const [selectedActions, setSelectedActions] = useState([]);
  const [expandedAction, setExpandedAction] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'inmediata':
        return 'text-error bg-error/10 border-error';
      case 'urgente':
        return 'text-warning bg-warning/10 border-warning';
      case 'prioritaria':
        return 'text-accent bg-accent/10 border-accent';
      case 'rutinaria':
        return 'text-success bg-success/10 border-success';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'inmediata':
        return 'Zap';
      case 'urgente':
        return 'Clock';
      case 'prioritaria':
        return 'Flag';
      case 'rutinaria':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const handleActionToggle = (actionId) => {
    setSelectedActions(prev => 
      prev?.includes(actionId) 
        ? prev?.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleApplyActions = () => {
    if (onActionSelect) {
      onActionSelect(selectedActions);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Acciones Recomendadas
          </h2>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {selectedActions?.length} de {actionsData?.actions?.length} seleccionadas
        </div>
      </div>
      {/* Protocol Summary */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="FileText" size={20} className="text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-2">
              Protocolo: {actionsData?.protocol}
            </h3>
            <p className="text-sm text-muted-foreground">
              {actionsData?.protocolDescription}
            </p>
          </div>
        </div>
      </div>
      {/* Actions List */}
      <div className="space-y-4 mb-6">
        {actionsData?.actions?.map((action, index) => (
          <div key={action?.id} className="border border-border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Action Checkbox */}
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      id={`action-${action?.id}`}
                      checked={selectedActions?.includes(action?.id)}
                      onChange={() => handleActionToggle(action?.id)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </div>

                  {/* Action Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full border
                        ${getPriorityColor(action?.priority)}
                      `}>
                        <Icon name={getPriorityIcon(action?.priority)} size={16} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground">{action?.title}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${getPriorityColor(action?.priority)}
                          `}>
                            {action?.priority}
                          </span>
                          <span className="text-muted-foreground">
                            {action?.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {action?.description}
                    </p>

                    {/* Action Steps Preview */}
                    <div className="flex items-center space-x-2">
                      <Icon name="List" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {action?.steps?.length} pasos • {action?.category}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedAction(expandedAction === index ? null : index)}
                        iconName={expandedAction === index ? "ChevronUp" : "ChevronDown"}
                        iconPosition="right"
                      >
                        {expandedAction === index ? 'Ocultar' : 'Ver detalles'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Action Details */}
              {expandedAction === index && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h5 className="font-medium text-foreground mb-3">Pasos a seguir:</h5>
                  <div className="space-y-3">
                    {action?.steps?.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{step?.instruction}</p>
                          {step?.note && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Nota: {step?.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resources */}
                  {action?.resources && action?.resources?.length > 0 && (
                    <div className="mt-4">
                      <h6 className="font-medium text-foreground mb-2">Recursos necesarios:</h6>
                      <div className="flex flex-wrap gap-2">
                        {action?.resources?.map((resource, resIndex) => (
                          <span 
                            key={resIndex}
                            className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          onClick={handleApplyActions}
          disabled={selectedActions?.length === 0}
          iconName="Check"
          iconPosition="left"
          className="flex-1"
        >
          Aplicar Acciones Seleccionadas ({selectedActions?.length})
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setSelectedActions(actionsData?.actions?.map(a => a?.id))}
          iconName="CheckSquare"
          iconPosition="left"
        >
          Seleccionar Todas
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setSelectedActions([])}
          iconName="Square"
          iconPosition="left"
        >
          Limpiar
        </Button>
      </div>
      {/* Emergency Contact Info */}
      <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Phone" size={20} className="text-error mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Contacto de Emergencia</h4>
            <p className="text-sm text-muted-foreground mb-2">
              En caso de deterioro del paciente o situación crítica:
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">Emergencias:</span>
                <span className="font-medical-data text-error">112</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">Centro de Control:</span>
                <span className="font-medical-data text-foreground">+34 900 123 456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedActions;