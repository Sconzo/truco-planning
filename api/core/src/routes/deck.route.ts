import {Router} from "express";
import {VotingSystemController} from "../controllers/VotingSystemController";

const controller = new VotingSystemController()
const deckRoute = Router();

deckRoute.get('/list',controller.listAll)

export {deckRoute};
