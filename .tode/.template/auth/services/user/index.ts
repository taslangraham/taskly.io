import { stringHash } from "../../../.tode/lib/index";
import { ServiceReponse } from "../../config/constants";
import { User } from '../../models/user';

export interface UserCreationInfo {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

class UserService {

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

  public async createUser(userInfo: UserCreationInfo) {
    let result: ServiceReponse<User>;
    try {
      const user = await User.query().insert({
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: await stringHash(userInfo.password),
      });

      result = {
        data: user,
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create User');
    }

    return result;
  }
}

const userService = new UserService();

export { userService };
