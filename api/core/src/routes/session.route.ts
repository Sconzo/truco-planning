import {Router} from "express";
import {SessionController} from "../controllers/SessionController";

const controller = new SessionController();
const sessionRoute = Router();

sessionRoute.post('/', controller.createSession);
sessionRoute.post('/custom-deck', controller.createSessionCustomDeck);
sessionRoute.get('/:sessionId', controller.getSessionById);
sessionRoute.patch('/reveal', controller.voteReveal);
sessionRoute.patch('/reset', controller.reset);

export {sessionRoute};
