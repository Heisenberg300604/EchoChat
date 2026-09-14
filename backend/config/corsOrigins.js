const defaultOrigins = ["http://localhost:3000"];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
