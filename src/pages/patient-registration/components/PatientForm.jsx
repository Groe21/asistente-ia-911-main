import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import API_URL from '../../../utils/api';

const PatientForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = [
    { value: '', label: 'Seleccionar género...' },
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' }
  ];

  const statusOptions = [
    { value: '', label: 'Seleccionar estado inicial...' },
    { value: 'consciente', label: 'Consciente y alerta' },
    { value: 'semiconsciente', label: 'Semiconsciente' },
    { value: 'inconsciente', label: 'Inconsciente' },
    { value: 'dolor_severo', label: 'Dolor severo' },
    { value: 'dificultad_respiratoria', label: 'Dificultad respiratoria' },
    { value: 'sangrado_activo', label: 'Sangrado activo' },
    { value: 'shock', label: 'Estado de shock' },
    { value: 'estable', label: 'Estable' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre del paciente es obligatorio';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData?.age) {
      newErrors.age = 'La edad es obligatoria';
    } else {
      const age = parseInt(formData?.age);
      if (isNaN(age) || age < 0 || age > 120) {
        newErrors.age = 'Ingrese una edad válida (0-120 años)';
      }
    }

    if (!formData?.gender) {
      newErrors.gender = 'El género es obligatorio';
    }

    if (!formData?.symptoms?.trim()) {
      newErrors.symptoms = 'Los síntomas iniciales son obligatorios';
    } else if (formData?.symptoms?.trim()?.length < 10) {
      newErrors.symptoms = 'Describa los síntomas con más detalle (mínimo 10 caracteres)';
    }

    if (!formData?.status) {
      newErrors.status = 'Seleccione el estado inicial del paciente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('ia911_token');
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: parseInt(formData.age),
          gender: formData.gender,
          symptoms: formData.symptoms.trim(),
          urgencyLevel: formData.status === 'shock' || formData.status === 'inconsciente' ? 'CRITICO'
            : formData.status === 'sangrado_activo' || formData.status === 'dificultad_respiratoria' ? 'ALTO'
            : formData.status === 'dolor_severo' || formData.status === 'semiconsciente' ? 'MODERADO'
            : 'BAJO'
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('ia911_user');
        localStorage.removeItem('ia911_token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar paciente');
      }

      const patient = await response.json();
      onSubmit(patient);

      navigate('/patient-dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Error al procesar el registro. Intente nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/patient-dashboard');
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Icon name="UserPlus" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Registro de Nuevo Paciente</h2>
          <p className="text-sm text-muted-foreground">Complete la información básica para iniciar la evaluación</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Name */}
        <Input
          label="Nombre Completo del Paciente"
          type="text"
          placeholder="Ej: María González López"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
          className="mb-4"
        />

        {/* Patient Age */}
        <Input
          label="Edad"
          type="number"
          placeholder="Ej: 45"
          value={formData?.age}
          onChange={(e) => handleInputChange('age', e?.target?.value)}
          error={errors?.age}
          required
          min="0"
          max="120"
          className="mb-4"
        />

        {/* Patient Gender */}
        <Select
          label="Género"
          options={genderOptions}
          value={formData?.gender}
          onChange={(value) => handleInputChange('gender', value)}
          error={errors?.gender}
          required
          className="mb-4"
        />

        {/* Initial Symptoms */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Síntomas Iniciales *
          </label>
          <textarea
            placeholder="Describa los síntomas observados: dolor, dificultades, lesiones visibles, estado de conciencia, etc."
            value={formData?.symptoms}
            onChange={(e) => handleInputChange('symptoms', e?.target?.value)}
            rows={4}
            className={`
              w-full px-3 py-2 border rounded-md text-sm transition-clinical
              ${errors?.symptoms 
                ? 'border-error focus:border-error focus:ring-error/20' :'border-border focus:border-primary focus:ring-primary/20'
              }
              bg-input text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2
            `}
          />
          {errors?.symptoms && (
            <p className="text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors?.symptoms}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Mínimo 10 caracteres. Sea específico para mejorar el análisis de IA.
          </p>
        </div>

        {/* Initial Status */}
        <Select
          label="Estado Inicial del Paciente"
          description="Seleccione el estado más apropiado según la evaluación inicial"
          options={statusOptions}
          value={formData?.status}
          onChange={(value) => handleInputChange('status', value)}
          error={errors?.status}
          required
          className="mb-4"
        />

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">{errors?.submit}</span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="UserPlus"
            iconPosition="left"
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Registrar Paciente'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            iconName="ArrowLeft"
            iconPosition="left"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>

        {/* Processing Indicator */}
        {isSubmitting && (
          <div className="flex items-center justify-center space-x-3 p-4 bg-muted/50 rounded-md">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">Procesando registro...</div>
              <div className="text-muted-foreground">Iniciando análisis de IA</div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientForm;