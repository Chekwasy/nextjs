import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function POST(request) {
    try {
        const { tok, firstname, lastname, age, department, address, mobile, sex, nationality, email } = await request.json();
        const dateadded = new Date();
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const user = await dbClient.client.db().collection('workers')
        .insertOne({firstname: firstname, lastname: lastname, age: age, department: department,
            address: address, mobile: mobile, sex: sex, nationality: nationality, email: email, 
            dateadded: dateadded, lastupdate: dateadded
        });
        if (!user) { return  NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

