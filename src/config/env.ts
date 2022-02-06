/**
 * Loads in application environment variables
 */

import { config as initEnv } from 'dotenv';
import { Base10 } from "./constants";
initEnv();

interface Process extends NodeJS.ProcessEnv {
  DB_NAME: string;
  DB_CLIENT: string;
  DB_PORT: string;
  DB_PASSWORD: string;
  DB_USER: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  IS_DB_ENABLED: string;

}

const processEnv = process.env as Process;

// Configuration properties for database
const database = {
  isEnabled: (processEnv.IS_DB_ENABLED as unknown) as boolean,
  client: processEnv.DB_CLIENT,
  name: processEnv.DB_NAME,
  user: processEnv.DB_USER,
  password: processEnv.DB_PASSWORD,
  port: Number.parseInt(processEnv.DB_PORT, Base10),
  seeds: {
    directory: 'src\\data-access\\seeds'
  },
  migrations: {
    tableName: "knex_migrations",
    directory: 'src\\data-access\\migrations',
  },
};

export const env = {
  database,
  JWT_SECRET: processEnv.JWT_SECRET,
  REFRESH_SECRET: processEnv.JWT_REFRESH_SECRET,
};
