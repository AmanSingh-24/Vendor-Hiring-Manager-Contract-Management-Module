import type { Request, Response } from "express";
import { getVendorOpeningsService, getVendorOpeningDetailsService, presignProfileService, uploadProfileService } from "../services/vendorService.js";
import { logger } from "../utils/logger/index.js";

export const getOpenings = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getVendorOpeningsService(req.user.tenantId, page, limit);
    res.json(result);
  } catch (error: any) {
    logger.error("Error fetching vendor openings", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOpeningDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getVendorOpeningDetailsService(req.user.tenantId, req.params.id, req.user.id);
    if (!result) { res.status(404).json({ message: "Opening not found" }); return; }
    res.json(result);
  } catch (error: any) {
    logger.error("Error fetching vendor opening details", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const presignProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) { res.status(400).json({ message: "Filename and contentType required" }); return; }
    
    const { presignedUrl, key } = await presignProfileService(req.user.tenantId, req.params.id, filename, contentType);
    res.json({ presignedUrl, s3Key: key });
  } catch (error: any) {
    logger.error("Error generating presigned URL", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { s3Key } = req.body;
    if (!s3Key) { res.status(400).json({ message: "s3Key required" }); return; }

    const profile = await uploadProfileService(req.user.tenantId, req.params.id, req.user.id, s3Key);
    if (!profile) { res.status(404).json({ message: "Opening not found" }); return; }

    res.status(202).json({ message: "Profile submitted, AI evaluation started", profile });
  } catch (error: any) {
    logger.error("Error submitting profile", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};
