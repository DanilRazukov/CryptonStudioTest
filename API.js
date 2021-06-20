import axios from 'axios';

const baseURL = "";

var axiosOpts = {
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL,
  timeout: 60 * 1000,
  withCredentials: true,
}


const API = axios.create(axiosOpts);

export default API;