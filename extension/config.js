// extension/config.js
// Central config for extension-wide variables

// You can change this to point to your deployed backend!
const BACKEND_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.BACKEND_BASE_URL)
  ? process.env.BACKEND_BASE_URL
  : 'http://localhost:8000';

export { BACKEND_BASE_URL };