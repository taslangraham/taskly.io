import express, { Request, Response } from "express";
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile';
import { loadBodyParser } from "./config";
import { config as databaseConfig } from "./config/database/db-config";
import { routeTable } from "./config/route-table";
import { loadRoutes } from "./controllers";

// Initialize knex.
const knex = Knex(knexConfig.development);
// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex);
const app = express();

try {
  loadBodyParser(app);
  // Load configuration settings for Database
  // You can define the values in env.ts

  app.get("/", async (req: Request, res: Response) => {
    return res.status(200).send({
      message: `Powered by Tode - a Nodejs Scaffolding told.\nBelow is a list of your Application's endpoints`,
      endpoints: routeTable.routes,
    },
    );
  });

  // register the entry route above
  routeTable.register(app._router.stack
    .filter((s: { route: any; }) => s.route)
    .map((r: any) => ({
      name: '/',
      path: r.route.path,
      method: Object.keys(r.route.methods)[0],
    })));

  // Loads in user defined routes
  loadRoutes(app);
} catch (error) {
  throw new Error(error as string);
}

export {
  app,
};
