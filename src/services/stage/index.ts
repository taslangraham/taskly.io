import { EnpoindReponse, ServiceReponse } from "../../config/constants";
import { findMissingFields } from "../../helpers/requiredFields";
import { Stage } from '../../models/stage';
import { User } from "../../models/user";
import { ProjectStage } from '../../modules/entity/project';
import { projectService } from "../project";
import { userService } from "../user";

export enum StageErrorCode {
  MISSING_REQUIRED_FILEDS = 'PS_01',
  INTERNAL_SERVER_ERROR = 'PS_02',
  PROJECT_NOT_FOUND = 'PS_03',
  STAGE_NAME_EXISTS = 'PS_04',
  USER_NOT_FOUND = 'PS_05',
}
class StageService {
  private _foo = "foo";

  constructor() {
    //
  }

  private async saveStage(info: ProjectStage) {
    let result: ServiceReponse<ProjectStage>;

    try {
      const stage = await Stage
        .query()
        .insert({
          title: info.title,
          created_by: info.user_id,
          project_id: info.project_id,
        }).returning('*');

      result = {
        success: true,
        data: {
          id: stage.$id(),
          title: stage.title,
          user_id: stage.created_by,
          project_id: stage.project_id,
          created_at: stage.created_at,
          deleted_at: stage.deleted_at,
          upated_at: stage.updated_at,
        },
      };

    } catch (error) {
      console.log(error);
      result = { success: false };
    }

    return result;
  }

  public async findStageBytitleAndProjectId(title: string, projectId: number) {
    let result: ServiceReponse<Stage>;
    try {
      const stage = await Stage
        .query()
        .findOne({ title, project_id: projectId });

      result = { success: true, data: stage };
    } catch (error) { result = { success: true }; }

    return result;
  }

  /**
   * Creates a new Stage
   * @param requestJson
   * @param projectId
   * @param userId
   * @returns
   */
  public async createStage(requestJson: JSON, projectId: number, userId: number) {
    let result: ServiceReponse<ProjectStage> = { success: false };

    try {
      const missingFields = findMissingFields(requestJson, ['title']);
      const hasMissingFields = missingFields.length > 0;
      if (hasMissingFields) {
        result = {
          success: false,
          errorCode: StageErrorCode.MISSING_REQUIRED_FILEDS,
          errorMessage: `Missing required fields [ ${missingFields.toString()}]`,
        };
      }

      let isUserExist = false;

      if (!hasMissingFields) {
        // Check if user exists
        const existingUser = await userService.findById(userId);
        isUserExist = existingUser.success && existingUser.data !== undefined;
        if (!existingUser.success) {
          result = {
            success: false,
            errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
            errorMessage: `Internal Server Error`,
          };
        }
      }

      const creationInfo = (requestJson as unknown) as ProjectStage;
      let isUserOwnsProject = false;
      if (isUserExist) {
        // Check if user owns project
        const projectResult = await projectService.findByProjectByIdAndUserId(projectId, userId);
        isUserOwnsProject = projectResult.success && projectResult.data !== undefined;

        if (projectResult.success && projectResult.data === undefined) {
          result = {
            success: false,
            errorCode: StageErrorCode.PROJECT_NOT_FOUND,
            errorMessage: `Project not found`,
          };
        }

        if (!projectResult.success) {
          result = {
            success: false,
            errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
            errorMessage: `Internal Server Error`,
          };
        }
      }

      let canCreateStage = false;
      if (isUserOwnsProject) {
        // Check if stage name already exist
        const getExistingStage = await this.findStageBytitleAndProjectId(creationInfo.title, projectId);
        canCreateStage = getExistingStage.success && getExistingStage.data === undefined;

        if (getExistingStage.success && getExistingStage.data !== undefined) {
          result = {
            success: false,
            errorCode: StageErrorCode.STAGE_NAME_EXISTS,
            errorMessage: `A stage with the name ${creationInfo.title} already exist in this project`,
          };
        }
        if (!getExistingStage.success) {
          result = {
            success: false,
            errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
            errorMessage: `Internal server error`,
          };
        }
      }

      if (isUserExist && canCreateStage && isUserOwnsProject) {
        // Create Stage
        creationInfo.project_id = projectId;
        creationInfo.user_id = userId;
        const { success, data } = await this.saveStage(creationInfo);
        if (success) {
          result = { success: true, data };
        }
      }
    } catch (error) {
      result = {
        success: false,
        errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: `Something went wrong`,
      };
    }

    return result;
  }

  /**
   * Get all stages for a project
   * @param projectId Project to get stages for
   * @param userId Owner of the project
   * @returns
   */
  public async getAllProjectStages(projectId: number, userId: number) {
    let result: ServiceReponse<Stage[]> = { success: false };
    try {
      const user = await userService.findById(userId);
      if (user.success && user.data !== undefined) {
        const stages = await Stage.query()
          .where('project_id', projectId)
          .andWhere('created_by', userId)
          .withGraphFetched('tasks');

        result = { success: true, data: stages };
      } else if (!user.success) {
        result = {
          success: false,
          errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal Server Error',
        };
      } else if (user.success && user.data === undefined) {
        result = {
          success: false,
          errorCode: StageErrorCode.USER_NOT_FOUND,
          errorMessage: 'User Does not exist',
        };
      }

    } catch (error) {
      console.log(error)
      result = {
        success: false,
        errorCode: StageErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: 'Internal Server',
      };
    }

    return result;
  }
}

const stageService = new StageService();

export { stageService };
