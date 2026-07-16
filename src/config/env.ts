import dotenv from "dotenv";

// Loads variables from the .env file into process.env.
// Fiber/Go equivalent: godotenv.Load() at the top of main.go
dotenv.config();

// Centralizing env access here means the rest of the app never calls
// process.env directly — it imports `env` from this file instead.
// This gives us one place to see every config value the app needs,
// and one place to add defaults or validation later.
export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
