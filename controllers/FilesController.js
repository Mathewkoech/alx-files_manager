import Bull from 'bull';
import fs from 'fs';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import { getUserByToken } from '../utils/auth';

const acceptedTypes = ['folder', 'file', 'image'];
const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
const fileQueue = new Bull('fileQueue'); // Moved outside to avoid multiple connections

class FilesController {
  static async postUpload(req, res) {
    const { user } = await getUserByToken(req);
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) return res.status(400).send({ error: 'Missing name' });
    if (!type || !acceptedTypes.includes(type)) return res.status(400).send({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).send({ error: 'Missing data' });

    if (parentId !== 0 && parentId !== '0') {
      try {
        const parentIdObj = new ObjectID(parentId);
        const parent = await dbClient.filterBy('files', { _id: parentIdObj });
        if (!parent) return res.status(400).send({ error: 'Parent not found' });
        if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
      } catch (error) {
        return res.status(400).send({ error: 'Invalid parent ID' });
      }
    }

    const file = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId: parentId !== 0 ? new ObjectID(parentId) : 0,
    };

    if (type === 'folder') {
      const newFolder = await dbClient.insertInto('files', file);
      file.id = newFolder.insertedId;
      delete file._id;
      return res.status(201).send(file);
    }

    file.localPath = `${folderPath}/${uuidv4()}`;
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(file.localPath, Buffer.from(data, 'base64'));

    const result = await dbClient.insertInto('files', file);
    if (type === 'image') {
      fileQueue.add({ userId: user._id, fileId: result.insertedId });
    }

    const newFile = { ...result.ops[0], id: result.insertedId };
    delete newFile._id;
    delete newFile.localPath;
    return res.status(201).send(newFile);
  }

  // Other methods remain unchanged...
}

export default FilesController;
