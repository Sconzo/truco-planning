import {prisma} from "../prisma/client";

export class VotingSystemRepository {

    public async listAllDecks (){
        const decks = await prisma.votingSystem.findMany({
            include: {
                votingValues : true
            }
        });

        return decks;
    }
}