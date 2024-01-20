import {NextFunction, Request, Response} from "express";
import {AppError} from "../errors/AppError";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error)

    if (error instanceof AppError) {
        return res.status(error.statusCode).send({"message": error.message});
    }

    return res.status(500).send({"message": error.message});
}