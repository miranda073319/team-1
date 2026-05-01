// Base URL of the backend API.
// In development: reads from .env (VITE_API_BASE=http://127.0.0.1:8000)
// In production build: Vite injects .env.production automatically
// This file is NEW - it does not modify any existing frontend code.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

export default API_BASE;
