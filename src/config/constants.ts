// Interface of the reponse returned by service menthods
export interface ServiceReponse<T> {
  success: boolean;
  data?: T;
}

export interface EnpoindReponse<T> {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  data?: T;
}
export interface Lookup<R = unknown> {
  [key: string]: R;
}

export const Base10 = 10;

export enum HttpResponseCode {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_REQUEST = 401,
  OK = 200,
  CREATED = 200,
}
