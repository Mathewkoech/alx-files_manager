import { ObjectID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import Queue from 'bull';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

class FileController {
  static async getUser(request) {
    const token = request.headers('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      const user = await users.findOne({ _id: idObject });
      if (!user) {
        return null;
      }
      return user;
    }
    return null;
  }

  static async postUpload(request, response) {
    const user = await FileController.getUser(request);
    if (!user) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = request.body;
    if (!name) {
      return response.status(400).send({ error: 'Missing name' });
    }
    if (!type) {
      return response.status(400).send({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return response.status(400).send({ error: 'Missing data ' });
    }
    const files = dbClient.db.collection('files');
    if (parentId !== 0) {
      const idObject = new ObjectID(parentId);
      const file = await files.findOne({ _id: idObject, userId: user._id });
      if (!file) {
        return response.status(404).send({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return response.status(400).send({ error: 'Parent is not a folder' });
      }
    }
    if (type === 'folder') {
      files
        .insertOne({
          userId: user._id,
          name,
          type,
          parentId,
          isPublic,
        })
        .then((result) => response.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          parentId,
          isPublic,
        }))
        .catch((error) => {
          console.log(error);
        });
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');
      try {
        try {
          await fs.mkdir(filePath);
        } catch (error) {
          console.log(error);
        }
        await fs.writeFile(fileName, buff);
      } catch (error) {
        console.log(error);
      }
      files
        .insertOne({
          userId: user._id,
          name,
          type,
          isPublic,
          parentId,
          localPath: fileName,
        })
        .then((result) => {
          response.status(201).json({
            id: result.insertedId,
            userId: user._id,
            name,
            type,
            parentId,
            isPublic,
          });
          if (type === 'image') {
            fileQueue.add({
              userId: user._id,
              fileId: result.insertedId,
            });
          }
        })
        .catch((error) => console.log(error));
    }
    return null;
  }
}

export default FileController;
