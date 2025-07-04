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

	for (let a = 0; a < gmlen; a++) {
		let docCopy = {...doc};
		let nwBet = [];
		doc.bet.forEach(async (itm) => {
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
								itmCopy.mStatus = gamesJson.Stages[i].Events[j].Eps;
								itmCopy.mResult = 'Pending';
								itmCopy.mOutcome = 'Pending';
								itmCopy.mScore = `${gamesJson.Stages[i].Events[j].Tr1OR} : ${gamesJson.Stages[i].Events[j].Tr2OR}`;
								nwBet.push(itmCopy);
							} else if (gamesJson.Stages[i].Events[j].Eps === 'HT') {
								itmCopy.mStatus = gamesJson.Stages[i].Events[j].Eps;
								itmCopy.mResult = 'Pending';
								itmCopy.mOutcome = 'Pending';
								itmCopy.mScore = `${gamesJson.Stages[i].Events[j].Tr1OR} : ${gamesJson.Stages[i].Events[j].Tr2OR}`;
								nwBet.push(itmCopy);
							} else if (gamesJson.Stages[i].Events[j].Eps === 'FT' || gamesJson.Stages[i].Events[j].Eps === 'AET' || gamesJson.Stages[i].Events[j].Eps === 'AP') {
								if (itmCopy.mStatus !== 'FT' || itmCopy.mStatus && 'AET' && itmCopy.mStatus !== 'AP') {
									itmCopy.mStatus = 'FT';
									const homescore = gamesJson.Stages[i].Events[j].Tr1OR;
									const awayscore = gamesJson.Stages[i].Events[j].Tr2OR;
									if (parseInt(homescore) > parseInt(awayscore)) {
										itmCopy.mResult = 'Home Won';
									} else if (parseInt(homescore) < parseInt(awayscore)) {
										itmCopy.mResult = 'Away Won';
									} else {
										itmCopy.mResult = 'Draw';
									}
									if (itmCopy.selection === 'home') {
										if (itmCopy.mResult === 'Home Won') {
											itmCopy.mOutcome = 'Won';
										} else {
											itmCopy.mOutcome = 'Lost';
											itmCopy.odd = '1';
										}
									}
									if (itmCopy.selection === 'draw') {
										if (itmCopy.mResult === 'Draw') {
											itmCopy.mOutcome = 'Won';
										} else {
											itmCopy.mOutcome = 'Lost';
											itmCopy.odd = '1';
										}
									}
									if (itmCopy.selection === 'away') {
										if (itmCopy.mResult === 'Away Won') {
											itmCopy.mOutcome = 'Won';
										} else {
											itmCopy.mOutcome = 'Lost';
											itmCopy.odd = '1';
										}
									}
									itmCopy.mScore = `${homescore} : ${awayscore}s`;
								}
								nwBet.push(itmCopy);
							} else if (gamesJson.Stages[i].Events[j].Eps.includes('.')) {
								itmCopy.mStatus = gamesJson.Stages[i].Events[j].Eps;
								itmCopy.mResult = 'NR';
								itmCopy.mOutcome = 'Void';
								itmCopy.odd = '1';
								nwBet.push(itmCopy);
							} else if (gamesJson.Stages[i].Events[j].Eps === 'NS') {
								const now = new Date();
								const month = (now.getMonth() + 1).toString().padStart(2, '0');
								const day = now.getDate().toString().padStart(2, '0');
								if (month !== gamesJson.Stages[i].Events[j].Esd.toString().substring(4, 6)) {
									if (parseInt(day) > 1) {
										itmCopy.mStatus = 'Canc.';
										itmCopy.mResult = 'NR';
										itmCopy.mOutcome = 'Void';
										itmCopy.odd = '1';
									}
									const day2 = gamesJson.Stages[i].Events[j].Esd.toString().substring(6, 8);
									if (day !== day2 && (parseInt(day2) + 1) <= 28 && parseInt(day) > (parseInt(day2) + 1)) {
										
									}
								}
								nwBet.push(itmCopy);
							}
							break;
						}
					}
					break;
				}
			}
			//save the nwBet to the docCopy and update it based on the gameID
		});
	}
	
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
