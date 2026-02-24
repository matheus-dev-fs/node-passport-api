import type { RequestHandler } from "express";
import { User, type UserInstance } from "../models/user.model.js";
import { generateTokenJwt, getCredentialsOrThrow } from "../helpers/auth-request.helper.js";
import { createUser, loginUser } from "../auth/services/user.service.js";
import type { CreateUserResult } from "../types/create-user-result.type.js";
import type { ParseEmailAndPasswordResult } from "../interfaces/parse-email-and-password-result.interface.js";
import { HttpError } from "../errors/http.error.js";
import type { PublicUser } from "../interfaces/public-user.interface.js";
import type { LoginUserResult } from "../types/login-user-result.type.js";

export const ping: RequestHandler = (_req, res): void => {
    res.status(200).json({ message: "pong" });
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const result: ParseEmailAndPasswordResult = getCredentialsOrThrow(req);
        const { email, password }: ParseEmailAndPasswordResult = result;
        const loginResult: LoginUserResult = await loginUser(email, password);

        if (!loginResult.isValid) {
            throw new HttpError(loginResult.status, loginResult.message);
        }

        const user: PublicUser | undefined = loginResult.data;

        if (!user) {
            throw new HttpError(500, "Erro ao realizar login.");
        }

        const token: string = generateTokenJwt({ id: user.id, email: user.email });

        res.status(loginResult.status).json({ response: loginResult, token });
    } catch (error) {
        next(error);
    }
};

export const register: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const data: ParseEmailAndPasswordResult = getCredentialsOrThrow(req);
        const { email, password }: ParseEmailAndPasswordResult = data;
        const createUserResult: CreateUserResult = await createUser(email, password);

        if (!createUserResult.isValid) {
            throw new HttpError(createUserResult.status, createUserResult.message);
        }

        const user: PublicUser | undefined = createUserResult.data;

        if (!user) {
            throw new HttpError(500, "Erro ao criar usuário.");
        }

        const token: string = generateTokenJwt({ id: user.id, email: user.email });

        res.status(createUserResult.status).json({ response: createUserResult, token });
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