import { Router } from "express";
import { login } from "./controllers/authControllers.js";
import { authMiddleware } from "./middlewares/auth.js";
import { createRepository } from "./controllers/uploadController.js";
import { getRepositories } from "./controllers/getRepositories.js";
import { approveRepository } from "./controllers/approveRepository.js";
import { rejectRepository } from "./controllers/rejectRepository.js";
import { getPendingRepositories } from "./controllers/getPendingRepositories.js";
import { getMyRepositories } from "./controllers/getMyRepositories.js";
import { deleteMyRepository } from "./controllers/deleteMyRepository.js";
import { upload } from "../src/middlewares/upload.js";

const router = Router()

router.post("/login", login)
router.post("/repositorios", authMiddleware, upload.single("file"), createRepository)
router.get("/repositorios/meus-repositorios", authMiddleware, getMyRepositories)
router.get("/repositorios/repositorios-turma", authMiddleware, getRepositories)
router.delete("/repositorios/meus-repositorios/:id", authMiddleware, deleteMyRepository)

router.get("/repositorios/pendentes", authMiddleware, getPendingRepositories);
router.patch("/repositorios/pendente/:id/approve", authMiddleware, approveRepository)
router.delete("/repositorios/pendente/:id", authMiddleware, rejectRepository)

export default router