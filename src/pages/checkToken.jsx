// axios.js

import axios from "axios";
// import useNavigate from "react-router-dom";
import {url_local,url_api} from "../Provider.jsx";
const instance = axios.create({
  baseURL: url_api, 
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = url_local;
      // const navigate = useNavigate('/');
    }
    return Promise.reject(error);
  }
);

export default instance;
