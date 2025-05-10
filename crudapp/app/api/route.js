import dbClient from '../../db';

const uu = async () => { 
    const gg = await dbClient.client.db().collection('users').findOne({"email": "richardchekwas@gmail.com"});
    console.log(gg);
};
uu();

