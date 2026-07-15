import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const InteractiveActions = ({ patientId, currentStatus, onStatusUpdate, onAddNote }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('observación');
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'crítico', label: 'Crítico' },
    { value: 'alto', label: 'Alto' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'bajo', label: 'Bajo' }
  ];

  const noteTypeOptions = [
    { value: 'observación', label: 'Observación Médica' },
    { value: 'tratamiento', label: 'Tratamiento Aplicado' },
    { value: 'evolución', label: 'Evolución del Paciente' },
    { value: 'educativa', label: 'Nota Educativa' }
  ];

  const handleStatusUpdate = () => {
    if (newStatus) {
      onStatusUpdate(patientId, newStatus);
      setIsUpdatingStatus(false);
      setNewStatus('');
    }
  };

  const handleAddNote = () => {
    if (newNote?.trim()) {
      onAddNote(patientId, {
        type: noteType,
        content: newNote,
        timestamp: new Date()?.toISOString(),
        author: 'Dr. Instructor'
      });
      setIsAddingNote(false);
      setNewNote('');
      setNoteType('observación');
    }
  };

  const handlePrintCase = () => {
    window.print();
  };

  const handleExportCase = () => {
    // Mock export functionality
    const exportData = {
      patientId,
      exportedAt: new Date()?.toISOString(),
      format: 'PDF'
    };
    console.log('Exporting case:', exportData);
    // In a real application, this would trigger a download
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Settings" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Acciones Interactivas</h2>
          <p className="text-sm text-muted-foreground">Herramientas para gestión del caso</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/patient-dashboard')}
            iconName="ArrowLeft"
            iconPosition="left"
            className="justify-start"
          >
            Volver al Panel
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/ai-analysis-results', { state: { patientId } })}
            iconName="Brain"
            iconPosition="left"
            className="justify-start"
          >
            Ver Análisis IA
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrintCase}
            iconName="Printer"
            iconPosition="left"
            className="justify-start"
          >
            Imprimir Caso
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportCase}
            iconName="Download"
            iconPosition="left"
            className="justify-start"
          >
            Exportar PDF
          </Button>
        </div>

        {/* Status Update Section */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Actualizar Estado de Urgencia</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
              iconName={isUpdatingStatus ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isUpdatingStatus ? 'Cancelar' : 'Modificar'}
            </Button>
          </div>
          
          {isUpdatingStatus && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Info" size={14} />
                <span>Estado actual: <span className="font-medium">{currentStatus}</span></span>
              </div>
              
              <Select
                label="Nuevo Estado de Urgencia"
                options={statusOptions}
                value={newStatus}
                onChange={setNewStatus}
                placeholder="Seleccionar nuevo estado"
              />
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Actualizar Estado
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsUpdatingStatus(false);
                    setNewStatus('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add Note Section */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Agregar Nota Educativa</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingNote(!isAddingNote)}
              iconName={isAddingNote ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isAddingNote ? 'Cancelar' : 'Añadir Nota'}
            </Button>
          </div>
          
          {isAddingNote && (
            <div className="space-y-4">
              <Select
                label="Tipo de Nota"
                options={noteTypeOptions}
                value={noteType}
                onChange={setNoteType}
              />
              
              <Input
                label="Contenido de la Nota"
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e?.target?.value)}
                placeholder="Escribir observación o nota educativa..."
                description="Máximo 500 caracteres"
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{newNote?.length}/500 caracteres</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{new Date()?.toLocaleTimeString('es-ES')}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={handleAddNote}
                  disabled={!newNote?.trim()}
                  iconName="FileText"
                  iconPosition="left"
                >
                  Guardar Nota
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote('');
                    setNoteType('observación');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-medium text-foreground mb-3">Navegación Rápida</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/case-history')}
              iconName="History"
              iconPosition="left"
              className="justify-start"
            >
              Historial Completo
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/patient-registration')}
              iconName="UserPlus"
              iconPosition="left"
              className="justify-start"
            >
              Nuevo Paciente
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/patient-dashboard')}
              iconName="LayoutDashboard"
              iconPosition="left"
              className="justify-start"
            >
              Panel Principal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveActions;