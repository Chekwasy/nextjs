import dbClient from '../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../redis';
import { ObjectID } from 'mongodb';
import { v4 } from 'uuid';


export async function GET(request) {
    try {
	const { auth_header } = request.json();
	if (!auth_header) {return NextResponse.json('error', {status: 400})}
	const encoded_usr_str = (auth_header.split(" "))[1];
	let decoded_usr_str = '';
	decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
	const usr_details = decoded_usr_str.split(':');
	const pwd = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
	const email = usr_details[0];
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "email": email });
	if (user && (user.password === pwd)) {
		const auth_token = v4();
		redisClient.set(`auth_${auth_token}`, user._id.toString(), 7 * 24 * 60 * 60);
		return NextResponse.json({token: auth_token}, {status: 201});
	}
    } catch {
	return NextResponse.json('error', {status: 400});
    }
};

