import { type Request } from 'express';
import type { ParseEmailAndPasswordResult } from '../interfaces/parse-email-and-password-result.interface.js';
import { HttpError } from '../errors/http.error.js';

export const parseEmailAndPassword = (req: Request): ParseEmailAndPasswordResult | null => {
    const email: string | undefined = req.body.email?.trim().toLowerCase();
    const password: string | undefined = req.body.password

    if (!email || !password) {
        return null;
    }

    return {
        email,
        password
    };
};

export const getCredentialsOrThrow = (req: Request): ParseEmailAndPasswordResult => {
    const data: ParseEmailAndPasswordResult | null = parseEmailAndPassword(req);

    if (!data) {
        throw new HttpError(400, "Email e/ou senha não fornecidos.");
    }

    return data;
};

export const checkBasicAuthorizationHeader = (authorization: string | undefined): void => {
     if (!authorization) {
        throw new HttpError(401, "Não autorizado");
    }

    if (!authorization.startsWith("Basic ")) {
        throw new HttpError(401, "Não autorizado");
    }
}