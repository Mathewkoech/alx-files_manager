import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

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
    await FilesController.postUpload(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to post a new user
router.post('/users', async (req, res) => {
  try {
    await UsersController.postNew(req, res);
  } catch (error) {
    console.log("user error error", error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to connect a user
router.get('/connect', async (req, res) => {
  try {
    await AuthController.getConnect(req, res);
  } catch (error) {
    console.log("connect error", error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route to show qtn 6:route 1
router.get("/files/:id", async (req, res) => {
  try {
    await FilesController.getShow(req, res)
  } catch (error) {
    console.log("File id: ", error)
    res.status(500).json({ error: "Internal servers Error" })
  }
})

// route to index Question 6: route 2
router.get('/files', FilesController.getIndex);

// route for question 7: route 1
router.get("/files/:id/publish", async (req, res) => {
  try {
    await FilesController.putPublish(req, res)
  } catch (error) {
    console.log("error for files id", error)
  }
})

// route for question 7: route 1
router.get("/files/:id/publish", async (req, res) => {
  try {
    await FilesController.putUnpublish(req, res)
  } catch (error) {
    console.log("error for files id", error)
  }
})

// Export the router
export default router;
