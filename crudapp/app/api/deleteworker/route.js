import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function DELETE(request) {
    let dd = "";
    try {
        dd = await request.headers.get(userdata);
        const { tok, email, firstname, lastname } = dd;
        if (!tok) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .deleteOne({ email: email, firstname: firstname, lastname: lastname });
        if (!user) { return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        console.log(dd);
        return  NextResponse.json('error', {status: 400});
    }
};

