import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainNavigation = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Panel de Control',
      path: '/patient-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Vista general de casos y estadísticas'
    },
    {
      label: 'Registrar Paciente',
      path: '/patient-registration',
      icon: 'UserPlus',
      tooltip: 'Registro rápido de nuevos casos'
    },
    {
      label: 'Análisis IA',
      path: '/ai-analysis-results',
      icon: 'Brain',
      tooltip: 'Resultados de análisis inteligente'
    },
    {
      label: 'Historial de Casos',
      path: '/case-history',
      icon: 'FileText',
      tooltip: 'Revisión de casos anteriores'
    }
  ];

  const secondaryItems = [
    {
      label: 'Configuración',
      path: '/settings',
      icon: 'Settings',
      tooltip: 'Configuración del sistema'
    },
    {
      label: 'Ayuda',
      path: '/help',
      icon: 'HelpCircle',
      tooltip: 'Centro de ayuda y documentación'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('ia911_user');
    localStorage.removeItem('ia911_token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMoreMenuOpen && !event?.target?.closest('.more-menu-container')) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMoreMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000 h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Cross" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">IA-911 Assist</h1>
                <p className="text-xs text-muted-foreground">Sistema de Entrenamiento Médico</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-clinical
                  ${isActive(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-clinical-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}

            {/* More Menu */}
            <div className="relative more-menu-container">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-clinical
                  ${isMoreMenuOpen
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name="MoreHorizontal" size={18} />
                <span>Más</span>
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-clinical-lg z-1050">
                  <div className="py-2">
                    {secondaryItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                        title={item?.tooltip}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-muted transition-clinical"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-1100 lg:hidden">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Icon name="Cross" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">IA-911 Assist</h1>
                  <p className="text-xs text-muted-foreground">Sistema de Entrenamiento</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {menuItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      flex items-center space-x-3 w-full p-4 rounded-lg text-left transition-clinical
                      ${isActive(item?.path)
                        ? 'bg-primary text-primary-foreground shadow-clinical-sm'
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={24} />
                    <div>
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-sm opacity-75">{item?.tooltip}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-border my-6"></div>

              <div className="space-y-2">
                {secondaryItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className="flex items-center space-x-3 w-full p-4 rounded-lg text-left text-foreground hover:bg-muted transition-clinical"
                  >
                    <Icon name={item?.icon} size={24} />
                    <div>
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-sm text-muted-foreground">{item?.tooltip}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start"
                iconName="LogOut"
                iconPosition="left"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;