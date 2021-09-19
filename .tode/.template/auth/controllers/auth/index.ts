import { Request, Response, Router } from "express";
import { isLoggedIn } from "../../middlewares/auth";
import { User } from "../../models/user";
import { authService, LoginInfo } from '../../services/auth';
import { UserCreationInfo, userService } from '../../services/user';

/**
 * This file contains a simple implementation of JWT based authentication
 * Feel free to modify logic/validations to match your needs
 */
module.exports = () => {
	const router = Router();
	/**
	 * Registers a new User
	 */
	router.post("/register", async (req: Request, res: Response) => {
		try {
			// TODO
			// check if all fields exist on request body and that their data type is correct
			const userInfo: UserCreationInfo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
			const { data, success } = await userService.findUserByEmail(userInfo.email);

			if (!success) { return res.status(500).send({ message: 'Internal server error' }); }
			if (success && data) { return res.status(409).send({ message: 'User already exist' }); }

			const result = await userService.createUser(userInfo);
			const createdUser = result.data;
			// create JWT
			const token = authService.createTokenFromUser(createdUser as User);

			return res.status(200).send({ token });
		} catch (error) {
			console.log('[Register Error ]:', error);
			return res.status(500).send({ message: 'Internal server error' });
		}
	});

	/**
	 * login
	 */
	router.post("/login", async (req: Request, res: Response) => {
		try {
			const loginInfo: LoginInfo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

			if (!loginInfo?.email || !loginInfo?.password) {
				return res.status(400).send({ message: 'Missing required fields' });
			}

			const { data: user, success } = await authService.login(loginInfo);

			if (!success) {
				return res.status(500).send({
					auth: false,
					message: 'Internal server error',
				});
			}

			if (user === null || user === undefined) {
				return res.status(401).send({
					auth: false,
					message: 'Invalid credential',
				});
			}

			// create JWT
			const token = authService.createTokenFromUser(user);

			return res.status(200).send({ auth: true, token });
		} catch (error) {
			return res.status(500).send({
				auth: false,
				message: 'Internal server error',
			});
		}
	});

	/**
	 * Get User
	 * This is a simple example of using the 'isLoggedIn' middleware to enforce
	 * authentication on individual routes
	 */
	router.get('/user', isLoggedIn, async (req: Request, res: Response) => {
		// Request will only hit here if request has a valid token
		// The 'isLoggedIn' middleware attatches a _user property to the body of the request
		const user = req.body._user;

		// The following will be returned if the user is Authenticated
		return res.status(200).send({ user, message: 'Authenticated' });
	});

	return router;
};
