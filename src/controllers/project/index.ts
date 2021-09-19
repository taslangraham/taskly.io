import { Request, Response, Router } from "express";
import { Base10, EnpoindReponse, HttpResponseCode } from '../../config/constants';
import { findMissingFields } from "../../helpers/requiredFields";
import { isLoggedIn } from "../../middlewares/auth";
import { ProjectStatusCode as ProjectStatusID } from "../../modules/constants";
import { ProjectInfo } from '../../modules/entity/project';
import { projectService } from '../../services/project';
import { userService } from "../../services/user";
module.exports = () => {
  const router = Router();
  /**
   * Create a new Item
   */
  router.post("/", isLoggedIn, async (req, res) => {
    let result: EnpoindReponse<ProjectInfo> = { success: false };
    let status = HttpResponseCode.OK;
    const body = req.body;
    const userId = req.body._user.id;

    try {
      // Check request body type
      if (typeof (body) !== 'string' && typeof (body) !== 'object') {
        result = { success: false, errorMessage: 'Invalid request body' };
        status = HttpResponseCode.BAD_REQUEST;
      } else {
        const bodyJson = typeof (body) === 'string' ? JSON.parse(body) : body;

        // Check if user exists
        const isUserExist = await userService.findById(userId);
        if (!isUserExist.success) {
          result = { success: false, errorMessage: `Failed to find user` };
          status = HttpResponseCode.SERVER_ERROR;

        } else if (isUserExist.success && isUserExist.data !== undefined) {
          const missingFields = findMissingFields(bodyJson, ['title', 'description']);
          if (missingFields.length > 0) {
            result = { success: false, errorMessage: `Missing required fields: [ ${missingFields.toString()} ]` };
            status = HttpResponseCode.BAD_REQUEST;
          } else {
            // create project
            // Cast bodyJson to ProjectCreationInfo
            const creationInfo = bodyJson as ProjectInfo;
            creationInfo.user_id = userId;
            creationInfo.status_id = ProjectStatusID.OPEN;
            const { success, data } = await projectService.createProject(creationInfo);

            if (!success) {
              result = { success: false, errorMessage: `Failed to create Project` };
              status = HttpResponseCode.SERVER_ERROR;
            } else {
              result = { success: true, data };
              status = HttpResponseCode.OK;
            }
          }
        } else if (isUserExist.success && isUserExist.data === undefined) {
          result = { success: false, errorMessage: `User not found` };
          status = HttpResponseCode.NOT_FOUND;
        }
      }
    } catch (error) {
      result = { success: false, errorMessage: `Internal Server error` };
      status = HttpResponseCode.SERVER_ERROR;
    }
    return res.status(status).send(result);
  });

  /**
   * Get all Items
   */
  router.get("/", isLoggedIn, async (req: Request, res: Response) => {
    let result: EnpoindReponse<ProjectInfo[]> = { success: false };
    let status = HttpResponseCode.OK;

    try {
      const userId = req.body._user.id;
      const { success, data } = await projectService.getAllProjectsByUserId(userId);

      if (!success) {
        result = { success: false, errorMessage: `Failed to find projects` };
        status = HttpResponseCode.SERVER_ERROR;
      } else {
        result = { success: true, data };
        status = HttpResponseCode.OK;
      }

    } catch (error) {
      result = { success: false, errorMessage: `Internal Server error` };
      status = HttpResponseCode.SERVER_ERROR;
    }

    res.status(status).send(result);
  });

  /**
   * Get an Item by Id
   */
  router.get("/:id", isLoggedIn, async (req: Request, res: Response) => {
    let result: EnpoindReponse<ProjectInfo> = { success: false };
    let status = HttpResponseCode.OK;
    const projectId = Number.parseInt(req.params.id, Base10);
    const userId = Number.parseInt(req.body._user.id, Base10);
    try {
      const { success, data } = await projectService.getById(projectId, userId);

      if (!success) {
        result = { success: false, errorMessage: `Something went wrong` };
        status = HttpResponseCode.SERVER_ERROR;
      }

      if (success && data === undefined) {
        result = { success: false, errorMessage: `Project Not Found` };
        status = HttpResponseCode.NOT_FOUND;
      }

      if (success && data !== undefined) {
        result = { success: true, data };
        status = HttpResponseCode.OK;
      }
    } catch (error) {
      result = { success: false, errorMessage: `Internal Server error` };
      status = HttpResponseCode.SERVER_ERROR;
    }
    res.status(status).send(result);
  });

  /**
   * Update an Item
   */
  router.patch("/:id", isLoggedIn, async (req: Request, res: Response) => {
    let result: EnpoindReponse<boolean> = { success: false };
    let status = HttpResponseCode.OK;
    const projectId = Number.parseInt(req.params.id, Base10);
    const userId = Number.parseInt(req.body._user.id, Base10);
    const body = req.body;

    try {
      const bodyJson = (typeof (body) === 'string' ? JSON.parse(body) : body) as ProjectInfo;
      const update = {
        title: bodyJson.title,
        description: bodyJson.description,
        status_id: bodyJson.status_id,
      };

      const { success, data } = await projectService.update(projectId, userId, update);
      if (!success) {
        result = { success: false, errorMessage: `Failed to update` };
        status = HttpResponseCode.SERVER_ERROR;
      }

      if (success && data && data?.afffectedRows > 0) {
        result = { success: true };
        status = HttpResponseCode.OK;
      }

      if (success && data && data.afffectedRows === 0) {
        result = { success: false, errorMessage: 'Project not found' };
        status = HttpResponseCode.NOT_FOUND;
      }
    } catch (error) {
      result = { success: false, errorMessage: `Internal Server error` };
      status = HttpResponseCode.SERVER_ERROR;
    }

    res.status(status).send(result);
  });

  router.delete("/:id", isLoggedIn, async (req: Request, res: Response) => {
    let result: EnpoindReponse<boolean> = { success: false };
    let status = HttpResponseCode.OK;
    const projectId = Number.parseInt(req.params.id, Base10);
    const userId = Number.parseInt(req.body._user.id, Base10);
    try {
      const { success, data } = await projectService.deleteByProjectIdAndUserId(projectId, userId);

      if (!success) {
        result = { success: false, errorMessage: `Failed to delete` };
        status = HttpResponseCode.SERVER_ERROR;
      }

      if (success && data && data?.afffectedRows > 0) {
        result = { success: true };
        status = HttpResponseCode.OK;
      }

      if (success && data && data.afffectedRows === 0) {
        result = { success: false, errorMessage: 'Project not found' };
        status = HttpResponseCode.NOT_FOUND;
      }
    } catch (error) {
      result = { success: false, errorMessage: `Internal Server error` };
      status = HttpResponseCode.SERVER_ERROR;
    }

    return res.status(status).send(result)
  });

  return router;
};
