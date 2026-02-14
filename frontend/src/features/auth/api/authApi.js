import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Auth Service
export const login = async (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = async (userData) => {
    return api.post('/auth/register', userData);
};
