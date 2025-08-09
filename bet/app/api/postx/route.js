//import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { getCurrentDateString, getCurrentTimeString } from '../../tools/dateitems';


export async function POST(request) {
	const dd = await request;
	try {
        const saved = JSON.parse(dd.headers.get('saved'));
        const tok = dd.headers.get('tok');
        const db = saved.get('db');
        const Sbal = saved.get('openBalance');
        const Tstake = saved.get('todayStake');
        const Todd = saved.get('totalOdd');
        const Ebal = saved.get('expectedBalance');
        const code = saved.get('code');
        const games = saved.get('games');
        const date = getCurrentDateString();
        const time = getCurrentTimeString();
        console.log('ss');
        if (!tok || !db || !Sbal || !Tstake || !Todd || !Ebal || !code || !games) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
		console.log(db, Sbal, Tstake, Todd, Ebal, code, games, date, time);
        return NextResponse.json({message: "Success" }, {status: 201});
        } catch {
        return  NextResponse.json('error', {status: 400});
    }
};