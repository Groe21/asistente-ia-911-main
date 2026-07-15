import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/patient-dashboard': { label: 'Panel de Control', icon: 'LayoutDashboard' },
    '/patient-registration': { label: 'Registrar Paciente', icon: 'UserPlus' },
    '/patient-details': { label: 'Detalles del Paciente', icon: 'User' },
    '/ai-analysis-results': { label: 'Análisis IA', icon: 'Brain' },
    '/case-history': { label: 'Historial de Casos', icon: 'FileText' },
    '/login': { label: 'Iniciar Sesión', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Always start with dashboard as home
    if (location?.pathname !== '/patient-dashboard') {
      breadcrumbs?.push({
        label: 'Panel de Control',
        path: '/patient-dashboard',
        icon: 'LayoutDashboard'
      });
    }

    // Add current page
    const currentRoute = routeMap?.[location?.pathname] 
      || (location?.pathname?.startsWith('/patient-details/') ? routeMap['/patient-details'] : null);
    if (currentRoute) {
      breadcrumbs?.push({
        label: currentRoute?.label,
        path: location?.pathname,
        icon: currentRoute?.icon,
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-border" 
              />
            )}
            
            {crumb?.current ? (
              <span className="flex items-center space-x-2 text-foreground font-medium">
                <Icon name={crumb?.icon} size={16} />
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb?.path)}
                className="flex items-center space-x-2 hover:text-foreground transition-clinical"
                aria-label={`Navegar a ${crumb?.label}`}
              >
                <Icon name={crumb?.icon} size={16} />
                <span>{crumb?.label}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;