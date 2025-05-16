import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { tmpdir } from 'os';
import { join as joinPath } from 'path';

export async function POST(request) {
    try {
        const { tok, image, name, type, isPublic } = await request.json();
        const dateadded = new Date();
      const parentId = '0';
        if (!tok) { return  NextResponse.json('error', {status: 400});}
      if (type !== 'image') { return  NextResponse.json('error', {status: 400});}
        const usr_id = await redisClient.get(`auth_${tok}`);
        if (!usr_id) {
            return  NextResponse.json('error', {status: 401});
        }
      const user = await dbClient.client.db().collection('users')
    	.findOne({ "userID": usr_id });
	    if (!user) { return  NextResponse.json('error', {status: 401});}
      const userID = user.userID;
      //The crudapp profile pic images can env based
      const baseDir = joinPath(tmpdir(), '/crudapp/profilepicimages');
      const newFile = {
      userID: userID,
      name: name,
      type: type,
      isPublic: isPublic,
      parentId: parentId,
    };
        
    } catch {
        return  NextResponse.json('error', {status: 400});
    }
};
