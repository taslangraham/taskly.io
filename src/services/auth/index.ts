import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { hashCompare } from "../../../.tode/lib";
import { EnpoindReponse, ServiceReponse } from "../../config/constants";
import { env } from '../../config/env';
import { RefreshToken } from '../../models/refresh-token';
import { User } from '../../models/user';
const TOKEN_TIME_TO_LIVE = 36000; // 5 minutes
const { JWT_SECRET, REFRESH_SECRET } = env;

export interface LoginInfo {
  email: string;
  password: string;
}

interface JwtDecode extends JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

class Auth {

  constructor() {
    //
  }

  /**
   * Creates a JSON web token
   * @param user
   * @returns
   */
  public createTokenFromUser(user: User, isRefreshToken = false) {
    const body = {
      id: user && user.$id(),
      firstName: user && user.firstName,
      email: user && user.email,
      lastName: user && user.lastName,
    };

    const SECRET = isRefreshToken ? REFRESH_SECRET : JWT_SECRET;
    const TIME_TO_LIVE = isRefreshToken ? 1000000000 : TOKEN_TIME_TO_LIVE;

    const token = jwt.sign(
      body,
      SECRET,
      { expiresIn: TIME_TO_LIVE },
    );

    return token;
  }

  public async storeToken(token: string, userId: number) {
    let result: EnpoindReponse;
    // Invalidate any existing token linked to user
    try {
      await RefreshToken
        .query()
        .update({
          user_id: userId,
          is_valid: false,
        })
        .where({ user_id: userId })
        .andWhere({ is_valid: true });

      // Store new token
      await RefreshToken
        .query()
        .insert({
          user_id: userId,
          is_valid: true,
          token,
        });

      result = { success: true };
    } catch (error) {
      result = { success: false };
    }

    return result;
  }
  /**
   * Decodes a JSON web token
   * @param token
   * @returns
   */
  public decodeToken(token: string, isRefreshToken = false) {

    const secret = isRefreshToken ? REFRESH_SECRET : JWT_SECRET;
    return jwt.verify(token, secret, {
    }) as JwtDecode;
  }

  /**
   * Validates a User's login credentials and return the User if found
   * @param credentials
   */
  public async login(credentials: LoginInfo) {
    let result: ServiceReponse<User> = { success: false };

    try {
      const user = await User.query().findOne({
        email: credentials.email,
      }) || null;

      if (user === null) {
        result = {
          success: true,
          data: user,
        };
      } else {
        const isCorrectPassword = await hashCompare(credentials.password, user.password);
        result.data = isCorrectPassword ? user : undefined;
        result.success = true;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Failed to login');
    }

    return result;
  }

  public async refreshToken(token: string) {
    let result: EnpoindReponse;
    try {
      // Check if refresh token is valid (expired or any other jwt invalid reason)
      const decodedToken = this.decodeToken(token, true);
      // check if token is currently assigned to user and is is_valid
      // Update it if it is
      const updated = await RefreshToken.query()
        .update({
          is_valid: false,
        })
        .where('user_id', decodedToken.id)
        .andWhere('token', token)
        .andWhere('is_valid', true);

      if (updated > 0) {
        // create new token and store it in database
        const user = await User.query().findById(decodedToken.id);
        const authToken = this.createTokenFromUser(user);
        const refreshToken = this.createTokenFromUser(user, true);

        result = {
          success: true,
          data: {
            token: authToken,
            refreshToken,
          },
        };
      } else {
        result = { success: false };
      }

    } catch (error) {
      console.log(error);
      result = { success: false };
    }

    return result;
  }
}

const authService = new Auth();

export { authService };
