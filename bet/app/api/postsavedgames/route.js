import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function POST(request) {
	const dd = await request;
try {
        const { savedgames, savedbuttons } = dd.json();
	const tok = dd.headers.get('tok');
	console.log("st", tok);
        if (!tok || !savedgames || !savedbuttons) { return NextResponse.json('error', {status: 400});}
	console.log("snd");
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
	console.log("thd");
	const usr_game = await dbClient.client.db().collection('savedgames')
    	.findOne({ "userID": usr_id });
	if (!usr_game) {
		const result = await (await dbClient.client.db().collection('savedgames'))
		.insertOne({userID: userID, savedgames: savedgames, savedbuttons: savedbuttons,});
		if (result) {
			return NextResponse.json({message: "Save Successful"}, {status: 201});
		}
		return NextResponse.json('error', {status: 401});
	} else {
		const sa = await (await dbClient.client.db().collection('savedgames'))
		.updateOne({ userID: usr_id }, 
		{ $set: { savedgames: savedgames, savedbuttons: savedbuttons,} });
		if (!sa) { return NextResponse.json('error', {status: 400});}
		console.log("saved");
		return  NextResponse.json({message: 'Save Successful'}, {status: 201});
	}
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
