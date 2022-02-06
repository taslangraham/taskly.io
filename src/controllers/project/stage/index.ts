import { Request, Response, Router } from "express";
import { Base10 } from "../../../config/constants";
import { parseJson } from "../../../helpers/json-parser";
import { isLoggedIn } from "../../../middlewares/auth";
import { HttpResponseCode } from "../../../modules/constants";
import { StageErrorCode, stageService } from '../../../services/stage';
// tslint:disable-next-line: no-var-requires
const task = require('./task')();

module.exports = () => {
  const router = Router({ mergeParams: true });
  /**
   * Create a new Item
   */
  router.post("/", async (req, res) => {
    const parsedRequestBody = parseJson(req.body);
    const projectId = Number.parseInt(req.params.projectId, Base10);
    const userId = req.body._user.id;
    let status = 500;

    const result = await stageService.createStage(parsedRequestBody, projectId, userId);

    if (result.success) {
      status = 200;
    } else {
      const errorCode = result.errorCode;
      switch (errorCode) {
        case StageErrorCode.INTERNAL_SERVER_ERROR:
          status = 500;
          break;
        case StageErrorCode.MISSING_REQUIRED_FILEDS:
          status = 401;
          break;
        case StageErrorCode.PROJECT_NOT_FOUND:
          status = 404;
          break;
        case StageErrorCode.STAGE_NAME_EXISTS:
          status = 409;
          break;
      }

    }

    return res.status(status).send(result);
  });

  /**
   * Get all Items
   */
  router.get("/", async (req: Request, res: Response) => {
    const projectId = Number.parseInt(req.params.projectId, Base10);
    const userId = Number.parseInt(req.body._user.id, Base10);
    let status = HttpResponseCode.SERVER_ERROR;
    const result = await stageService.getAllProjectStages(projectId, userId);

    if (result.success) {
      status = HttpResponseCode.OK;
    } else {
      const errorCode = result.errorCode;
      switch (errorCode) {
        case StageErrorCode.INTERNAL_SERVER_ERROR:
          status = HttpResponseCode.SERVER_ERROR;
          break;
        case StageErrorCode.USER_NOT_FOUND:
          status = HttpResponseCode.NOT_FOUND;
          break;
      }
    }

    return res.status(status).send(result);
  });

  /**
   * Get an Item by Id
   */
  router.get("/:id", (req: Request, res: Response) => {
    res.send("stage/  - GET /id");

  });

  /**
   * Update an Item
   */
  router.patch("/:id", (req: Request, res: Response) => {
    res.send("stage/  - PATCH /id");
  });

  router.use('/:stageId/task', isLoggedIn, task);

  return router;
};
