import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

const emp = [{ 
    userID: '', 
    gameID: '', 
    returns: '', 
    result: '', 
    date: '', 
    time: '', 
    betamt: '', 
    status: '', 
    potwin: '', 
    odds: '', 
    bet: [{ 
      id: '', 
      gId: '', 
      gTCountry: '', 
      gSubtitle: '',  
      mktT: '', 
      mTime: '', 
      hometeam: '', 
      awayteam: '', 
      odd: '', 
      selection: '', 
      mStatus: '', 
      mResult: '', 
      mOutcome: '', 
      mScore: '',
    }]
}];

export async function GET(request) {
	const dd = await request;
	try {
		const tok = dd.headers.get('tok');
		if (!tok) { return  NextResponse.json('error', {status: 400});}
		const usr_id = await redisClient.get(`auth_${tok}`);
		if (!usr_id) {
			return NextResponse.json('error', {status: 401});
		}
		const gm = await dbClient.client.db().collection('bets')
		.find({ 'userID': usr_id, 'status': 'close' }).toArray();
		if (!gm) {
			return NextResponse.json('error', {status: 404});
		}
		const gmlen = gm.length;
		if (gmlen === 0) {
			return  NextResponse.json({games: emp }, {status: 201});
		}
        return  NextResponse.json({closebet: gm}, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
