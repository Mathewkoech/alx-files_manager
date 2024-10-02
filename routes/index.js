import { Router } from "express";
import AppController from "../controllers/AppController";
import FileController from "../controllers/FilesController";

const router = Router();

router.get("/status", async (req, res) => AppController.getStatus(req, res));

router.get("/stats", async (req, res) => AppController.getStats(req, res));

router.post("/files", async (req, res) => FileController.postUpload(req, res));

router.post("/files/:id", async (req, res) => FileController.getShow(req, res))

router.post("/files/", async (req, res) => FileController.getIndex(req, res))


export default router;
