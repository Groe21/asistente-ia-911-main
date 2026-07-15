import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PatientInfoCard = ({ patient }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'crítico':
        return 'text-error bg-error/10 border-error';
      case 'alto':
        return 'text-warning bg-warning/10 border-warning';
      case 'moderado':
        return 'text-accent bg-accent/10 border-accent';
      case 'bajo':
        return 'text-success bg-success/10 border-success';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={patient?.avatar}
              alt={patient?.avatarAlt}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
              patient?.status === 'Activo' ? 'bg-success' : 'bg-muted-foreground'
            }`}></div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{patient?.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-muted-foreground">ID: {patient?.id}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{patient?.age} años</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{patient?.gender}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full border font-medium ${getUrgencyColor(patient?.urgencyLevel)}`}>
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span>{patient?.urgencyLevel}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
            <p className="text-foreground font-medical-data">{formatDate(patient?.registrationTime)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contacto de Emergencia</label>
            <p className="text-foreground">{patient?.emergencyContact}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Alergias Conocidas</label>
            <p className="text-foreground">{patient?.allergies || 'Ninguna reportada'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Estado Actual</label>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                patient?.status === 'Activo' ? 'bg-success' : 'bg-muted-foreground'
              }`}></div>
              <span className="text-foreground">{patient?.status}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
            <p className="text-foreground">{patient?.location}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Médico Asignado</label>
            <p className="text-foreground">{patient?.assignedDoctor}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <label className="text-sm font-medium text-muted-foreground">Descripción de Síntomas</label>
        <div className="mt-2 p-4 bg-muted rounded-lg">
          <p className="text-foreground leading-relaxed">{patient?.symptoms}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;