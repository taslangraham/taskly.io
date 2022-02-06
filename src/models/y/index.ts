import BaseModel from "../BaseMode";

export class Y extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'projects';
  public foo!: string;

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })

}
