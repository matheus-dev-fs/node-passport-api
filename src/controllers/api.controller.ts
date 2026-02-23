import type { RequestHandler } from "express";
import { User, type UserInstance } from "../models/user.model.js";

export const ping: RequestHandler = (req, res): void => {
    res.status(200).json({ message: "pong" });
};

export const login: RequestHandler = (req, res): void => {

};

export const register: RequestHandler = (req, res): void => {
    
};

export const list: RequestHandler = async (req, res): Promise<void> => {
    const users: UserInstance[] = await User.findAll();

    if (users.length === 0) {
        res.status(404).json({ list: [] });
        return;
    }

    const emails: string[] = users.map((user: UserInstance): string => user.email);
    res.status(200).json({ list: emails }); 
};