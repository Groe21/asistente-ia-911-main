import React from 'react';
import TimelineEntry from './TimelineEntry';
import Icon from '../../../components/AppIcon';

const CaseTimeline = ({ entries = [], loading = false, emptyMessage = "No se encontraron registros" }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="animate-spin">
            <Icon name="Loader2" size={24} />
          </div>
          <span>Cargando historial de casos...</span>
        </div>
      </div>
    );
  }

  if (entries?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Sin registros disponibles
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {emptyMessage}. Ajusta los filtros de búsqueda o verifica que existan casos registrados en el sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Cronología de Eventos
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{entries?.length} evento{entries?.length !== 1 ? 's' : ''} encontrado{entries?.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="space-y-0">
        {entries?.map((entry, index) => (
          <TimelineEntry
            key={entry?.id}
            entry={entry}
            isLast={index === entries?.length - 1}
          />
        ))}
      </div>
      {/* Load More Button (if needed for pagination) */}
      {entries?.length >= 20 && (
        <div className="text-center pt-6 border-t border-border">
          <button className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-clinical">
            <Icon name="ChevronDown" size={16} />
            <span>Cargar más eventos</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseTimeline;