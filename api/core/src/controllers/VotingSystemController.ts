import { Request, Response } from 'express';
import {VotingSystemService} from "../core/services/VotingSystemService";

const service = new VotingSystemService();

export class VotingSystemController{
    async listAll(req:Request,res:Response){

        const result = await service.listAllVotingSystems()

        return res.status(201).json(result);
    }
    // async create(req:Request,res:Response){
    //
    //     const deck = req.body;
    //
    //     const result = await service.createNewVotingSystem(deck);
    //
    //     return res.status(201).json(result);
    // }
}