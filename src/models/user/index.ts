import BaseModel from "../BaseMode";
export class User extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'users';

  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public createdAt!: Date;
  public deletedAt!: Date;
  public updatedAt!: Date;

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })
}
