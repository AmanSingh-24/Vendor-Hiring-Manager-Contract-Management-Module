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
    orderBy: { submittedAt: 'desc' },
  });

  // Manual join: fetch vendor names for all uploaders
  const uploaderIds = [...new Set(profiles.map(p => p.uploadedBy))];
  const uploaders = await prisma.user.findMany({
    where: { id: { in: uploaderIds } },
    select: { id: true, firstName: true, lastName: true },
  });
  const uploaderMap = new Map(uploaders.map(u => [u.id, u]));

  return {
    opening: { id: opening.id, title: opening.title },
    profiles: profiles.map(p => {
      const uploader = uploaderMap.get(p.uploadedBy);
      return {
        id: p.id,
        s3Key: p.s3Key,
        status: p.status,
        submittedAt: p.submittedAt,
        uploadedByUser: uploader ? { firstName: uploader.firstName, lastName: uploader.lastName } : null,
        aiEvaluation: p.recommended !== null ? {
          badge: p.recommended ? "Recommended" : (p.recommendationScore && p.recommendationScore >= 0.5 ? "Borderline" : "Not Recommended"),
          score: p.recommendationScore,
          confidence: p.recommendationConfidence,
          explanation: p.recommendationReason,
          latencyMs: p.recommendationLatencyMs
        } : null
      };
    })
  };
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
