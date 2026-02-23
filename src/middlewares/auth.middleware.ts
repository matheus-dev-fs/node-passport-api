import type { NextFunction, Request, Response } from "express";
import passport from "../config/passport.config.js";
import type { UserInstance } from "../models/user.model.js";
import type { ErrorResponse } from "../types/errors/error-response.type.js";

const notAuthorizedJson: ErrorResponse = { status: 401, message: "Não autorizado" };

export const privateRoute = (req: Request, res: Response, next: NextFunction): void => {
    const authenticate = passport.authenticate("basic", (err: any, user: UserInstance | false): void => {
        if (err) {
            next(err);
            return;
        }

        if (!user) {
            res.status(401).json(notAuthorizedJson);
            return;
        }

        req.user = user;
        next();
    });

    authenticate(req, res, next);
};
