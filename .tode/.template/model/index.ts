import BaseModel from "../BaseMode";

export class ModelClassName extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'animals';
  public foo!: string;

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })

}
