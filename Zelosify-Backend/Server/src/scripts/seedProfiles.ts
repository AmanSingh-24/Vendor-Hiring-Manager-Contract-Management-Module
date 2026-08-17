import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed 55 profiles...");

  // 1. Find a Senior Software Engineer opening
  let opening = await prisma.opening.findFirst({
    where: { title: { contains: "Senior Software Engineer", mode: "insensitive" } },
  });

  // If not found, use the first opening
  if (!opening) {
    opening = await prisma.opening.findFirst();
  }

  if (!opening) {
    console.error("No openings found in the database. Please run the main seed first.");
    return;
  }

  // 2. Find a Vendor User
  const vendor = await prisma.user.findFirst({
    where: { role: "IT_VENDOR" },
  });

  if (!vendor) {
    console.error("No IT_VENDOR found in the database.");
    return;
  }

  console.log(`Seeding into Opening: ${opening.title} (ID: ${opening.id})`);
  console.log(`Using Vendor: ${vendor.firstName} ${vendor.lastName} (ID: ${vendor.id})`);

  // 3. Generate 55 Profiles
  const profilesToInsert = [];
  const statuses = ["SUBMITTED", "SHORTLISTED", "REJECTED"];

  for (let i = 1; i <= 55; i++) {
    const isRecommended = Math.random() > 0.5;
    const score = isRecommended ? 0.75 + Math.random() * 0.25 : Math.random() * 0.74; // Random score
    const badge = score >= 0.75 ? "Recommended" : score >= 0.5 ? "Borderline" : "Not Recommended";
    
    profilesToInsert.push({
      openingId: opening.id,
      s3Key: `dummy/resume-virtual-${i}-${uuidv4().substring(0, 8)}.pdf`,
      uploadedBy: vendor.id,
      status: "SUBMITTED", // Default to SUBMITTED so we can see action buttons
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
      recommended: isRecommended,
      recommendationScore: score,
      recommendationReason: `AI Evaluation for candidate ${i}. Score falls into ${badge} category based on matched skills and experience constraints.`,
      recommendationLatencyMs: Math.floor(100 + Math.random() * 500),
      recommendationVersion: "v3.0",
      recommendationConfidence: 0.6 + Math.random() * 0.38,
      recommendedAt: new Date(),
    });
  }

  // 4. Insert them in a transaction
  await prisma.$transaction(
    profilesToInsert.map(profile => prisma.hiringProfile.create({ data: profile as any }))
  );

  console.log("✅ Successfully seeded 55 dummy profiles for virtualization demo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
