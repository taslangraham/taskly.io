import { raw } from "objection";
import { ServiceReponse } from "../../config/constants";
import { Project } from "../../models/project";
import { Y } from "../../models/y";
import { UpdateResponse } from "../../modules/constants";
import { ProjectInfo } from "../../modules/entity/project";

class ProjectService {

  constructor() {
    //
  }

  public async createProject(info: ProjectInfo) {
    let result: ServiceReponse<Project>;
    try {
      const project = await Project
        .query()
        .insert({
          title: info.title,
          description: info.description,
          created_by: info.user_id,
          status_id: info.status_id,
        }).returning('*');

      result = { success: true, data: project }
    } catch (error) {
      console.log(`[PROJECT - createProject ] ${error}`);
      result = { success: false };
    }

    return result;
  }

  public async getAllProjectsByUserId(userId: number) {
    let result: ServiceReponse<Project[]>;

    try {
      const projects = await Project.query()
        .where('created_by', userId)
        .andWhere("deleted_at", null);
      result = { success: true, data: projects };
    } catch (error) {
      result = { success: false };
    }

    return result;
  }

  /**
   * Get project by project ID and user ID
   * @param id Project ID
   * @param userId User Id
   * @returns
   */
  public async findByProjectByIdAndUserId(id: number, userId: number) {
    let result: ServiceReponse<Project>;
    try {
      const project = await Project.query()
        .findOne({ id, created_by: userId })
        .andWhere("deleted_at", null)
        .withGraphFetched('stages.tasks', { aliases: { stages: 'd' } })
      // .orderBy(raw("order by d.id"));

      result = { success: true, data: project };
    } catch (error) {
      console.log(error);
      result = { success: false };
    }

    return result;
  }

  public async update(projectId: number, userId: number, projectInfo: ProjectInfo) {
    let result: ServiceReponse<UpdateResponse>;
    try {
      const afffectedRows = await Project.query()
        .findById(projectId)
        .where('created_by', userId)
        .andWhere("deleted_at", null)
        .patch({
          title: projectInfo.title,
          description: projectInfo.description,
          status_id: projectInfo.status_id,
        });

      result = { success: true, data: { afffectedRows } };
    } catch (error) {
      console.log(error);
      result = { success: false };
    }

    return result;
  }

  public async deleteByProjectIdAndUserId(projectId: number, userId: number) {
    let result: ServiceReponse<UpdateResponse>;
    try {
      const afffectedRows = await Project.query()
        .findById(projectId)
        .where('created_by', userId)
        .andWhere("deleted_at", null)
        .patch({
          deleted_at: new Date().toISOString(),
        });

      result = { success: true, data: { afffectedRows } };
    } catch (error) {

      console.log(error);
      result = { success: false };
    }

    return result;
  }
}

const projectService = new ProjectService();

export { projectService };
