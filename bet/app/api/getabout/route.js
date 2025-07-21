import dbClient from '../../../db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const about = await dbClient.client.db().collection('about')
        .findOne({ "about": 'myabout' });
        if (!about) { return NextResponse.json('error', {status: 400}); }
        return  NextResponse.json({about: about, message: "Success" }, {status: 201});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
