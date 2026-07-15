import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientTable = ({ patients, onStatusUpdate, onBulkAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const navigate = useNavigate();

  const urgencyOptions = [
    { value: '', label: 'Todos los niveles' },
    { value: 'crítico', label: 'Crítico' },
    { value: 'alto', label: 'Alto' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'bajo', label: 'Bajo' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'en evaluación', label: 'En evaluación' },
    { value: 'en tratamiento', label: 'En tratamiento' },
    { value: 'estable', label: 'Estable' },
    { value: 'dado de alta', label: 'Dado de alta' }
  ];

  const getUrgencyBadge = (level) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (level?.toLowerCase()) {
      case 'crítico':
        return `${baseClasses} bg-error/10 text-error animate-medical-pulse`;
      case 'alto':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'moderado':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'bajo':
        return `${baseClasses} bg-success/10 text-success`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status?.toLowerCase()) {
      case 'en evaluación':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'en tratamiento':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'estable':
        return `${baseClasses} bg-success/10 text-success`;
      case 'dado de alta':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         patient?.symptoms?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesUrgency = !urgencyFilter || patient?.urgencyLevel?.toLowerCase() === urgencyFilter?.toLowerCase();
    const matchesStatus = !statusFilter || patient?.status?.toLowerCase() === statusFilter?.toLowerCase();
    
    return matchesSearch && matchesUrgency && matchesStatus;
  });

  const sortedPatients = [...filteredPatients]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPatients(sortedPatients?.map(p => p?.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId, checked) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients?.filter(id => id !== patientId));
    }
  };

  const handlePatientClick = (patient) => {
    navigate(`/patient-details/${patient.dbId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      {/* Filters and Search */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por nombre o síntomas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={urgencyOptions}
              value={urgencyFilter}
              onChange={setUrgencyFilter}
              placeholder="Filtrar por urgencia"
              className="w-48"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filtrar por estado"
              className="w-48"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPatients?.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedPatients?.length} paciente(s) seleccionado(s)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('update-status', selectedPatients)}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Actualizar Estado
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export', selectedPatients)}
                iconName="Download"
                iconPosition="left"
              >
                Exportar
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedPatients?.length === sortedPatients?.length && sortedPatients?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-clinical"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Paciente</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-clinical"
                onClick={() => handleSort('age')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Edad</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Síntomas</span>
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-clinical"
                onClick={() => handleSort('urgencyLevel')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Urgencia</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Estado</span>
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-clinical"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Registro</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="w-20 p-4">
                <span className="text-sm font-medium text-muted-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients?.map((patient) => (
              <tr 
                key={patient?.id}
                className="border-b border-border hover:bg-muted/50 cursor-pointer transition-clinical"
                onClick={() => handlePatientClick(patient)}
              >
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedPatients?.includes(patient?.id)}
                    onChange={(e) => handleSelectPatient(patient?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                      <Icon name="User" size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{patient?.name}</div>
                      <div className="text-sm text-muted-foreground font-medical-data">ID: {patient?.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-medical-data">{patient?.age} años</span>
                </td>
                <td className="p-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-foreground truncate" title={patient?.symptoms}>
                      {patient?.symptoms}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={getUrgencyBadge(patient?.urgencyLevel)}>
                    {patient?.urgencyLevel}
                  </span>
                </td>
                <td className="p-4">
                  <span className={getStatusBadge(patient?.status)}>
                    {patient?.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-muted-foreground font-medical-data">
                    {new Date(patient.timestamp)?.toLocaleDateString('es-ES')}
                    <br />
                    {new Date(patient.timestamp)?.toLocaleTimeString('es-ES')}
                  </div>
                </td>
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStatusUpdate(patient?.id)}
                    className="h-8 w-8"
                  >
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {sortedPatients?.map((patient) => (
          <div 
            key={patient?.id}
            className="p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-clinical"
            onClick={() => handlePatientClick(patient)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedPatients?.includes(patient?.id)}
                  onChange={(e) => {
                    e?.stopPropagation();
                    handleSelectPatient(patient?.id, e?.target?.checked);
                  }}
                  className="rounded border-border"
                />
                <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                  <Icon name="User" size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{patient?.name}</h3>
                  <p className="text-sm text-muted-foreground font-medical-data">
                    ID: {patient?.id} • {patient?.age} años
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  onStatusUpdate(patient?.id);
                }}
                className="h-8 w-8"
              >
                <Icon name="MoreVertical" size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Síntomas:</p>
                <p className="text-sm text-foreground">{patient?.symptoms}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={getUrgencyBadge(patient?.urgencyLevel)}>
                    {patient?.urgencyLevel}
                  </span>
                  <span className={getStatusBadge(patient?.status)}>
                    {patient?.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medical-data">
                  {new Date(patient.timestamp)?.toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {sortedPatients?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron pacientes
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || urgencyFilter || statusFilter 
              ? 'Intenta ajustar los filtros de búsqueda' :'Aún no hay pacientes registrados en el sistema'
            }
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/patient-registration')}
            iconName="Plus"
            iconPosition="left"
          >
            Registrar Primer Paciente
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientTable;