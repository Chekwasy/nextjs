import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function GET(request) {
    const dd = await request;
    try {
        const tok = dd.headers.get('tok');
        if (!tok) { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return NextResponse.json('error', {status: 401});
        }
        const gm = await (await dbClient.client.db().collection('bets'))
	.find({ 'userID': usr_id, 'status': 'open' });
	if (!gm) {
		return NextResponse.json('error', {status: 404});
	}
	const gmlen = gm.length;
	if (gmlen === 0) {
		return  NextResponse.json({games: [] }, {status: 201});
	}
	gm.forEach((doc) => {
		doc.bet.forEach((itm) => {
			const date_ = itm.mTime.substring(0, 8);
			const response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`);
			const gamesJson = response.data;
			// extract details
			const gjLen = gamesJson.Stages.length;
		});
	});
	
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
