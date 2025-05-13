import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { ObjectID } from 'mongodb';

export async function PUT(request) {
    const dd = await request.json();
    try {
        console.log(dd);
        const { tok, age, department, address, mobile,} = dd;
        const lastupdate = new Date();
        if (!tok) { console.log(1, dd ); return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .updateOne({ "_id": ObjectID(usr_id) }, 
        { $set: { age: age, department: department, address: address, mobile: mobile, lastupdate: lastupdate} });       
        if (!user) { return  NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

