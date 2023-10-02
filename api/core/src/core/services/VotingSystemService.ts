import {VotingSystemRepository} from "../repositories/VotingSystemRepository";
import {DeckMapper} from "../mappers/DeckMapper";
import {VotingSystemListResponse} from "../domain/dtos/votingSystem/VotingSystemListResponse";
import {VotingSystemRequest} from "../domain/dtos/votingSystem/VotingSystemRequest";


const repository = new VotingSystemRepository();
const mapper = new DeckMapper();


export class VotingSystemService {

    async listAllVotingSystems() {
        const decks = await repository.listAllDecks();
        const listVotingSystem : VotingSystemListResponse[] = [];
        decks.forEach(deck => {
            if (deck.id <= 2) {
                listVotingSystem.push(mapper.entityToResponse(deck))
            }
        });
        return listVotingSystem
    }

    // async createNewVotingSystem(deck : VotingSystemRequest) {
    //
    //     const deckCreated = await repository.saveDeck(deck);
    // }
}