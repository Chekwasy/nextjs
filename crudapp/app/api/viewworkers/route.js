import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function GET(request) {
    const dd = await request;
    try {
        const tok = dd.headers.get('tok');
        const pg = dd.headers.get('pg');
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return NextResponse.json('error', {status: 401});
        }
        const pageSize = 2; 
        const page = parseInt(pg);
        const workers = await dbClient.client.db().collection('workers')
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
        if (!workers) { return NextResponse.json('error', {status: 400});}
        return  NextResponse.json({workers: workers}, {status: 201});
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};

