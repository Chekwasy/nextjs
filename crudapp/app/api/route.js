import dbClient from '../../db';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        const gg = await dbClient.client.db().collection('users').findOne({"email": "richardchekwas@gmail.com"});
        console.log(gg);
        return  NextResponse.json('{successssss}', {status: 201});
    } catch {
        console.log('err');
    }
};

