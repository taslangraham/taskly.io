import { stringHash } from "../../../.tode/lib/index";
import { ServiceReponse } from "../../config/constants";
import { findMissingFields, getFieldsWithMissingValue } from "../../helpers/requiredFields";
import { User } from '../../models/user';
import { AuthErrorCode, GeneralErrorCode } from "../../modules/constants";
import { UserInfo } from "../../modules/entity/auth";

export interface UserCreationInfo {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default class UserService {

  constructor() {
    //
  }

  public async findUserByEmail(email: string) {
    let result: ServiceReponse<User>;

    try {
      const user = await User.query().findOne({ email });
      result = {
        data: user || undefined,
        success: true,
      };
    } catch (error) {
      throw new Error(`[ Find By Email Error ]: ${error}`);
    }

    return result;
  }

  public async createUser2(registrationInfo: UserCreationInfo) {
    let result: ServiceReponse<UserInfo> = { success: false };
    try {
      // Check if  there's any missing fields
      const missingFields = getFieldsWithMissingValue(registrationInfo, ['firstName', 'lastName', 'email', 'password']);
      const hasMissingField = missingFields.length > 0;

      if (hasMissingField) {
        result = {
          errorCode: AuthErrorCode.MISSING_REQUIRED_FILEDS,
          success: false,
          errorMessage: `Missing required fields [ ${missingFields.toString()} ]`,
        };
      } else {
        const userInfo = registrationInfo;
        const findExistingUser = await this.findUserByEmail(userInfo.email);
        const isUserAlreadyExist = findExistingUser.data !== undefined;
        const isEmailAvailable = findExistingUser.success && findExistingUser.data === undefined;
        const canCreateUser = findExistingUser.success && !isUserAlreadyExist && isEmailAvailable;
        if (!findExistingUser.success) {
          result = {
            errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
            success: false,
            errorMessage: `Internal server error`,
          };
        } else if (isUserAlreadyExist) {
          result = {
            errorCode: AuthErrorCode.USER_ALREADY_EXISTS,
            success: false,
            errorMessage: `An account already exists for the email "${userInfo.email}"`,
          };
        } else if (canCreateUser) { result = await this.createUser(userInfo); }
      }
    } catch (error) {
      console.error(error);
      result = {
        success: false,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: "Internal server error",
      };
    }

    return result;
  }

  public async createUser(userInfo: UserCreationInfo) {
    let result: ServiceReponse<UserInfo>;
    try {
      const user = await User.query().insert({
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: await stringHash(userInfo.password),
      });
      const createdUser = user as UserInfo;
      delete createdUser.password;
      result = {
        data: createdUser,
        success: true,
      };

    } catch (error) {
      result = {
        success: false,
        errorCode: GeneralErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: "Internal server error",
      };
    }

    return result;
  }

  public async findById(id: number | string) {
    let result: ServiceReponse<User>;
    try {
      const user = await User.query().findById(id);
      result = { success: true, data: user };
    } catch (error) {
      console.log(`[USER SERVICE - $findBy ] ${error}`);
      result = { success: true };
    }

    return result;
  }
}

const userService = new UserService();

export { userService };
