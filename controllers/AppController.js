/**
 * AppController representing the controller for the application.
 */
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Checks the status of the API.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The status of the API.
   */
  static async getStatus(req, res) {
    try {
      const redisStatus = redisClient.isAlive();
      const dbStatus = await dbClient.isAlive();

      res.status(200).send({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      res.status(500).send({ redis: false, db: false });
    }
  }

  /**
   * Returns the number of users and files in the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The number of users and files in the database.
   */
  static async getStats(req, res) {
    try {
      const nbUsers = await dbClient.nbUsers();
      const nbFiles = await dbClient.nbFiles();

      res.status(200).send({ users: nbUsers, files: nbFiles });
    } catch (error) {
      res.status(500).send('Cannot get the stats');
    }
  }
}

export default AppController;
