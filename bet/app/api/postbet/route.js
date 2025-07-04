import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { v4 } from 'uuid';

const makeID = () => {
	return v4();
};


export async function POST(request) {
	const dd = await request;
try {
        const tobet = JSON.parse(dd.headers.get('tobet'));
	const tok = dd.headers.get('tok');
	const betamt = dd.headers.get('betamt');
	const potwin = dd.headers.get('potwin');
	const odds = dd.headers.get('odds');
        if (!tok || !tobet) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
	const now = new Date();
	const year = now.getFullYear().toString();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const hour = now.getHours().toString().padStart(2, '0');
	const minute = now.getMinutes().toString().padStart(2, '0');
	const second = now.getSeconds().toString().padStart(2, '0');
	const dt = `${year}${month}${day}`
	const tm = `${hour}${minute}${second}`;
	const gameID = makeID();
	const usr = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	if (!usr) { return  NextResponse.json('error', {status: 401});}
	if (betamt === '' || betamt === '0' || odds === '' || odds === '0') {
		return NextResponse.json('error', {status: 401});
	}
	const nwbetamt = parseFloat(betamt);
	const accbal = parseFloat(usr.accbal);
	if ((accbal - nwbetamt) < 0) {
		return NextResponse.json('error', {status: 401});
	}

	const sa = await dbClient.client.db().collection('users')
		.updateOne({ userID: usr_id }, 
		{ $set: { accbal: (accbal - nwbetamt).toFixed(2)} });
	if (!sa) { return NextResponse.json('error', {status: 400});}
	const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	if (!user) { return  NextResponse.json('error', {status: 401});}
	
	const result = await (await dbClient.client.db().collection('bets'))
	.insertOne({userID: usr_id, gameID: gameID, returns: '0.00', result: 'Pending', date: dt, time: tm, betamt: betamt, status: 'open', potwin: potwin, odds: odds, bet: tobet,});
	if (result) {
		return NextResponse.json({message: "Game Booked Successfully", me: {userID: user.userID, fname: user.fname, lname: user.lname, email: user.email, mobile: user.mobile, accbal: user.accbal, currency: user.currency}}, {status: 201});
	}
	return NextResponse.json('error', {status: 401});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
