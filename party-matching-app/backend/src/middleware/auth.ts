import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing Authorization header' });

    const parts = header.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // attach userId to request in a type-agnostic way
        (req as any).userId = decoded?.id;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}