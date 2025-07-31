import { NextResponse } from 'next/server';
import redisClient from '../../../redis';


export async function GET(request) {
    const dd = await request;
    try {
        const tok = dd.headers.get('tok');
		if (!tok) { return  NextResponse.json({message: 'Invalid tok'}, {status: 400});}
		const usr_id = await redisClient.get(`auth_${tok}`);
		if (!usr_id) {
			return  NextResponse.json({message: 'error: user not found'}, {status: 401});
		}
		await redisClient.del(`auth_${tok}`);
        return  NextResponse.json({message: 'Logged Out Successful'}, {status: 201});
    } catch {
        return  NextResponse.json({message: 'error processing logout'}, {status: 400});
    }
};
