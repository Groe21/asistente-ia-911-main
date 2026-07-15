import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import FilterControls from './components/FilterControls';
import CaseTimeline from './components/CaseTimeline';
import StatsSummary from './components/StatsSummary';
import ExportModal from './components/ExportModal';

import Button from '../../components/ui/Button';
import API_URL from '../../utils/api';

const CaseHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [stats, setStats] = useState({ totalCasos: 0, analisisCompletados: 0, casosCriticos: 0, intervencionesMedicas: 0 });
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    busqueda: '',
    tipoEvento: 'todos',
    nivelUrgencia: 'todos',
    rangoFecha: 'mes',
    fechaInicio: '',
    fechaFin: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ia911_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const mapUrgencyLevel = (level) => {
    if (!level) return undefined;
    const map = { CRITICO: 'crítico', ALTO: 'alto', MODERADO: 'moderado', BAJO: 'bajo' };
    return map[level] || level?.toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders();

        const [entriesRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/history`, { headers }),
          fetch(`${API_URL}/history/stats`, { headers })
        ]);

        if (entriesRes.status === 401) {
          localStorage.removeItem('ia911_user');
          localStorage.removeItem('ia911_token');
          navigate('/login');
          return;
        }

        const entriesData = await entriesRes.json();
        const statsData = await statsRes.json();

        setStats(statsData);
        setTimelineEntries(entriesData.map(entry => ({
          id: entry.id,
          tipo: entry.type,
          titulo: entry.title,
          descripcion: entry.description,
          timestamp: new Date(entry.createdAt).toLocaleString('es-ES'),
          usuario: entry.user ? `${entry.user.nombre} ${entry.user.apellido}` : 'Sistema',
          nivelUrgencia: mapUrgencyLevel(entry.urgencyLevel),
          detalles: entry.details || {},
          acciones: [
            { texto: 'Ver detalles', icono: 'Eye' }
          ]
        })));
        setError(null);
      } catch (err) {
        setError('Error al cargar el historial. Verifique que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      busqueda: '',
      tipoEvento: 'todos',
      nivelUrgencia: 'todos',
      rangoFecha: 'mes',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const handleExport = (exportConfig) => {
    console.log('Exportando con configuración:', exportConfig);
    // Simulate export process
    alert(`Exportando historial en formato ${exportConfig?.formato?.toUpperCase()}...`);
  };

  const filteredEntries = timelineEntries?.filter(entry => {
    // Apply search filter
    if (filters?.busqueda) {
      const searchTerm = filters?.busqueda?.toLowerCase();
      const matchesSearch = 
        entry?.titulo?.toLowerCase()?.includes(searchTerm) ||
        entry?.descripcion?.toLowerCase()?.includes(searchTerm) ||
        entry?.usuario?.toLowerCase()?.includes(searchTerm) ||
        (entry?.detalles && Object.values(entry?.detalles)?.some(value => 
          value?.toString()?.toLowerCase()?.includes(searchTerm)
        ));
      if (!matchesSearch) return false;
    }

    // Apply event type filter
    if (filters?.tipoEvento !== 'todos' && entry?.tipo !== filters?.tipoEvento) {
      return false;
    }

    // Apply urgency level filter
    if (filters?.nivelUrgencia !== 'todos' && entry?.nivelUrgencia !== filters?.nivelUrgencia) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={() => {}} />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Historial de Casos
                </h1>
                <p className="text-muted-foreground">
                  Revisión completa de registros médicos y eventos del sistema para análisis educativo
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/patient-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Volver al Panel
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => setShowExportModal(true)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar Datos
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-error font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Statistics Summary */}
          <StatsSummary stats={stats} />

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => setShowExportModal(true)}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">
                Cronología de Eventos
              </h2>
              <span className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                {filteredEntries?.length} resultado{filteredEntries?.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Case Timeline */}
          <CaseTimeline
            entries={filteredEntries}
            loading={loading}
            emptyMessage="No se encontraron casos que coincidan con los filtros aplicados"
          />

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-clinical-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/patient-registration')}
                iconName="UserPlus"
                iconPosition="left"
                className="justify-start"
              >
                Registrar Nuevo Paciente
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/ai-analysis-results')}
                iconName="Brain"
                iconPosition="left"
                className="justify-start"
              >
                Ver Análisis IA
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                iconName="FileText"
                iconPosition="left"
                className="justify-start"
              >
                Generar Reporte
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default CaseHistory;