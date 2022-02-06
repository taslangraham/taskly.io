import Knex from 'knex';
import { Model } from 'objection';
import { env } from '../env';

const DATABASE = env.database;
const connnection = {
  client: DATABASE.client,
  connection: {
    database: DATABASE.name,
    user: DATABASE.user,
    password: DATABASE.password,
    port: DATABASE.port,
  },
  seeds: DATABASE.seeds,
  migrations: DATABASE.migrations,
}

function initializeDatabase() {

  // Initialize knex.
  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  if (env.database.isEnabled) {
    const knex = Knex(connnection);
    Model.knex(knex);
  }
}

export { initializeDatabase, connnection };
