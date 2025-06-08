import dbClient from '../../../../db';
import { NextResponse } from 'next/server';
import axios from 'axios';

//scraps matches details from a source and align
// them well and save in db. this is does for 7 
// days of the week on a first request of the day
export async function GET(request: Request, { params }: { params: { date: string } }) {
    let givenDate = parseInt(params.date);
    if (givenDate > 7) {
	    givenDate = 0;
    }
    try {
	//get today's date
	const today = new Date();
	const i = givenDate;
	//The particular day
	const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
	//uses West African Time
	const options = {'timeZone': 'WAT'};
	//Breaks date data to a list [2024, 04, 02]
	const dateLst = nex.toLocaleDateString(options).split('/');
	//Adds a 0 for dates that has one digit
	if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
	if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
	const date_ = dateLst[2] + dateLst[0] + dateLst[1];
	console.log(date_);
	//scrap the matches data
	const response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`);
	const gamesJson = response.data;
	// extract details for all events that is active 
	const gjLen = gamesJson.Stages.length;
	const oddLst = [];
	let eventDit = {};
	for (let i = 0; i < gjLen; i++) {
		const evtLen = gamesJson.Stages[i].Events.length;
		eventDit["id"] = i.toString();
		eventDit["titleCountry"] = gamesJson.Stages[i].Cnm;
		eventDit["subtitle"] = gamesJson.Stages[i].Snm;
		eventDit["events"] = [];
		for (let j = 0; j < evtLen; j++) {
			if (gamesJson.Stages[i].Events[j].Eps === 'NS') {
				const Edt = {};
				Edt["id"] = j.toString();
				Edt['hometeam'] = gamesJson.Stages[i].Events[j].T1[0].Nm;
				Edt['awayteam'] = gamesJson.Stages[i].Events[j].T2[0].Nm;
				Edt['homeodd'] = 1.7;
				Edt['awayodd'] = 1.8;
				Edt['drawodd'] = 3.1;
				Edt['Esd'] = gamesJson.Stages[i].Events[j].Esd.toString();
				eventDit['events'].push(Edt);
			}
		}
		if (eventDit.events.length > 0) {
			oddLst.push(eventDit);
		}
		eventDit = {};
	}
	//Save data to db
	await (await dbClient.client.db().collection('dates'))
	.insertOne({"date": date_, "games": oddLst
	});
	return NextResponse.json({date: date_, games: oddLst}, {status: 201});
    } catch {
	    return NextResponse.json('error fetching data', {status: 400});
    }
};
