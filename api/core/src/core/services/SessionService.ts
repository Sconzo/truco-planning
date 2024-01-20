import {SessionInterface} from "../domain/interfaces/session/SessionInterface"
import {CreateSessionRequest} from "../domain/dtos/session/CreateSessionRequest";
import {VoteRevealRequest} from "../domain/dtos/session/VoteRevealRequest";
import {ResetRequest} from "../domain/dtos/session/ResetRequest";
import {v4 as uuidv4} from 'uuid';
import {pusher} from "../../server";
import {prisma} from "../../prisma/client";
import {AppError} from "../errors/AppError";
import {UserInterface} from "../domain/interfaces/user/UserInterface";
import {User} from "@prisma/client";
import {SessionRepository} from "../repositories/SessionRepository";
import {CustomSystemRequest} from "../domain/dtos/session/CreateSessionCustomDeckRequest";
import {VotingSystemRepository} from "../repositories/VotingSystemRepository";
import {SessionMapper} from "../mappers/SessionMapper";

export const sessionList : SessionInterface[] = [];

const sessionRepository = new SessionRepository();
const votingSystemRepository = new VotingSystemRepository();
const mapper = new SessionMapper();
export class SessionService {

    async createSession(req : CreateSessionRequest) : Promise<SessionInterface> {

        const votingSystem = await prisma.votingSystem.findUnique({
            where: {
                id: req.votingSystemId
            },
            include: {
                votingValues: true,
            }
        })
        if(votingSystem){
            const newSession = await prisma.session.create({
                data: {
                    sessionName : req.name,
                    sessionKey : uuidv4(),
                    votingSystemId : 1
                }
            })
            return mapper.entityToResponse(votingSystem, newSession);
        }
        else{
            throw new AppError("Voting System not found", 404)
        }

    }

    async getSessionById(sessionId : string) : Promise<SessionInterface> {
        let sessionFound = await sessionRepository.getSessionById(sessionId);
        let maxTries = 0;
        while ((sessionFound == null || sessionFound.users.length == 0) && maxTries < 99999){
            sessionFound = await sessionRepository.getSessionById(sessionId);
            maxTries ++;
        }

        if(sessionFound && sessionFound.users.length !== 0){
            return mapper.entityToResponse(sessionFound.votingSystem,sessionFound)
        }
        else{
            throw new AppError("Session not found after " + maxTries + "tries", 404)
        }
    }

    async voteReveal(req : VoteRevealRequest) {
        await pusher.trigger('presence-session_' + req.sessionId, 'vote_reveal', req.mean);
    }

    async reset(req : ResetRequest) {
        const session = await prisma.session.findUnique({
            where : {
                sessionKey: req.sessionId
            },
            include : {
                users: true
            }
        })

        const userList : UserInterface[] = []
        if(session){
            await prisma.user.updateMany({
                where: { sessionId: session.id },
                data: { userVote: null }
            });

            session.users.forEach((user : User) => userList.push({
                userId : user.userKey,
                userName : user.userName,
                spectator : user.spectator,
                vote : "",
                roomId : session.sessionKey
            }))
        }
        else{
            throw new AppError("Session not found", 404)
        }

        await pusher.trigger('presence-session_' + req.sessionId, 'reset', userList);
    }

    async createSessionCustomDeck(req : CustomSystemRequest) : Promise<SessionInterface> {
        const deck = await votingSystemRepository.saveDeck(req.votingSystemRequest)
        if(deck){
            const newSession = await prisma.session.create({
                data: {
                    sessionName : req.sessionName,
                    sessionKey : uuidv4(),
                    votingSystemId : deck.id
                }
            })
            return mapper.entityToResponse(deck, newSession);
        }
        else{
            throw new AppError("Deck not found", 404)
        }
    }
}

