import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function GET(request) {
    try {
        const tok = request.header.get('tok');
        const pg = request.header.get('pg');
        if (!tok) { console.log(1); return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            console.log(2); return NextResponse.json('error', {status: 400});
        }
        const pageSize = 2; 
        const page = parseInt(pg);
        const workers = await dbClient.client.db().collection('workers')
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
        if (!workers) { console.log(3); return NextResponse.json('error', {status: 400});}
        return  NextResponse.json({workers: workers}, {status: 201});
    } catch {
        console.log(4, request.header); return NextResponse.json('error', {status: 400});
    }
};

