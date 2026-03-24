export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#f43f5e', // rose
];

// If VITE_API_BASE_URL is set in the environment (e.g. Vercel), use it.
// Otherwise, default to localhost for development.
// Using optional chaining to prevent crash if import.meta.env is undefined
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5001/api';