import {UserCreationRequest} from "../domain/dtos/user/UserCreationRequest";
import {UserInterface} from "../domain/interfaces/user/UserInterface"
import {pusher} from "../../server";
import {UserVoteRequest} from "../domain/dtos/user/UserVoteRequest";
import {UserRemoveRequest} from "../domain/dtos/user/UserRemoveRequest";
import {prisma} from "../../prisma/client";
import {User} from "@prisma/client";
import {AppError} from "../errors/AppError";

export class UserService {

    async createUser(req: UserCreationRequest): Promise<UserInterface> {

        const newUser: UserInterface = {
            userId: req.userIdFront,
            userName: req.name,
            vote: "",
            spectator: req.spectator,
            roomId: req.sessionId,
        }
        const found = await prisma.session.findUnique({
            where: {sessionKey: req.sessionId},
            include: {users: true}
        })
        if (found) {
            const newUser = await prisma.user.create({
                data: {
                    userName: req.name,
                    userKey: req.userIdFront,
                    spectator: req.spectator,
                    sessionId: found.id
                }
            })

            const userList: UserInterface[] = []
            found.users.forEach((user: User) => userList.push({
                userId: user.userKey,
                userName: user.userName,
                spectator: user.spectator,
                vote: user.userVote != null ? user.userVote.toString() : "",
                roomId: found.sessionKey
            }))
            userList.push({
                userId: newUser.userKey,
                userName: newUser.userName,
                spectator: newUser.spectator,
                vote: newUser.userVote != null ? newUser.userVote.toString() : "",
                roomId: found.sessionKey
            })

            await pusher.trigger('presence-session_' + req.sessionId, 'user_created', userList);
        } else {
            throw new AppError("Session not found", 404)
        }

        return newUser
    }

    async removeUser(req: UserRemoveRequest) {

        const sessionFound = await prisma.session.findUnique({
            where: {sessionKey: req.sessionId},
            include: {users: true}
        })
        if (sessionFound) {
            const userFound = sessionFound.users.find((obj: User) => {
                return obj.userKey === req.userId;
            });

            if (userFound) {
                const userDeleted = await prisma.user.delete({
                    where: {id: userFound.id}
                })

                const userList: UserInterface[] = []
                sessionFound.users.forEach((user: User) => {
                    if (user.id != userDeleted.id) {
                        userList.push({
                            userId: user.userKey,
                            userName: user.userName,
                            spectator: user.spectator,
                            vote: user.userVote != null ? user.userVote.toString() : "",
                            roomId: sessionFound.sessionKey
                        })
                    }
                })
                await pusher.trigger('presence-session_' + req.sessionId, 'user_created', userList);
            } else {
                throw new AppError("User not found", 404)
            }
        } else {
            throw new AppError("Session not found", 404)
        }
    }

    async userVoted(req: UserVoteRequest) {

        const sessionFound = await prisma.session.findUnique({
            where: {
                sessionKey: req.sessionId
            },
            include: {
                users: true
            }
        })

        if (sessionFound) {
            const userFound = sessionFound.users.find((obj: User) => {
                return obj.userKey === req.userId;
            });
            if (userFound) {
                const userWithNewVote = await prisma.user.update({
                    where: {id: userFound.id},
                    data: {userVote: req.vote != "" ? parseInt(req.vote) : null}
                });
                const userList: UserInterface[] = []
                sessionFound.users.forEach((user: User) => {
                    if (user.id != userWithNewVote.id) {
                        userList.push({
                            userId: user.userKey,
                            userName: user.userName,
                            spectator: user.spectator,
                            vote: user.userVote != null ? user.userVote.toString() : "",
                            roomId: sessionFound.sessionKey
                        })
                    } else {
                        userList.push({
                            userId: userWithNewVote.userKey,
                            userName: userWithNewVote.userName,
                            spectator: userWithNewVote.spectator,
                            vote: userWithNewVote.userVote != null ? userWithNewVote.userVote.toString() : "",
                            roomId: sessionFound.sessionKey
                        })
                    }
                })
                await pusher.trigger('presence-session_' + req.sessionId, 'user_created', userList);
            } else {
                throw new AppError("User not found", 404)
            }
        } else {
            throw new AppError("Session not found", 404)
        }
    }
}