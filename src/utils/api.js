// En producción (Railway), el frontend y backend están en el mismo dominio.
// En desarrollo, el backend corre en localhost:3001.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default API_URL;
