import { Request, Response } from 'express';
import {VotingSystemService} from "../services/VotingSystemService";

const service = new VotingSystemService();

export class VotingSystemController{
    async listAll(req:Request,res:Response){

        const result = await service.listAllVotingSystems()

        return res.status(201).json(result);
    }
}