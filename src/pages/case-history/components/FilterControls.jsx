import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  onExport 
}) => {
  const eventTypeOptions = [
    { value: 'todos', label: 'Todos los eventos' },
    { value: 'registro', label: 'Registros de pacientes' },
    { value: 'analisis_ia', label: 'Análisis de IA' },
    { value: 'cambio_estado', label: 'Cambios de estado' },
    { value: 'intervencion', label: 'Intervenciones médicas' },
    { value: 'nota', label: 'Notas añadidas' },
    { value: 'exportacion', label: 'Exportaciones' }
  ];

  const urgencyLevelOptions = [
    { value: 'todos', label: 'Todos los niveles' },
    { value: 'crítico', label: 'Crítico' },
    { value: 'alto', label: 'Alto' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'bajo', label: 'Bajo' }
  ];

  const dateRangeOptions = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Última semana' },
    { value: 'mes', label: 'Último mes' },
    { value: 'trimestre', label: 'Último trimestre' },
    { value: 'personalizado', label: 'Rango personalizado' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Filtros de Búsqueda
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Limpiar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Buscar paciente, síntomas o términos médicos..."
            value={filters?.busqueda}
            onChange={(e) => onFilterChange('busqueda', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Event Type Filter */}
        <Select
          options={eventTypeOptions}
          value={filters?.tipoEvento}
          onChange={(value) => onFilterChange('tipoEvento', value)}
          placeholder="Tipo de evento"
        />

        {/* Urgency Level Filter */}
        <Select
          options={urgencyLevelOptions}
          value={filters?.nivelUrgencia}
          onChange={(value) => onFilterChange('nivelUrgencia', value)}
          placeholder="Nivel de urgencia"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Date Range */}
        <Select
          options={dateRangeOptions}
          value={filters?.rangoFecha}
          onChange={(value) => onFilterChange('rangoFecha', value)}
          placeholder="Rango de fechas"
        />

        {/* Custom Date Inputs */}
        {filters?.rangoFecha === 'personalizado' && (
          <>
            <Input
              type="date"
              label="Fecha inicio"
              value={filters?.fechaInicio}
              onChange={(e) => onFilterChange('fechaInicio', e?.target?.value)}
            />
            <Input
              type="date"
              label="Fecha fin"
              value={filters?.fechaFin}
              onChange={(e) => onFilterChange('fechaFin', e?.target?.value)}
            />
          </>
        )}
      </div>
      {/* Active Filters Display */}
      {(filters?.busqueda || filters?.tipoEvento !== 'todos' || filters?.nivelUrgencia !== 'todos') && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          
          {filters?.busqueda && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              <Icon name="Search" size={12} />
              <span>"{filters?.busqueda}"</span>
              <button
                onClick={() => onFilterChange('busqueda', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </span>
          )}
          
          {filters?.tipoEvento !== 'todos' && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
              <Icon name="Filter" size={12} />
              <span>{eventTypeOptions?.find(opt => opt?.value === filters?.tipoEvento)?.label}</span>
              <button
                onClick={() => onFilterChange('tipoEvento', 'todos')}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </span>
          )}
          
          {filters?.nivelUrgencia !== 'todos' && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
              <Icon name="AlertTriangle" size={12} />
              <span>{urgencyLevelOptions?.find(opt => opt?.value === filters?.nivelUrgencia)?.label}</span>
              <button
                onClick={() => onFilterChange('nivelUrgencia', 'todos')}
                className="hover:bg-warning/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;