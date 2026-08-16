import type { Request, Response } from "express";
import { getHMOpeningsService, getHMProfilesService, shortlistProfileService, rejectProfileService } from "../services/hiringManagerService.js";
import { logger } from "../utils/logger/index.js";

export const getOpenings = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getHMOpeningsService(req.user.tenant.tenantId, req.user.id);
    res.json({ data: result });
  } catch (error: any) {
    logger.error("Error fetching HM openings", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getHMProfilesService(req.user.tenant.tenantId, req.user.id, req.params.id);
    if (!result) { res.status(403).json({ message: "Access Denied: Not your opening" }); return; }
    res.json({ data: result });
  } catch (error: any) {
    logger.error("Error fetching HM profiles", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const shortlistProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shortlistProfileService(parseInt(req.params.id), req.user.id);
    if (!result) { res.status(403).json({ message: "Access Denied" }); return; }
    res.json({ message: "Profile shortlisted", profile: result });
  } catch (error: any) {
    logger.error("Error shortlisting profile", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await rejectProfileService(parseInt(req.params.id), req.user.id);
    if (!result) { res.status(403).json({ message: "Access Denied" }); return; }
    res.json({ message: "Profile rejected", profile: result });
  } catch (error: any) {
    logger.error("Error rejecting profile", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};
