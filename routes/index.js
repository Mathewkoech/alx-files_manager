import { Router } from "express";
import AppController from "../controllers/AppController";
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';


const router = Router();

router.get("/status", async (req, res) => AppController.getStatus(req, res));

router.get("/stats", async (req, res) => AppController.getStats(req, res));

router.post("/files", async (req, res) => FileController.postUpload(req, res));


/**
 * Route to post new user.
 * @name POST /users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/users', async (req, res) => UsersController.postNew(req, res));

/**
 * Route to connect a user.
 * @name GET /connect
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/connect', async (req, res) => AuthController.getConnect(req, res));

/**
 * Route to disconnect a user.
 * @name GET /disconnect
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/disconnect', async (req, res) => AuthController.getDisconnect(req, res));

/**
 * Route to get the authenticated user's information.
 * @name GET /users/me
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/users/me', async (req, res) => UsersController.getMe(req, res));

export default router;
