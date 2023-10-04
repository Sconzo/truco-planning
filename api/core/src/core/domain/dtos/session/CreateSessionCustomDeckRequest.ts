import {VotingSystemRequest} from "../votingSystem/VotingSystemRequest";

export interface CustomSystemRequest {
    votingSystemRequest: VotingSystemRequest,
    sessionName: string
}