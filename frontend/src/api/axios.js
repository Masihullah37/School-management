// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
//   withCredentials: true,
// })

// axiosClient.interceptors.request.use(function (config) {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = 'Bearer ' + token
//   }
//   return config
// })

// export {axiosClient}

// axios.js

import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
  withCredentials: true,
})

// Request Interceptor (Existing)
axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// 👇 CRITICAL FIX: Response Interceptor to handle expired tokens
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for 401 Unauthorized status
    if (error.response && error.response.status === 401) {
      console.log('🚨 Received 401 Unauthorized. Clearing Local Storage.');
      
      // 1. Force clear Local Storage
      localStorage.removeItem('token');
      localStorage.removeItem('AUTHENTICATED');
      
      // 2. Force redirect to a clean state (login page or home)
      //    We use location.replace() for a clean history.
      window.location.replace(window.location.origin + '/login?expired=1');
    }
    return Promise.reject(error);
  }
);

export {axiosClient}
