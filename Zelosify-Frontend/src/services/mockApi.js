// Simulated database
const mockOpenings = [
  {
    id: "req-101",
    title: "Senior Frontend Engineer",
    location: "Remote (US)",
    contractType: "C2C",
    postedDate: "2026-08-10",
    hiringManager: "Bruce Wayne",
    status: "OPEN",
    description: "Looking for an expert React/Next.js developer to build a modern dashboard.",
  },
  {
    id: "req-102",
    title: "DevOps Architect",
    location: "New York, NY",
    contractType: "W2",
    postedDate: "2026-08-12",
    hiringManager: "Lucius Fox",
    status: "OPEN",
    description: "Requires deep knowledge of AWS, Kubernetes, and CI/CD pipelines.",
  },
  {
    id: "req-103",
    title: "Backend Java Developer",
    location: "Remote (Global)",
    contractType: "C2C",
    postedDate: "2026-08-15",
    hiringManager: "Bruce Wayne",
    status: "OPEN",
    description: "Spring Boot microservices architecture experience required.",
  }
];

// Generate 500 realistic profiles for performance testing of virtualized table
let mockProfiles = Array.from({ length: 500 }).map((_, i) => {
  const score = Math.floor(Math.random() * 100);
  let badge, badgeColor;
  if (score > 85) { badge = "Top Match"; badgeColor = "emerald"; }
  else if (score > 70) { badge = "Strong Match"; badgeColor = "blue"; }
  else if (score > 50) { badge = "Potential Match"; badgeColor = "yellow"; }
  else { badge = "Not Recommended"; badgeColor = "red"; }

  return {
    id: `prof-${i}`,
    openingId: "req-101",
    vendorName: ["TechCorp", "Apex IT", "Global Solutions", "NextGen Talent"][Math.floor(Math.random() * 4)],
    fileName: `Candidate_Resume_${i}_${Math.random().toString(36).substr(2, 5)}.pdf`,
    uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    status: "COMPLETED",
    aiScore: score,
    aiBadge: badge,
    aiBadgeColor: badgeColor,
    aiSummary: "The AI agent analyzed this resume against the JD. Candidate possesses 80% of required hard skills but lacks specific tenure in Kubernetes."
  };
});

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, 1500));

export const MockApi = {
  getOpenings: async () => {
    await delay(600);
    return [...mockOpenings];
  },

  getOpeningById: async (id) => {
    await delay(400);
    return mockOpenings.find((o) => o.id === id) || null;
  },

  getProfilesForOpening: async (openingId) => {
    await delay(500);
    return mockProfiles.filter((p) => p.openingId === openingId);
  },

  uploadProfile: async (openingId, file) => {
    await delay(1200); // Simulate S3 Presign + Upload delay
    const newProfile = {
      id: `prof-${Math.random().toString(36).substr(2, 9)}`,
      openingId,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: "PROCESSING"
    };
    mockProfiles.unshift(newProfile);
    return newProfile;
  },

  deleteProfile: async (profileId) => {
    await delay(400);
    mockProfiles = mockProfiles.filter((p) => p.id !== profileId);
    return true;
  }
};
