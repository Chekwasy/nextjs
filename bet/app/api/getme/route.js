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
        return  NextResponse.json({me: {userID: user.userID, fname: user.fname, lname: user.lname, email: user.email, mobile: user.mobile, accbal: user.accbal, currency: user.currency, rating: user.rating, sub: user.sub, TGames: user.TGames, TWon: user.TWon, TLost: user.TLost, nickname: user.nickname, jdate: user.jdate}, logged: true, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
