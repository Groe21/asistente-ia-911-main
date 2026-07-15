import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import DashboardMetrics from './components/DashboardMetrics';
import PatientTable from './components/PatientTable';
import QuickActions from './components/QuickActions';
import UrgencyDistribution from './components/UrgencyDistribution';
import GeneralChatBot from './components/GeneralChatBot';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import API_URL from '../../utils/api';
import { getDemoPatients } from '../../utils/demoMode';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ia911_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const mapUrgencyLevel = (level) => {
    const map = { CRITICO: 'crítico', ALTO: 'alto', MODERADO: 'moderado', BAJO: 'bajo' };
    return map[level] || level?.toLowerCase();
  };

  const mapStatus = (status) => {
    const map = {
      EN_EVALUACION: 'en evaluación',
      EN_TRATAMIENTO: 'en tratamiento',
      ESTABLE: 'estable',
      DADO_DE_ALTA: 'dado de alta'
    };
    return map[status] || status?.toLowerCase();
  };

  // Calculate metrics from patient data
  const calculateMetrics = (patientData) => {
    const totalCases = patientData?.length;
    const criticalCases = patientData?.filter(p => p?.urgencyLevel === 'crítico')?.length;
    const highCases = patientData?.filter(p => p?.urgencyLevel === 'alto')?.length;
    const moderateCases = patientData?.filter(p => p?.urgencyLevel === 'moderado')?.length;
    const lowCases = patientData?.filter(p => p?.urgencyLevel === 'bajo')?.length;

    return { totalCases, criticalCases, highCases, moderateCases, lowCases };
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        localStorage.removeItem('ia911_user');
        localStorage.removeItem('ia911_token');
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error('Error al obtener pacientes');

      const data = await response.json();

      const mapped = data.map(p => ({
        id: p.code,
        dbId: p.id,
        name: p.name,
        age: p.age,
        symptoms: p.symptoms,
        urgencyLevel: mapUrgencyLevel(p.urgencyLevel),
        status: mapStatus(p.status),
        timestamp: new Date(p.arrivalTime),
        aiAnalysis: p.aiAnalyses?.[0]?.diagnosis || 'Pendiente de análisis',
        recommendedAction: p.aiAnalyses?.[0]?.recommendedAction || 'En espera'
      }));

      setPatients(mapped);
      setMetrics(calculateMetrics(mapped));
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      const demoPatients = getDemoPatients();
      const mapped = demoPatients.map(p => ({
        id: p.code,
        dbId: p.id,
        name: p.name,
        age: p.age,
        symptoms: p.symptoms,
        urgencyLevel: mapUrgencyLevel(p.urgencyLevel),
        status: mapStatus(p.status),
        timestamp: new Date(p.arrivalTime),
        aiAnalysis: p.aiAnalyses?.[0]?.diagnosis || 'Pendiente de análisis',
        recommendedAction: p.aiAnalyses?.[0]?.recommendedAction || 'En espera'
      }));

      setPatients(mapped);
      setMetrics(calculateMetrics(mapped));
      setLastUpdate(new Date());
      setError('Mostrando datos de demostración porque el backend no está disponible.');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await fetchPatients();
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchPatients();
    setIsLoading(false);
  };

  const handleStatusUpdate = (patientId) => {
    const patient = patients?.find(p => p?.id === patientId);
    if (patient) {
      navigate(`/patient-details/${patient.dbId}`);
    }
  };

  const handleBulkAction = (action, selectedPatientIds) => {
    switch (action) {
      case 'update-status':
        // In a real app, this would open a bulk status update modal
        console.log('Bulk status update for:', selectedPatientIds);
        break;
      case 'export':
        // In a real app, this would export selected patient data
        console.log('Export patients:', selectedPatientIds);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Cargando panel de control...</p>
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
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Panel de Control - IA-911 Assist
                </h1>
                <p className="text-muted-foreground">
                  Sistema de entrenamiento médico para respuesta de emergencias
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Tiempo real</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                  disabled={isLoading}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions 
            onRefresh={handleRefresh}
            lastUpdate={lastUpdate}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm text-error font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Dashboard Metrics */}
          <DashboardMetrics metrics={metrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Patient Table - Takes 2/3 width on xl screens */}
            <div className="xl:col-span-2">
              <PatientTable 
                patients={patients}
                onStatusUpdate={handleStatusUpdate}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Urgency Distribution Chart - Takes 1/3 width on xl screens */}
            <div className="xl:col-span-1">
              <UrgencyDistribution data={metrics} />
            </div>
          </div>

          {/* Emergency Protocol Notice */}
          <div className="bg-warning/10 border border-warning rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Protocolo de Entrenamiento Activo
                </h4>
                <p className="text-sm text-muted-foreground">
                  Este es un sistema de simulación para entrenamiento médico. 
                  Los casos mostrados son ficticios y están diseñados para práctica educativa.
                  En una emergencia real, contacte inmediatamente al 112.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot General IA-911 */}
      <GeneralChatBot />
    </div>
  );
};

export default PatientDashboard;