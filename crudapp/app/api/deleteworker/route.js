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
        if (!tok) { console.log(1); return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            console.log(2);
            return  NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .deleteOne({ email: email, firstname: firstname, lastname: lastname });
        if (!user) { console.log(3); return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        console.log(4);
        return  NextResponse.json('error', {status: 400});
    }
};

