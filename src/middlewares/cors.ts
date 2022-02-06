import cors, { CorsOptions } from "cors";
import { Application } from "express";

const corsOptions: CorsOptions = {
  methods: ["GET", "HEAD", "PUT", "PATCH", "DELETE"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  origin: 'http://localhost:8080',
  preflightContinue: true,
  credentials: true,
};

function configureCors(app: Application) {
  app.use(cors(corsOptions));
  app.options('/*', (_, res) => {
    res.sendStatus(200);
  });
}
export { configureCors };
