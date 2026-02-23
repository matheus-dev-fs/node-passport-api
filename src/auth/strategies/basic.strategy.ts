import { BasicStrategy } from "passport-http";
import type { PublicUser } from "../../interfaces/public-user.interface.js";
import { validateUserCredentials } from "../services/credentials.service.js";

export const basicStrategy: BasicStrategy = new BasicStrategy(async (
    email,
    password,
    done
): Promise<void> => {
    try {
        const IS_EMAIL_OR_PASSWORD_NOT_SENT: boolean = !email || !password;

        if (IS_EMAIL_OR_PASSWORD_NOT_SENT) {
            done(null, false);
            return;
        }

        const user: PublicUser | null = await validateUserCredentials(email, password);

        if (!user) {
            done(null, false);
            return;
        }

        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }}
);