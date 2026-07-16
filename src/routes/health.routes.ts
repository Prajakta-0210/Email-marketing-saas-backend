import { Router } from "express";

// A Router is a "mini Express app" — a self-contained group of routes.
// Fiber equivalent: router := app.Group("/api/health")
const router = Router();

// Full path becomes /api/health because we mount this router
// at "/api/health" in app.ts (app.use("/api/health", healthRoutes)).
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Pulse backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
