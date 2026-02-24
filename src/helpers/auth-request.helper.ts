import { type Request } from 'express';
import type { ParseEmailAndPasswordResult } from '../interfaces/parse-email-and-password-result.interface.js';
import { HttpError } from '../errors/http.error.js';
import jwt, { type SignOptions } from 'jsonwebtoken';

export const parseEmailAndPassword = (req: Request): ParseEmailAndPasswordResult | null => {
    const email: string | undefined = req.body?.email?.trim().toLowerCase();
    const password: string | undefined = req.body?.password;

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

export const checkAuthorizationHeader = (authorization: string | undefined, type: 'Basic' | 'Bearer'): void => {
     if (!authorization) {
        throw new HttpError(401, "Não autorizado");
    }

    if (type === 'Basic' && !authorization.startsWith("Basic ")) {
        throw new HttpError(401, "Não autorizado");
    }

    if (type === 'Bearer' && !authorization.startsWith("Bearer ")) {
        throw new HttpError(401, "Não autorizado");
    }
}

export const generateTokenJwt = (user: { id: number; email: string }): string => {
    const payload = { id: user.id, email: user.email };
    const secretKey: string = process.env.JWT_SECRET_KEY ?? "1234";
    const options: SignOptions = { expiresIn: "1h" };

    return jwt.sign(payload, secretKey, options);
}