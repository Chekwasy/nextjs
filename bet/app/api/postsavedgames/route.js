import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';

export async function POST(request) {
    let dd = await request;
    try {
        const tok = dd.headers.get('tok');
	const savedgames = dd.headers.get('savedgames');
	const savedbuttons = dd.headers.get('savedbuttons);
        if (!tok || !savedgames || !savedbuttons) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
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
		const sa = await (await dbClient.client.db().collection('savedgames))
		.updateOne({ userID: usr_id }, 
		{ $set: { savedgames: savedgames, savedbuttons: savedbuttons,} });
		if (!sa) { return NextResponse.json('error', {status: 400});}
		return  NextResponse.json({message: 'Save Successful'}, {status: 201});
	}
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
