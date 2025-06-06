import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import axios from 'axios';

//scraps matches details from a source and align
// them well and save in db. this is does for 7 
// days of the week on a first request of the day
export async function GET(request) {
    const dd = await request;
    const redisDate = await redisClient.get(`gamedate`);
    //get today's date
    let today = new Date();
    //runs a loop of 7days to get data of each day for matches
    for (let i = 0; i < 7; i++) {
	//Thr particular day
	const nex = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
	//uses West African Time
	let options = {'timeZone': 'WAT'};
	//Breaks date data to a list [2024, 04, 02]
	let dateLst = nex.toLocaleDateString(options).split('/');
	//Adds a 0 for dates that has one digit
	if (dateLst[0].length === 1) {dateLst[0] = '0' + dateLst[0];}
	if (dateLst[1].length === 1) {dateLst[1] = '0' + dateLst[1];}
	let date_ = dateLst[2] + dateLst[0] + dateLst[1];
	console.log(date_);
	//Sets in redis a date string to help regenerate
	// data in 10hrs interval on a first request 
	if (i === 0) {
		redisClient.set(`gamedate`, date_, 2 * 60 * 60);
	}
	//runs only if no date data in redis and 
	if (redisDate === null) {
		console.log(date_);
		//scrap the matches data
		let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`);
		let gamesJson = response.data;
		//puts all main heading to a list
		const titleCountry = gamesJson.Stages.map(stage => stage.Cnm);
		let insertDate = await (await dbClient.client.db().collection('dates'))
		.insertOne({"date": date_, "games": gamesJson, "titleCountry": titleCountry
		});
		let gamesId = insertDate.insertedId.toString();
		// save default odds for all events
		let gjLen = gamesJson.Stages.length;
		let oddLst = [];
		let eventDit = {};
		for (let i = 0; i < gjLen; i++) {
			let evtLen = gamesJson.Stages[i].Events.length;
			if (evtLen > 0) {
				for (let j = 0; j < evtLen; j++) {
				if (gamesJson.Stages[i].Events[j]) {
					let EidLstDit = {};
								eventDit[gamesJson.Stages[i].Events[j].Eid] = [];
								EidLstDit['hometeam'] = gamesJson.Stages[i].Events[j].T1[0].Nm;
								EidLstDit['awayteam'] = gamesJson.Stages[i].Events[j].T2[0].Nm;
								EidLstDit['homeodd'] = 1.5;
								EidLstDit['awayodd'] = 1.5;
								EidLstDit['drawodd'] = 3.0;
								eventDit[gamesJson.Stages[i].Events[j].Eid].push(EidLstDit);
							}
						}
					}
				}
				oddLst.push(eventDit);
				let insertOdd = await (await dbClient.client.db().collection('odds'))
				.insertOne({"date": date_, "odds": oddLst
				});
			}
		}
		let do_update = false;

		//form date string
		let exp_today = new Date(today.getTime());
		let exp_dateLst = exp_today.toLocaleDateString().split('/');
		if (exp_dateLst[0].length === 1) {exp_dateLst[0] = '0' + exp_dateLst[0];}
		if (exp_dateLst[1].length === 1) {exp_dateLst[1] = '0' + exp_dateLst[1];}
		let dateStr = exp_dateLst[2] + exp_dateLst[0] + exp_dateLst[1];

		//get games object to work on
		let response = await axios.get(`https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/1?countryCode=NG&locale=en&MD=1`);
		let games = response.data;
		let gamesLen = games.Stages.length;
		let oddLst = [];
		let eventDit = {};
		for (let i = 0; i < gamesLen; i++) {
			let eventLen = games.Stages[i].Events.length;
			if (eventLen > 0) {
				for (let j = 0; j < eventLen; j++) {
					if (games.Stages[i].Events[j]) {
						let EidLstDit = {};
						eventDit[games.Stages[i].Events[j].Eid] = [];
						EidLstDit['hometeam'] = games.Stages[i].Events[j].T1[0].Nm;
						EidLstDit['awayteam'] = games.Stages[i].Events[j].T2[0].Nm;
						EidLstDit['homeodd'] = 1.7;
						EidLstDit['awayodd'] = 1.8;
						EidLstDit['drawodd'] = 3.1;
						eventDit[games.Stages[i].Events[j].Eid].push(EidLstDit);
						// if (games.Stages[i].Events[j].Eps !== "NS") {
						// 	games.Stages[i].Events.splice(j, 1);
						// 	j--;
						// 	eventLen --;

						// 	do_update = true;
						// }
						if (games.Stages[i].Events[j].Esd) {
							const tm = games.Stages[i].Events[j].Esd;
							const tmhr = parseInt(tm.toString().slice(-6,-4) || 0) || 0;
							const tmmin = parseInt(tm.toString().slice(-4, -2) || 0) || 0;
							const curhr = today.getHours();
							const curmin = today.getMinutes();
							//console.log(tmhr, tmmin, curhr, curmin);
							if ((curhr > tmhr) || (curhr === tmhr && curmin >= tmmin)) {
								games.Stages[i].Events.splice(j, 1);
								j--;
								eventLen --;

								do_update = true;
							}
						}
					}
				}
			}
		}
		oddLst.push(eventDit);

		for (let i = 0; i < gamesLen; i++) {
			let eventLen = games.Stages[i].Events.length;
			if (eventLen === 0) {
				if (games.Stages[i]) {
					games.Stages.splice(i, 1);
					i--;
					gamesLen--;
					do_update = true;
				}
			}
		}
		console.log(today.getHours(), today.getMinutes());
		console.log(gamesLen);
		if (do_update === true) {
			//update the current games available to bet
			await (await dbClient.client.db().collection('dates'))
			.updateOne({ "date": dateStr },
			{ $set: { "games":  games} });
			let dateodds = await (await dbClient.client.db().collection('odds'))
        	.findOne({ "date": dateStr });
			const dodds = dateodds.odds;
			//console.log(dodds['1295560'][0].hometeam);
			const oddsave = ld.merge({}, oddLst, dodds);
			if (1) {
				await (await dbClient.client.db().collection('odds'))
				.updateOne({ "date": dateStr },
				{ $set: { "odds":  oddsave} });
			}
			do_update = false;
		}

	await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));		
	}
};
