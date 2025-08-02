import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import axios from 'axios';

export async function POST(request) {
	const dd = await request;
	try {
        const reference = dd.headers.get('reference');
        const tok = dd.headers.get("tok");
	    if (!tok || !reference) { return  NextResponse.json({message: 'Incomplete data supplied'}, {status: 400});}
    	const usr_id = await redisClient.get(`auth_${tok}`);
	    if (!usr_id) {
		    return  NextResponse.json({message: 'User access denied. Try Login'}, {status: 401});
	    }
	    const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	    if (!user) { return  NextResponse.json({message: 'User has no access. Try signup'}, {status: 401});}

        const apiEndpoint = `https://api.paystack.co/transaction/verify/${reference}`;
        const secretKey = process.env.PSKT || ''; 

        const headers = {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
        };
        let status = '';
        await axios.get(apiEndpoint, { headers })
        .then(async (response) => {
            status = response.data.data.status;
        })
        .catch(error => {
            console.error(error);
            return  NextResponse.json({message: 'Error from payment channel'}, {status: 401});
        });
        console.log('jjj', status);
        if (status === 'success') {
            return  NextResponse.json({status: status, message: "Payment Successful" }, {status: 201});
        } else {
            return  NextResponse.json({status: status, message: `Payment ${status}` }, {status: 201});
        }
    } catch {
        return  NextResponse.json({message: 'Payment Verification Error'}, {status: 401});
    }
};

