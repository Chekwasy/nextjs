import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { getCurrentDateString, getYesterdayDateString, } from '../../tools/dateitems';

export async function POST(request) {
	const dd = await request;
	try {
        const saved = JSON.parse(dd.headers.get('saved'));
        const tok = dd.headers.get('tok');
        const db = saved.option;
        const result = saved.result;
        const day = saved.day;
        const index = saved.index;
        let date = '';

        if (day === 'yest') {
            date = getYesterdayDateString();
        } else {
            date = getCurrentDateString();
        }

        if (!tok || !db || !result || !day || !index) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const usr = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });

    	if (!usr || usr?.email !== 'richardchekwas@gmail.com') { return  NextResponse.json('error', {status: 401});}


        if (db === 'two2win') {

            if (result === 'Won') {
                const r = await dbClient.client
                .db()
                .collection("two2win")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Won",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            if (result === 'Lost') {
                const r = await dbClient.client
                .db()
                .collection("two2win")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Lost",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
        }

        if (db === 'point5') {
            if (result === 'Won') {
                const r = await dbClient.client
                .db()
                .collection("point5")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Won",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            if (result === 'Lost') {
                const r = await dbClient.client
                .db()
                .collection("point5")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Lost",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
        }

        if (db === 'point5pro') {
            if (result === 'Won') {
                const r = await dbClient.client
                .db()
                .collection("point5pro")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Won",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            if (result === 'Lost') {
                const r = await dbClient.client
                .db()
                .collection("point5pro")
                .updateOne(
                    {
                    date: date,
                    [`game.${index}.status`]: "Pending",
                    },
                    {
                    $set: {
                        [`game.${index}.status`]: "Lost",
                    },
                    }
                );
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
        }


        return  NextResponse.json('error', {status: 400});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};