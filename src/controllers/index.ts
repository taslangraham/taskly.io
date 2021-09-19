import { Application, Router } from "express";
import fs from "fs";
import { routeTable } from "../config/route-table";

/**
 * Loads in all routes defined in controllers folder
 */
const routes = (app: Application) => {
  const directories = fs.readdirSync(`${__dirname}`, { withFileTypes: true });
  for (const directory of directories) {
    if (directory.isDirectory()) {

      const routeDef: Router = require(`./${directory.name}`)();
      // Register route
      app.use(`/${directory.name}`, routeDef);

      // Create an object with details about the route
      const routeInfo = routeDef.stack.map((s) => ({
        name: directory.name,
        path: '/' + directory.name + s.route.path,
        method: Object.keys(s.route.methods)[0],
      }));
      // Stores detail about the route
      // this is used tpo provide a print out of all routes
      // when you navigate to base route, /
      routeTable.register(routeInfo);
    }
  }
};

export {
  routes as loadRoutes,
};
