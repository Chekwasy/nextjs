import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 } from 'uuid';


const makeID = () => {
	return v4();
};


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
		return NextResponse.json('error', {status: 401});
	    
	}
	if (!password) {
		return NextResponse.json('error', {status: 401});
	}
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "email": email });
	if (user) {
		return NextResponse.json('user exists', {status: 404});
	}
	const result = await (await dbClient.client.db().collection('users'))
	.insertOne({userID: userID, email: email, password: password, fname: firstname, lname: lastname, mobile: "", accbal: 10000, currency: "N"});
	if (result) {
            return NextResponse.json({'success': email, message: "Signup Successful"}, {status: 201});
        }
    } catch {
        return NextResponse.json('error', {status: 401});
    }
};
userID: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    accbal: string;
    currency: string;
