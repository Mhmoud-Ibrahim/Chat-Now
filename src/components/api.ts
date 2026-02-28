

import axios from 'axios';



const api = axios.create({
  baseURL: 'https://chat-server-delta-eight.vercel.app', // رابط الباك اند
  withCredentials: true, 
});

export default api;
 
