import type { RequestHandler } from "express";
import { User, type UserInstance } from "../models/user.model.js";
import { parseEmailAndPassword } from "../utils/auth-request.util.js";
import { createUser } from "../auth/services/user.service.js";
import type { CreateUserResult } from "../types/create-user-result.type.js";
import type { ParseEmailAndPasswordResult } from "../interfaces/parse-email-and-password-result.interface.js";
import { HttpError } from "../errors/http.error.js";

export const ping: RequestHandler = (req, res): void => {
    res.status(200).json({ message: "pong" });
};

export const login: RequestHandler = (req, res): void => {

};

export const register: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const data: ParseEmailAndPasswordResult | null = parseEmailAndPassword(req);

        if (!data) {
            const error: HttpError = new HttpError(400, "Email ou/e senha não informados.");
            next(error);
            return;
        }

        const { email, password }: ParseEmailAndPasswordResult = data;
        const response: CreateUserResult = await createUser(email, password);

        if (!response.isValid) {
            const error: HttpError = new HttpError(response.status, response.message);
            next(error);
            return;
        }

        res.status(response.status).json({ message: response.message, user: response.data });
    } catch (error) {
        next(error);
    }
};

export const list: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const users: UserInstance[] = await User.findAll();

        if (users.length === 0) {
            res.status(200).json({ list: [] });
            return;
        }

        const emails: string[] = users.map((user: UserInstance): string => user.email);
        res.status(200).json({ list: emails });
    } catch (error) {
        next(error);
    }
};