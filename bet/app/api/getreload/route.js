import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function GET(request) {
    const dd = await request;
    try {
        const tok = dd.headers.get("tok");
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const user = await dbClient.client.db().collection('users')
        .findOne({ "userID": usr_id });
        if (!user) { return  NextResponse.json('error', {status: 401});}
        if (parseFloat(user.accbal) < 10000) {
            const sa = await dbClient.client.db().collection('users')
                .updateOne({ userID: usr_id }, 
                { $set: { accbal: '10000'} });
            if (!sa) { return NextResponse.json('error', {status: 400});}
        }
        const ussr = await dbClient.client.db().collection('users')
            .findOne({ "userID": usr_id });
        if (!ussr) { return  NextResponse.json('error', {status: 401});}
        return  NextResponse.json({me: {userID: ussr.userID, fname: ussr.fname, lname: ussr.lname, email: ussr.email, mobile: ussr.mobile, accbal: ussr.accbal, currency: ussr.currency, rating: ussr.rating, sub: ussr.sub, TGames: ussr.TGames, TWon: ussr.TWon, TLost: ussr.TLost, nickname: ussr.nickname,}, logged: true, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
