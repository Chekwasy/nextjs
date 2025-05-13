import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function PUT(request) {
    let dd = "";
    try {
        dd = await request.json();
        const { tok, age, department, address, mobile, email } = dd;
        const lastupdate = new Date();
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .updateOne({ email: email }, 
        { $set: { age: age, department: department, address: address, mobile: mobile, lastupdate: lastupdate} });
        if (!user) { return NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

