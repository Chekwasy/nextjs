import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { checknumber, checkpwd } from './../../tools/func';

export async function POST(request) {
	try {
		const dd = await request.json();
		const { email, token } = dd;
		if (!email || !token) {
			return  NextResponse.json('error', {status: 400});
		}
		if (!(checkpwd(email))) {
			return  NextResponse.json('error', {status: 400});
		}
		if (!(checknumber(token))) {
			return  NextResponse.json('error', {status: 400});
		}
		const tok = await redisClient.get(email);
		if (!tok) {
			return  NextResponse.json('error', {status: 400});
		}
		console.log('ddddd');
		const mainstr = tok.slice(0,6);
		const mainval = parseInt(tok.slice(-1)) + 1;
		const finalstr = mainstr.toString() + mainval.toString();
		redisClient.del(email);
		redisClient.set(email, finalstr, 5 * 60);
		if (mainval > 5) {
			redisClient.del(email);
			return  NextResponse.json('error', {status: 400});
		}
		if (mainstr !== token.toString()) {
			return  NextResponse.json('error', {status: 400});
		}
		const user = await dbClient.client.db().collection('users')
		.findOne({ "email": email});
		if (!user) {
			return  NextResponse.json('error', {status: 400});
		}

        return  NextResponse.json({email: user.email, message: 'Token Verified'}, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
