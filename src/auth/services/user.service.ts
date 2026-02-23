import { User, type UserInstance } from "../../models/user.model.js";
import type { CreateUserResult } from "../../types/create-user-result.type.js";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string): Promise<CreateUserResult> => {
    const existingUser: UserInstance | null = await User.findOne({ where: { email } });

    if (existingUser) {
        const response: CreateUserResult = {
            isValid: false,
            status: 409,
            message: "Usuário já existe.",
        };
        return response;
    }

    const encryptedPassword: string = await bcrypt.hash(password, 10);
    const user: UserInstance = await User.create({ email, password: encryptedPassword });

    const response: CreateUserResult = {
        isValid: true,
        status: 201,
        message: "Usuário criado com sucesso.",
        data: {
            id: user.id,
            email: user.email,
        }
    };
    return response;
};