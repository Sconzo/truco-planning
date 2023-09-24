import {Router} from "express";
import {userRoute} from "./user.route";
import {sessionRoute} from "./session.route";
import {deckRoute} from "./deck.route";

const routes = Router();

routes.use("/session", sessionRoute);
routes.use("/user", userRoute);
routes.use("/deck",deckRoute );

export {routes}