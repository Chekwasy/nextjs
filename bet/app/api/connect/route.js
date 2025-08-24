import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { makeID, checkpwd } from '../../tools/func';
import crypto from 'crypto';


export async function POST(request) {
    try {
	const { auth_header } = await request.json();
	if (!auth_header) { return NextResponse.json({message: 'unsetted auth header'}, {status: 400})}
	const encoded_usr_str = (auth_header.split(" "))[1];
	let decoded_usr_str = '';
	decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
	const usr_details = decoded_usr_str.split(':');
	const pwd = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
	const email = usr_details[0];
	//check password characters
	if (!checkpwd(usr_details[1])) {
		return NextResponse.json({message: 'error from password characters'}, {status: 401});
	}
	//check email characters
	if (!checkpwd(email)) {
		return NextResponse.json({message: 'error from email characters'}, {status: 401});    
	}
	const user = await dbClient.client.db().collection('users')
	.findOne({ "email": email });
	const tok = await redisClient.get(email);
	if (tok && parseInt(tok) > 5) {
		return  NextResponse.json('error', {status: 400});
	}
	if (user && (user.password === pwd)) {
		redisClient.del(email);
		const auth_token = makeID();
		redisClient.set(`auth_${auth_token}`, user.userID, 24 * 60 * 60);
		return NextResponse.json({token: auth_token, message: "Login Successful"}, {status: 201});
	} else {
		if (!tok) {
			redisClient.set(email, '1', 24 * 60 * 60);
			return NextResponse.json({message: 'Email or Password Incorrect'}, {status: 400});	
		}
		redisClient.del(email);
		redisClient.set(email, (parseInt(tok) + 1).toString(), 24 * 60 * 60);
		return NextResponse.json({message: 'Email or Password Incorrect. You all be blocked for several hours after 5 failed trials'}, {status: 400});
    }
    } catch {
	return NextResponse.json({message: 'error processing signin'}, {status: 400});
    }
};
