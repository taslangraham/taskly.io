import { Request, Response, Router } from "express";
import { Base10, EnpoindReponse } from "../../../../config/constants";
import { parseJson } from "../../../../helpers/json-parser";
import {
  AuthErrorCode,
  GeneralErrorCode,
  HttpResponseCode,
  ProjectErrorCode,
  TaskErrorCode,
} from "../../../../modules/constants";
import { taskService } from "../../../../services/task";
module.exports = () => {
  const router = Router({ mergeParams: true });

  /**
   * Create a new Item
   */
  router.post("/", async (req, res) => {
    let status = 500;
    let result: EnpoindReponse;
    try {
      const parsedRequestBody = parseJson(req.body);
      const projectId = Number.parseInt(req.params.projectId, Base10);
      const userId = req.body._user.id;
      const stageId = Number.parseInt(req.params.stageId, Base10);

      const info = {
        requestJson: parsedRequestBody,
        projectId,
        userId,
        stageId,
      };
      const task = await taskService.createTask(info);
      result = { ...task };
      if (task.success) {
        status = HttpResponseCode.OK;
      } else {
        const errorCode = task.errorCode;
        switch (errorCode) {
          case TaskErrorCode.MISSING_REQUIRED_FILEDS:
            status = HttpResponseCode.BAD_REQUEST;
            break;
          case ProjectErrorCode.NOT_FOUND:
          case AuthErrorCode.USER_NOT_FOUND:
            status = HttpResponseCode.NOT_FOUND;
            break;
          case GeneralErrorCode.INTERNAL_SERVER_ERROR:
            status = HttpResponseCode.SERVER_ERROR;
            break;
        }
      }
    } catch (error) {
      result = {
        success: true,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
      };
      status = HttpResponseCode.SERVER_ERROR;
    }

    return res.status(status).send(result);
  });

  /**
   * Get all Items
   */
  router.get("/", (req: Request, res: Response) => {
    res.send("project/stage/task/  - GET");
  });

  /**
   * Get an Item by Id
   */
  router.get("/:id", (req: Request, res: Response) => {
    return res.send("project/stage/task/  - GET /id");
  });

  /**
   * Update an Item
   */
  router.put("/:id", async (req: Request, res: Response) => {
    let status = 500;
    let result: EnpoindReponse;

    try {
      const parsedRequestBody = parseJson(req.body);
      const projectId = Number.parseInt(req.params.projectId, Base10);
      const userId = req.body._user.id;
      const currentStageId = Number.parseInt(req.params.stageId, Base10);
      const taskId = Number.parseInt(req.params.id, Base10);

      const info = {
        requestJson: parsedRequestBody,
        projectId,
        userId,
        stageId: currentStageId,
      };
      const { success, errorCode, errorMessage, data } = await taskService.updateTask(taskId, info);
      result = { success, errorCode, data, errorMessage };
      if (success) {
        status = HttpResponseCode.OK;
      } else {
        switch (errorCode) {
          case TaskErrorCode.MISSING_REQUIRED_FILEDS:
            status = HttpResponseCode.BAD_REQUEST;
            break;
          case ProjectErrorCode.NOT_FOUND:
          case AuthErrorCode.USER_NOT_FOUND:
            status = HttpResponseCode.NOT_FOUND;
            break;
          case GeneralErrorCode.INTERNAL_SERVER_ERROR:
            status = HttpResponseCode.SERVER_ERROR;
            break;
        }
      }

    } catch (error) {
      result = {
        success: true,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
      };
      status = HttpResponseCode.SERVER_ERROR;
    }

    return res.status(status).send(result);
  });

  return router;
};
