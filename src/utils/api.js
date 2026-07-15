// En producción, el frontend y el backend pueden compartir el mismo dominio vía rewrites de Vercel.
// En desarrollo, el backend corre en localhost:3001.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export default API_URL;
