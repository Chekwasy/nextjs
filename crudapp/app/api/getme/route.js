import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import { ObjectID } from 'mongodb';
import redisClient from '../../../redis';

export async function GET(request) {
	const dd = await request;
	try {
        const tok = dd.headers.get("tok");
	    if (!tok) { console.log(1); return  NextResponse.json('error', {status: 400});}
	console.log(122);
    	const usr_id = await redisClient.get(`auth_${tok}`);
	    if (!usr_id) {
		    return  NextResponse.json('error', {status: 401});
	    }
	console.log(441, usr_id);
	    const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	console.log(77771);
	    if (!user) { return  NextResponse.json('error', {status: 401});}
        return  NextResponse.json({email: user.email}, {status: 201});
    } catch {
	console.log(4, dd.headers.get("tok"));
        return  NextResponse.json('error', {status: 400});
    }
};

