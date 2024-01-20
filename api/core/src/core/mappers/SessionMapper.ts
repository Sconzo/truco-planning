import {UserInterface} from "../domain/interfaces/user/UserInterface";
import {User} from "@prisma/client";
import {SessionInterface} from "../domain/interfaces/session/SessionInterface";

export class SessionMapper {
    public entityToResponse(votingSystem : any, newSession : any) : SessionInterface {
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

        return {
            sessionId: newSession.sessionKey,
            roomName: newSession.sessionName,
            sessionSystem: {
                id: votingSystem.id,
                name: votingSystem.systemName,
                intValues: valueList
            },
            userList: userList
        };
    }
}