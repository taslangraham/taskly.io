import BaseModel from "../BaseMode";

export class ProjectStatus extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'project_statuses';
  public name!: string;

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })

}
