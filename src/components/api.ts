

import axios from 'axios';



const api = axios.create({
  baseURL: 'https://chat-server-git-main-mahmouds-projects-90220037.vercel.app', // رابط الباك اند
  withCredentials: true, 
});

export default api;
 
