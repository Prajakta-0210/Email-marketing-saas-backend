import { Router } from "express";

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts.controller";

const router = Router();

// Note: no base path here — that's set once in app.ts
// (app.use("/api/contacts", contactsRoutes)), so these become:
//   GET    /api/contacts
//   GET    /api/contacts/:id
//   POST   /api/contacts
//   PUT    /api/contacts/:id
//   DELETE /api/contacts/:id
//
// Fiber comparison: this whole file is like one
// router := app.Group("/api/contacts") block with
// router.Get("/", ...), router.Post("/", ...), etc.
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
