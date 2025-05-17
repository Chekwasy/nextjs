import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join as joinPath } from 'path';
import { mkdir, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

export async function POST(request) {
  try {
    const { tok, image, name, type } = await request.json();

    if (!tok) {
      return NextResponse.json('error', { status: 400 });
    }

    if (type.split('/')[0] !== 'image') {
      return NextResponse.json('error', { status: 400 });
    }

    const usr_id = await redisClient.get(`auth_${tok}`);

    if (!usr_id) {
      return NextResponse.json('error', { status: 401 });
    }

    const user = await dbClient.client.db().collection('users').findOne({ userID: usr_id });

    if (!user) {
      return NextResponse.json('error', { status: 401 });
    }
    const filer = await dbClient.client.db().collection('files').findOne({ userID: usr_id });

    if (filer) {
      if (type.split('/')[0] === 'image') {
        const localPath = joinPath(baseDir, `${uuidv4()}.${type.split('/')[1]}`);
        await writeFileAsync(localPath, Buffer.from(image, 'base64'));
        const filee = await (await dbClient.client.db().collection('files'))
        .updateOne({ userID: usr_id }, 
          { $set: { localPath: localPath } });

      if (!filee) {
        return NextResponse.json('error', { status: 400 });
      }
      return NextResponse.json('success', { status: 200 });
      }
      return NextResponse.json('error', { status: 401 });
    }

    const userID = user.userID;
    const baseDir = joinPath(tmpdir(), '/crudapp/profilepicimages');
    const newFile = {
      userID,
      name,
      fileID: uuidv4(),
      type,
      isPublic: true,
      parentId: '0',
      dateadded: new Date(),
    };

    await mkDirAsync(baseDir, { recursive: true });

    if (type.split('/')[0] === 'image') {
      const localPath = joinPath(baseDir, `${uuidv4()}.${type.split('/')[1]}`);
      await writeFileAsync(localPath, Buffer.from(image, 'base64'));
      newFile.localPath = localPath;
    }

    const insertInfo = await dbClient.client.db().collection('files').insertOne(newFile);

    if (!insertInfo) {
      return NextResponse.json('error', { status: 400 });
    }

    return NextResponse.json('success', { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json('error', { status: 404 });
  }
}
