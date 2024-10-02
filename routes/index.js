import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FileController from '../controllers/FilesController';

const router = Router();

// Route to check the application status
router.get('/status', async (req, res) => {
  try {
    await AppController.getStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get application statistics
router.get('/stats', async (req, res) => {
  try {
    await AppController.getStats(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to upload files
router.post('/files', async (req, res) => {
  try {
    await FileController.postUpload(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to post a new user
router.post('/users', async (req, res) => {
  try {
    await UsersController.postNew(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to connect a user
router.get('/connect', async (req, res) => {
  try {
    await AuthController.connect(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
export default router;
