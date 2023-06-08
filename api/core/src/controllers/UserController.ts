import {UserService} from "../services/UserService";
import { Request, Response } from 'express';

const userService = new UserService();

export class UserController{

    async createUser(req : Request,res:Response) {
        const body = req.body;

        try {
            const result =  await userService.createUser(body)
            return res.status(201).json(result);

        } catch (error) {
            console.log(error)
        }

    }
}