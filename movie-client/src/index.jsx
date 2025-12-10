import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import {  QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import store from './components/store/Store';
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Provider store={store}>
    <AuthProvider>
    <Routes>
        <Route path="/*" element={<App />}/>
    </Routes>
    </AuthProvider>
    </Provider>
    </BrowserRouter>
    </QueryClientProvider>
);



