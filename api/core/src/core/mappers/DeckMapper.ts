import {VotingSystemListResponse} from "../domain/dtos/votingSystem/VotingSystemListResponse";

export class DeckMapper {


    public entityToResponse = (entity: any) : VotingSystemListResponse => {
        const valueList : number[] = [];
        entity.votingValues.forEach((value: { intValue: number; }) => valueList.push(value.intValue))

        return {
            id: entity.id,
            name: entity.systemName,
            intValues: valueList
        };
    }
}