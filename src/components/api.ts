

import axios from 'axios';



const api = axios.create({
  baseURL: 'https://m2dd-chatserver.hf.space', 
  withCredentials: true, 
});

export default api;
 
