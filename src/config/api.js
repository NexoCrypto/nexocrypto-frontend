// Configuração da API para produção
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://nexocrypto-backend.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;

