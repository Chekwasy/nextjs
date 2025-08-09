//import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { getCurrentDateString, getCurrentTimeString } from '../../tools/dateitems';


export async function POST(request) {
	const dd = await request;
	try {
        console.log('start');
        const tok = dd.headers.get('tok');
        const db = dd.get('db');
        const Sbal = dd.get('openBalance');
        const Tstake = dd.get('todayStake');
        const Todd = dd.get('totalOdd');
        const Ebal = dd.get('expectedBalance');
        const code = dd.get('code');
        const games = dd.get('games');
        const date = getCurrentDateString();
        const time = getCurrentTimeString();
        
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