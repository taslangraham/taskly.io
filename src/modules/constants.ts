export enum ProjectStatusCode {
  OPEN = 1,
}

// Response object when you update a row in a database table
export interface UpdateResponse {
  afffectedRows: number;
}

export enum HttpResponseCode {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  OK = 200,
  CREATED = 200,
  CONFLICT = 409,
  UNAUTHENTICATED = 401,
}

export enum AuthErrorCode {
  USER_NOT_FOUND = 'A_01',
  INVALID_CREDENTIALS = 'A_02',
  USER_ALREADY_EXISTS = 'A_03',
  MISSING_REQUIRED_FILEDS = 'A_04',
}
export enum GeneralErrorCode {
  INTERNAL_SERVER_ERROR = 'GE_01',
}

export enum ProjectErrorCode {
  NOT_FOUND = 'PE_01',
  MISSING_REQUIRED_FIELDS = 'PE_02',
  INVALID_REQUEST_BODY = 'PE_03',
}

export enum TaskErrorCode {
  MISSING_REQUIRED_FILEDS = 'PST_0',
  NOT_FOUND = 'PST_01',
}
