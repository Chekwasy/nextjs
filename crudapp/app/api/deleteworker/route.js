import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function DELETE(request) {
    let dd = "";
    try {
        dd = await request.json();
        const { tok, email, firstname, lastname } = dd;
        console.log("8888888hg");
        if (!tok) { console.log("hdhdhg"); return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 400});
        }
        console.log("hg");
        const user = await (await dbClient.client.db().collection('workers'))
        .deleteOne({ email: email, firstname: firstname, lastname: lastname });
        console.log("hdxxxcxxxcxhdhg");
        if (!user) { console.log("44444hg"); return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        console.log("9999999hg", dd);
        return  NextResponse.json('error', {status: 400});
    }
};

