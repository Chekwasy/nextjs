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
		let docCopy = {...doc};
		let nwBet = [];
		doc.bet.forEach((itm) => {
			let itmCopy = {...itm};
			const date_ = itm.mTime.substring(0, 8);
			const response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`);
			const gamesJson = response.data;
			// extract details
			const gjLen = gamesJson.Stages.length;
			for (let i = 0; i < gjLen; i++) {
				let tc = gamesJson.Stages[i].Cnm;
				let st = gamesJson.Stages[i].Snm;
				if (tc === itm.gTCountry && st === item.gSubtitle) {
					const evtLen = gamesJson.Stages[i].Events.length;
					for (let j = 0; j < evtLen; j++) {
						if (gamesJson.Stages[i].Events[j].T1[0].Nm === itm.hometeam) {
							if (gamesJson.Stages[i].Events[j].Eps.includes("'")) {
								itmCopy.mResult = 'Pending';
								itmCopy.mOutcome = 'Pending';
								itmCopy.mScore = `${gamesJson.Stages[i].Events[j].Tr1OR} : ${gamesJson.Stages[i].Events[j].Tr2OR}`;
								nwBet.push(itmCopy);
							} else if (gamesJson.Stages[i].Events[j].Eps === 'HT') {
								
							}
							break;
						}
					}
					break;
				}
			}
			//save the nwBet to the docCopy and update it based on the gameID
		});
	});
	
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
