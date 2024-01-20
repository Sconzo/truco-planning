import {VotingSystemRepository} from "../repositories/VotingSystemRepository";
import {DeckMapper} from "../mappers/DeckMapper";
import {VotingSystemListResponse} from "../domain/dtos/votingSystem/VotingSystemListResponse";
import {AppError} from "../errors/AppError";


const repository = new VotingSystemRepository();
const mapper = new DeckMapper();


export class VotingSystemService {

    async listAllVotingSystems() {
        const decks = await repository.listAllDecks();
        const listVotingSystem: VotingSystemListResponse[] = [];
        if (decks.length !== 0) {
            decks.forEach(deck => {
                if (deck.id <= 2) {
                    listVotingSystem.push(mapper.entityToResponse(deck))
                }
            });
        } else {
            throw new AppError("Deck list is empty", 404)
        }
        return listVotingSystem
    }
}