import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import AnalysisHeader from './components/AnalysisHeader';
import SymptomAnalysis from './components/SymptomAnalysis';
import UrgencyDetermination from './components/UrgencyDetermination';
import InteractiveControls from './components/InteractiveControls';
import MiniChatBot from '../patient-details/components/MiniChatBot';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import API_URL from '../../utils/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ia911_token');
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
};

const mapUrgency = (level) => {
  const map = { CRITICO: 'Crítico', ALTO: 'Alto', MODERADO: 'Moderado', BAJO: 'Bajo' };
  return map[level] || level;
};

const AIAnalysisResults = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || null);
  const [patient, setPatient] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Cargar lista de pacientes si no hay patientId
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${API_URL}/patients`, { headers: getAuthHeaders() });
        if (res.status === 401) { navigate('/login'); return; }
        const data = await res.json();
        setPatients(data);
        if (!patientId && data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch { setError('Error al cargar pacientes'); }
      setIsLoading(false);
    };
    fetchPatients();
  }, []);

  // Cargar análisis del paciente seleccionado
  useEffect(() => {
    if (!selectedPatientId) return;
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const [patientRes, analysisRes] = await Promise.all([
          fetch(`${API_URL}/patients/${selectedPatientId}`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/analysis/${selectedPatientId}`, { headers: getAuthHeaders() })
        ]);
        if (patientRes.status === 401) { navigate('/login'); return; }
        
        const patientData = await patientRes.json();
        const analysisData = await analysisRes.json();
        
        setPatient(patientData);
        setAnalysis(analysisData.length > 0 ? analysisData[0] : null);
      } catch { setError('Error al cargar datos'); }
      setIsLoading(false);
    };
    fetchAnalysis();
  }, [selectedPatientId]);

  const handleRunAnalysis = async () => {
    if (!selectedPatientId) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/analysis/${selectedPatientId}/run`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Error al ejecutar análisis');
      const newAnalysis = await res.json();
      setAnalysis(newAnalysis);

      // Refrescar datos del paciente (urgencyLevel pudo cambiar)
      const patientRes = await fetch(`${API_URL}/patients/${selectedPatientId}`, { headers: getAuthHeaders() });
      if (patientRes.ok) setPatient(await patientRes.json());
    } catch (err) {
      setError('Error al ejecutar el análisis de IA. Verifique la configuración.');
    }
    setIsAnalyzing(false);
  };

  // Mapear datos para los componentes existentes
  const patientData = patient ? {
    id: patient.code,
    name: patient.name,
    age: patient.age,
    gender: patient.gender
  } : null;

  const analysisData = analysis ? {
    urgencyLevel: mapUrgency(patient?.urgencyLevel),
    confidence: analysis.confidence,
    confidenceScore: analysis.confidence,
    processedAt: new Date(analysis.processedAt).toLocaleString('es-ES'),
    symptomsProcessed: analysis.symptoms?.length || 0,
    riskFactors: analysis.riskFactors?.length || 0
  } : null;

  const symptomsData = analysis ? {
    originalInput: patient?.symptoms || '',
    processedSymptoms: (analysis.symptoms || []).map(s => ({
      name: s.name,
      severity: s.severity,
      confidence: s.confidence,
      category: s.category,
      description: s.description,
      keywords: [],
      relatedConditions: []
    })),
    processingNotes: analysis.reasoning || ''
  } : null;

  const urgencyData = analysis ? {
    level: mapUrgency(patient?.urgencyLevel),
    confidence: analysis.confidence,
    escalatingFactors: analysis.riskFactors || [],
    mitigatingFactors: [],
    reasoning: analysis.reasoning || ''
  } : null;

  if (isLoading && !patient) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Cargando datos</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbTrail />
          
          <div className="space-y-8">
            {/* Selector de paciente + Botón de análisis */}
            <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Seleccionar Paciente para Análisis
                  </label>
                  <select
                    value={selectedPatientId || ''}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Seleccione un paciente...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name} ({p.age} años) — {p.symptoms?.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="default"
                  onClick={handleRunAnalysis}
                  disabled={!selectedPatientId || isAnalyzing}
                  loading={isAnalyzing}
                  iconName="Brain"
                  iconPosition="left"
                  className="whitespace-nowrap"
                >
                  {isAnalyzing ? 'Analizando con IA...' : 'Ejecutar Análisis IA'}
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <span className="text-sm text-error">{error}</span>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm text-success font-medium">
                      Análisis disponible — Modelo: {analysis.modelVersion} — Confianza: {analysis.confidence}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados del análisis */}
            {patient && analysis ? (
              <>
                <AnalysisHeader 
                  patientData={patientData}
                  analysisData={analysisData}
                />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <SymptomAnalysis symptomsData={symptomsData} />
                    <UrgencyDetermination urgencyData={urgencyData} />

                    {/* Diagnóstico y Razonamiento */}
                    <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                        <Icon name="Brain" size={20} className="text-primary" />
                        <span>Diagnóstico y Razonamiento IA</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">Diagnóstico</div>
                          <p className="text-foreground font-medium">{analysis.diagnosis}</p>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">Acción Recomendada</div>
                          <p className="text-foreground">{analysis.recommendedAction}</p>
                        </div>
                        {analysis.reasoning && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Razonamiento Clínico</div>
                            <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
                          </div>
                        )}
                        {analysis.riskFactors?.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Factores de Riesgo</div>
                            <div className="flex flex-wrap gap-2">
                              {analysis.riskFactors.map((rf, i) => (
                                <span key={i} className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20">
                                  {rf}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1">
                    <div className="sticky top-24">
                      <InteractiveControls
                        patientId={patient.id}
                        analysisData={analysisData}
                        onUpdateStatus={() => {}}
                        onAddNote={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : patient && !analysis ? (
              <div className="bg-card border border-border rounded-lg shadow-clinical p-12 text-center">
                <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Sin análisis para este paciente</h3>
                <p className="text-muted-foreground mb-6">
                  Haga clic en "Ejecutar Análisis IA" para generar un análisis inteligente de los síntomas de {patient.name}
                </p>
                <Button
                  variant="default"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  loading={isAnalyzing}
                  iconName="Brain"
                  iconPosition="left"
                >
                  {isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis IA'}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {patient && selectedPatientId && (
        <MiniChatBot patientId={selectedPatientId} patientName={patient.name} />
      )}
    </div>
  );
};

export default AIAnalysisResults;