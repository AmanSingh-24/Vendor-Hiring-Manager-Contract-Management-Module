import { deterministicMatchingEngine, MatchingEngineInput, MatchingEngineOutput } from "./matchingEngine.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import pdfExtraction from "pdf-extraction";
import { logger } from "../../../utils/logger/index.js";

const s3Client = new S3Client({
  region: process.env.S3_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 1: Resume Parsing — Downloads PDF from S3 and extracts raw text
// ═══════════════════════════════════════════════════════════════════════════════

export const parseResumeTool = {
  type: "function" as const,
  function: {
    name: "parse_resume_tool",
    description: "Downloads and extracts raw text from a candidate's resume PDF stored in S3. Returns the full text content.",
    parameters: {
      type: "object",
      properties: {
        s3Key: { type: "string", description: "The S3 key of the resume file to parse" },
      },
      required: ["s3Key"],
    },
  },
};

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

// Helper function to extract text from a PPTX file without any external dependencies
function extractPptxText(buffer: Buffer): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pptx-"));
  const tempFile = path.join(tempDir, "temp.pptx");
  fs.writeFileSync(tempFile, buffer);

  try {
    // Unzip the pptx file (which is just a zip archive) using built-in tar
    execSync(`tar -xf temp.pptx`, { cwd: tempDir, stdio: "ignore" });
    
    // Read all slide XML files
    const slidesDir = path.join(tempDir, "ppt", "slides");
    if (!fs.existsSync(slidesDir)) return "";

    const files = fs.readdirSync(slidesDir).filter(f => f.endsWith(".xml"));
    let extractedText = "";

    for (const file of files) {
      const content = fs.readFileSync(path.join(slidesDir, file), "utf-8");
      // Extract text from <a:t> tags which contain the actual text in PPTX XML
      const matches = content.matchAll(/<a:t[^>]*>([^<]+)<\/a:t>/g);
      for (const match of matches) {
        extractedText += match[1] + " ";
      }
      extractedText += "\n";
    }

    return extractedText.trim();
  } catch (error: any) {
    logger.error("PPTX extraction failed", { error: error.message });
    return "";
  } finally {
    // Cleanup temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

export async function parseResumeImplementation(s3Key: string): Promise<string> {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) throw new Error("S3_BUCKET_NAME not configured");

  const command = new GetObjectCommand({ Bucket: bucketName, Key: s3Key });
  const response = await s3Client.send(command);

  if (!response.Body) throw new Error("S3 returned empty body");

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  let rawText = "";
  if (s3Key.toLowerCase().endsWith(".pdf")) {
    try {
      const data = await pdfExtraction(buffer);
      rawText = data.text;
    } catch (e: any) {
      logger.error("pdfExtraction failed", { s3Key, error: e.message });
      rawText = "Error: Could not extract text from this PDF due to corruption or bad formatting.";
    }
  } else if (s3Key.toLowerCase().endsWith(".pptx")) {
    rawText = extractPptxText(buffer);
  } else {
    rawText = buffer.toString("utf-8");
  }

  // Sanitize: strip code fences (prompt injection defense) and cap length
  const sanitized = rawText.replace(/```/g, " ").substring(0, 15000);
  logger.info("parse_resume_tool: extracted text", { s3Key, textLength: sanitized.length });
  return sanitized;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 2: Feature Extraction — LLM extracts structured data from resume text
// The server CAPTURES these args; they are NOT passed back to the LLM for scoring.
// ═══════════════════════════════════════════════════════════════════════════════

export interface ExtractedFeatures {
  experienceYears: number;
  skills: string[];
  location: string;
  education: string[];
}

export const featureExtractionTool = {
  type: "function" as const,
  function: {
    name: "feature_extraction_tool",
    description:
      "Extracts structured features from the parsed resume text. " +
      "You MUST calculate experienceYears by summing the duration of each work position listed in the resume. " +
      "Count ONLY the actual months/years between start and end dates. 'Present' means August 2026. " +
      "Do NOT guess or round up. If dates overlap, do not double-count. " +
      "For skills, list ONLY the technical skills explicitly written in the resume's skills section. " +
      "Do NOT infer skills from job descriptions or add skills that are not explicitly listed.",
    parameters: {
      type: "object",
      properties: {
        experienceYears: {
          type: "number",
          description: "Total years of professional experience, calculated by summing durations of each listed position. Must be a number with at most 1 decimal place.",
        },
        skills: {
          type: "array",
          items: { type: "string" },
          description: "List of technical skills EXPLICITLY mentioned in the resume's skills/technologies section. Do not infer or add skills not listed.",
        },
        location: {
          type: "string",
          description: "Candidate's location as stated in the resume, or 'Remote' if stated as remote.",
        },
        education: {
          type: "array",
          items: { type: "string" },
          description: "List of degrees and institutions.",
        },
      },
      required: ["experienceYears", "skills", "location", "education"],
    },
  },
};

/**
 * Validates and captures the LLM's extracted features.
 * Returns an acknowledgment to the LLM. The actual data is captured by the agent loop.
 */
export function featureExtractionImplementation(args: ExtractedFeatures): { message: string; extractedFeatures: ExtractedFeatures } {
  // Clamp experience to reasonable bounds
  const clampedExp = Math.max(0, Math.min(args.experienceYears, 50));

  const validated: ExtractedFeatures = {
    experienceYears: Math.round(clampedExp * 10) / 10, // 1 decimal place
    skills: (args.skills || []).map(s => s.trim()).filter(s => s.length > 0),
    location: (args.location || "Unknown").trim(),
    education: args.education || [],
  };

  logger.info("feature_extraction_tool: LLM extracted features", {
    experienceYears: validated.experienceYears,
    skills: validated.skills,
    location: validated.location,
    educationCount: validated.education.length,
  });

  return { message: "Features captured. The server will now score this candidate.", extractedFeatures: validated };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER-SIDE ONLY: Deterministic Scoring — Never exposed to the LLM
// Called directly by the agent orchestrator after capturing features.
// ═══════════════════════════════════════════════════════════════════════════════

export function runDeterministicScoring(
  candidateFeatures: ExtractedFeatures,
  groundTruth: { minExp: number; maxExp: number | null; requiredSkills: string[]; requiredLocation: string }
): MatchingEngineOutput {
  const input: MatchingEngineInput = {
    candidateExp: candidateFeatures.experienceYears,
    minExp: groundTruth.minExp,
    maxExp: groundTruth.maxExp,
    candidateSkills: candidateFeatures.skills,
    requiredSkills: groundTruth.requiredSkills,
    candidateLocation: candidateFeatures.location,
    requiredLocation: groundTruth.requiredLocation,
  };

  logger.info("deterministic_scoring: input", {
    candidateExp: input.candidateExp,
    minExp: input.minExp,
    maxExp: input.maxExp,
    candidateSkills: input.candidateSkills,
    requiredSkills: input.requiredSkills,
    candidateLocation: input.candidateLocation,
    requiredLocation: input.requiredLocation,
  });

  const result = deterministicMatchingEngine(input);

  logger.info("deterministic_scoring: result", {
    skillMatchScore: result.skillMatchScore,
    experienceMatchScore: result.experienceMatchScore,
    locationMatchScore: result.locationMatchScore,
    finalScore: result.finalScore,
    decision: result.decision,
    matchedSkills: result.breakdown.matchedSkills,
    unmatchedSkills: result.breakdown.unmatchedSkills,
  });

  return result;
}
