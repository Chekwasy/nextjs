import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import axios from 'axios';

export async function POST(request) {
	const dd = await request;
	try {
        const plan = JSON.parse(dd.headers.get('plan'));
        const tok = dd.headers.get("tok");
	    if (!tok) { return  NextResponse.json('error', {status: 400});}
    	const usr_id = await redisClient.get(`auth_${tok}`);
	    if (!usr_id) {
		    return  NextResponse.json('error', {status: 401});
	    }
	    const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	    if (!user) { return  NextResponse.json('error', {status: 401});}

        const apiEndpoint = 'https://api.paystack.co/transaction/initialize';
        const secretKey = 'YOUR_SECRET_KEY';
        const email = user.email;
        let amount = '250';
        if (plan === 'month') {
            amount = '800';
        }
        if (plan === 'week') {
            amount = '250';
        } 

        const headers = {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
        };

        const data = {
            email,
            amount
        };
        const response = await axios.post(apiEndpoint, data, { headers });
        const access_code = response.data.access_code;

        await initializeTransaction();
        return  NextResponse.json({me: {access_code: access_code}, logged: true, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

