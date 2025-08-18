import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { checkpwd } from './../../tools/func';
import Queue from 'bull/lib/queue';

export async function POST(request) {
	try {
        const dd = await request.json();
		//data from frontend
    	const { email } = dd;
	    if (!email) { return  NextResponse.json('error', {status: 400});}
    	if (!checkpwd(email)) { return  NextResponse.json('error', {status: 400});}
		const user = await dbClient.client.db().collection('users')
		.findOne({ "email": email});
		if (!user) { return  NextResponse.json('error', {status: 400}); }
		const min = 123456;
		const max = 987654;
		const token = Math.floor(Math.random() * (max - min + 1)) + min;
		redisClient.del(email);
		redisClient.set(email, token.toString() + '1', 10 * 60);

		//create worker to send email token
		const tokenQueue = new Queue('Send Trybet Token');
		await tokenQueue.add({"email": email, "token": {"token": token.toString(), "count": 0}});
	    
        return  NextResponse.json({email: user.email}, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
