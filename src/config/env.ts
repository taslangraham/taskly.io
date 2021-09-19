/**
 * Loads in application environment variables
 */

import { config as initEnv } from 'dotenv';
import { Base10 } from "./constants";
initEnv();

interface Process extends NodeJS.ProcessEnv {
  DB_NAME: string;
  DB_TYPE: string;
  DB_CLIENT_URL: string;
  DB_PORT: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
}

const processEnv = process.env as Process;

// Configuration properties for database
const database = {};

export const env = {
  database,
  JWT_SECRET: processEnv.JWT_SECRET,
};
