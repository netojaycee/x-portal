// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('xtk')?.value;

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
            permissions: { name: string }[];
            role: string;
            sub: string;
        };
        return NextResponse.json({ payload }, { status: 200 });
    } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}