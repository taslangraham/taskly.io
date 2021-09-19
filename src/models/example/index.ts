import BaseModel from "../BaseMode";

export class Example extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'example';

  public name!: string;
  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })
}
