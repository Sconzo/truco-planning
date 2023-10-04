import {prisma} from "../../prisma/client";
import {VotingSystemRequest} from "../domain/dtos/votingSystem/VotingSystemRequest";
import {VotingValuesRepository} from "./VotingValuesRepository";

const votingValueRepository = new VotingValuesRepository();

export class VotingSystemRepository {


    public async listAllDecks() {
        const decks = await prisma.votingSystem.findMany({
            include: {
                votingValues: true
            }
        });

        return decks;
    }

    public async saveDeck(deck: VotingSystemRequest) {
        try {
            const deckSaved = await prisma.votingSystem.create({
                data: {
                    systemName: deck.name
                }
            })
            deck.values.forEach(value => {
                votingValueRepository.createOneValue(value, deckSaved.id)
            })

            return this.findDeckById(deckSaved.id)

        } catch (error) {
            console.error("Erro ao salvar o deck:", error);
            throw error;
        }
    }

    public async findDeckById(deckId: number) {
        const votingSystem = await prisma.votingSystem.findUnique({
            where: {
                id: deckId
            },
            include: {
                votingValues: true,
            }
        })

        return votingSystem;
    }
}
