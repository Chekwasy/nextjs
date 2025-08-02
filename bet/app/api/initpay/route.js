import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import axios from 'axios';

export async function POST(request) {
	const dd = await request;
	try {
        console.log('aaa');
        const plan = dd.headers.get('plan');
        const tok = dd.headers.get("tok");
        console.log(plan);
        console.log(tok);
	    if (!tok) { return  NextResponse.json('error', {status: 400});}
    	const usr_id = await redisClient.get(`auth_${tok}`);
	    if (!usr_id) {
		    return  NextResponse.json('error', {status: 401});
	    }
	    const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	    if (!user) { return  NextResponse.json('error', {status: 401});}

        console.log('pass auth');
        const apiEndpoint = 'https://api.paystack.co/transaction/initialize';
        const secretKey = 'sk_test_c7475fd045815e1d20471fe419e713025c9cea10';
        const email = user.email;
        let amount = '250';
        if (plan === 'monthly') {
            amount = '800';
        }
        if (plan === 'weekly') {
            amount = '250';
        } 

        const headers = {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
        };

        const data = {
            email: email,
            amount: amount
        };
        let access_code = '';
        await axios.post(apiEndpoint, data, { headers })
        .then(async (response) => {
            access_code = response.data.access_code;
        })
        .catch(error => {
            console.log(error);
        });
        console.log('after pay ', access_code);
        return  NextResponse.json({access_code: access_code, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

