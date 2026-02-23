import type { NextFunction, Request, Response } from "express";
import passport from "../config/passport.config.js";
import { HttpError } from "../errors/http.error.js";
import type { PublicUser } from "../interfaces/public-user.interface.js";

export const privateRoute = (req: Request, _res: Response, next: NextFunction): void => {
    const authenticate = passport.authenticate("basic", (err: unknown, user: PublicUser | false): void => {
        if (err) {
            next(err);
            return;
        }

        if (!user) {
            const error: HttpError = new HttpError(401, "Não autorizado");
            next(error);
            return;
        }

        req.user = user;
        next();
    });

    authenticate(req, _res, next);
};
