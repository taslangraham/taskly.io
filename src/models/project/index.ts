import BaseModel from "../BaseMode";
import { Stage } from "../stage";

export class Project extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'projects';
  public title!: string;
  public description!: string;
  public status_id!: number;
  public created_by!: number;
  public deleted_at!: Date;
  public stages!: Stage[];
  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
    stages: {
      relation: BaseModel.HasManyRelation,
      modelClass: Stage,
      join: {
        from: 'projects.id',
        to: 'project_stages.project_id',
      },
    },
  })

}
