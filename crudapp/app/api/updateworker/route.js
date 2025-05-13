import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { ObjectID } from 'mongodb';

export async function PUT(request) {
    try {
        const { tok, age, department, address, mobile } = await request.json();
        const lastupdate = new Date();
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            console.log(1);
            return NextResponse.json('error', {status: 400});
        }
        const user = await (await dbClient.client.db().collection('workers'))
        .updateOne({ "_id": ObjectID(usr_id) }, 
        { $set: { age: age, department: department, address: address, mobile: mobile, lastupdate: lastupdate} });       
        if (!user) { return  NextResponse.json('error', {status: 400});}
        return  NextResponse.json('success', {status: 201});
    } catch {
        console.log(4);
        return  NextResponse.json('error', {status: 400});
    }
};

