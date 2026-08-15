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
}

export const deterministicMatchingEngine = (input: MatchingEngineInput): MatchingEngineOutput => {
  // 1. Experience Logic
  let experienceMatchScore = 0;
  if (input.candidateExp < input.minExp) {
    experienceMatchScore = 0;
  } else if (!input.maxExp || input.candidateExp <= input.maxExp) {
    experienceMatchScore = 1;
  } else {
    experienceMatchScore = 0.8;
  }

  // 2. Skill Match Logic
  let skillMatchScore = 0;
  if (input.requiredSkills.length === 0) {
    skillMatchScore = 1; // If no required skills, assume match
  } else {
    const candidateSkillsLower = input.candidateSkills.map(s => s.toLowerCase());
    let overlap = 0;
    input.requiredSkills.forEach(req => {
      if (candidateSkillsLower.includes(req.toLowerCase())) {
        overlap++;
      }
    });
    skillMatchScore = overlap / input.requiredSkills.length;
  }

  // 3. Location Logic
  let locationMatchScore = 0;
  const reqLoc = input.requiredLocation.toLowerCase();
  const candLoc = input.candidateLocation.toLowerCase();
  
  if (reqLoc === 'remote') {
    locationMatchScore = 1;
  } else if (reqLoc === candLoc) {
    locationMatchScore = 1;
  } else {
    locationMatchScore = 0.5; // Onsite mismatch
  }

  // 4. Final Score Formula (MANDATORY)
  // (0.5 * skillMatchScore) + (0.3 * experienceMatchScore) + (0.2 * locationMatchScore)
  const finalScore = (0.5 * skillMatchScore) + (0.3 * experienceMatchScore) + (0.2 * locationMatchScore);

  // 5. Decision Thresholds
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
    decision
  };
};
