import { NextResponse } from 'next/server';
import redisClient from '../../../redis';


export async function GET(request) {
    const dd = await request;
    try {
        const tok = request.headers.get('tok');
		if (!tok) { return  NextResponse.json('error', {status: 400});}
		const usr_id = await redisClient.get(`auth_${tok}`);
		if (!usr_id) {
			return  NextResponse.json('error', {status: 401});
		}
		await redisClient.del(`auth_${tok}`);
        return  NextResponse.json('success', {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};

