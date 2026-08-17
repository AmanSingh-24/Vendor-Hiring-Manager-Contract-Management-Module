export interface MatchingEngineInput {
  candidateExp: number;
  minExp: number;
  maxExp?: number | null;
  candidateSkills: string[];
  requiredSkills: string[];
  candidateLocation: string;
  requiredLocation: string;
}

export interface MatchingEngineOutput {
  skillMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  finalScore: number;
  decision: "Recommended" | "Borderline" | "Not Recommended";
  breakdown: {
    matchedSkills: string[];
    unmatchedSkills: string[];
  };
}

/**
 * Normalizes a skill string for comparison.
 * Strips whitespace, lowercases, removes dots and common suffixes like ".js".
 */
function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\.js$/i, "")  // "Node.js" → "node", "React.js" → "react"
    .replace(/\./g, "")     // remaining dots
    .replace(/-/g, "")      // hyphens
    .replace(/\s+/g, " ");  // collapse whitespace
}

/**
 * Alias map: maps alternate names to a canonical form.
 * Both keys AND values should be in normalized form (lowercase, no dots).
 */
const SKILL_ALIASES: Record<string, string> = {
  "reactjs": "react",
  "nodejs": "node",
  "amazon web services": "aws",
  "typescript": "typescript",
  "ts": "typescript",
  "javascript": "javascript",
  "js": "javascript",
  "k8s": "kubernetes",
  "gcp": "google cloud platform",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "nextjs": "next",
  "expressjs": "express",
  "vuejs": "vue",
  "angularjs": "angular",
  "ml": "machine learning",
  "ai": "artificial intelligence",
  "quality assurance": "qa",
  "continuous integration": "cicd",
  "continuous deployment": "cicd",
  "ci": "cicd",
  "cd": "cicd",
  "ux": "user experience",
  "ui": "user interface",
  "microsoft azure": "azure",
  "infosec": "cybersecurity",
  "netsec": "network security",
  "tf": "tensorflow",
  "py": "python",
  "pentesting": "penetration testing",
  "pen testing": "penetration testing",
};

/**
 * Resolves a skill to its canonical name using aliases, then normalization.
 */
function canonicalize(skill: string): string {
  const normalized = normalizeSkill(skill);
  return SKILL_ALIASES[normalized] || normalized;
}

/**
 * Checks if a candidate skill matches a required skill using:
 * 1. Exact canonical match
 * 2. Substring containment (bidirectional)
 */
function skillMatches(candidateSkill: string, requiredSkill: string): boolean {
  const candCanon = canonicalize(candidateSkill);
  const reqCanon = canonicalize(requiredSkill);

  // Exact match after canonicalization
  if (candCanon === reqCanon) return true;

  // Substring containment: "amazon web services" contains "aws" or vice versa
  if (candCanon.includes(reqCanon) || reqCanon.includes(candCanon)) return true;

  return false;
}

export const deterministicMatchingEngine = (input: MatchingEngineInput): MatchingEngineOutput => {
  // ─── 1. Experience Score ───
  let experienceMatchScore = 0;
  if (input.candidateExp < input.minExp) {
    // Provide a partial credit curve for candidates slightly under the threshold
    // e.g., 4.9 years / 5 years = 0.98 (98% credit) instead of a hard 0
    experienceMatchScore = input.candidateExp / Math.max(1, input.minExp);
  } else if (!input.maxExp || input.candidateExp <= input.maxExp) {
    experienceMatchScore = 1;
  } else {
    experienceMatchScore = 0.8; // Over-qualified
  }

  // ─── 2. Skill Match Score (fuzzy) ───
  let skillMatchScore = 0;
  const matchedSkills: string[] = [];
  const unmatchedSkills: string[] = [];

  if (input.requiredSkills.length === 0) {
    skillMatchScore = 1; // No requirements = assume full match
  } else {
    for (const reqSkill of input.requiredSkills) {
      const found = input.candidateSkills.some(candSkill => skillMatches(candSkill, reqSkill));
      if (found) {
        matchedSkills.push(reqSkill);
      } else {
        unmatchedSkills.push(reqSkill);
      }
    }
    skillMatchScore = matchedSkills.length / input.requiredSkills.length;
  }

  // ─── 3. Location Score ───
  let locationMatchScore = 0;
  const reqLoc = input.requiredLocation.toLowerCase().trim();
  const candLoc = input.candidateLocation.toLowerCase().trim();

  if (reqLoc === "remote") {
    locationMatchScore = 1; // Remote jobs accept anyone
  } else if (reqLoc === candLoc) {
    locationMatchScore = 1;
  } else {
    locationMatchScore = 0.5; // Location mismatch
  }

  // ─── 4. Final Score ───
  // Formula: (0.5 * skillMatch) + (0.3 * expMatch) + (0.2 * locationMatch)
  const rawScore = (0.5 * skillMatchScore) + (0.3 * experienceMatchScore) + (0.2 * locationMatchScore);
  const finalScore = Math.round(rawScore * 1000) / 1000; // 3 decimal places

  // ─── 5. Decision Thresholds ───
  let decision: "Recommended" | "Borderline" | "Not Recommended";
  if (finalScore >= 0.75) {
    decision = "Recommended";
  } else if (finalScore >= 0.5) {
    decision = "Borderline";
  } else {
    decision = "Not Recommended";
  }

  return {
    skillMatchScore,
    experienceMatchScore,
    locationMatchScore,
    finalScore,
    decision,
    breakdown: { matchedSkills, unmatchedSkills },
  };
};
