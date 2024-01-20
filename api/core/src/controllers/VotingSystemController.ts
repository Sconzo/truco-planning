import {NextFunction, Request, Response} from 'express';
import {VotingSystemService} from "../core/services/VotingSystemService";

const service = new VotingSystemService();

export class VotingSystemController {
    async listAll(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await service.listAllVotingSystems()
            return res.status(200).json(result);
        } catch (error) {
            return next(error)
        }
    }
}