export enum ProjectStatusCode {
  OPEN = 1,
}

// Response object when you update a row in a database table
export interface UpdateResponse {
  afffectedRows: number;
}