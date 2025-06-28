import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function POST(request) {
	const dd = await request;
try {
        const savedgames = JSON.parse(dd.headers.get('savedgames'));
	const savedbuttons = JSON.parse(dd.headers.get('savedbuttons'));
	const tok = dd.headers.get('tok');
        if (!tok || !savedgames || !savedbuttons) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
	console.log("thd");
	const usr_game = await dbClient.client.db().collection('savedgames')
    	.findOne({ "userID": usr_id });
	if (!usr_game) {
		console.log("gg");
		const result = await (await dbClient.client.db().collection('savedgames'))
		.insertOne({userID: userID, savedgames: savedgames, savedbuttons: savedbuttons,});
		if (result) {
			console.log("kk");
			return NextResponse.json({message: "Save Successful"}, {status: 201});
		}
		console.log("pp");
		return NextResponse.json('error', {status: 401});
	} else {
		console.log("uu");
		const sa = await (await dbClient.client.db().collection('savedgames'))
		.updateOne({ userID: usr_id }, 
		{ $set: { savedgames: savedgames, savedbuttons: savedbuttons,} });
		if (!sa) { return NextResponse.json('error', {status: 400});}
		console.log("saved");
		return  NextResponse.json({message: 'Save Successful'}, {status: 201});
	}
    } catch {
	console.log("yy");
        return  NextResponse.json('error', {status: 400});
    }
};
