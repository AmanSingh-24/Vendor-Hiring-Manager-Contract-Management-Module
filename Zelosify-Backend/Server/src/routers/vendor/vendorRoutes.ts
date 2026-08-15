import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";
import { requireRole } from "../../middlewares/auth/roleMiddleware.js";
import { getOpenings, getOpeningDetails, presignProfile, uploadProfile } from "../../controllers/vendorController.js";

const router = Router();

// Apply auth and RBAC middleware to all vendor routes
router.use(authenticateUser);
router.use(requireRole(["IT_VENDOR"]));

router.get("/openings", getOpenings);
router.get("/openings/:id", getOpeningDetails);
router.post("/openings/:id/profiles/presign", presignProfile);
router.post("/openings/:id/profiles/upload", uploadProfile);

export default router;
