import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth';

/**
 * Middleware that verifies if a request has a valid token
 * @param req
 * @param response
 * @param next
 */
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization && req.headers.authorization;
  try {

    if (!authToken) {
      return res.status(403).send({ auth: false, message: 'Missing required Token' });
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
    return res.status(403).send({ auth: false, message: JSON.stringify(error) });
  }
};
