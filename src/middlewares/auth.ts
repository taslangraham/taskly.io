import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { EnpoindReponse } from '../config/constants';
import { authService } from '../services/auth';

/**
 * Middleware that verifies if a request has a valid token
 * @param req
 * @param response
 * @param next
 */
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers['auth-token'] && req.headers['auth-token'] as string;
  let errorResponse: EnpoindReponse;

  try {

    if (!authToken) {
      errorResponse = {
        success: false,
        errorMessage: 'Missing required Token',
        errorCode: 'A_01',
      };
      return res.status(401).send(errorResponse);
    }

    const decoded = authService.decodeToken(authToken);
    req.body._user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };

    return next();

  } catch (error) {
    console.log(`[ Auth middleware Error ]: ${error}`);
    errorResponse = {
      success: false,
      errorCode: 'A_02',
      errorMessage: (error as JsonWebTokenError).message,
    };
    return res.status(401).send(errorResponse);
  }
};
