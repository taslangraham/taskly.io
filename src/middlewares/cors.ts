import cors, { CorsOptions } from "cors";
import { Application } from "express";

const corsOptions: CorsOptions = {
  methods: "GET,HEAD,PUT,PATCH,DELETE",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  origin: "",
  preflightContinue: true,
};

function configureCors(app: Application) {
  return app.use(cors(corsOptions));
}
export { configureCors };
