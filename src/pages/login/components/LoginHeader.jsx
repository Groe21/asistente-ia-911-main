import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-xl shadow-clinical">
          <Icon name="Cross" size={28} color="white" />
        </div>
      </div>

      {/* Application Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1 sm:mb-2">
        IA-911 Assist
      </h1>
      
      {/* Subtitle */}
      <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">
        Sistema de Asistencia Médica con IA
      </p>

      {/* Welcome Message */}
      <div className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-clinical-sm">
        <h2 className="text-lg sm:text-xl font-medium text-foreground mb-1 sm:mb-2">
          Bienvenido al Sistema
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Plataforma de respuesta médica de emergencia con inteligencia artificial
          para profesionales de la salud.
        </p>
      </div>

      {/* Features List */}
      <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Users" size={16} className="text-accent" />
          <span>Pacientes</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Brain" size={16} className="text-accent" />
          <span>Análisis IA</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Activity" size={16} className="text-accent" />
          <span>Monitoreo</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;