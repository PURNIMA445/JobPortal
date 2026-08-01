import { getApplicationCv } from "./application.service";

// In-Memory Caching (Level 1)
const resumeCache = new Map();
const rankingCache = new Map();

// Helper to generate simple hash string
export function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// Concurrency queue helper
export async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// Timeout helper wrapped around fetch/abort
function withTimeout(promise, timeoutMs, abortController) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (abortController) abortController.abort();
      reject(new Error(`Timeout: Operation took longer than ${timeoutMs / 1000}s`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Retry helper with exponential backoff
async function withRetry(fn, retries = 3, delay = 1000, signal) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0 || (signal && signal.aborted)) {
      throw err;
    }
    if (process.env.NODE_ENV === "development") {
      console.warn(`AI API call failed. Retrying in ${delay}ms... Details:`, err.message);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2, signal);
  }
}

// Fetch candidate CV and parse resume text via FastAPI with schema validation
export async function fetchAndExtractText(applicationId, candidateId, appliedAt, signal, onProgress) {
  const cacheKey = `${candidateId}_${appliedAt}`;
  
  if (resumeCache.has(cacheKey)) {
    if (process.env.NODE_ENV === "development") {
      console.log(`Cache hit for candidate resume: ${candidateId}`);
    }
    return resumeCache.get(cacheKey).text;
  }

  // 1. Fetch CV from backend
  if (onProgress) onProgress("Downloading CV...");
  const cvBlob = await getApplicationCv(applicationId);
  if (!cvBlob || cvBlob.size === 0) {
    throw new Error("Candidate has no valid resume on profile.");
  }

  // Validate file type (PDF MIME type check)
  if (cvBlob.type && cvBlob.type !== "application/pdf") {
    throw new Error("Only PDF files are supported by the parsing service.");
  }

  // 2. Upload to FastAPI
  if (onProgress) onProgress("Extracting text...");
  
  // Set up linked AbortController
  const localController = new AbortController();
  if (signal) {
    signal.addEventListener("abort", () => localController.abort());
  }

  const formData = new FormData();
  formData.append("file", cvBlob, `${candidateId}_resume.pdf`);

  const uploadTask = () =>
    fetch("/api/ai-service/upload-resume", {
      method: "POST",
      body: formData,
      signal: localController.signal,
    }).then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Status: ${res.status}`);
      }
      const data = await res.json();
      
      // Contract Validation
      if (!data || typeof data.text !== "string") {
        throw new Error("Invalid API response format from /upload-resume: missing 'text' field.");
      }
      return data.text;
    });

  // Limit execution time to 60s
  const text = await withTimeout(
    withRetry(uploadTask, 3, 1000, localController.signal),
    60000,
    localController
  );

  // Store in cache
  resumeCache.set(cacheKey, {
    version: 1,
    candidateId,
    appliedAt,
    text,
  });

  return text;
}

// Call /rank-candidates with contract schema validation
export async function rankCandidates(jobDescription, candidates, jobId, applicantsHash, signal) {
  const cacheKey = `${jobId}_${applicantsHash}`;

  if (rankingCache.has(cacheKey)) {
    if (process.env.NODE_ENV === "development") {
      console.log(`Cache hit for ranking list of job: ${jobId}`);
    }
    return rankingCache.get(cacheKey);
  }

  // Short-circuit lookup check on cache miss
  if (candidates.length === 0) {
    return null;
  }

  // Set up linked AbortController
  const localController = new AbortController();
  if (signal) {
    signal.addEventListener("abort", () => localController.abort());
  }

  const rankTask = () =>
    fetch("/api/ai-service/rank-candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription,
        candidates,
      }),
      signal: localController.signal,
    }).then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Status: ${res.status}`);
      }
      const data = await res.json();

      // Contract Validation
      if (!data || !Array.isArray(data.rankedCandidates)) {
        throw new Error("Invalid API response format from /rank-candidates: missing 'rankedCandidates' array.");
      }
      return data;
    });

  // Limit execution time to 120s
  const rankingResult = await withTimeout(
    withRetry(rankTask, 2, 1500, localController.signal),
    120000,
    localController
  );

  // Store in cache
  rankingCache.set(cacheKey, rankingResult);

  return rankingResult;
}
