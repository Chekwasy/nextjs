import dbClient from '../../db';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        const { tok } = request.json();
	if (!tok) { NextResponse.json('error', {status: 400}) }


    
	if (!(checkinput(x_tok))) {
		res.status(401).json({'error': 'Unauthorized'}); return;
	}
	const usr_id = await redisClient.get(`auth_${x_tok}`);
	if (!usr_id) {
		res.status(401).json({});
		return;
	}
	const user = await (await dbClient.client.db().collection('users'))
	.findOne({ "_id": ObjectID(usr_id) });
	if (!user) { res.status(401).json({}); console.log(4); return;}
	if (checksub(user.subtime)) {
		res.status(200).json({ firstname: user.firstname, lastname: user.lastname, phonenumber: user.phonenumber, earnings: user.earnings, staff: user.staff, subtime: user.subtime, count: user.count ? user.count : 0, status: user.status, accountNo: user.accountNo, walletbal: user.walletbal, currency: user.currency, email: user.email,});
		return;
	} else {
		await (await dbClient.client.db().collection('users'))
		.updateOne({ "userID": user.userID },
		{ $set: { "status": 'expired' } });
		res.status(200).json({ firstname: user.firstname, lastname: user.lastname, phonenumber: user.phonenumber, earnings: user.earnings, staff: user.staff, count: user.count ? user.count : 0, subtime: user.subtime, status: 'expired', accountNo: user.accountNo, walletbal: user.walletbal, currency: user.currency, email: user.email,});
		return;
	}
    } catch {
        console.log('err');
    }
};

