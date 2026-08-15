import prisma from "../../config/prisma/prisma.js";
import { generatePresignedUrl } from "../utils/aws/s3Uploader.js";
import { processResumeWithAgent } from "./ai/agent.js";
import { logger } from "../utils/logger/index.js";

export const getVendorOpeningsService = async (tenantId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [openings, total] = await Promise.all([
    prisma.opening.findMany({
      where: { tenantId },
      skip,
      take: limit,
      orderBy: { postedDate: 'desc' },
    }),
    prisma.opening.count({ where: { tenantId } })
  ]);
  
  return {
    data: openings,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const getVendorOpeningDetailsService = async (tenantId: string, openingId: string, userId: string) => {
  const opening = await prisma.opening.findFirst({
    where: { id: openingId, tenantId },
    include: {
      hiringProfiles: {
        where: { uploadedBy: userId, isDeleted: false },
        select: { id: true, s3Key: true, submittedAt: true, status: true }
      }
    }
  });

  if (!opening) return null;

  const hm = await prisma.user.findUnique({
    where: { id: opening.hiringManagerId },
    select: { firstName: true, lastName: true }
  });

  return {
    ...opening,
    hiringManagerName: hm ? `${hm.firstName} ${hm.lastName}` : "Unknown",
    profilesCount: opening.hiringProfiles.length,
  };
};

export const presignProfileService = async (tenantId: string, openingId: string, filename: string, contentType: string) => {
  return await generatePresignedUrl(tenantId, openingId, filename, contentType);
};

export const uploadProfileService = async (tenantId: string, openingId: string, userId: string, s3Key: string) => {
  const opening = await prisma.opening.findFirst({ where: { id: openingId, tenantId } });
  if (!opening) return null;

  // 1. Transaction to save profile
  const profile = await prisma.$transaction(async (tx) => {
    return await tx.hiringProfile.create({
      data: { openingId, s3Key, uploadedBy: userId, status: "SUBMITTED" }
    });
  });

  // 2. Fire and forget AI background task
  processResumeWithAgent(s3Key, {
    minExp: opening.experienceMin,
    maxExp: opening.experienceMax,
    requiredSkills: [], 
    requiredLocation: opening.location || "Remote"
  }).then(async (aiResult) => {
    await prisma.$transaction(async (tx) => {
      await tx.hiringProfile.update({
        where: { id: profile.id },
        data: {
          recommended: aiResult.recommended,
          recommendationScore: aiResult.recommendationScore,
          recommendationReason: aiResult.recommendationReason,
          recommendationLatencyMs: aiResult.recommendationLatencyMs,
          recommendationVersion: aiResult.recommendationVersion,
          recommendationConfidence: aiResult.recommendationConfidence,
          recommendedAt: new Date(),
        }
      });
    });
    logger.info("AI evaluation saved to DB", { profileId: profile.id });
  }).catch((err) => {
    logger.error("Async AI evaluation failed", { profileId: profile.id, error: err.message });
  });

  return profile;
};
