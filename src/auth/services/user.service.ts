import { User, type UserInstance } from "../../models/user.model.js";
import type { CreateUserResult } from "../../types/create-user-result.type.js";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import type { LoginUserResult } from "../../types/login-user-result.type.js";

export const createUser = async (email: string, password: string): Promise<CreateUserResult> => {
    try {
        const existingUser: UserInstance | null = await User.findOne({ where: { email } });

        if (existingUser) {
            const response: CreateUserResult = {
                isValid: false,
                status: 409,
                message: "Usuário já existe.",
            };
            return response;
        }

        const encryptedPassword: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) ?? 10);
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
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            const response: CreateUserResult = {
                isValid: false,
                status: 409,
                message: "Usuário já existe.",
            };
            return response;
        }

        throw error;
    }
};

export const loginUser = async (email: string, password: string): Promise<LoginUserResult> => {
    try {
        const existingUser: UserInstance | null = await User.findOne({ where: { email } });

        if (!existingUser) {
            const response: LoginUserResult = {
                isValid: false,
                status: 401,
                message: "Credenciais inválidas.",
            };
            return response;
        }
        
        const isPasswordValid: boolean = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            const response: LoginUserResult = {
                isValid: false,
                status: 401,
                message: "Credenciais inválidas.",
            };
            return response;
        }

        const response: LoginUserResult = {
            isValid: true,
            status: 200,
            message: "Login realizado com sucesso.",
            data: {
                id: existingUser.id,
                email: existingUser.email,
            }
        };
        
        return response;
    } catch (error) {
        throw error;
    }
}
