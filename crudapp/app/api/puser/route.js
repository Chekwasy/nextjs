import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 } from 'uuid';


const makeID = () => {
	return v4();
};


export async function POST(request) {
    try {
        const { emailpwd, firstname, lastname } = await request.json();
    	const encoded_usr_str = (emailpwd.split(" "))[1];
	    let decoded_usr_str = '';
		decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
    	const usr_details = decoded_usr_str.split(':');
	    const password = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
	    const userID = makeID();
	    const email = usr_details[0];
	    if (!email) {
		    console.log(1);
		    return NextResponse.json('error', {status: 401});
	    }
	    if (!password) {
		    console.log(2);
		    return NextResponse.json('error', {status: 401});
	    }
	    const user = await (await dbClient.client.db().collection('users'))
	    .findOne({ "email": email });
	    if (user) {
		    return NextResponse.json('user exists', {status: 404});
	    }
	    const result = await (await dbClient.client.db().collection('users'))
	    .insertOne({userID: userID, email: email, password: password, firstname: firstname, lastname: lastname });
	    if (result) {
            return NextResponse.json({'success': email}, {status: 201});
        }
    } catch {
        console.log('err');
        return NextResponse.json('error', {status: 401});
    }
};

