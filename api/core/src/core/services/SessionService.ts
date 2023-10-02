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

export const sessionList : SessionInterface[] = [];

const sessionRepository = new SessionRepository();
const votingSystemRepository = new VotingSystemRepository();
export class SessionService {

    async createSession(req : CreateSessionRequest) : Promise<SessionInterface> {
        //console.log("Started: Session Creation Flow")
        try{
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
                        votingSystemId : votingSystem.id
                    }
                })
                return this.entityToResponse(votingSystem, newSession);
            }
            else{
                throw new AppError("Error creating session")
            }
        }
        catch (error){
            throw new AppError("Error creating session")
        }
    }

    private entityToResponse(votingSystem : any, newSession : any) {
        const valueList: number[] = [];
        [...votingSystem.votingValues.values()].forEach(value => valueList.push(value.intValue))

        const userList : UserInterface[] = [];

        if(newSession.users && newSession.users.length > 0) {
            newSession.users.forEach((user: User) => {
                userList.push({
                    userId: user.userKey,
                    userName: user.userName,
                    spectator: user.spectator,
                    vote: user.userVote !== null ? user.userVote.toString() : "",
                    roomId: newSession.sessionKey
                })
            })
        }

        const sessionResponse: SessionInterface = {
            sessionId: newSession.sessionKey,
            roomName: newSession.sessionName,
            sessionSystem: {
                id: votingSystem.id,
                name: votingSystem.systemName,
                intValues: valueList
            },
            userList: userList
        }
        return sessionResponse;
    }

    async getSessionById(sessionId : string) : Promise<SessionInterface> {
        let sessionFound = await sessionRepository.getSessionById(sessionId);
        let maxTries = 0;
        while ((sessionFound == null || sessionFound.users.length == 0) && maxTries < 10){
            sessionFound = await sessionRepository.getSessionById(sessionId);
            maxTries ++;
        }

        if(sessionFound && sessionFound.users.length !== 0){
            return this.entityToResponse(sessionFound.votingSystem,sessionFound)
        }
        else{
            console.log("Session not found")
            return Promise.reject("Session not found");
        }
    }

    async voteReveal(req : VoteRevealRequest) {
        //const session = this.getSessionById(req.sessionId);

        await pusher.trigger('presence-session_' + req.sessionId, 'vote_reveal', req.mean);

    }

    async reset(req : ResetRequest) {
        console.log(req.sessionId)
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
            const usersAfterVoteReset = await prisma.user.updateMany({
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

        await pusher.trigger('presence-session_' + req.sessionId, 'reset', userList);
    }

    async createSessionCustomDeck(req : CustomSystemRequest) : Promise<SessionInterface> {
        console.log("Started: Session Creation Flow", req.sessionName)
        try{
            const deck = await votingSystemRepository.saveDeck(req.votingSystemRequest)

            console.log(deck)
            if(deck){

                const newSession = await prisma.session.create({
                    data: {
                        sessionName : req.sessionName,
                        sessionKey : uuidv4(),
                        votingSystemId : deck.id
                    }
                })
                return this.entityToResponse(deck, newSession);
            }
            else{
                throw new AppError("Error creating session")
            }
        }
        catch (error){
            console.error("Erro criando deck customizado", error)
            throw error
        }
    }
}

