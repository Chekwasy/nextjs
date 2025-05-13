import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function DELETE(request) {
    let dd = "";
    try {
        dd = await request.headers.get(userdata);
        const { tok, email, firstname, lastname } = dd;
        if (!tok) { console.log(1, dd); return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            console.log(2, dd);
            return  NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .deleteOne({ email: email, firstname: firstname, lastname: lastname });
        if (!user) { console.log(3, dd); return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        console.log(4, dd);
        return  NextResponse.json('error', {status: 400});
    }
};

