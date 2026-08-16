import prisma from "../config/prisma/prisma.js";

export const getHMOpeningsService = async (tenantId: string, hiringManagerId: string) => {
  return await prisma.opening.findMany({
    where: { tenantId, hiringManagerId },
    orderBy: { postedDate: 'desc' },
    include: {
      _count: {
        select: { hiringProfiles: { where: { isDeleted: false } } }
      }
    }
  });
};

export const getHMProfilesService = async (tenantId: string, hiringManagerId: string, openingId: string) => {
  const opening = await prisma.opening.findFirst({
    where: { id: openingId, tenantId, hiringManagerId }
  });
  if (!opening) return null;

  const profiles = await prisma.hiringProfile.findMany({
    where: { openingId, isDeleted: false },
    orderBy: { submittedAt: 'desc' }
  });

  return profiles.map(p => ({
    id: p.id,
    s3Key: p.s3Key,
    status: p.status,
    submittedAt: p.submittedAt,
    aiEvaluation: p.recommended !== null ? {
      badge: p.recommended ? "Recommended" : (p.recommendationScore && p.recommendationScore >= 0.5 ? "Borderline" : "Not Recommended"),
      score: p.recommendationScore,
      confidence: p.recommendationConfidence,
      explanation: p.recommendationReason,
      latencyMs: p.recommendationLatencyMs
    } : null
  }));
};

export const shortlistProfileService = async (profileId: number, hiringManagerId: string) => {
  const profile = await prisma.hiringProfile.findUnique({
    where: { id: profileId },
    include: { opening: true }
  });
  if (!profile || profile.opening.hiringManagerId !== hiringManagerId) return null;

  return await prisma.$transaction(async (tx) => {
    return await tx.hiringProfile.update({
      where: { id: profileId },
      data: { status: "SHORTLISTED", shortlistedBy: hiringManagerId, shortlistedAt: new Date() }
    });
  });
};

export const rejectProfileService = async (profileId: number, hiringManagerId: string) => {
  const profile = await prisma.hiringProfile.findUnique({
    where: { id: profileId },
    include: { opening: true }
  });
  if (!profile || profile.opening.hiringManagerId !== hiringManagerId) return null;

  return await prisma.$transaction(async (tx) => {
    return await tx.hiringProfile.update({
      where: { id: profileId },
      data: { status: "REJECTED", rejectedBy: hiringManagerId, rejectedAt: new Date() }
    });
  });
};
