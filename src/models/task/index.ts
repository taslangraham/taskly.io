import { Model } from "objection";
import { TaskContent } from "../../modules/entity/project";
import BaseModel from "../BaseMode";
import { Stage } from "../stage";

export class Task extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'tasks';
  public title!: string;
  public content!: TaskContent;
  public stage_id!: number;
  public user_id!: number;
  public project_id!: number;

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
    stage: {
      relation: Model.BelongsToOneRelation,
      modelClass: Stage,
      join: {
        from: 'tasks.stage_id',
        to: 'project_stages.id',
      },
    },
  })

}
