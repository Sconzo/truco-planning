import {SessionInterface} from "../interfaces/session/SessionInterface"
import {CreateSessionRequest} from "../dtos/session/CreateSessionRequest";
import {VoteRevealRequest} from "../dtos/session/VoteRevealRequest";
import {ResetRequest} from "../dtos/session/ResetRequest";
import { v4 as uuidv4 } from 'uuid';
import {VotingSystemService} from "./VotingSystemService";
import {pusher} from "../server";
import {prisma} from "../prisma/client";
import {AppError} from "../errors/AppError";
import {UserInterface} from "../interfaces/user/UserInterface";
import {User} from "@prisma/client";

export const sessionList : SessionInterface[] = [];

const votingSystemService = new VotingSystemService();
export class SessionService {

    async createSession(req : CreateSessionRequest) : Promise<SessionInterface> {
        console.log("Started: Session Creation Flow")
        console.log("req ->")
        console.log(req)
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
                console.log("Voting System -> ", votingSystem)
                console.log("newSession -> ", newSession)
                return this.entityToResponse(votingSystem, newSession);
            }
            else{
                console.log("Voting System -> ", votingSystem)
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

        const sessionResponse: SessionInterface = {
            sessionId: newSession.sessionKey,
            roomName: newSession.sessionName,
            sessionSystem: {
                id: votingSystem.id,
                name: votingSystem.systemName,
                values: valueList,
                coffee: true
            },
            userList: []
        }
        return sessionResponse;
    }

    async getSessionById(sessionId : string) : Promise<SessionInterface> {
        const session = await prisma.session.findUnique({
            where: {
                sessionKey: sessionId
            },
            include: {
                users : true,
                votingSystem: {
                    include: {
                        votingValues: true
                    },
                },
            },
        });

        if(session){
            return this.entityToResponse(session.votingSystem,session)
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
}

