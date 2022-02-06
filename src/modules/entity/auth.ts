export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}
