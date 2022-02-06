import { ServiceReponse } from "../../config/constants";
import { findMissingFields } from "../../helpers/requiredFields";
import { Project } from "../../models/project";
import { Task } from "../../models/task";
import { AuthErrorCode, GeneralErrorCode, ProjectErrorCode, TaskErrorCode } from "../../modules/constants";
import { TaskContent, TaskCreationInfo, TaskUpdateInfo } from "../../modules/entity/project";
import { projectService } from "../project";
import { userService } from "../user";

class TaskService {
  private UserService = userService;

  constructor() {
    //
  }

  public async createTask(info: {
    requestJson: JSON;
    projectId: number;
    userId: number;
    stageId: number;
  }) {
    let result: ServiceReponse<Task> = { success: false };
    const { requestJson, projectId, userId, stageId } = info;
    try {
      // Check if all required fields exists
      const requiredFields = ['title', 'content'];
      const missingFields = findMissingFields(requestJson, requiredFields);
      const hasMissingFields = missingFields.length > 0;

      if (hasMissingFields) {
        result = {
          success: false,
          errorCode: TaskErrorCode.MISSING_REQUIRED_FILEDS,
          errorMessage: `Missing required fields [ ${missingFields.toString()} ]`,
        };
      }

      if (!hasMissingFields) {
        // Get user
        const findUser = await this.UserService.findById(userId);
        const isUserFound = findUser.success && findUser.data !== undefined;
        const userNotFound = findUser.success && findUser.data === undefined;
        if (userNotFound) {
          result = {
            success: false,
            errorCode: AuthErrorCode.USER_NOT_FOUND,
            errorMessage: 'User does not exist',
          };
        } else if (!findUser.success) {
          result = {
            success: false,
            errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
            errorMessage: 'Internal Server Error',
          };
        } else if (isUserFound) {
          // Get project and stage
          const project = await this.findProjectByProjectWithStageId(projectId, stageId);
          if (project === undefined) {
            result = {
              success: false,
              errorCode: ProjectErrorCode.NOT_FOUND,
              errorMessage: 'Project or stage does not exist',
            };
          } else {
            //  create task
            // Transform request json into taskcreationinfo
            const creationInfo: TaskCreationInfo = (requestJson as unknown as TaskCreationInfo);
            creationInfo.projectId = projectId;
            creationInfo.userId = userId;
            creationInfo.stageId = stageId;

            const task = await this.saveTask(creationInfo);
            result = {
              success: true,
              data: task,
            };
          }
        }
      }
    } catch (error) {
      result = {
        success: false,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: 'Failed to create task',
      };
    }

    return result;
  }

  private async saveTask(info: TaskCreationInfo) {
    const task = Task.query()
      .insert({
        title: info.title,
        project_id: info.projectId,
        user_id: info.userId,
        stage_id: info.stageId,
        content: info.content,
      })
      .returning("*");

    return task;
  }

  /**
   * Updates a task
   * @param info
   * @returns
   */
  public async updateTask(taskId: number, info: {
    requestJson: JSON;
    projectId: number;
    userId: number;
    stageId: number;
  }) {
    let result: ServiceReponse<Task> = { success: false };
    const { requestJson, projectId, userId, stageId: currentStageId } = info;
    try {
      // Get user
      const findUser = await this.UserService.findById(userId);
      const isUserFound = findUser.success && findUser.data !== undefined;
      const userNotFound = findUser.success && findUser.data === undefined;
      const isErrorFindingUser = findUser.success === false;

      if (userNotFound) {
        result = {
          success: false,
          errorCode: AuthErrorCode.USER_NOT_FOUND,
          errorMessage: 'User does not exist',
        };
      } else if (isErrorFindingUser) {
        result = {
          success: false,
          errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal Server Error',
        };
      } else if (isUserFound) {
        // Transform request json into TaskUpdateInfo
        const updateInfo: TaskUpdateInfo = (requestJson as unknown as TaskUpdateInfo);
        result = await this.processUpdate({ userId, projectId, currentStageId, taskId, updateInfo });
      }
    } catch (error) {
      result = {
        success: false,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: 'Failed to update task',
      };
    }

    return result;
  }

  private async processUpdate(info: {
    projectId: number;
    userId: number;
    currentStageId: number;
    taskId: number
    updateInfo: TaskUpdateInfo;
  }) {
    let result: ServiceReponse<Task> = { success: false };
    const { projectId, userId, currentStageId: stageId, updateInfo, taskId } = info;
    const { success, data } = await projectService.findByProjectByIdAndUserId(projectId, userId);

    if (success && data === undefined) {
      result = {
        success: false,
        errorMessage: "The Assciated project for this Task does not exist",
        errorCode: ProjectErrorCode.NOT_FOUND,
      };
    } else if (!success) {
      result = {
        success: false,
        errorMessage: "Internal Server error",
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
      };
    } else {
      //  Perform Task update
      const updatedTask = await this.performTaskUpdate({
        taskId, currentStageId: stageId,
        projectId,
        userId,
        info: updateInfo,
      });
      if (updatedTask === null) {
        result = { success: false, errorMessage: "Task does not exist", errorCode: TaskErrorCode.NOT_FOUND };
      } else {
        result = { success: true, data: updatedTask };
      }
    }

    return result;
  }

  /**
   * Updates a task and returns the updated task. Returns `null` if task was not found
   * @param data
   * @returns
   */
  private async performTaskUpdate(data: {
    taskId: number;
    currentStageId: number;
    projectId: number;
    userId: number;
    info: { content?: TaskContent; title?: string; stageId?: number }
  }) {
    const { taskId, projectId, userId, info, currentStageId: stageId } = data;
    const task: Task | null = await Task
      .query()
      .patchAndFetchById(taskId, {
        content: info?.content,
        title: info?.title,
        stage_id: info?.stageId,
      })
      .findById(taskId)
      .where("project_id", projectId)
      .where("stage_id", stageId)
      .where("user_id", userId);

    // console.log('task', task);
    return task !== undefined ? task : null;
  }
  /**
   * Returns the project that matches the project id and has the stage that matches the stageId
   * @param projectId
   * @param stageId
   */
  private async findProjectByProjectWithStageId(projectId: number, stageId: number) {
    const project = await Project
      .query()
      .findById(projectId)
      .joinRelated('stages', { alias: 's' })
      .where('s.project_id', '=', projectId)
      .andWhere('s.id', '=', stageId)
      .withGraphFetched('stages');

    return project;
  }

  private async findTaskByIdStageIdAndProjectId({ taskId, projectId, stageId, userId }:
    {
      taskId: number;
      projectId: number;
      stageId: number;
      userId: number
    }) {
    const task = await Task
      .query()
      .findById(taskId)
      .where('user_id', userId)
      .where('project_id', projectId)
      .where('stage_id', stageId);

    return task;
  }
}

const taskService = new TaskService();

export { taskService };
