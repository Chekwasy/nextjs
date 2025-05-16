import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { tmpdir } from 'os';
import { join as joinPath } from 'path';
import { mkdir, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Queue from 'bull/lib/queue';

export async function POST(request) {
    try {
	    const mkDirAsync = promisify(mkdir);
	    const writeFileAsync = promisify(writeFile);
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
        fileID: uuidv4(),
        type: type,
        isPublic: isPublic,
        parentId: parentId,
        dateadded: dateadded,
      };
      await mkDirAsync(baseDir, { recursive: true });
      if (type === 'image') {
        const localPath = joinPath(baseDir, uuidv4());
        await writeFileAsync(localPath, Buffer.from(image, 'base64'));
        newFile.localPath = localPath;
      }
      const insertInfo = await dbClient.client.db().collection('files')
	    .insertOne(newFile);
      if (!insertInfo) { return  NextResponse.json('error', {status: 400});}
      if (type === 'image') {
        //create worker to resize image
        const fileQueue = new Queue('thumbnail generation');
        const jobName = `Image thumbnail [${userID}-${insertInfo.fileID}]`;
        fileQueue.add({ userID: userID, fileID: newFile.fileID, name: jobName });
      }
      return  NextResponse.json('success', {status: 200});
    } catch {
      return  NextResponse.json('error', {status: 400});
    }
};
