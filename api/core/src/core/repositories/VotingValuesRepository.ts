import {prisma} from "../../prisma/client";

export class VotingValuesRepository {

    public async createOneValue(value: number, systemId: number) {
        try {
            console.log("try create one value")
            await prisma.votingValues.create({
                data: {
                    intValue: value,
                    votingSystemId: systemId
                }
            })
        }
        catch (error){
            console.error("Erro ao salvar valores", error)
            throw error;
        }
    }
}
