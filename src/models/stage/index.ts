import { Model } from "objection";
import BaseModel from "../BaseMode";
import { Project } from "../project";
import { Task } from "../task";

export class Stage extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'project_stages';
  public title!: string;
  public created_by!: number;
  public project_id!: number;
  public deleted_at!: Date;
  public updated_at!: Date;
  public created_at!: Date;
  public tasks!: Task[];

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: Task,
      join: {
        from: 'project_stages.id',
        to: 'tasks.stage_id',
      },
    },
    project: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Project,
      join: {
        from: 'stages.project_id',
        to: 'projects.id',
      },
    },
  })

}
