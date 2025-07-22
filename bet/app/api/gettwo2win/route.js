import dbClient from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const dd = await request;
    try {
        const url = new URL(dd.url);
        const date = url.searchParams.get('date');
        console.log(date);
        if (!date) { return  NextResponse.json('error', {status: 400});}
        const game = await dbClient.client.db().collection('two2win')
        .findOne({ "date": date });
        console.log(game);
        if (!game) { return  NextResponse.json({game: null, message: "Success" }, {status: 201});}
        return  NextResponse.json({game: game.game, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
