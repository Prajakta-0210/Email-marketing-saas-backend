import express, { Application } from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import contactsRoutes from "./routes/contacts.routes";
import campaignsRoutes from "./routes/campaigns.routes";

const app: Application = express();

// ---- Global middleware ----
// cors() lets the frontend (running on a different port, e.g. 3000)
// make requests to this backend (running on 5000). Without this,
// the browser blocks the request with a CORS error.
// Fiber equivalent: app.Use(cors.New())
app.use(cors());

// express.json() parses incoming JSON request bodies into req.body.
// Fiber does this automatically; in Express you opt in explicitly.
app.use(express.json());

// ---- Routes ----
// Every route file is "mounted" under a base path here.
// Fiber equivalent: app.Group("/api/health", healthRoutes)
app.use("/api/health", healthRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/campaigns", campaignsRoutes);

export default app;
