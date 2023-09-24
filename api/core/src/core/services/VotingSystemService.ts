import {VotingSystemInterface} from "../domain/interfaces/votingSystem/VotingSystemInterface";
import {VotingSystemRepository} from "../repositories/VotingSystemRepository";

export const Basic : VotingSystemInterface= {
    id : 1,
    name: "BASIC",
    values: [1, 2, 4, 8, 16],
    coffee: true
}

export const Fibonacci : VotingSystemInterface = {
    id : 2,
    name: "FIBONACCI",
    values: [0, 1, 2, 3, 5, 8, 13, 21, 34],
    coffee: true
}
export const possibleSystems : VotingSystemInterface[] = [Basic,Fibonacci];

const repository = new VotingSystemRepository();

export class VotingSystemService {

    async getVotingSystem(id:number) {
        return possibleSystems.find(sys=> sys.id === id);
    }

    async listAllVotingSystems() {
        return repository.listAllDecks();

    }

    async createNewVotingSystem(id:number) {

    }
}