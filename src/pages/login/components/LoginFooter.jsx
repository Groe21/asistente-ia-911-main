import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      {/* Security Notice */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-success mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-success mb-1">
              Conexión Segura
            </h4>
            <p className="text-xs text-success/80">
              Sus datos están protegidos con cifrado SSL de 256 bits.
            </p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <button className="hover:text-foreground transition-clinical">
          Política de Privacidad
        </button>
        <span>•</span>
        <button className="hover:text-foreground transition-clinical">
          Términos de Uso
        </button>
        <span>•</span>
        <button className="hover:text-foreground transition-clinical">
          Guía de Usuario
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} IA-911 Assist. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sistema de asistencia médica con inteligencia artificial.
        </p>
      </div>

      {/* Version Info */}
      <div className="text-center">
        <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-medical-data">
          <Icon name="Code" size={12} className="mr-1" />
          v2.1.0 - Build 2024.11.02
        </span>
      </div>
    </div>
  );
};

export default LoginFooter;