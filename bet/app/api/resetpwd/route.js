import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import crypto from 'crypto';
import { checknumber, checkpwd } from './../../tools/func';

export async function POST(request) {
	try {
		const dd = await request.json();
		//data from frontend
    	const { token, auth_header } = dd;
		if (!auth_header || !token ) { redisClient.del(email); return  NextResponse.json('error', {status: 400}); }
	 	const decoded_usr_str = Buffer.from(auth_header, 'base64').toString('utf-8');	
		const usr_details = decoded_usr_str.split(':');
		const pwd = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
		const email = usr_details[0];
		if (!email || !usr_details[1]) { redisClient.del(email); return NextResponse.json('error', {status: 401}); }
		if (!checkpwd(email)) { redisClient.del(email); return  NextResponse.json('error', {status: 401}); }
		if (!checkpwd(usr_details[1])) {redisClient.del(email); return  NextResponse.json('error', {status: 401});}
		if (!checknumber(token)) { 
			redisClient.del(email);
			return  NextResponse.json('error', {status: 401});
		}
		const tok = await redisClient.get(email);
		if (!tok) {
			return  NextResponse.json('error', {status: 401});
		}
		const mainstr = tok.slice(0,6);
		const mainval = parseInt(tok.slice(-1)) + 1;
		redisClient.del(email);
		if ((mainstr !== token.toString()) || (mainval > 5)) {
			return  NextResponse.json('error', {status: 401});
		}
		const user = await dbClient.client.db().collection('users')
		.findOne({ "email": email});
		if (!user) { return  NextResponse.json('error', {status: 401}); }
		await dbClient.client.db().collection('users')
		.updateOne({ 'email': email },
		{ $set: { "password": pwd } }); 
		
        return  NextResponse.json({email: user.email}, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};