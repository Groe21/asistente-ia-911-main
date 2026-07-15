import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import PatientForm from './components/PatientForm';
import RegistrationGuidelines from './components/RegistrationGuidelines';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const PatientRegistration = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePatientSubmit = (patientData) => {
    console.log('Patient registered:', patientData);
    setRegistrationSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setRegistrationSuccess(false);
    }, 3000);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Helmet>
        <title>Registro de Paciente - IA-911 Assist</title>
        <meta name="description" content="Registre nuevos casos de emergencia médica para análisis y clasificación de urgencia con IA" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={handleToggleCollapse} />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <BreadcrumbTrail />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                    <Icon name="UserPlus" size={28} color="white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Registro de Paciente</h1>
                    <p className="text-muted-foreground">Sistema de registro rápido para casos de emergencia médica</p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Última actualización: {new Date()?.toLocaleTimeString('es-ES')}</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {registrationSuccess && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <div>
                    <div className="font-medium text-success">Paciente registrado exitosamente</div>
                    <div className="text-sm text-muted-foreground">El análisis de IA ha sido iniciado automáticamente</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Registration Form - Main Content */}
              <div className="lg:col-span-2">
                <PatientForm onSubmit={handlePatientSubmit} />
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <RegistrationGuidelines />
                <QuickActions />
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={20} className="text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Datos Seguros</div>
                    <div className="text-muted-foreground">Toda la información se procesa de forma segura y confidencial</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Icon name="Zap" size={20} className="text-accent mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Procesamiento Rápido</div>
                    <div className="text-muted-foreground">El análisis de IA se completa en menos de 30 segundos</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Icon name="BookOpen" size={20} className="text-success mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Propósito Educativo</div>
                    <div className="text-muted-foreground">Sistema diseñado para entrenamiento médico y simulaciones</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PatientRegistration;