import type { JwtPayload } from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt, type StrategyOptions, type VerifiedCallback } from "passport-jwt";
import { findUserById } from "../services/credentials.service.js";
import type { PublicUser } from "../../interfaces/public-user.interface.js";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY || "1234"
}

export const jwtStrategy: JwtStrategy = new JwtStrategy(
    options,
    async (
        payload: JwtPayload,
        done: VerifiedCallback
    ): Promise<void> => {
        try {
            const IS_PAYLOAD_INVALID: boolean = !payload || !payload.id;

            if (IS_PAYLOAD_INVALID) {
                return done(null, false);
            }

            const IS_ID_INVALID: boolean = typeof payload.id !== "number";

            if (IS_ID_INVALID) {
                return done(null, false);
            }

            const user: PublicUser | null = await findUserById(payload.id);

            if (!user) {
                return done(null, false);
            }

            done(null, user);
        } catch (error) {
            done(error as Error);
        }
    }
);