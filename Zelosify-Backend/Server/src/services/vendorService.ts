import prisma from "../config/prisma/prisma.js";
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

// Helper to map seeded job titles to required skills for the AI engine
const getRequiredSkillsForTitle = (title: string): string[] => {
  const t = title.toLowerCase();
  if (t.includes('software')) return ['React', 'Node.js', 'AWS', 'TypeScript'];
  if (t.includes('frontend')) return ['HTML', 'CSS', 'JavaScript', 'React'];
  if (t.includes('cloud')) return ['AWS', 'Azure', 'Kubernetes', 'Docker'];
  if (t.includes('devops')) return ['CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'AWS'];
  if (t.includes('data scientist')) return ['Python', 'Machine Learning', 'SQL', 'Pandas'];
  if (t.includes('product manager')) return ['Agile', 'Scrum', 'Jira', 'Roadmapping'];
  if (t.includes('ux designer')) return ['Figma', 'Wireframing', 'Prototyping', 'User Research'];
  if (t.includes('quality assurance') || t.includes('qa')) return ['Selenium', 'Cypress', 'Testing', 'QA'];
  if (t.includes('backend')) return ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'];
  if (t.includes('security')) return ['Cybersecurity', 'Penetration Testing', 'Network Security'];
  if (t.includes('machine learning')) return ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'];
  if (t.includes('it support')) return ['Troubleshooting', 'Networking', 'Active Directory'];
  return ['Communication', 'Teamwork', 'Problem Solving']; // Default fallback
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
    requiredSkills: getRequiredSkillsForTitle(opening.title), 
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
          extractedFeatures: aiResult.extractedFeatures as any,
          totalTokensUsed: aiResult.totalTokensUsed,
        }
      });
    });
    logger.info("AI evaluation saved to DB", { profileId: profile.id });
  }).catch((err) => {
    logger.error("Async AI evaluation failed", { profileId: profile.id, error: err.message });
  });

  return profile;
};
