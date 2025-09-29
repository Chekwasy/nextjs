import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { makeID, checkpwd } from '../../tools/func';
import { getDateTimeString, getThirtiethDay } from '../../tools/dateitems'



export async function POST(request) {
    try {
	const dd = await request.json();
	//data from frontend
    const { emailpwd, firstname, lastname } = dd;
	//encoded data
	const encoded_usr_str = (emailpwd.split(" "))[1];
	let decoded_usr_str = '';
	decoded_usr_str = Buffer.from(encoded_usr_str, 'base64').toString('utf-8');
    const usr_details = decoded_usr_str.split(':');
	const password = crypto.createHash('sha256').update(usr_details[1]).digest('hex');
	const userID = makeID();
	const email = usr_details[0];
	//email not found
	if (!email) {
		return NextResponse.json({message: 'error sending email'}, {status: 401});    
	}
	//password not found
	if (!password) {
		return NextResponse.json({message: 'error sending password'}, {status: 401});
	}
	//check email characters
	if (!checkpwd(email)) {
		return NextResponse.json({message: 'error from email characters'}, {status: 401});    
	}
	//check firstname characters
	if (!checkpwd(firstname)) {
		return NextResponse.json({message: 'error from firstname characters'}, {status: 401});    
	}
	//check lastname characters
	if (!checkpwd(lastname)) {
		return NextResponse.json({message: 'error from lastname characters'}, {status: 401});    
	}
	//check password characters
	if (!checkpwd(usr_details[1])) {
		return NextResponse.json({message: 'error from password characters'}, {status: 401});
	}
	//check user from db
	const user = await dbClient.client.db().collection('users')
	.findOne({ "email": email });
	//check if user exists
	if (user) {
		return NextResponse.json({message: 'user already exists'}, {status: 404});
	}

	const jdate = getDateTimeString();
	const sevth = `mont_${getThirtiethDay(curDay)}`;
	//adds user to db
	const result = await dbClient.client.db().collection('users')
	.insertOne({userID: userID, email: email, password: password, fname: firstname, lname: lastname, mobile: "", accbal: '10000', currency: "N", rating: '', sub: `free_${sevth}`, TGames: '', TWon: '', TLost: '', nickname: '', jdate: jdate,});
	//check if user added success
	if (result) {
        return NextResponse.json({'success': email, message: "Signup Successful"}, {status: 201});
    }
    } catch {
		//check for any errors that results
        return NextResponse.json({message: 'error processing signup'}, {status: 401});
    }
};
