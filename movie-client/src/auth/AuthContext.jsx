import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setupAxiosInterceptors } from '../api/axiosTokenInterceptor';
import moviesApi from '../api/axiosConfig';
import { useDispatch } from 'react-redux';
import { hideAlert, showAlert } from '../components/store/AlertSlice';
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState("");
const navigate = useNavigate();
  useEffect(()=>{
    setupAxiosInterceptors(moviesApi, tokenExpiredlogOut);
    

  },[])
  useEffect(() => {
    if (token) {
      try {
        // console.log(token);
        const { username } = jwtDecode(token);
        setUsername(username);
      } catch (error) {
        console.log("error on effect check if token expired");
        
        // If the token is invalid or expired, clear it
        localStorage.removeItem('authToken');
        setToken(null);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, [token]);

  // Function to handle login
  const logIn = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  // Function to handle logout
  const logOut = () => {
    localStorage.removeItem('authToken');
    qc.clear();
    setToken(null);
    setUsername(null);
  };
  const tokenExpiredlogOut = () => {
    localStorage.removeItem('authToken');
    qc.clear();
    setToken(null);
    setUsername(null);
    navigate("/login");
    dispatch(showAlert({message: "Your token expired please log in again", variant: "warning"}));
    
  };

  // The value object to be provided to consumers
  const value = {
    token,
    username,
    logOut,
    logIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};