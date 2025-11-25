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
        console.log('Decoded JWT:', decoded); // Debug log
        
        // Try both userId and id fields
        (req as any).userId = decoded?.userId || decoded?.id;
        
        console.log('Set req.userId to:', (req as any).userId); // Debug log
        return next();
    } catch (err) {
        console.error('JWT verify error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export const authenticateToken = authenticate;