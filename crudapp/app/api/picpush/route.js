import dbClient from '../../../db';
import { NextResponse } from 'next/server';
import redisClient from '../../../redis';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join as joinPath } from 'path';
import { mkdir, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';

const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

export async function POST(request) {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = tmpdir();
    form.keepExtensions = true;
    form.multipart = true;

    const parsedForm = await new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { tok, name, type } = parsedForm.fields;
    const image = parsedForm.files.image;

    if (!tok) {
      return NextResponse.json('error', { status: 400 });
    }

    if (type !== 'image') {
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
      return NextResponse.json('error', { status: 200 });
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

    if (type === 'image') {
      const localPath = joinPath(baseDir, image.originalFilename);
      await writeFileAsync(localPath, image.file);
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
