// config/env.ts

import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "CLIENT_URL",
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "JWT_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}
