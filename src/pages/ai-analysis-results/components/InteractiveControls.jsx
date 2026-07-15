import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InteractiveControls = ({ patientId, analysisData, onUpdateStatus, onAddNote }) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState("observacion");
  const [isModifying, setIsModifying] = useState(false);
  const [modificationReason, setModificationReason] = useState("");
  const navigate = useNavigate();

  const handleAcceptAnalysis = () => {
    if (onUpdateStatus) {
      onUpdateStatus(patientId, {
        status: 'analysis_accepted',
        urgencyLevel: analysisData?.urgencyLevel,
        timestamp: new Date()?.toISOString()
      });
    }
    navigate('/patient-dashboard');
  };

  const handleModifyAnalysis = () => {
    setIsModifying(true);
  };

  const handleSubmitModification = () => {
    if (modificationReason?.trim()) {
      if (onUpdateStatus) {
        onUpdateStatus(patientId, {
          status: 'analysis_modified',
          modificationReason: modificationReason,
          timestamp: new Date()?.toISOString()
        });
      }
      setIsModifying(false);
      setModificationReason("");
    }
  };

  const handleAddNote = () => {
    if (note?.trim()) {
      if (onAddNote) {
        onAddNote(patientId, {
          type: noteType,
          content: note,
          timestamp: new Date()?.toISOString(),
          author: "Sistema de Entrenamiento"
        });
      }
      setNote("");
      setShowNoteForm(false);
    }
  };

  const handleNavigateToDetails = () => {
    navigate(`/patient-details/${patientId}`);
  };

  const handleNavigateToHistory = () => {
    navigate('/case-history', { 
      state: { 
        patientId: patientId 
      } 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Settings" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Controles Interactivos
        </h2>
      </div>
      {/* Main Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <Button
          variant="default"
          onClick={handleAcceptAnalysis}
          iconName="Check"
          iconPosition="left"
          className="h-11 w-full justify-center"
        >
          Aceptar Análisis IA
        </Button>
        
        <Button
          variant="outline"
          onClick={handleModifyAnalysis}
          iconName="Edit"
          iconPosition="left"
          className="h-11 w-full justify-center"
        >
          Modificar Recomendaciones
        </Button>
      </div>
      {/* Modification Form */}
      {isModifying && (
        <div className="mb-6 p-4 bg-warning/5 border border-warning/20 rounded-lg">
          <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="AlertCircle" size={18} className="text-warning" />
            <span>Modificar Análisis</span>
          </h3>
          
          <Input
            label="Razón de la modificación"
            type="text"
            placeholder="Explique por qué está modificando las recomendaciones del IA..."
            value={modificationReason}
            onChange={(e) => setModificationReason(e?.target?.value)}
            description="Esta información será registrada para fines educativos"
            className="mb-4"
          />
          
          <div className="flex gap-3">
            <Button
              variant="warning"
              onClick={handleSubmitModification}
              disabled={!modificationReason?.trim()}
              iconName="Save"
              iconPosition="left"
            >
              Confirmar Modificación
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                setIsModifying(false);
                setModificationReason("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* Secondary Actions */}
      <div className="flex flex-col gap-3 mb-6">
        <Button
          variant="outline"
          onClick={() => setShowNoteForm(!showNoteForm)}
          iconName="FileText"
          iconPosition="left"
          className="h-10 w-full justify-center text-sm"
        >
          {showNoteForm ? 'Ocultar' : 'Agregar'} Nota del Entrenador
        </Button>
        
        <Button
          variant="outline"
          onClick={handleNavigateToDetails}
          iconName="User"
          iconPosition="left"
          className="h-10 w-full justify-center text-sm"
        >
          Ver Detalles del Paciente
        </Button>

        <div className="border-t border-border pt-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={handleNavigateToHistory}
            iconName="Clock"
            iconPosition="left"
            className="h-9 w-full justify-center text-sm"
          >
            Historial de Casos
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/patient-dashboard')}
            iconName="ArrowLeft"
            iconPosition="left"
            className="h-9 w-full justify-center text-sm"
          >
            Volver al Panel
          </Button>
        </div>
      </div>
      {/* Note Form */}
      {showNoteForm && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <h3 className="font-medium text-foreground mb-4">Agregar Nota del Entrenador</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de nota
              </label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="observacion">Observación</option>
                <option value="evaluacion">Evaluación</option>
                <option value="recomendacion">Recomendación</option>
                <option value="seguimiento">Seguimiento</option>
              </select>
            </div>
            
            <Input
              label="Contenido de la nota"
              type="text"
              placeholder="Escriba sus observaciones sobre el caso y el análisis IA..."
              value={note}
              onChange={(e) => setNote(e?.target?.value)}
              description="Esta nota será visible en el historial del caso para revisión educativa"
            />
            
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={handleAddNote}
                disabled={!note?.trim()}
                iconName="Save"
                iconPosition="left"
              >
                Guardar Nota
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  setShowNoteForm(false);
                  setNote("");
                  setNoteType("observacion");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Analysis Summary */}
      <div className="pt-4 border-t border-border">
        <h3 className="font-medium text-foreground mb-3 text-sm">Resumen del Análisis</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="font-medium text-foreground">Nivel de Urgencia</div>
            <div className="text-base font-bold text-primary mt-1">
              {analysisData?.urgencyLevel}
            </div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="font-medium text-foreground">Confianza</div>
            <div className="text-base font-bold text-accent mt-1">
              {analysisData?.confidence}%
            </div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="font-medium text-foreground">Procesado</div>
            <div className="text-xs font-medical-data text-muted-foreground mt-1">
              {analysisData?.processedAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveControls;