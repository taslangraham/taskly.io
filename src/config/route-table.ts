import express, { Application } from "express";
import { Lookup } from "./constants";

export interface RouteInfo {
  name: string;
  path: string;
  method: string;
}
class RouteTable {
  private routeList: Lookup<RouteInfo[]> = {};

  public register(info: RouteInfo[]) {
    this.routeList = {
      ...this.routeList,
      [info[0].name]: info,
    };
  }

  public get routes() {
    let routeTableString = ``;
    const keys = Object.keys(this.routeList);

    for (const key of keys) {
      routeTableString += `${key.toUpperCase()} \n`;
      this.routeList[key].forEach((r) => {
        // method: r.method,
        //   path: r.path,

        routeTableString += `\t${r.path} [${r.method.toUpperCase()}]\n`;
      });
      routeTableString += '\n';
    }

    return keys.map((routeName) => {
      const route = this.routeList[routeName];

      const paths = route.map((r) => ({
        method: r.method.toUpperCase(),
        path: r.path,
      }));
      return {
        name: routeName,
        routes: paths,
      };
    });
  }
}

const routeTable = new RouteTable();
export { routeTable };
