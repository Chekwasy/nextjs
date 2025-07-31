import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { makeID, checkpwd } from '../../tools/func';
import { getDateTimeString, getSeventhDay } from '../../tools/dateitems'



export async function POST(request) {
    try {
	const dd = await request.json();
    const { emailpwd, firstname, lastname } = dd;
	const encoded_usr_str = (emailpwd.split(" "))[1];
	let decoded_usr_str = '';
	decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
    const usr_details = decoded_usr_str.split(':');
	const password = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
	const userID = makeID();
	const email = usr_details[0];
	if (!email) {
		return NextResponse.json({message: 'error sending email'}, {status: 401});    
	}
	if (!password) {
		return NextResponse.json({message: 'error sending password'}, {status: 401});
	}
	if (!checkpwd(email)) {
		return NextResponse.json({message: 'error from email characters'}, {status: 401});    
	}
	if (!checkpwd(usr_details[1])) {
		return NextResponse.json({message: 'error from password characters'}, {status: 401});
	}
	const user = await dbClient.client.db().collection('users')
	.findOne({ "email": email });
	if (user) {
		return NextResponse.json({message: 'user already exists'}, {status: 404});
	}

	const jdate = getDateTimeString();
	const sevth = getSeventhDay(jdate);
	const result = await dbClient.client.db().collection('users')
	.insertOne({userID: userID, email: email, password: password, fname: firstname, lname: lastname, mobile: "", accbal: '10000', currency: "N", rating: '', sub: `free_${sevth}`, TGames: '', TWon: '', TLost: '', nickname: '', jdate: jdate,});
	if (result) {
            return NextResponse.json({'success': email, message: "Signup Successful"}, {status: 201});
        }
    } catch {
        return NextResponse.json({message: 'error processing signup'}, {status: 401});
    }
};
