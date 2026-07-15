import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    formato: 'pdf',
    rangoFecha: 'mes',
    incluirDetalles: true,
    incluirAnalisisIA: true,
    incluirNotas: false,
    nombreArchivo: `historial_casos_${new Date()?.toISOString()?.split('T')?.[0]}`
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF - Documento' },
    { value: 'excel', label: 'Excel - Hoja de cálculo' },
    { value: 'csv', label: 'CSV - Datos separados por comas' },
    { value: 'json', label: 'JSON - Datos estructurados' }
  ];

  const rangeOptions = [
    { value: 'hoy', label: 'Solo hoy' },
    { value: 'semana', label: 'Última semana' },
    { value: 'mes', label: 'Último mes' },
    { value: 'trimestre', label: 'Último trimestre' },
    { value: 'todo', label: 'Todo el historial' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1100 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Exportar Historial
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* File Format */}
          <Select
            label="Formato de archivo"
            options={formatOptions}
            value={exportConfig?.formato}
            onChange={(value) => handleConfigChange('formato', value)}
          />

          {/* Date Range */}
          <Select
            label="Rango de fechas"
            options={rangeOptions}
            value={exportConfig?.rangoFecha}
            onChange={(value) => handleConfigChange('rangoFecha', value)}
          />

          {/* File Name */}
          <Input
            label="Nombre del archivo"
            type="text"
            value={exportConfig?.nombreArchivo}
            onChange={(e) => handleConfigChange('nombreArchivo', e?.target?.value)}
            placeholder="historial_casos"
          />

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Incluir en la exportación:
            </h4>
            
            <Checkbox
              label="Detalles completos de pacientes"
              checked={exportConfig?.incluirDetalles}
              onChange={(e) => handleConfigChange('incluirDetalles', e?.target?.checked)}
            />
            
            <Checkbox
              label="Resultados de análisis IA"
              checked={exportConfig?.incluirAnalisisIA}
              onChange={(e) => handleConfigChange('incluirAnalisisIA', e?.target?.checked)}
            />
            
            <Checkbox
              label="Notas y comentarios"
              checked={exportConfig?.incluirNotas}
              onChange={(e) => handleConfigChange('incluirNotas', e?.target?.checked)}
            />
          </div>

          {/* Preview Info */}
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>
                Se exportarán aproximadamente 150 registros en formato {exportConfig?.formato?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;