import {UserService} from "../core/services/UserService";
import {NextFunction, Request, Response} from 'express';

const userService = new UserService();

export class UserController {

    async createUser(req: Request, res: Response, next: NextFunction) {

        try {
            const body = req.body;
            const result = await userService.createUser(body)
            return res.status(201).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async removeUser(req: Request, res: Response, next: NextFunction) {

        try {
            const body = req.body;
            const result = await userService.removeUser(body)
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async userVoted(req: Request, res: Response, next: NextFunction) {

        try {
            const body = req.body;
            const result = await userService.userVoted(body)
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }

    }
}