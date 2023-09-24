import {UserInterface} from "../user/UserInterface";
import {VotingSystemInterface} from "../votingSystem/VotingSystemInterface";

export interface SessionInterface {
    sessionId: string,
    roomName: string,
    sessionSystem: VotingSystemInterface;
    userList : UserInterface[]
}