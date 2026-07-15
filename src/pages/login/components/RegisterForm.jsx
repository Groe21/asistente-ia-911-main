import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import API_URL from '../../../utils/api';
import { registerDemoUser } from '../../../utils/demoMode';

const RegisterForm = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cedula?.trim()) {
      newErrors.cedula = 'La cédula es obligatoria';
    }

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido?.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const demoResult = registerDemoUser({
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido: formData.apellido,
        password: formData.password
      });

      if (demoResult) {
        localStorage.setItem('ia911_user', JSON.stringify(demoResult.user));
        localStorage.setItem('ia911_token', demoResult.token);
        setSuccessMessage('Cuenta creada exitosamente. Será redirigido al panel.');
        setTimeout(() => {
          window.location.href = '/patient-dashboard';
        }, 1200);
        return;
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: formData.cedula,
          nombre: formData.nombre,
          apellido: formData.apellido,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Error al crear la cuenta' });
        return;
      }

      setSuccessMessage('Cuenta creada exitosamente. Inicie sesión con sus credenciales.');
      setTimeout(() => {
        onShowLogin();
      }, 2000);
    } catch (error) {
      setErrors({
        general: 'Error de conexión con el servidor. Verifique que el backend esté corriendo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg mx-auto mb-3">
          <Icon name="UserPlus" size={24} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Crear Nueva Cuenta</h2>
        <p className="text-sm text-muted-foreground mt-1">Complete los datos para registrarse en el sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error font-medium">{errors.general}</span>
            </div>
          </div>
        )}

        <Input
          label="Cédula"
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleInputChange}
          placeholder="Ingrese su número de cédula"
          error={errors?.cedula}
          required
          disabled={isLoading}
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Su nombre"
            error={errors?.nombre}
            required
            disabled={isLoading}
            className="w-full"
          />

          <Input
            label="Apellido"
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            placeholder="Su apellido"
            error={errors?.apellido}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mínimo 6 caracteres"
            error={errors?.password}
            required
            disabled={isLoading}
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-clinical"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Repita su contraseña"
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
          className="w-full"
        />

        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
          iconName="UserPlus"
          iconPosition="left"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">¿Ya tiene cuenta?</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onShowLogin}
          className="w-full"
          iconName="LogIn"
          iconPosition="left"
        >
          Volver a Iniciar Sesión
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
