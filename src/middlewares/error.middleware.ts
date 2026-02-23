import type { ErrorRequestHandler } from 'express';
import type { ParseError } from '../types/errors/parse-error.type.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const error: ParseError = err as ParseError;

    const IS_JSON_PARSE_ERROR: boolean = error.status === 400 && error.type === 'entity.parse.failed';
    if (IS_JSON_PARSE_ERROR) {
        res.status(400).json({
            error: 'JSON inválido. Remova eventuais vírgulas extras ou corrija a estrutura do JSON.'
        });
        return;
    }

    if (error.status) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
};