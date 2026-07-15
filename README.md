# React

Un proyecto moderno basado en React que utiliza las tecnologías y herramientas frontend más recientes para construir aplicaciones web responsive.

## 🚀 Características

- **React 18** - Versión de React con mejoras en el renderizado y características concurrentes
- **Vite** - Herramienta de construcción y servidor de desarrollo ultrarrápido
- **Redux Toolkit** - Gestión del estado con una configuración de Redux simplificada
- **TailwindCSS** - Framework CSS utility-first con amplia personalización
- **React Router v6** - Enrutamiento declarativo para aplicaciones React
- **Visualización de datos** - Integración con D3.js y Recharts para visualización de datos potente
- **Gestión de formularios** - React Hook Form para manejo eficiente de formularios
- **Animaciones** - Framer Motion para animaciones de interfaz fluidas
- **Testing** - Configuración con Jest y React Testing Library

## 📋 Requisitos previos

- Node.js (v14.x o superior)
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
	 ```bash
	 npm install
	 # o
	 yarn install
	 ```
   
2. Iniciar el servidor de desarrollo:
	 ```bash
	 npm start
	 # o
	 yarn start
	 ```

## 📁 Estructura del proyecto

```
react_app/
├── public/             # Assets estáticos
├── src/
│   ├── components/     # Componentes UI reutilizables
│   ├── pages/          # Componentes de página
│   ├── styles/         # Estilos globales y configuración de Tailwind
│   ├── App.jsx         # Componente principal de la aplicación
│   ├── Routes.jsx      # Rutas de la aplicación
│   └── index.jsx       # Punto de entrada de la aplicación
├── .env                # Variables de entorno
├── index.html          # Plantilla HTML
├── package.json        # Dependencias y scripts del proyecto
├── tailwind.config.js  # Configuración de Tailwind CSS
└── vite.config.js      # Configuración de Vite
```

## 🧩 Añadir rutas

Para añadir nuevas rutas a la aplicación, actualiza el archivo `Routes.jsx`:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
	let element = useRoutes([
		{ path: "/", element: <HomePage /> },
		{ path: "/about", element: <AboutPage /> },
		// Añade más rutas según sea necesario
	]);

	return element;
};
```

## 🎨 Estilos

Este proyecto utiliza Tailwind CSS para el estilado. La configuración incluye:

- Plugin de Forms para estilado de formularios
- Plugin de Typography para estilado tipográfico
- Plugin de Aspect Ratio para elementos responsivos
- Container queries para diseño responsivo a nivel de componente
- Tipografía fluida para textos responsivos
- Utilidades de animación

## 📱 Diseño responsivo

La app está construida con diseño responsivo usando los breakpoints de Tailwind CSS.

## 📦 Despliegue

Genera la versión de producción de la aplicación:

```bash
npm run build
```

## 🙏 Agradecimientos

- Construido con ❤️ en Rocket.new
- Impulsado por React y Vite
- Estilado con Tailwind CSS

Built with ❤️ on Rocket.new

