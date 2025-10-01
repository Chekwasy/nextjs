import Queue from 'bull/lib/queue';
import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { getCurrentDateString, getYesterdayDateString, getCurrentTimeString } from '../../tools/dateitems';


export async function POST(request) {
	const dd = await request;
	try {
        const saved = JSON.parse(dd.headers.get('saved'));
        const tok = dd.headers.get('tok');
        const db = saved.db;
        const Todd = saved.totalOdd;
        const code = saved.code;
        const date = getCurrentDateString();
        const time = getCurrentTimeString();
        const yest = getYesterdayDateString();
        if (!tok || !db || !Todd || !code) { return NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
        const usr = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
        const usrAll = await dbClient.client.db().collection('users')
        .find({}).toArray();
    	if (!usr || usr?.email !== 'richardchekwas@gmail.com') { return  NextResponse.json('error', {status: 401});}



        let Sbal = '';
        let stake = '';
        let Ebal = '';

        const two = ['20', '60', '140', '300', '620', '1260', '2540', '5100'];
        const p5 = ['100', '400', '1300', '4000', '12000'];
        const p5pro = ['100', '400', '1300', '4000', '12000'];




        //Two2Win
        if (db[0] === 'two2win') {

            const g = await dbClient.client.db().collection('two2win')
            .findOne({ "date": date }).toArray();
            const yg = await dbClient.client.db().collection('two2win')
            .findOne({ "date": yest }).toArray();



            if (g.length === 0) {
                if (yg.length === 0) {
                    Sbal = '9980';
                    stake = '20';
                    Ebal = (parseFloat(Sbal) + (parseFloat(Todd) * parseFloat(stake)));
                }

                if (yg.length > 0) {
                    const preSbal = yg[0].game[(yg[0].game.length - 1)].Sbal;
                    const preEbal = yg[0].game[(yg[0].game.length - 1)].Ebal;
                    const preStake = yg[0].game[(yg[0].game.length - 1)].stake;
                    const preStatus = yg[0].game[(yg[0].game.length - 1)].status;
                    if (preStatus === 'Pending') {
                        return  NextResponse.json('error not done', {status: 401});    
                    }
                    if (preStatus === 'Won') {
                        stake = two[0];
                        Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                    if (preStatus === 'Lost') {
                        stake = two[two.indexOf(preStake) + 1];
                        Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                    
                }


                //put items in db
                const r = await dbClient.client.db().collection('two2win')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: stake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                //create worker to send notification
                const notifyQueue = new Queue('Notify');
                await notifyQueue.add({"usr": [...usrAll], "option": 'Two2Win', "time": time, "Sbal": Sbal.toString(), "stake": stake.toString(), 
                    "odd": Todd.toString(), 
                    "Ebal": Ebal.toString(),
                    "status": 'Pending',
                    "code": code, 
                });
                return  NextResponse.json({message: "Success" }, {status: 201});
            }
            //if today data is present
            const preSbal = g[0].game[(g[0].game.length - 1)].Sbal;
            const preEbal = g[0].game[(g[0].game.length - 1)].Ebal;
            const preStake = g[0].game[(g[0].game.length - 1)].stake;
            const preStatus = g[0].game[(g[0].game.length - 1)].status;
            if (preStatus === 'Pending') {
                return  NextResponse.json('error not done', {status: 401});
            }
            if (preStatus === 'Won') {
                stake = two[0];
                Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
            }
            if (preStatus === 'Lost') {
                stake = two[two.indexOf(preStake) + 1];
                Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
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




        //Ponit5
        if (db[0] === 'point5') {
            const g = await dbClient.client.db().collection('point5')
            .findOne({ "date": date }).toArray();
            const yg = await dbClient.client.db().collection('point5')
            .findOne({ "date": yest }).toArray();


            
            if (g.length === 0) {


                if (yg.length === 0) {
                    Sbal = '17900';
                    stake = '100';
                    Ebal = (parseFloat(Sbal) + (parseFloat(Todd) * parseFloat(stake)));
                }

                if (yg.length > 0) {
                    const preSbal = yg[0].game[(yg[0].game.length - 1)].Sbal;
                    const preEbal = yg[0].game[(yg[0].game.length - 1)].Ebal;
                    const preStake = yg[0].game[(yg[0].game.length - 1)].stake;
                    const preStatus = yg[0].game[(yg[0].game.length - 1)].status;
                    if (preStatus === 'Pending') {
                        return  NextResponse.json('error not done', {status: 401});    
                    }
                    if (preStatus === 'Won') {
                        stake = p5[0];
                        Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                    if (preStatus === 'Lost') {
                        stake = p5[p5.indexOf(preStake) + 1];
                        Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                }


                const r = await dbClient.client.db().collection('point5')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: stake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                //create worker to send notification
                const notifyQueue = new Queue('Notify');
                await notifyQueue.add({"usr": [...usrAll], "option": 'Point5', "time": time, "Sbal": Sbal.toString(), "stake": stake.toString(), 
                    "odd": Todd.toString(), 
                    "Ebal": Ebal.toString(),
                    "status": 'Pending',
                    "code": code, 
                });
                return  NextResponse.json({message: "Success" }, {status: 201});
            }

            //if today data is present
            const preSbal = g[0].game[(g[0].game.length - 1)].Sbal;
            const preEbal = g[0].game[(g[0].game.length - 1)].Ebal;
            const preStake = g[0].game[(g[0].game.length - 1)].stake;
            const preStatus = g[0].game[(g[0].game.length - 1)].status;
            if (preStatus === 'Pending') {
                return  NextResponse.json('error not done', {status: 401});
            }
            if (preStatus === 'Won') {
                stake = p5[0];
                Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
            }
            if (preStatus === 'Lost') {
                stake = p5[p5.indexOf(preStake) + 1];
                Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
            }
            const r = await dbClient.client.db().collection('point5')
            .updateOne(
                { date: date },
                {
                    $push: {
                        game: {
                            time: time,
                            Sbal: Sbal.toString(),
                            stake: stake.toString(),
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
            //create worker to send notification
		    const notifyQueue = new Queue('Notify');
		    await notifyQueue.add({"usr": [...usrAll], "option": 'Point5', "time": time, "Sbal": Sbal.toString(), "stake": stake.toString(), 
                "odd": Todd.toString(), 
                "Ebal": Ebal.toString(),
                "status": 'Pending',
                "code": code, 
            });
            return  NextResponse.json({message: "Success" }, {status: 201});
        }


        //Point5PRO
        if (db[0] === 'point5pro') {
            const g = await dbClient.client.db().collection('point5pro')
            .findOne({ "date": date }).toArray();
            const yg = await dbClient.client.db().collection('point5pro')
            .findOne({ "date": yest }).toArray();
            
            
            
            if (g.length === 0) {

                if (yg.length === 0) {
                    Sbal = '17900';
                    stake = '100';
                    Ebal = (parseFloat(Sbal) + (parseFloat(Todd) * parseFloat(stake)));
                }

                if (yg.length > 0) {
                    const preSbal = yg[0].game[(yg[0].game.length - 1)].Sbal;
                    const preEbal = yg[0].game[(yg[0].game.length - 1)].Ebal;
                    const preStake = yg[0].game[(yg[0].game.length - 1)].stake;
                    const preStatus = yg[0].game[(yg[0].game.length - 1)].status;
                    if (preStatus === 'Pending') {
                        return  NextResponse.json('error not done', {status: 401});    
                    }
                    if (preStatus === 'Won') {
                        stake = p5pro[0];
                        Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                    if (preStatus === 'Lost') {
                        stake = p5pro[p5pro.indexOf(preStake) + 1];
                        Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                        Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
                    }
                }

                const r = await dbClient.client.db().collection('point5pro')
                .insertOne({ 
                    date: date, 
                    game: [{
                        time: time,
                        Sbal: Sbal.toString(),
                        stake: stake.toString(),
                        odd: Todd.toString(),
                        Ebal: Ebal.toString(),
                        status: "Pending",
                        code: code,
                    }]    
                });
                if (!r) {
                    return  NextResponse.json('error not done', {status: 401});
                }
                //create worker to send notification
                const notifyQueue = new Queue('Notify');
                await notifyQueue.add({"usr": [...usrAll], "option": 'Point5PRO', "time": time, "Sbal": Sbal.toString(), "stake": stake.toString(), 
                    "odd": Todd.toString(), 
                    "Ebal": Ebal.toString(),
                    "status": 'Pending',
                    "code": code, 
                });
                return  NextResponse.json({message: "Success" }, {status: 201});
            }

            //if today data is present
            const preSbal = g[0].game[(g[0].game.length - 1)].Sbal;
            const preEbal = g[0].game[(g[0].game.length - 1)].Ebal;
            const preStake = g[0].game[(g[0].game.length - 1)].stake;
            const preStatus = g[0].game[(g[0].game.length - 1)].status;
            if (preStatus === 'Pending') {
                return  NextResponse.json('error not done', {status: 401});
            }
            if (preStatus === 'Won') {
                stake = p5pro[0];
                Sbal = (parseFloat(preEbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
            }
            if (preStatus === 'Lost') {
                stake = p5pro[p5pro.indexOf(preStake) + 1];
                Sbal = (parseFloat(preSbal) - parseFloat(stake)).toString();
                Ebal = (parseFloat(Sbal) + (parseFloat(stake) * parseFloat(Todd))).toString();
            }
            const r = await dbClient.client.db().collection('point5pro')
            .updateOne(
                { date: date },
                {
                    $push: {
                        game: {
                            time: time,
                            Sbal: Sbal.toString(),
                            stake: stake.toString(),
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
            //create worker to send notification
            const notifyQueue = new Queue('Notify');
            await notifyQueue.add({"usr": [...usrAll], "option": 'Point5PRO', "time": time, "Sbal": Sbal.toString(), "stake": stake.toString(), 
                "odd": Todd.toString(), 
                "Ebal": Ebal.toString(),
                "status": 'Pending',
                "code": code, 
            });
            return  NextResponse.json({message: "Success" }, {status: 201});
        } 
        //if (db[0] === 'sevenpro') {
            
        //}
        return  NextResponse.json('error', {status: 400});
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};