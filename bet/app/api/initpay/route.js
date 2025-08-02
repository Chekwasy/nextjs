import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import axios from 'axios';

export async function POST(request) {
	const dd = await request;
	try {
        const plan = dd.headers.get('plan');
        const tok = dd.headers.get("tok");
	    if (!tok || !plan) { return  NextResponse.json({message: 'Incomplete data supplied'}, {status: 400});}
    	const usr_id = await redisClient.get(`auth_${tok}`);
	    if (!usr_id) {
		    return  NextResponse.json({message: 'User access denied. Try Login'}, {status: 401});
	    }
	    const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	    if (!user) { return  NextResponse.json({message: 'User has no access. Try signup'}, {status: 401});}

        const apiEndpoint = 'https://api.paystack.co/transaction/initialize';
        const secretKey = 'sk_test_c7475fd045815e1d20471fe419e713025c9cea10';
        const email = user.email;
        let amount = '25000';
        if (plan === 'monthly') {
            amount = '80000';
        }
        if (plan === 'weekly') {
            amount = '25000';
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
        let reference = '';
        await axios.post(apiEndpoint, data, { headers })
        .then(async (response) => {
            access_code = response.data.data.access_code;
            reference = response.data.data.reference;
        })
        .catch(error => {
            console.error(error);
            return  NextResponse.json({message: 'Error from payment channel'}, {status: 401});
        });
        return  NextResponse.json({access_code: access_code, reference: reference, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json({message: 'Payment Processing Error'}, {status: 401});
    }
};

