import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import { promisify } from 'util';
import redisClient from '../../../redis';
import { tmpdir } from 'os';
import { join as joinPath } from 'path';
import {
  mkdir, stat, existsSync, realpath, readFileSync,
} from 'fs';
import mime from 'mime-types';



export async function GET(request) {
  try {
    const tok = request.cookies.get('tok') || request.headers.get('tok');
    const baseDir1 = joinPath(tmpdir(), '/crudapp/profilepicimages');
    const mkDirAsync = promisify(mkdir);
    const realpathAsync = promisify(realpath);
    const defaultPath = joinPath(baseDir1, 'default.jpg');
    if (!tok) {
      return NextResponse.json({ error: 'Error1' }, { status: 400 });
    }

    console.log(tok.value);
    const userID = await redisClient.get(`auth_${tok.value}`);

    if (!userID) {
      return NextResponse.json({ error: 'Error2' }, { status: 400 });
    }

    const file = await dbClient.client.db().collection('files').findOne({ userID: userID });

    //Handle the default profile pic
    if (!file) {
      await mkDirAsync(baseDir1, { recursive: true });
      const absoluteFilePath = await realpathAsync(defaultPath);
      const mimeType1 = mime.lookup(defaultPath);
      const dbody = await readFileSync(absoluteFilePath);
      console.log(55);
      return new NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType1 || 'text/plain; charset=utf-8',
        },
      });
    }

    let filePath = file.localPath;

    if (existsSync(filePath)) {
      const statAsync = promisify(stat);
      const fileInfo = await statAsync(filePath);

      if (!fileInfo.isFile()) {
        return NextResponse.json({ error: 'Error3' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Error4' }, { status: 400 });
    }

    const absoluteFilePath = await realpathAsync(filePath);
    const mimeType = mime.lookup(filePath);

    const dbody = await readFileSync(absoluteFilePath, 'utf8');
    const binaryData = Buffer.from(dbody, 'base64');
    return new NextResponse(binaryData, {
      status: 200,
      headers: {
        'Content-Type': mimeType || 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'ErrorTRY' }, { status: 400 });
  }
}
