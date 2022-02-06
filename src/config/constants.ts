// Interface of the reponse returned by service menthods
export interface ServiceReponse<T> {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  data?: T;
}

export interface EnpoindReponse extends ServiceReponse<any> {
}
export interface Lookup<R = unknown> {
  [key: string]: R;
}

export const Base10 = 10;
