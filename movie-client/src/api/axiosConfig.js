import axios from "axios";
import env from "react-dotenv";

// template check
// console.log(`${import.meta.env.VITE_SPRING_BOOT}/api/v1`);

const moviesApi = axios.create({
  baseURL: "/api/v1",
  headers: {
    'Content-Type': 'application/json'
  }
}); 
export default moviesApi;