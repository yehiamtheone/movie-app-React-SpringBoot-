import React from 'react'
import { useAuth } from './auth/AuthContext'
import { Navigate } from 'react-router-dom';

const BlockLoginRouteForAuth = ({children}) => {
    const {token} = useAuth();
    if (token) {
        return <Navigate to="/" replace />;

        
    }
    return children;
}

export default BlockLoginRouteForAuth;