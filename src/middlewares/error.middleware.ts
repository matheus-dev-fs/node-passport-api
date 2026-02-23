import type { ErrorRequestHandler } from "express";
import type { ParseError } from "../types/errors/parse-error.type.js";
import { HttpError } from "../errors/http.error.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const error: ParseError = err as ParseError;

    const isJsonParseError: boolean =
        error.status === 400 && error.type === "entity.parse.failed";

    if (isJsonParseError) {
        res.status(400).json({
            error: "JSON inválido. Remova eventuais vírgulas extras ou corrija a estrutura do JSON.",
        });
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message });
        return;
    }

    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
};