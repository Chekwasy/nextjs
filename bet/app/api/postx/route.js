import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { getCurrentDateString, getCurrentTimeString } from '../../tools/dateitems';


export async function POST(request) {
	const dd = await request;
	try {
        const saved = JSON.parse(dd.headers.get('saved'));
        const tok = dd.headers.get('tok');
        const db = saved.db;
        const Sbal = saved.openBalance;
        const Tstake = saved.todayStake;
        const Todd = saved.totalOdd;
        const Ebal = saved.expectedBalance;
        const code = saved.code;
        const date = getCurrentDateString();
        const time = getCurrentTimeString();
        if (!tok || !db || !Sbal || !Tstake || !Todd || !Ebal || !code) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const usr = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
    	if (!usr || usr?.email !== 'richardchekwas@gmail.com') { return  NextResponse.json('error', {status: 401});}
        if (db[0] === 'two2win') {
            const g = await dbClient.client.db().collection('two2win')
            .findOne({ "date": date });
            if (!g) {
                const r = await dbClient.client.db().collection('two2win')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: Tstake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            const r = await dbClient.client.db().collection('two2win')
            .updateOne(
                { date: date },
                {
                    $push: {
                        game: {
                            time: time,
                            Sbal: Sbal.toString(),
                            stake: Tstake.toString(),
                            odd: Todd.toString(),
                            Ebal: Ebal.toString(),
                            status: "Pending",
                            code: code,
                        }
                    }
                }
            );
            if (!r) {
                return  NextResponse.json('error not done', {status: 401});
            }
            return  NextResponse.json({message: "Success" }, {status: 201});
        }
        if (db[0] === 'three2win') {
            const g = await dbClient.client.db().collection('three2win')
            .findOne({ "date": date });
            if (!g) {
                const r = await dbClient.client.db().collection('three2win')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: Tstake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            const r = await dbClient.client.db().collection('three2win')
            .updateOne(
                { date: date },
                {
                    $push: {
                        game: {
                            time: time,
                            Sbal: Sbal.toString(),
                            stake: Tstake.toString(),
                            odd: Todd.toString(),
                            Ebal: Ebal.toString(),
                            status: "Pending",
                            code: code,
                        }
                    }
                }
            );
            if (!r) {
                return  NextResponse.json('error not done', {status: 401});
            }
            return  NextResponse.json({message: "Success" }, {status: 201});
        }
        if (db[0] === 'threepro') {
            const g = await dbClient.client.db().collection('three2winpro')
            .findOne({ "date": date });
            if (!g) {
                const r = await dbClient.client.db().collection('three2winpro')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: Tstake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            const r = await dbClient.client.db().collection('three2winpro')
            .updateOne(
                { date: date },
                {
                    $push: {
                        game: {
                            time: time,
                            Sbal: Sbal.toString(),
                            stake: Tstake.toString(),
                            odd: Todd.toString(),
                            Ebal: Ebal.toString(),
                            status: "Pending",
                            code: code,
                        }
                    }
                }
            );
            if (!r) {
                return  NextResponse.json('error not done', {status: 401});
            }
            return  NextResponse.json({message: "Success" }, {status: 201});
        } 
        //if (db[0] === 'sevenpro') {
            
        //}
        return  NextResponse.json('error', {status: 400});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};