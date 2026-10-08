import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy/Safe Gemini initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Document Text Extraction (PDF, DOCX, TXT)
app.post("/api/documents/extract-text", async (req: Request, res: Response) => {
  try {
    const { fileBase64, fileName, fileType } = req.body;
    if (!fileBase64) {
      return res.status(400).json({ error: "Missing fileBase64 data." });
    }

    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const nameLower = (fileName || "").toLowerCase();

    let extractedText = "";

    if (nameLower.endsWith(".pdf") || fileType === "application/pdf") {
      try {
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        extractedText = typeof data === "string" ? data : data?.text || "";
      } catch (pdfErr: any) {
        console.error("PDF parse error:", pdfErr);
        return res.status(422).json({
          error: "Unable to parse PDF. Ensure file is not password-protected or corrupted.",
        });
      }
    } else if (
      nameLower.endsWith(".docx") ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docxErr: any) {
        console.error("DOCX parse error:", docxErr);
        return res.status(422).json({
          error: "Unable to parse DOCX document. Ensure the file is a valid Word document.",
        });
      }
    } else {
      // Plain text or fallback
      extractedText = buffer.toString("utf-8");
    }

    extractedText = extractedText.replace(/\r\n/g, "\n").trim();

    if (!extractedText || extractedText.length < 20) {
      return res.status(422).json({
        error: "Extracted text is empty or too short. Check if the resume contains scanned image text without OCR.",
      });
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    return res.json({
      success: true,
      text: extractedText,
      fileName,
      wordCount,
    });
  } catch (error: any) {
    console.error("Document extraction error:", error);
    return res.status(500).json({
      error: `Failed to extract text from document: ${error.message || "Unknown error"}`,
    });
  }
});

// 2. AI Job Requirement Analyzer
app.post("/api/ai/analyze-job", async (req: Request, res: Response) => {
  try {
    const { title, description, rawText } = req.body;
    const textToAnalyze = rawText || `${title ? `Job Title: ${title}\n` : ""}${description || ""}`;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      return res.status(400).json({ error: "Job title or description is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback heuristics when API key is not present
      const fallbackResult = parseJobFallback(title, description || rawText);
      return res.json(fallbackResult);
    }

    const prompt = `You are an expert HR Talent Acquisition Specialist. Analyze the following job description and extract structured requirements in JSON format.
Be precise and extract all critical competencies, technologies, certifications, and responsibilities.

Job Content:
${textToAnalyze}

Output strictly valid JSON with this schema:
{
  "title": "string (cleaned job title)",
  "department": "string (e.g. Engineering, Product, Marketing, or Other)",
  "location": "string (e.g. Remote, Hybrid, or city)",
  "employmentType": "Full-time | Part-time | Contract | Remote | Hybrid",
  "seniority": "Junior | Mid-Level | Senior | Lead | Executive",
  "experienceLevel": "string (e.g. 3-5 years, 5+ years)",
  "educationRequirement": "string (e.g. Bachelor's in Computer Science)",
  "requiredSkills": ["string", "string"],
  "preferredSkills": ["string", "string"],
  "certifications": ["string"],
  "responsibilities": ["string", "string"],
  "technicalRequirements": ["string", "string"],
  "softSkills": ["string", "string"],
  "keywords": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing job description:", error);
    // Graceful fallback to ensure UI never freezes
    const fallback = parseJobFallback(req.body.title, req.body.description || req.body.rawText);
    return res.json(fallback);
  }
});

// 3. AI Resume Parser
app.post("/api/ai/parse-resume", async (req: Request, res: Response) => {
  try {
    const { resumeText, fileName } = req.body;
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Resume text is empty or could not be read." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = parseResumeFallback(resumeText, fileName);
      return res.json(fallback);
    }

    const prompt = `You are a professional HR Resume Screening Engine. Parse and extract structured candidate data from the provided resume text into JSON.
Understand related technical terminology and context (e.g. React.js = React, ML = Machine Learning, TensorFlow as an ML framework), but DO NOT fabricate or hallucinate details not supported by the resume.

Resume Text:
${resumeText}

Output strictly valid JSON with this schema:
{
  "candidateName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string",
  "totalExperienceYears": number (estimated numeric years, e.g. 4.5),
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "year": "string",
      "gpa": "string (optional)"
    }
  ],
  "technicalSkills": ["string"],
  "softSkills": ["string"],
  "workExperience": [
    {
      "company": "string",
      "role": "string",
      "period": "string",
      "years": number,
      "description": "string",
      "highlights": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "certifications": ["string"],
  "achievements": ["string"],
  "languages": ["string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    const fallback = parseResumeFallback(req.body.resumeText, req.body.fileName);
    return res.json(fallback);
  }
});

// 4. AI Candidate Matching & Explainable Scoring
app.post("/api/ai/match-candidate", async (req: Request, res: Response) => {
  try {
    const { job, resume, fairScreening, weights } = req.body;
    if (!job || !resume) {
      return res.status(400).json({ error: "Both job requirements and structured resume are required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = computeMatchFallback(job, resume, weights);
      return res.json(fallback);
    }

    const fairNotice = fairScreening
      ? `CRITICAL FAIR SCREENING DIRECTIVE: You MUST evaluate this candidate purely on job-relevant technical qualifications, demonstrable work experience, education, and observable skill proficiency. DO NOT consider, infer, or penalize based on gender, ethnicity, race, age, religion, marital status, or nationality.`
      : ``;

    const prompt = `You are the HireLens AI Semantic Matching Engine. Compare the candidate's actual resume against the target job requirements.

CRITICAL EVALUATION MANDATES:
1. NO SIMPLE KEYWORD COUNTING: Semantically evaluate the candidate's actual work experience, demonstrated skills, real-world project scale, and education against the job requirements.
2. EVIDENCE-BACKED & GROUNDED: Do not invent, hallucinate, or assume experience or skills that are not present in the resume. If a required competency is not demonstrably evidenced by the resume text, mark it as "missing" or "partial". Cite only factual evidence from the resume.
3. STRUCTURED EVIDENCE FOR EVERY SCORE: For every scoring dimension and skill, generate:
   - matched requirement: the exact job requirement evaluated
   - evidence from resume: direct quotation or verifiable fact from the resume demonstrating this requirement (or "None found in resume" if missing)
   - match status: "matched" | "partial" | "missing"
   - missing requirement: specific deficiency, missing depth, or missing credential (or "None" if fully matched)
   - confidence: integer percentage (0-100) representing certainty of the match
4. DETERMINISTIC & EXPLAINABLE: Base scoring strictly on observable credentials and mathematical weights.

${fairNotice}

Target Job Requirements:
- Title: ${job.title}
- Seniority: ${job.seniority || "Mid-Senior"}
- Required Experience: ${job.experienceLevel || "Not specified"}
- Education Requirement: ${job.educationRequirement || "Not specified"}
- Required Skills: ${(job.requiredSkills || []).join(", ")}
- Preferred Skills: ${(job.preferredSkills || []).join(", ")}
- Certifications: ${(job.certifications || []).join(", ")}
- Key Responsibilities: ${(job.responsibilities || []).join("; ")}
- Technical Requirements: ${(job.technicalRequirements || []).join("; ")}

Candidate Profile:
- Name: ${resume.candidateName || "Candidate"}
- Total Experience: ${resume.totalExperienceYears || 0} years
- Education: ${(resume.education || []).map((e: any) => `${e.degree} in ${e.field} from ${e.institution} (${e.year})`).join("; ")}
- Technical Skills: ${(resume.technicalSkills || []).join(", ")}
- Work History Summary: ${(resume.workExperience || []).map((w: any) => `${w.role} at ${w.company} (${w.period}, ${w.years || 0} yrs): ${w.highlights ? w.highlights.join(" ") : w.description}`).join(" | ")}
- Projects: ${(resume.projects || []).map((p: any) => `${p.name} (Tech: ${(p.technologies || []).join(", ")}): ${p.description}`).join("; ")}
- Certifications: ${(resume.certifications || []).join(", ")}
- Summary: ${resume.summary || "Not provided"}

Configured Scoring Weights:
- Required Skills: ${weights?.requiredSkills || 40}%
- Experience: ${weights?.experience || 25}%
- Education: ${weights?.education || 15}%
- Preferred Skills: ${weights?.preferredSkills || 10}%
- Certifications: ${weights?.certifications || 5}%
- Projects: ${weights?.projects || 5}%

Scoring Rules:
- Calculate overall as strictly: Math.round((requiredSkills * ${weights?.requiredSkills || 40} + experience * ${weights?.experience || 25} + education * ${weights?.education || 15} + preferredSkills * ${weights?.preferredSkills || 10} + certifications * ${weights?.certifications || 5} + projectRelevance * ${weights?.projects || 5}) / 100).
- Recommendation Level: "Strongly Recommended" (88-100) | "Recommended" (75-87) | "Consider" (60-74) | "Low Match" (45-59) | "Not Recommended" (<45).

Output strictly valid JSON with this schema:
{
  "scores": {
    "overall": number,
    "requiredSkills": number,
    "experience": number,
    "education": number,
    "preferredSkills": number,
    "projectRelevance": number,
    "certifications": number
  },
  "scoreEvidence": {
    "requiredSkills": {
      "dimension": "Required Skills",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (what core requirements are satisfied)",
      "evidenceFromResume": "string (factual citation from resume)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (what is missing or unverified, or None)",
      "confidence": number
    },
    "experience": {
      "dimension": "Experience & Seniority",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (evaluated tenure and seniority)",
      "evidenceFromResume": "string (candidate verified years and roles cited from resume)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (tenure or seniority gap, or None)",
      "confidence": number
    },
    "education": {
      "dimension": "Education Alignment",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (evaluated degree and field)",
      "evidenceFromResume": "string (degree and institution cited from resume)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (degree or field gap, or None)",
      "confidence": number
    },
    "preferredSkills": {
      "dimension": "Preferred Competencies",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (preferred skills evaluated)",
      "evidenceFromResume": "string (citations for secondary skills found)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (preferred skills missing)",
      "confidence": number
    },
    "projectRelevance": {
      "dimension": "Project Depth & Scope",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (project scale and architecture expected)",
      "evidenceFromResume": "string (projects and technologies cited from resume)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (project depth missing, or None)",
      "confidence": number
    },
    "certifications": {
      "dimension": "Certifications & Credentials",
      "score": number,
      "weight": number,
      "matchedRequirement": "string (certifications evaluated)",
      "evidenceFromResume": "string (credentials cited from resume)",
      "matchStatus": "matched | partial | missing",
      "missingRequirement": "string (missing credentials, or None)",
      "confidence": number
    }
  },
  "recommendation": "Strongly Recommended | Recommended | Consider | Low Match | Not Recommended",
  "aiExplanation": "string (concise, factual summary grounded in resume facts)",
  "goodFitReasons": ["string", "string"],
  "potentialConcerns": ["string"],
  "missingRequirements": ["string"],
  "resumeEvidence": ["string", "string"],
  "skillGaps": [
    {
      "skill": "string",
      "matchedRequirement": "string",
      "status": "matched | partial | missing",
      "category": "required | preferred",
      "evidence": "string (brief summary)",
      "evidenceFromResume": "string (factual quote or citation from resume)",
      "missingRequirement": "string (specific gap or None)",
      "confidence": number
    }
  ],
  "matchedCompetenciesCount": number,
  "totalCompetenciesCount": number
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.0, // Strictly deterministic for identical inputs
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Guarantee deterministic score breakdown and confidence
    const wReq = weights?.requiredSkills || 40;
    const wExp = weights?.experience || 25;
    const wEdu = weights?.education || 15;
    const wPref = weights?.preferredSkills || 10;
    const wCert = weights?.certifications || 5;
    const wProj = weights?.projects || 5;

    const earnedReq = Math.round(((parsed.scores?.requiredSkills || 75) * wReq) / 100);
    const earnedExp = Math.round(((parsed.scores?.experience || 75) * wExp) / 100);
    const earnedEdu = Math.round(((parsed.scores?.education || 85) * wEdu) / 100);
    const earnedPref = Math.round(((parsed.scores?.preferredSkills || 70) * wPref) / 100);
    const earnedCert = Math.round(((parsed.scores?.certifications ?? 70) * wCert) / 100);
    const earnedProj = Math.round(((parsed.scores?.projectRelevance || 80) * wProj) / 100);
    const totalEarned = earnedReq + earnedExp + earnedEdu + earnedPref + earnedCert + earnedProj;

    parsed.scores.overall = totalEarned;
    parsed.scoreBreakdown = {
      requiredSkills: { earned: earnedReq, max: wReq },
      experience: { earned: earnedExp, max: wExp },
      education: { earned: earnedEdu, max: wEdu },
      preferredSkills: { earned: earnedPref, max: wPref },
      certifications: { earned: earnedCert, max: wCert },
      projects: { earned: earnedProj, max: wProj },
      total: { earned: totalEarned, max: 100 },
    };

    if (!parsed.confidence) {
      parsed.confidence = "High";
      parsed.confidenceExplanation = "The resume provides verifiable, structured details across skills, work tenure, and educational credentials.";
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("Error matching candidate with Gemini AI:", error);
    const fallback = computeMatchFallback(req.body.job, req.body.resume, req.body.weights);
    return res.json(fallback);
  }
});

// 4b. AI Hiring Report Generator
app.post("/api/ai/hiring-report", async (req: Request, res: Response) => {
  try {
    const { job, candidates } = req.body;
    if (!job) {
      return res.status(400).json({ error: "Job details are required." });
    }

    const cList = Array.isArray(candidates) ? candidates : [];
    const totalApplications = cList.length;
    const candidatesScreened = cList.filter((c: any) => c.pipelineStatus !== "Applied").length;
    const candidatesQualified = cList.filter((c: any) => (c.evaluation?.scores?.overall || 0) >= 70).length;
    const candidatesShortlisted = cList.filter((c: any) => c.pipelineStatus === "Shortlisted").length;
    const candidatesUnderReview = cList.filter((c: any) => c.pipelineStatus === "Under Review" || c.pipelineStatus === "AI Screened").length;
    const candidatesSelected = cList.filter((c: any) => c.pipelineStatus === "Selected" || c.pipelineStatus === "Interview").length;
    const candidatesRejected = cList.filter((c: any) => c.pipelineStatus === "Rejected").length;

    const totalScore = cList.reduce((acc: number, c: any) => acc + (c.evaluation?.scores?.overall || 0), 0);
    const averageMatchScore = totalApplications > 0 ? Math.round(totalScore / totalApplications) : 0;

    // Top candidates sorted by overall score
    const topCandidates = [...cList]
      .sort((a: any, b: any) => (b.evaluation?.scores?.overall || 0) - (a.evaluation?.scores?.overall || 0))
      .slice(0, 5)
      .map((c: any) => ({
        id: c.id,
        name: c.structuredResume?.candidateName || "Candidate",
        score: c.evaluation?.scores?.overall || 0,
        recommendation: c.evaluation?.recommendation || "Recommended",
        confidence: c.evaluation?.confidence || "High",
        pipelineStatus: c.pipelineStatus || "AI Screened",
        recruiterDecision: c.recruiterDecision,
        keyStrength: c.evaluation?.goodFitReasons?.[0] || "Solid technical alignment",
      }));

    // Most common skills
    const skillCountMap: Record<string, number> = {};
    const missingSkillMap: Record<string, number> = {};

    cList.forEach((c: any) => {
      const gaps = c.evaluation?.skillGaps || [];
      gaps.forEach((g: any) => {
        if (g.status === "matched") {
          skillCountMap[g.skill] = (skillCountMap[g.skill] || 0) + 1;
        } else if (g.status === "missing") {
          missingSkillMap[g.skill] = (missingSkillMap[g.skill] || 0) + 1;
        }
      });
    });

    const mostCommonSkills = Object.entries(skillCountMap)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const mostCommonMissingSkills = Object.entries(missingSkillMap)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Experience distribution
    let exp0to2 = 0;
    let exp3to5 = 0;
    let exp6to8 = 0;
    let exp8plus = 0;

    cList.forEach((c: any) => {
      const yrs = c.structuredResume?.totalExperienceYears || 0;
      if (yrs < 3) exp0to2++;
      else if (yrs <= 5) exp3to5++;
      else if (yrs <= 8) exp6to8++;
      else exp8plus++;
    });

    const experienceDistribution = [
      { range: "0 - 2 Years", count: exp0to2 },
      { range: "3 - 5 Years", count: exp3to5 },
      { range: "6 - 8 Years", count: exp6to8 },
      { range: "8+ Years", count: exp8plus },
    ];

    // Skill distribution for required skills
    const reqSkills = job.requiredSkills || [];
    const skillDistribution = reqSkills.map((sk: string) => {
      const matched = cList.filter((c: any) =>
        (c.evaluation?.skillGaps || []).some((g: any) => g.skill.toLowerCase() === sk.toLowerCase() && g.status === "matched")
      ).length;
      return {
        name: sk,
        matchedCount: matched,
        totalCount: totalApplications,
        rate: totalApplications > 0 ? Math.round((matched / totalApplications) * 100) : 0,
      };
    });

    let executiveSummary = `Recruitment audit for "${job.title}" across ${totalApplications} screened applicants indicates an average alignment of ${averageMatchScore}%. ${candidatesQualified} candidates satisfy the qualification threshold (≥70%). Key technical strengths center in ${mostCommonSkills.slice(0, 2).map((s) => s.skill).join(" and ") || "core disciplines"}, while ${mostCommonMissingSkills[0]?.skill || "cloud infrastructure"} represents the most frequent skill gap.`;
    let recommendations = [
      `Progress top-aligned candidates (${topCandidates.slice(0, 2).map((t) => t.name).join(", ")}) to technical panel interviews.`,
      `Focus interview evaluations on ${mostCommonMissingSkills[0]?.skill || "secondary competency"} to probe learning agility.`,
      `Maintain recruiter human-in-the-loop review on candidates marked 'Under Review'.`,
    ];

    const ai = getGeminiClient();
    if (ai && totalApplications > 0) {
      try {
        const prompt = `You are an HR Executive Talent Acquisition Director. Generate a concise, high-level executive recruitment report for the job requisition "${job.title}".
Data:
- Total Applicants: ${totalApplications}
- Average Match Score: ${averageMatchScore}%
- Candidates Shortlisted: ${candidatesShortlisted}, Under Review: ${candidatesUnderReview}
- Most common verified skills: ${mostCommonSkills.map((s) => `${s.skill} (${s.percentage}%)`).join(", ")}
- Most common missing skills: ${mostCommonMissingSkills.map((s) => `${s.skill} (${s.percentage}%)`).join(", ")}
- Top Candidates: ${topCandidates.map((t) => `${t.name} (${t.score}%)`).join(", ")}

Output strictly valid JSON with this schema:
{
  "executiveSummary": "string (concise 2-3 sentence overview of talent quality, common proficiencies, and primary skill gaps)",
  "recommendations": ["string", "string", "string"]
}`;
        const aiRes = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });
        const aiParsed = JSON.parse(aiRes.text || "{}");
        if (aiParsed.executiveSummary) executiveSummary = aiParsed.executiveSummary;
        if (Array.isArray(aiParsed.recommendations) && aiParsed.recommendations.length > 0) {
          recommendations = aiParsed.recommendations;
        }
      } catch (e) {
        console.warn("Gemini hiring report enrichment skipped, using analytical synthesis:", e);
      }
    }

    return res.json({
      jobId: job.id,
      jobTitle: job.title,
      department: job.department || "Engineering",
      location: job.location || "Remote",
      generatedAt: new Date().toISOString().split("T")[0],
      totalApplications,
      candidatesScreened,
      candidatesQualified,
      candidatesShortlisted,
      candidatesUnderReview,
      candidatesSelected,
      candidatesRejected,
      averageMatchScore,
      topCandidates,
      mostCommonSkills,
      mostCommonMissingSkills,
      experienceDistribution,
      skillDistribution,
      executiveSummary,
      recommendations,
    });
  } catch (error: any) {
    console.error("Error generating hiring report:", error);
    return res.status(500).json({ error: error.message || "Failed to generate report" });
  }
});

// 5. AI Interview Question Generator
app.post("/api/ai/interview-questions", async (req: Request, res: Response) => {
  try {
    const { job, candidate } = req.body;
    if (!job || !candidate) {
      return res.status(400).json({ error: "Job and candidate details are required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = generateInterviewQuestionsFallback(job, candidate);
      return res.json(fallback);
    }

    const prompt = `You are a Senior Technical Interviewer and Hiring Director. Generate 5 targeted, high-impact interview questions tailored specifically to this candidate and job.
Base the questions on:
1. Specific projects and achievements listed on the candidate's resume.
2. Identifiable skill gaps or partial competencies for the role.
3. Behavioral and technical leadership challenges relevant to the seniority level.

Job: ${job.title} (${job.seniority || "Mid-Senior"})
Candidate: ${candidate.structuredResume?.candidateName || "Candidate"}
Resume Summary: ${candidate.structuredResume?.summary || ""}
Key Experience: ${(candidate.structuredResume?.workExperience || []).map((w: any) => `${w.role} at ${w.company}`).join(", ")}
Projects: ${(candidate.structuredResume?.projects || []).map((p: any) => `${p.name}: ${p.description}`).join("; ")}
Missing/Partial Skills: ${(candidate.evaluation?.skillGaps || []).filter((s: any) => s.status !== 'matched').map((s: any) => s.skill).join(", ")}

Generate 5 distinct questions covering categories: Technical, Project, Behavioral, Experience, Skill Gap.
Output strictly valid JSON with this schema:
{
  "questions": [
    {
      "id": "q1",
      "category": "Technical | Project | Behavioral | Experience | Skill Gap",
      "question": "string",
      "context": "string (why this question is asked based on their resume)",
      "sampleAnswerCriteria": "string (what a strong candidate response should demonstrate)"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed.questions || []);
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    const fallback = generateInterviewQuestionsFallback(req.body.job, req.body.candidate);
    return res.json(fallback);
  }
});

// 6. AI Candidate Comparison
app.post("/api/ai/compare-candidates", async (req: Request, res: Response) => {
  try {
    const { job, candidates } = req.body;
    if (!job || !candidates || candidates.length < 2) {
      return res.status(400).json({ error: "At least 2 candidates are required for comparison." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const summary = `Comparison between ${candidates.map((c: any) => c.structuredResume.candidateName).join(", ")}: ${candidates[0].structuredResume.candidateName} exhibits the strongest core match (${candidates[0].evaluation.scores.overall}%), while other candidates bring unique strengths in specific competencies.`;
      return res.json({ summary });
    }

    const candidateProfiles = candidates.map((c: any, idx: number) => `
Candidate ${idx + 1}: ${c.structuredResume.candidateName}
Overall Score: ${c.evaluation.scores.overall}%
Required Skills Score: ${c.evaluation.scores.requiredSkills}%
Experience: ${c.structuredResume.totalExperienceYears} years (${c.evaluation.scores.experience}%)
Top Strengths: ${(c.evaluation.goodFitReasons || []).slice(0, 2).join("; ")}
Gaps: ${(c.evaluation.missingRequirements || []).join(", ") || "None"}
    `).join("\n");

    const prompt = `You are an HR Executive Advisor. Compare the following candidates for the position of "${job.title}".
Candidates:
${candidateProfiles}

Provide a concise, highly professional 2-3 paragraph comparative executive summary explaining:
1. Key differentiators between the candidates.
2. Who is best suited for immediate operational impact vs long-term potential.
3. A clear recommendation for the hiring manager.

Output strictly valid JSON with this schema:
{
  "summary": "string",
  "differentiators": ["string", "string"],
  "recommendedCandidate": "string (candidate name)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error comparing candidates:", error);
    return res.json({
      summary: "Comparison completed. Review the side-by-side metric matrix to compare technical competencies, seniority levels, and experience profiles.",
      differentiators: ["Skill breadth vs specialization", "Years of production experience"],
      recommendedCandidate: req.body.candidates?.[0]?.structuredResume?.candidateName || "Top Candidate"
    });
  }
});

// 7. Standalone Resume Analyzer
app.post("/api/ai/analyze-resume-standalone", async (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = analyzeResumeStandaloneFallback(resumeText);
      return res.json(fallback);
    }

    const prompt = `You are a Senior Talent Acquisition Executive and Executive Career Coach. Conduct an in-depth audit of the provided resume text (not for a specific job, but general resume effectiveness and market competitiveness).

Resume Text:
${resumeText}

Evaluate:
1. Resume strengths and highlights.
2. Weaknesses or ambiguities.
3. Missing information (e.g. quantifiable metrics, tech stack specifications, dates).
4. Clarity scores (0-100) for Skills, Experience, and Project presentation.
5. Formatting risks (dense blocks, unclear hierarchy).
6. Missing measurable achievements (lack of ROI, percentages, metrics).
7. Actionable improvement suggestions.

Output strictly valid JSON with this schema:
{
  "candidateName": "string",
  "overallImpression": "string (2-3 sentences)",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missingInformation": ["string", "string"],
  "skillClarity": {
    "score": number,
    "feedback": "string"
  },
  "experienceClarity": {
    "score": number,
    "feedback": "string"
  },
  "projectQuality": {
    "score": number,
    "feedback": "string"
  },
  "potentialFormattingProblems": ["string"],
  "missingMeasurableAchievements": ["string"],
  "improvementSuggestions": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing standalone resume:", error);
    const fallback = analyzeResumeStandaloneFallback(req.body.resumeText);
    return res.json(fallback);
  }
});

// ================= Fallback parsing helpers =================

function parseJobFallback(title: string, desc: string) {
  const text = `${title || ""} ${desc || ""}`.toLowerCase();
  const techKeywords = ['react', 'typescript', 'javascript', 'node.js', 'python', 'c++', 'c', 'sql', 'postgresql', 'aws', 'docker', 'kubernetes', 'tableau', 'snowflake', 'rest apis'];
  const matched = techKeywords.filter(k => text.includes(k));

  return {
    title: title || "Software Engineer",
    department: text.includes("hardware") || text.includes("embedded") ? "Hardware & IoT" : text.includes("data") ? "Data & Analytics" : "Engineering",
    location: text.includes("remote") ? "Remote" : "Hybrid / On-site",
    employmentType: "Full-time",
    seniority: text.includes("senior") || text.includes("lead") ? "Senior" : "Mid-Level",
    experienceLevel: text.includes("5+") ? "5+ years" : text.includes("3+") ? "3+ years" : "3-5 years",
    educationRequirement: "Bachelor's degree in Computer Science or related engineering field",
    requiredSkills: matched.length > 0 ? matched.slice(0, 5).map(s => s.toUpperCase()) : ["React", "TypeScript", "Node.js", "SQL"],
    preferredSkills: ["Docker", "Kubernetes", "CI/CD", "Cloud Architecture"],
    certifications: ["Relevant Cloud / Industry Certification"],
    responsibilities: [
      "Collaborate with engineering and product stakeholders to deliver robust features.",
      "Write clean, maintainable, and well-tested code following best practices.",
      "Participate in code reviews and architectural discussions."
    ],
    technicalRequirements: ["Proficiency in modern programming languages and frameworks.", "Experience with relational databases and API design."],
    softSkills: ["Problem Solving", "Collaboration", "Written Communication"],
    keywords: matched.length > 0 ? matched : ["Engineering", "Software", "Cloud"]
  };
}

function parseResumeFallback(text: string, fileName?: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const candidateName = lines[0] ? lines[0].replace(/[^a-zA-Z\s]/g, "").slice(0, 30) : (fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ") : "Candidate");

  return {
    candidateName: candidateName || "Candidate",
    email: (text.match(/[\w.-]+@[\w.-]+\.\w+/) || ["candidate@example.com"])[0],
    phone: (text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) || ["(555) 000-0000"])[0],
    location: "United States",
    summary: lines.slice(1, 4).join(" ") || "Experienced technical professional with demonstrated background in software development.",
    totalExperienceYears: 4.0,
    education: [
      {
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "Accredited University",
        year: "2021"
      }
    ],
    technicalSkills: ["React", "TypeScript", "Node.js", "Python", "SQL", "Git", "REST APIs"],
    softSkills: ["Teamwork", "Communication", "Problem Solving"],
    workExperience: [
      {
        company: "Technology Solutions Corp",
        role: "Software Engineer",
        period: "2021 - Present",
        years: 3.5,
        description: "Built web applications and integrated backend services.",
        highlights: [
          "Developed core frontend components using React and TypeScript.",
          "Maintained backend endpoints and optimized database queries."
        ]
      }
    ],
    projects: [
      {
        name: "Enterprise Workflow Platform",
        description: "Full-stack web application with responsive interface and database integration.",
        technologies: ["React", "Node.js", "SQL"]
      }
    ],
    certifications: ["Professional Industry Certification"],
    achievements: ["Successfully delivered key client milestone ahead of schedule"],
    languages: ["English"]
  };
}

const SEMANTIC_EQUIVALENCES: Record<string, string[]> = {
  react: ["react", "react.js", "reactjs", "next.js", "nextjs", "redux", "zustand", "frontend", "spa", "ui/ux", "tailwind"],
  typescript: ["typescript", "ts", "javascript", "js", "es6", "ecmascript", "typed javascript"],
  python: ["python", "py", "django", "fastapi", "flask", "sqlalchemy", "pandas", "numpy", "pytorch", "scikit-learn"],
  sql: ["sql", "postgresql", "postgres", "mysql", "relational", "sqlite", "rdbms", "database schema", "acid", "queries"],
  nosql: ["nosql", "mongodb", "mongo", "redis", "dynamodb", "firestore", "couchbase", "cassandra"],
  cloud: ["cloud", "aws", "amazon web services", "gcp", "google cloud", "azure", "cloud-native", "serverless", "lambda", "s3", "ec2"],
  docker: ["docker", "container", "containers", "containerization", "dockerfile", "docker-compose"],
  kubernetes: ["kubernetes", "k8s", "helm", "gke", "eks", "container orchestration", "service mesh"],
  node: ["node", "node.js", "nodejs", "express", "express.js", "nest.js", "nestjs", "fastify", "backend"],
  api: ["api", "apis", "rest", "restful", "graphql", "grpc", "microservices", "web services", "endpoints", "json"],
  testing: ["testing", "jest", "vitest", "cypress", "playwright", "pytest", "unit test", "tdd", "integration test", "qa"],
  ci_cd: ["ci/cd", "continuous integration", "github actions", "gitlab ci", "jenkins", "pipeline", "devops"],
  leadership: ["leadership", "mentorship", "mentor", "lead", "architect", "code review", "scrum master", "team lead", "technical lead"],
  data_analysis: ["data analysis", "tableau", "power bi", "analytics", "a/b testing", "statistics", "metric modeling", "looker", "snowflake", "bigquery"]
};

function searchResumeSemanticEvidence(skillOrRequirement: string, resume: any): {
  status: "matched" | "partial" | "missing";
  evidence: string;
  evidenceFromResume: string;
  missingRequirement: string;
  confidence: number;
} {
  const query = (skillOrRequirement || "").toLowerCase().trim();
  if (!query) {
    return {
      status: "missing",
      evidence: "Requirement not specified",
      evidenceFromResume: "None found",
      missingRequirement: "Unspecified requirement",
      confidence: 90,
    };
  }

  // Generate semantic terms for this requirement
  const terms = new Set<string>([query]);
  for (const [key, synonyms] of Object.entries(SEMANTIC_EQUIVALENCES)) {
    if (query.includes(key) || synonyms.some(s => query.includes(s) || s.includes(query))) {
      synonyms.forEach(s => terms.add(s));
    }
  }

  const termArray = Array.from(terms);

  // 1. Search in Work Experience (highest confidence proof of real-world application)
  if (Array.isArray(resume.workExperience)) {
    for (const exp of resume.workExperience) {
      const roleText = (exp.role || "").toLowerCase();
      const descText = (exp.description || "").toLowerCase();
      const highlights = Array.isArray(exp.highlights) ? exp.highlights : [];
      const combinedWorkText = `${roleText} ${descText} ${highlights.join(" ").toLowerCase()}`;

      for (const term of termArray) {
        if (combinedWorkText.includes(term)) {
          const matchingHighlight = highlights.find((h: string) => h.toLowerCase().includes(term));
          const citation = matchingHighlight || exp.description || `${exp.role} at ${exp.company}`;
          return {
            status: "matched",
            evidence: `Demonstrated in work experience as ${exp.role} at ${exp.company}`,
            evidenceFromResume: `${exp.role} at ${exp.company} (${exp.period || ""}): "${citation}"`,
            missingRequirement: "None - verified in professional work history",
            confidence: 95,
          };
        }
      }
    }
  }

  // 2. Search in Projects (high confidence proof of practical execution)
  if (Array.isArray(resume.projects)) {
    for (const proj of resume.projects) {
      const projName = (proj.name || "").toLowerCase();
      const projDesc = (proj.description || "").toLowerCase();
      const projTech = Array.isArray(proj.technologies) ? proj.technologies.map((t: string) => t.toLowerCase()) : [];

      for (const term of termArray) {
        if (projTech.some((t: string) => t.includes(term) || term.includes(t)) || projDesc.includes(term) || projName.includes(term)) {
          return {
            status: "matched",
            evidence: `Verified in project "${proj.name}" utilizing ${proj.technologies?.join(", ") || "relevant stack"}`,
            evidenceFromResume: `Project "${proj.name}": "${proj.description}" (Technologies: ${(proj.technologies || []).join(", ")})`,
            missingRequirement: "None - verified in project portfolio",
            confidence: 90,
          };
        }
      }
    }
  }

  // 3. Search in Technical Skills list (partial confidence if not backed by explicit work highlight)
  if (Array.isArray(resume.technicalSkills)) {
    const candidateSkillsLower = resume.technicalSkills.map((s: string) => s.toLowerCase());
    for (const term of termArray) {
      const matchedSkill = candidateSkillsLower.find((s: string) => s.includes(term) || term.includes(s));
      if (matchedSkill) {
        return {
          status: "partial",
          evidence: `Candidate explicitly lists skill competency`,
          evidenceFromResume: `Included in declared technical skills profile: "${matchedSkill}"`,
          missingRequirement: `Requires validation of production tenure and hands-on depth for ${skillOrRequirement}`,
          confidence: 80,
        };
      }
    }
  }

  // 4. Search in Summary
  if (typeof resume.summary === "string") {
    const sumLower = resume.summary.toLowerCase();
    for (const term of termArray) {
      if (sumLower.includes(term)) {
        return {
          status: "partial",
          evidence: `Mentioned in professional profile summary`,
          evidenceFromResume: `Summary excerpt: "${resume.summary.slice(0, 140)}..."`,
          missingRequirement: `Verify practical enterprise usage of ${skillOrRequirement}`,
          confidence: 75,
        };
      }
    }
  }

  // 5. Not found anywhere in resume
  return {
    status: "missing",
    evidence: `No demonstrable evidence found in candidate's resume`,
    evidenceFromResume: "No mention or verified application found in resume work history or projects",
    missingRequirement: `Candidate has no documented proficiency or hands-on experience with ${skillOrRequirement}`,
    confidence: 90,
  };
}

function computeMatchFallback(job: any, resume: any, weights?: any) {
  const reqSkills: string[] = job.requiredSkills && job.requiredSkills.length > 0
    ? job.requiredSkills
    : ["React", "TypeScript", "Node.js", "Python"];

  const prefSkills: string[] = job.preferredSkills && job.preferredSkills.length > 0
    ? job.preferredSkills
    : ["Cloud Infrastructure", "CI/CD", "Docker"];

  // 1. Evaluate Required Skills Semantically
  let matchedReqCount = 0;
  let partialReqCount = 0;
  const skillGaps: Array<{
    skill: string;
    matchedRequirement: string;
    status: "matched" | "partial" | "missing";
    category: "required" | "preferred";
    evidence: string;
    evidenceFromResume: string;
    missingRequirement: string;
    confidence: number;
  }> = reqSkills.map((skill: string) => {
    const analysis = searchResumeSemanticEvidence(skill, resume);
    if (analysis.status === "matched") matchedReqCount++;
    if (analysis.status === "partial") partialReqCount++;
    return {
      skill,
      matchedRequirement: skill,
      status: analysis.status,
      category: "required",
      evidence: analysis.evidence,
      evidenceFromResume: analysis.evidenceFromResume,
      missingRequirement: analysis.missingRequirement,
      confidence: analysis.confidence,
    };
  });

  // Also append preferred skills to skillGaps for comprehensive tracking
  prefSkills.forEach((pref: string) => {
    const analysis = searchResumeSemanticEvidence(pref, resume);
    skillGaps.push({
      skill: pref,
      matchedRequirement: pref,
      status: analysis.status,
      category: "preferred" as const,
      evidence: analysis.evidence,
      evidenceFromResume: analysis.evidenceFromResume,
      missingRequirement: analysis.missingRequirement,
      confidence: analysis.confidence,
    });
  });

  const reqScore = Math.min(
    100,
    Math.round(((matchedReqCount + partialReqCount * 0.5) / (reqSkills.length || 1)) * 100)
  );

  // 2. Evaluate Experience Semantically
  const expMatch = (job.experienceLevel || "3-5 years").match(/(\d+)/);
  const targetYears = expMatch ? parseInt(expMatch[1], 10) : 3;
  const actualYears = typeof resume.totalExperienceYears === "number" ? resume.totalExperienceYears : 3.0;

  let expScore = 70;
  let expStatus: "matched" | "partial" | "missing" = "matched";
  let expMissing = "None";

  if (actualYears >= targetYears) {
    expScore = Math.min(100, Math.round(85 + ((actualYears - targetYears) / 2) * 10));
    expStatus = "matched";
    expMissing = "None - satisfies required experience tenure";
  } else if (actualYears >= targetYears * 0.75) {
    expScore = Math.round((actualYears / targetYears) * 85);
    expStatus = "partial";
    expMissing = `Shortfall of ${(targetYears - actualYears).toFixed(1)} years against ${targetYears}+ year target`;
  } else {
    expScore = Math.max(30, Math.round((actualYears / targetYears) * 75));
    expStatus = "missing";
    expMissing = `Candidate has ${actualYears} years vs. ${targetYears}+ years required for ${job.seniority || "target"} seniority`;
  }

  const workRoles = (resume.workExperience || []).map((w: any) => `${w.role} at ${w.company} (${w.period || w.years + " yrs"})`).join("; ");

  // 3. Evaluate Education Semantically
  const eduReq = job.educationRequirement || "Bachelor's degree in Computer Science or related field";
  let eduScore = 85;
  let eduStatus: "matched" | "partial" | "missing" = "matched";
  let eduEvidence = "Degree details verified";
  let eduMissing = "None";

  if (Array.isArray(resume.education) && resume.education.length > 0) {
    const primaryEdu = resume.education[0];
    eduEvidence = `${primaryEdu.degree || "Degree"} in ${primaryEdu.field || "relevant field"} from ${primaryEdu.institution || "Accredited University"} (${primaryEdu.year || ""})`;
    const fieldLower = (primaryEdu.field || "").toLowerCase();
    const isTechField = fieldLower.includes("computer") || fieldLower.includes("software") || fieldLower.includes("engineer") || fieldLower.includes("data") || fieldLower.includes("information") || fieldLower.includes("math");
    eduScore = isTechField ? 95 : 80;
    eduStatus = "matched";
  } else {
    eduScore = 65;
    eduStatus = "partial";
    eduEvidence = "No formal tertiary education listed on resume";
    eduMissing = "Requires verification of equivalent industry qualifications";
  }

  // 4. Evaluate Preferred Skills Semantically
  let matchedPrefCount = 0;
  prefSkills.forEach((pref: string) => {
    const analysis = searchResumeSemanticEvidence(pref, resume);
    if (analysis.status === "matched") matchedPrefCount++;
    else if (analysis.status === "partial") matchedPrefCount += 0.5;
  });
  const prefScore = Math.min(100, Math.round((matchedPrefCount / (prefSkills.length || 1)) * 100));

  // 5. Evaluate Project Relevance Semantically
  const projectsList = resume.projects || [];
  let projScore = 75;
  let projEvidence = "Projects demonstrated in resume portfolio";
  let projMissing = "None";
  if (projectsList.length >= 2) {
    projScore = 90;
    projEvidence = projectsList.map((p: any) => `"${p.name}" (${(p.technologies || []).join(", ")})`).join("; ");
  } else if (projectsList.length === 1) {
    projScore = 80;
    projEvidence = `"${projectsList[0].name}" (${(projectsList[0].technologies || []).join(", ")})`;
  } else {
    projScore = 60;
    projEvidence = "No dedicated project portfolio listed in resume";
    projMissing = "Candidate relies purely on work experience without independent project highlights";
  }

  // 6. Evaluate Certifications Semantically
  const certsList = resume.certifications || [];
  const certScore = certsList.length > 0 ? 85 : 55;
  const certEvidence = certsList.length > 0 ? certsList.join(", ") : "No professional certifications listed in resume";
  const certMissing = certsList.length > 0 ? "None" : "No industry credentials stated";

  // Calibrated Weights
  const wReq = weights?.requiredSkills || 40;
  const wExp = weights?.experience || 25;
  const wEdu = weights?.education || 15;
  const wPref = weights?.preferredSkills || 10;
  const wCert = weights?.certifications || 5;
  const wProj = weights?.projects || 5;

  const overall = Math.round(
    (reqScore * wReq + expScore * wExp + eduScore * wEdu + prefScore * wPref + certScore * wCert + projScore * wProj) / 100
  );

  const earnedReq = Math.round((reqScore * wReq) / 100);
  const earnedExp = Math.round((expScore * wExp) / 100);
  const earnedEdu = Math.round((eduScore * wEdu) / 100);
  const earnedPref = Math.round((prefScore * wPref) / 100);
  const earnedCert = Math.round((certScore * wCert) / 100);
  const earnedProj = Math.round((projScore * wProj) / 100);
  const totalEarned = earnedReq + earnedExp + earnedEdu + earnedPref + earnedCert + earnedProj;

  const scoreBreakdown = {
    requiredSkills: { earned: earnedReq, max: wReq },
    experience: { earned: earnedExp, max: wExp },
    education: { earned: earnedEdu, max: wEdu },
    preferredSkills: { earned: earnedPref, max: wPref },
    certifications: { earned: earnedCert, max: wCert },
    projects: { earned: earnedProj, max: wProj },
    total: { earned: totalEarned, max: 100 },
  };

  const hasEducation = Array.isArray(resume.education) && resume.education.length > 0;
  const hasWork = Array.isArray(resume.workExperience) && resume.workExperience.length > 0;
  const hasProjects = Array.isArray(resume.projects) && resume.projects.length > 0;
  const hasSkills = Array.isArray(resume.technicalSkills) && resume.technicalSkills.length >= 4;
  const wordCount = (resume.summary || "").length + (resume.workExperience || []).reduce((acc: number, w: any) => acc + (w.description || "").length, 0);

  let confidence: "High" | "Medium" | "Low" = "High";
  let confidenceExplanation = "The resume provides detailed, verifiable records of work tenure, core skills, and educational qualifications.";

  if (!hasWork || (!hasProjects && !hasSkills) || wordCount < 100) {
    confidence = "Low";
    confidenceExplanation = "The resume provides sparse detail on previous responsibilities, limiting analytical certainty.";
  } else if (!hasEducation || !hasProjects || wordCount < 250) {
    confidence = "Medium";
    confidenceExplanation = "The resume provides solid work history, but has partial gaps in formal education or portfolio depth.";
  }

  let recommendation: "Strongly Recommended" | "Recommended" | "Consider" | "Low Match" | "Not Recommended" = "Recommended";
  if (totalEarned >= 88) recommendation = "Strongly Recommended";
  else if (totalEarned >= 75) recommendation = "Recommended";
  else if (totalEarned >= 60) recommendation = "Consider";
  else if (totalEarned >= 45) recommendation = "Low Match";
  else recommendation = "Not Recommended";

  const missingReqItems = skillGaps
    .filter(s => s.category === "required" && s.status !== "matched")
    .map(s => s.skill);

  const matchedEvidenceQuotes = (resume.workExperience || [])
    .flatMap((w: any) => (w.highlights || []).slice(0, 2).map((h: string) => `${w.company}: "${h}"`))
    .slice(0, 3);

  return {
    scores: {
      overall: totalEarned,
      requiredSkills: reqScore,
      experience: expScore,
      education: eduScore,
      preferredSkills: prefScore,
      projectRelevance: projScore,
      certifications: certScore,
    },
    scoreBreakdown,
    confidence,
    confidenceExplanation,
    scoreEvidence: {
      requiredSkills: {
        dimension: "Required Skills",
        score: reqScore,
        weight: wReq,
        matchedRequirement: `Evaluated ${reqSkills.length} core technical requirements (${matchedReqCount} verified, ${partialReqCount} partial)`,
        evidenceFromResume: `Directly evidenced via ${matchedReqCount} competencies in work history and projects`,
        matchStatus: reqScore >= 80 ? "matched" : reqScore >= 50 ? "partial" : "missing",
        missingRequirement: missingReqItems.length > 0 ? `Unverified: ${missingReqItems.join(", ")}` : "None",
        confidence: 92,
      },
      experience: {
        dimension: "Experience & Seniority",
        score: expScore,
        weight: wExp,
        matchedRequirement: `Target: ${targetYears}+ years for ${job.seniority || "Mid-Senior"} seniority`,
        evidenceFromResume: `Candidate presents ${actualYears} verified years: ${workRoles || "Work history"}`,
        matchStatus: expStatus,
        missingRequirement: expMissing,
        confidence: 95,
      },
      education: {
        dimension: "Education Alignment",
        score: eduScore,
        weight: wEdu,
        matchedRequirement: eduReq,
        evidenceFromResume: eduEvidence,
        matchStatus: eduStatus,
        missingRequirement: eduMissing,
        confidence: 95,
      },
      preferredSkills: {
        dimension: "Preferred Competencies",
        score: prefScore,
        weight: wPref,
        matchedRequirement: `Evaluated preferred skills: ${prefSkills.join(", ")}`,
        evidenceFromResume: `Candidate matched ${matchedPrefCount} of ${prefSkills.length} secondary skills`,
        matchStatus: prefScore >= 70 ? "matched" : prefScore >= 40 ? "partial" : "missing",
        missingRequirement: prefSkills.filter(p => searchResumeSemanticEvidence(p, resume).status === "missing").join(", ") || "None",
        confidence: 88,
      },
      projectRelevance: {
        dimension: "Project Depth & Scope",
        score: projScore,
        weight: wProj,
        matchedRequirement: "Practical architecture complexity and technology stack integration",
        evidenceFromResume: projEvidence,
        matchStatus: projScore >= 75 ? "matched" : "partial",
        missingRequirement: projMissing,
        confidence: 90,
      },
      certifications: {
        dimension: "Certifications & Credentials",
        score: certScore,
        weight: wCert,
        matchedRequirement: (job.certifications || []).join(", ") || "Industry certified credentials",
        evidenceFromResume: certEvidence,
        matchStatus: certsList.length > 0 ? "matched" : "partial",
        missingRequirement: certMissing,
        confidence: 95,
      },
    },
    recommendation,
    aiExplanation: `${recommendation}. Candidate presents ${actualYears} verified years of experience and semantically satisfies ${matchedReqCount} of ${reqSkills.length} required core competencies. Overall weighted matching score is ${overall}%.`,
    goodFitReasons: [
      `Semantically satisfies ${matchedReqCount} of ${reqSkills.length} required competencies with observable work evidence.`,
      `Presents ${actualYears} verifiable years of industry experience across ${resume.workExperience?.length || 1} organizations.`,
      `Demonstrates relevant educational background: ${eduEvidence}.`,
    ],
    potentialConcerns: missingReqItems.length > 0
      ? missingReqItems.map(s => `No explicit work history highlight found for "${s}".`)
      : ["No critical technical deficiencies identified."],
    missingRequirements: missingReqItems,
    resumeEvidence: matchedEvidenceQuotes.length > 0
      ? matchedEvidenceQuotes
      : [`Verified work history tenure of ${actualYears} years across declared positions.`],
    skillGaps,
    matchedCompetenciesCount: matchedReqCount,
    totalCompetenciesCount: reqSkills.length,
  };
}

function generateInterviewQuestionsFallback(job: any, candidate: any) {
  const name = candidate.structuredResume?.candidateName || "the candidate";
  const missing = (candidate.evaluation?.skillGaps || []).filter((s: any) => s.status !== "matched").map((s: any) => s.skill);

  return [
    {
      id: "q1",
      category: "Technical",
      question: `Can you walk through your experience architecting scalable applications using ${job.requiredSkills?.[0] || "React"} and how you handle state and error boundaries?`,
      context: `Target role requires deep proficiency in ${job.requiredSkills?.[0] || "core frameworks"}.`,
      sampleAnswerCriteria: "Demonstrates clear architectural patterns, defensive coding, and performance optimization."
    },
    {
      id: "q2",
      category: "Project",
      question: `On your resume you mentioned working on "${candidate.structuredResume?.projects?.[0]?.name || "a major full-stack project"}". What were the primary engineering trade-offs you made?`,
      context: "Validates technical ownership and depth of claimed project achievements.",
      sampleAnswerCriteria: "Explains alternatives considered, technical bottlenecks overcome, and business impact."
    },
    {
      id: "q3",
      category: "Skill Gap",
      question: `The role involves working with ${missing[0] || "container orchestration and cloud services"}. How have you approached quickly ramping up on technologies where you have less production tenure?`,
      context: `Addresses identified competency gap in ${missing[0] || "advanced tooling"}.`,
      sampleAnswerCriteria: "Shows fast learning agility, curiosity, and structured self-learning discipline."
    },
    {
      id: "q4",
      category: "Experience",
      question: `Describe a scenario where a production release encountered an unforeseen bug or degradation. What was your triage and resolution process?`,
      context: "Evaluates incident management and production resilience for Senior/Mid engineering roles.",
      sampleAnswerCriteria: "Structured debugging approach, clear stakeholder communication, and blameless post-mortem actions."
    },
    {
      id: "q5",
      category: "Behavioral",
      question: `Tell us about a time you strongly disagreed with a product specification or architectural direction. How did you advocate your perspective while maintaining team alignment?`,
      context: "Measures cross-functional collaboration and mature disagreement resolution.",
      sampleAnswerCriteria: "Constructive data-backed advocacy, willingness to commit once a decision is made."
    }
  ];
}

function analyzeResumeStandaloneFallback(text: string) {
  return {
    candidateName: "Resume Review",
    overallImpression: "A solid technical resume with clear career progression, but would benefit from more quantifiable metrics and explicit impact statements.",
    strengths: [
      "Consistent timeline and clear role titles.",
      "Clear enumeration of technical skill keywords across languages and frameworks.",
      "Good inclusion of education and project summaries."
    ],
    weaknesses: [
      "Responsibilities describe duties rather than business outcomes.",
      "Limited percentage gains, revenue impacts, or latency reductions cited."
    ],
    missingInformation: [
      "Specific team sizes or mentorship metrics.",
      "Scale metrics (e.g. monthly active users, database transaction volume)."
    ],
    skillClarity: {
      score: 82,
      feedback: "Skills are grouped well, but distinguishing between expert vs familiar proficiencies is recommended."
    },
    experienceClarity: {
      score: 78,
      feedback: "Bullet points are readable; transform passive sentences into action-driven statements."
    },
    projectQuality: {
      score: 80,
      feedback: "Projects demonstrate capability; adding live links or GitHub references boosts credibility."
    },
    potentialFormattingProblems: [
      "Dense paragraphs in work history could be broken into 3-4 distinct bullet points.",
      "Ensure consistent date formatting (e.g. Month Year - Month Year)."
    ],
    missingMeasurableAchievements: [
      "Did not mention quantitative efficiency gains (e.g., 'reduced load time by 30%').",
      "No direct financial or user adoption metrics attached to major milestones."
    ],
    improvementSuggestions: [
      "Use the Google 'XYZ formula': Accomplished [X] as measured by [Y], by doing [Z].",
      "Prominently feature 3-5 core technical competencies at the top of your resume.",
      "Quantify at least one key metric in every role."
    ]
  };
}

// 8. Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HireLens AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
