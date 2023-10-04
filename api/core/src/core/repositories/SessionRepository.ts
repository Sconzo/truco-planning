import {prisma} from "../../prisma/client";

export class SessionRepository {

    public async getSessionById(sessionId : string){
        const session = await prisma.session.findUnique({
            where: {
                sessionKey: sessionId
            },
            include: {
                users : true,
                votingSystem: {
                    include: {
                        votingValues: true
                    },
                },
            },
        });

        return session;
    }
}