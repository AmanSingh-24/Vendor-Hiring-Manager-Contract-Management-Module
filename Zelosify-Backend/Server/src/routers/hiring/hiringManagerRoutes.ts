import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth/authenticateMiddleware.js";
import { requireRole } from "../../middlewares/auth/roleMiddleware.js";
import { getOpenings, getProfiles, shortlistProfile, rejectProfile } from "../../controllers/hiringManagerController.js";

const router = Router();

// Apply auth and RBAC middleware to all hiring manager routes
router.use(authenticateUser);
router.use(requireRole(["HIRING_MANAGER"]));

router.get("/openings", getOpenings);
router.get("/openings/:id/profiles", getProfiles);
router.post("/profiles/:id/shortlist", shortlistProfile);
router.post("/profiles/:id/reject", rejectProfile);

export default router;
