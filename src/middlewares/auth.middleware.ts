import type { NextFunction, Request, Response } from "express";
import passport from "../config/passport.config.js";
import { HttpError } from "../errors/http.error.js";
import type { PublicUser } from "../interfaces/public-user.interface.js";
import { checkBasicAuthorizationHeader } from "../helpers/auth-request.helper.js";

export const privateRoute = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authorization: string | undefined = req.get("authorization");
        checkBasicAuthorizationHeader(authorization);

        const authenticate = passport.authenticate(
            "basic",
            { session: false },
            (err: unknown, user: PublicUser | false): void => {
                if (err) {
                    next(err);
                    return;
                }

                if (!user) {
                    res.setHeader("WWW-Authenticate", "Basic");
                    next(new HttpError(401, "Não autorizado"));
                    return;
                }

                req.user = user;
                next();
            }
        );

        authenticate(req, res, next);
    } catch (error) {
        res.setHeader("WWW-Authenticate", "Basic");
        next(error);
    }
};