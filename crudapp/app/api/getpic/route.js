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
    console.log(tok);
    const size = '100';
    const baseDir1 = joinPath(tmpdir(), '/crudapp/profilepicimages');
    const mkDirAsync = promisify(mkdir);
    const realpathAsync = promisify(realpath);
    const defaultPath = joinPath(baseDir1, 'default.jpg');
    if (!tok) {
      await mkDirAsync(baseDir1, { recursive: true });
      const absoluteFilePath = await realpathAsync(defaultPath);
      const mimeType1 = mime.lookup(defaultPath);
      const dbody = await readFileSync(absoluteFilePath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
    }

    const userID = await redisClient.get(`auth_${tok}`);

    if (!userID) {
      await mkDirAsync(baseDir1, { recursive: true });
      const absoluteFilePath = await realpathAsync(defaultPath);
      const mimeType1 = mime.lookup(defaultPath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
    }

    const file = await dbClient.client.db().collection('files').findOne({ userID: userID });

    //Handle the default profile pic
    if (!file) {
      await mkDirAsync(baseDir1, { recursive: true });
      const absoluteFilePath = await realpathAsync(defaultPath);
      const mimeType1 = mime.lookup(defaultPath);
      const dbody = await readFileSync(absoluteFilePath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
    }

    let filePath = file.localPath;

    if (size) {
      filePath = `${file.localPath}_${size}`;
    }

    if (existsSync(filePath)) {
      const statAsync = promisify(stat);
      const fileInfo = await statAsync(filePath);

      if (!fileInfo.isFile()) {
        await mkDirAsync(baseDir1, { recursive: true });
        const absoluteFilePath = await realpathAsync(defaultPath);
        const mimeType1 = mime.lookup(defaultPath);
        const dbody = await readFileSync(absoluteFilePath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
      }
        } else {
      await mkDirAsync(baseDir1, { recursive: true });
      const absoluteFilePath = await realpathAsync(defaultPath);
      const mimeType1 = mime.lookup(defaultPath);
      const dbody = await readFileSync(absoluteFilePath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
    }

    const absoluteFilePath = await realpathAsync(filePath);
    const mimeType = mime.lookup(filePath);

    const dbody = await readFileSync(absoluteFilePath);
      return NextResponse(dbody, {
        status: 200,
        headers: {
          'Content-Type': mimeType || 'text/plain; charset=utf-8',
        },
      });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 400 });
  }
}
