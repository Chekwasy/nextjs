import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function DELETE(request) {
    let dd = await request;
    try {
        const tok = dd.headers.get('tok');
        const firstname = dd.headers.get('firstname');
        const lastname = dd.headers.get('lastname');
        const email = dd.headers.get('email');
        if (!tok) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .deleteOne({ email: email, firstname: firstname, lastname: lastname });
        if (!user) { return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

