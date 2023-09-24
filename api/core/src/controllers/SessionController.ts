import { Request, Response } from 'express';
import {SessionService} from "../core/services/SessionService";

const service = new SessionService();
export class SessionController {

    async createSession(req:Request,res:Response){

        const body = req.body;

        const result = await service.createSession(body)

        return res.status(201).json(result);
    }
    async getSessionById(req:Request,res:Response){

        try{
            const sessionId = req.params.sessionId;

            const result = await service.getSessionById(sessionId).catch()

            return res.status(201).json(result);
        }
        catch (error){
            res.status(404).send("Session not found");
        }
    }

    async voteReveal(req:Request,res:Response){

        try{
            const result = await service.voteReveal(req.body).catch()

            return res.status(201).json(result);
        }
        catch (error){
            res.status(404).send("Vote Reveal Failed");
        }
    }

    async reset(req:Request,res:Response){

        try{
            const result = await service.reset(req.body).catch()

            return res.status(201).json(result);
        }
        catch (error){
            res.status(404).send("Reset failed");
        }
    }
}