/**
 * api.js
 * Unified API client for communicating with the Flask backend.
 * Uses relative '/api' which works directly when served from Flask (port 5000)
 * and through Vite reverse proxy (port 3000), with explicit fallback.
 */

// Determine base API url dynamically (supports cloud deployments like Vercel + Render)
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  // If hosted on Flask (port 5000) or Vite (port 3000 with proxy), relative '/api' works cleanly!
  return '/api';
};

const BASE_URL = getBaseUrl();
const DIRECT_BACKEND = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : 'http://127.0.0.1:5000/api';

const safeFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (res.ok) return res;
    // If relative fails (e.g. static dev file opening), fallback to direct backend
    const fallbackRes = await fetch(`${DIRECT_BACKEND}${endpoint}`, options);
    return fallbackRes;
  } catch (err) {
    // Attempt direct backend URL
    const fallbackRes = await fetch(`${DIRECT_BACKEND}${endpoint}`, options);
    return fallbackRes;
  }
};

export const checkHealth = async () => {
  try {
    const res = await safeFetch('/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.error('API health error:', err);
    return { status: 'offline', error: err.message };
  }
};

export const getModelInfo = async () => {
  const res = await safeFetch('/model-info');
  if (!res.ok) throw new Error('Failed to load model info');
  return await res.json();
};

export const getPersonas = async () => {
  const res = await safeFetch('/personas');
  if (!res.ok) throw new Error('Failed to load personas');
  return await res.json();
};

export const getDatasetStats = async () => {
  const res = await safeFetch('/dataset-stats');
  if (!res.ok) throw new Error('Failed to load dataset stats');
  return await res.json();
};

export const predictSingle = async (customerData) => {
  const res = await safeFetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Prediction failed (${res.status})`);
  }
  return await res.json();
};

export const predictAllModels = async (customerData) => {
  const res = await safeFetch('/predict-all-models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Multi-model prediction failed (${res.status})`);
  }
  return await res.json();
};

export const predictBatch = async (records) => {
  const res = await safeFetch('/predict-batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Batch prediction failed (${res.status})`);
  }
  return await res.json();
};

export const predictBatchFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await safeFetch('/predict-batch', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Batch file upload failed (${res.status})`);
  }
  return await res.json();
};
