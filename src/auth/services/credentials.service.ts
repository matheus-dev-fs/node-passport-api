import bcrypt from "bcrypt";
import { User, type UserInstance } from "../../models/user.model.js";
import type { PublicUser } from "../../interfaces/public-user.interface.js";

const toPublicUser = (user: UserInstance): PublicUser => ({
    id: user.id,
    email: user.email,
});

export const validateUserCredentials = async (
    email: string,
    password: string
): Promise<PublicUser | null> => {
    const user: UserInstance | null = await User.findOne({ where: { email } });

    if (!user) {
        return null;
    }

    const IS_PASSWORD_INVALID: boolean = !(await bcrypt.compare(password, user.password));

    if (IS_PASSWORD_INVALID) {
        return null;
    }

    return toPublicUser(user);
};