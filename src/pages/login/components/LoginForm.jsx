import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import API_URL from '../../../utils/api';
import { loginDemoUser } from '../../../utils/demoMode';

const LoginForm = ({ onShowRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.cedula?.trim()) {
      newErrors.cedula = 'La cédula es obligatoria';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const demoResult = loginDemoUser(formData.cedula, formData.password);

      if (demoResult) {
        localStorage.setItem('ia911_user', JSON.stringify(demoResult.user));
        localStorage.setItem('ia911_token', demoResult.token);
        navigate('/patient-dashboard');
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: formData.cedula,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Credenciales incorrectas' });
        return;
      }

      localStorage.setItem('ia911_user', JSON.stringify(data.user));
      localStorage.setItem('ia911_token', data.token);

      navigate('/patient-dashboard');
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error general */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error font-medium">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Campo Cédula */}
        <Input
          label="Cédula"
          type="text"
          name="cedula"
          value={formData?.cedula}
          onChange={handleInputChange}
          placeholder="Ingrese su número de cédula"
          error={errors?.cedula}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Campo Contraseña */}
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Ingrese su contraseña"
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

        {/* Botón Iniciar Sesión */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">¿No tiene cuenta?</span>
          </div>
        </div>

        {/* Botón Crear Cuenta */}
        <Button
          type="button"
          variant="outline"
          onClick={onShowRegister}
          className="w-full"
          iconName="UserPlus"
          iconPosition="left"
        >
          Crear Nueva Cuenta
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;