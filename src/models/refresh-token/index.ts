import BaseModel from "../BaseMode";

export class RefreshToken extends BaseModel {
  // Table name is the only required property.
  public static tableName = 'issued_refresh_tokens';
  public user_id!: string;
  public is_valid!: boolean;
  public token!: string;
  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  public static relationMappings = () => ({
    // specify relation with other modules
  })

}
