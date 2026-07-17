import { Router } from "express";

import {
  getAllAudiences,
  getAudienceById,
  createAudience,
  updateAudience,
  deleteAudience,
} from "../controllers/audiences.controller";

const router = Router();

router.get("/", getAllAudiences);
router.get("/:id", getAudienceById);
router.post("/", createAudience);
router.put("/:id", updateAudience);
router.delete("/:id", deleteAudience);

export default router;