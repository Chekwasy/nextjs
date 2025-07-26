import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import { isDateInPast } from '../../tools/dateitems'

export async function GET(request) {
    const dd = await request;
    try {
        const url = new URL(dd.url);
        const date = url.searchParams.get('date');
        const tok = dd.headers.get('tok');
        console.log(tok);
        if (!tok) {return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return NextResponse.json('error', {status: 401});
        }
		const usr = await dbClient.client.db().collection('users')
		.findOne({ "userID": usr_id });
		if (!usr) {return  NextResponse.json('error', {status: 401});}
        console.log(usr.sub.slice(-8));
        if (isDateInPast(usr.sub.slice(-8))) {
            console.log('nil');
            return  NextResponse.json({game: null, message: "Success" }, {status: 201});
        }
        if (!date) { return  NextResponse.json('error', {status: 400});}
        const game = await dbClient.client.db().collection('two2win')
        .findOne({ "date": date });
        if (!game) { return  NextResponse.json({game: null, message: "Success" }, {status: 201});}
        return  NextResponse.json({game: game.game, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
