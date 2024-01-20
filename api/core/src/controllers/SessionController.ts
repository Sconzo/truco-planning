import {NextFunction, Request, Response} from 'express';
import {SessionService} from "../core/services/SessionService";

const service = new SessionService();

export class SessionController {

    async createSession(req: Request, res: Response, next: NextFunction) {

        try {
            const body = req.body;
            const result = await service.createSession(body)
            return res.status(201).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async getSessionById(req: Request, res: Response, next: NextFunction) {

        try {
            const sessionId = req.params.sessionId;
            const result = await service.getSessionById(sessionId)
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async voteReveal(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await service.voteReveal(req.body)
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async reset(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await service.reset(req.body)
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }
    }

    async createSessionCustomDeck(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const result = await service.createSessionCustomDeck(body.customSystemRequest)
            return res.status(201).json(result);
        }
        catch (error){
            return next(error)
        }

    }
}