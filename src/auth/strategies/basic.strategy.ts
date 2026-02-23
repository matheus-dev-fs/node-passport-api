import { BasicStrategy } from "passport-http";
import { type UserInstance } from "../../models/user.model.js";
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

        const user: UserInstance | null = await validateUserCredentials(email, password);

        if (!user) {
            done(null, false);
            return;
        }

        return done(null, { email, password });
    } catch (error) {
        return done(error as Error);
    }}
);