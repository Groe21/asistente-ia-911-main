import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import PatientInfoCard from './components/PatientInfoCard';
import UrgencyAssessment from './components/UrgencyAssessment';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import CaseHistoryTimeline from './components/CaseHistoryTimeline';
import InteractiveActions from './components/InteractiveActions';
import MiniChatBot from './components/MiniChatBot';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import API_URL from '../../utils/api';

const PatientDetails = () => { 
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (!id || id === 'undefined') {
      navigate('/patient-dashboard');
      return;
    }

    const fetchPatient = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/patients/${id}`, {
          headers: getAuthHeaders()
        });

        if (response.status === 401) {
          localStorage.removeItem('ia911_user');
          localStorage.removeItem('ia911_token');
          navigate('/login');
          return;
        }

        if (response.status === 404) {
          setError('Paciente no encontrado');
          setIsLoading(false);
          return;
        }

        if (!response.ok) throw new Error('Error al obtener paciente');

        const data = await response.json();

        const lastAnalysis = data.aiAnalyses?.[0];
        const lastVitals = data.vitalSigns?.[0];

        setPatient({
          id: data.code,
          dbId: data.id,
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodType: data.bloodType || 'No registrado',
          contactNumber: data.contactNumber || 'No registrado',
          emergencyContact: data.emergencyContact || 'No registrado',
          allergies: data.allergies || 'Ninguna conocida',
          conditions: data.conditions || 'Ninguna conocida',
          symptoms: data.symptoms,
          urgencyLevel: mapUrgencyLevel(data.urgencyLevel),
          status: mapStatus(data.status),
          arrivalTime: new Date(data.arrivalTime),
          aiAnalysis: lastAnalysis ? {
            diagnosis: lastAnalysis.diagnosis,
            confidence: lastAnalysis.confidence,
            recommendedAction: lastAnalysis.recommendedAction,
            riskFactors: lastAnalysis.riskFactors || [],
            vitalSigns: lastVitals ? {
              heartRate: lastVitals.heartRate || 'N/D',
              bloodPressure: lastVitals.bloodPressure || 'N/D',
              temperature: lastVitals.temperature || 'N/D',
              oxygenSaturation: lastVitals.oxygenSaturation || 'N/D'
            } : null
          } : {
            diagnosis: 'Pendiente de análisis',
            confidence: 0,
            recommendedAction: 'En espera',
            riskFactors: [],
            vitalSigns: lastVitals ? {
              heartRate: lastVitals.heartRate || 'N/D',
              bloodPressure: lastVitals.bloodPressure || 'N/D',
              temperature: lastVitals.temperature || 'N/D',
              oxygenSaturation: lastVitals.oxygenSaturation || 'N/D'
            } : null
          },
          timeline: (data.caseEntries || []).map(entry => ({
            time: new Date(entry.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            event: entry.title,
            type: entry.type
          }))
        });
      } catch (err) {
        setError('Error al cargar los datos del paciente');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando detalles del paciente...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">{error || 'Paciente no encontrado'}</p>
          <Button variant="outline" onClick={() => navigate('/patient-dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={(collapsed) => setIsNavCollapsed(collapsed)} />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-6">
              <BreadcrumbTrail />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/patient-dashboard')}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="ArrowLeft" size={20} />
                    <span>Volver al Dashboard</span>
                  </Button>
                </div>
                
                <InteractiveActions patientId={patient.id} />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Patient Info & Urgency */}
              <div className="lg:col-span-1 space-y-6">
                <PatientInfoCard patient={patient} />
                <UrgencyAssessment 
                  urgencyLevel={patient.urgencyLevel}
                  status={patient.status}
                />
              </div>

              {/* Middle Column - AI Analysis */}
              <div className="lg:col-span-1">
                <AIAnalysisPanel analysis={patient.aiAnalysis} />
              </div>

              {/* Right Column - Timeline */}
              <div className="lg:col-span-1">
                <CaseHistoryTimeline timeline={patient.timeline} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <MiniChatBot patientId={patient.dbId} patientName={patient.name} />
    </>
  );
};

export default PatientDetails;