import { writeFile } from 'fs';
import Queue from 'bull/lib/queue';
import imgThumbnail from 'image-thumbnail';
import dbClient from '/db';


const writeFileAsync = promisify(writeFile);
const fileQueue = new Queue('thumbnail generation');

const generateThumbnail = async (filePath, size) => {
  const buffer = await imgThumbnail(filePath, { width: size });
  console.log(`Generating file: ${filePath}, size: ${size}`);
  return writeFileAsync(`${filePath}_${size}`, buffer);
};

fileQueue.process(async (job, done) => {
  const fileID = job.data.fileID || null;
  const userID = job.data.userID || null;

  if (!fileID) {
    throw new Error('Missing fileID');
  }
  if (!userID) {
    throw new Error('Missing userID');
  }
  console.log('Processing', job.data.name || '');
  const file = await (await dbClient.client.db().collection('files'))
    .findOne({
      fileID: fileID,
      userID: userID,
    });
  if (!file) {
    throw new Error('File not found');
  }
  const sizes = [100,];
  Promise.all(sizes.map((size) => generateThumbnail(file.localPath, size)))
    .then(() => {
      done();
    });
});
