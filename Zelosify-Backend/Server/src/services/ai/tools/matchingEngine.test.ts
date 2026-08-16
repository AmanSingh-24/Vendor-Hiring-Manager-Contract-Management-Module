/**
 * Unit test: deterministicMatchingEngine
 * Tests the 3 resume scenarios against the Senior Software Engineer opening.
 * Opening: expMin=5, expMax=8, requiredSkills=[React, Node.js, AWS, TypeScript], location=Remote
 */

import { deterministicMatchingEngine } from "./matchingEngine.js";

const OPENING = {
  minExp: 5,
  maxExp: 8,
  requiredSkills: ["React", "Node.js", "AWS", "TypeScript"],
  requiredLocation: "Remote",
};

interface TestCase {
  name: string;
  candidateExp: number;
  candidateSkills: string[];
  candidateLocation: string;
  expectedScore: number;
  expectedDecision: string;
}

const testCases: TestCase[] = [
  {
    name: "Alex Mercer (Perfect Match)",
    candidateExp: 6,
    candidateSkills: ["React", "Node.js", "AWS", "TypeScript"],
    candidateLocation: "Remote",
    expectedScore: 1.0,
    expectedDecision: "Recommended",
  },
  {
    name: "Jordan Lee (Borderline — 3yr exp, missing TypeScript)",
    candidateExp: 3,
    candidateSkills: ["React", "Node.js", "AWS"],
    candidateLocation: "Remote",
    expectedScore: 0.575,
    expectedDecision: "Borderline",
  },
  {
    name: "Taylor Smith (Not Recommended — 1yr exp, zero skill match)",
    candidateExp: 1,
    candidateSkills: ["Python", "Django", "HTML"],
    candidateLocation: "Remote",
    expectedScore: 0.2,
    expectedDecision: "Not Recommended",
  },
  // Edge case: candidate writes "React.js" and "NodeJS" (variant spellings)
  {
    name: "Variant Spellings (should still match)",
    candidateExp: 6,
    candidateSkills: ["React.js", "NodeJS", "AWS", "TypeScript"],
    candidateLocation: "Remote",
    expectedScore: 1.0,
    expectedDecision: "Recommended",
  },
  // Edge case: candidate writes "Amazon Web Services" instead of "AWS"
  {
    name: "AWS as 'Amazon Web Services' (fuzzy match)",
    candidateExp: 6,
    candidateSkills: ["React", "Node.js", "Amazon Web Services", "TypeScript"],
    candidateLocation: "Remote",
    expectedScore: 1.0,
    expectedDecision: "Recommended",
  },
];

let allPassed = true;

for (const tc of testCases) {
  const result = deterministicMatchingEngine({
    candidateExp: tc.candidateExp,
    minExp: OPENING.minExp,
    maxExp: OPENING.maxExp,
    candidateSkills: tc.candidateSkills,
    requiredSkills: OPENING.requiredSkills,
    candidateLocation: tc.candidateLocation,
    requiredLocation: OPENING.requiredLocation,
  });

  const scoreMatch = result.finalScore === tc.expectedScore;
  const decisionMatch = result.decision === tc.expectedDecision;
  const passed = scoreMatch && decisionMatch;

  if (!passed) allPassed = false;

  console.log(`${passed ? "✅ PASS" : "❌ FAIL"} | ${tc.name}`);
  console.log(`   Score:    ${result.finalScore} (expected ${tc.expectedScore})`);
  console.log(`   Decision: ${result.decision} (expected ${tc.expectedDecision})`);
  console.log(`   Skills:   matched=[${result.breakdown.matchedSkills}] unmatched=[${result.breakdown.unmatchedSkills}]`);
  console.log(`   Exp:      ${result.experienceMatchScore} | Skill: ${result.skillMatchScore} | Loc: ${result.locationMatchScore}`);
  console.log("");
}

if (allPassed) {
  console.log("🎉 ALL TESTS PASSED");
  process.exit(0);
} else {
  console.log("💥 SOME TESTS FAILED");
  process.exit(1);
}
