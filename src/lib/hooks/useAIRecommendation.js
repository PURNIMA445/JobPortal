import { useState, useRef, useEffect, useCallback } from "react";
import { fetchAndExtractText, rankCandidates, limitConcurrency, getHash } from "../services/ai.service";

export function useAIRecommendation(jobId, applications) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ phase: "", count: 0, total: 0, name: "", percent: 0 });
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [skippedCandidates, setSkippedCandidates] = useState([]);

  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(0);
  const isProcessingRef = useRef(false);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isProcessingRef.current = false;
    setLoading(false);
    setProgress({ phase: "", count: 0, total: 0, name: "", percent: 0 });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const recommend = useCallback(async () => {
    if (isProcessingRef.current) return; // Prevent duplicate requests
    isProcessingRef.current = true;
    
    // Reset states
    setError(null);
    setSkippedCandidates([]);
    setLoading(true);

    const requestId = ++activeRequestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      if (!applications || applications.length === 0) {
        throw new Error("No applicants available for AI analysis.");
      }

      // Check job description
      const firstApp = applications[0];
      const jobDescription = firstApp?.job?.description || "";
      const jobRequirements = firstApp?.job?.requirements || "";
      const fullJobDescription = `${firstApp?.job?.title || ""}\n\nDescription:\n${jobDescription}\n\nRequirements:\n${jobRequirements}`;

      if (!jobDescription.trim()) {
        throw new Error("Job description is missing or empty.");
      }

      // Generate cache hash of applications list
      const appHashSource = applications
        .map((a) => `${a.id}_${a.status}_${a.appliedAt || ""}`)
        .join(",");
      const appHash = getHash(appHashSource);

      // Check ranking cache
      setProgress({ phase: "ranking", count: 0, total: 0, name: "", percent: 80 });
      const cachedResult = await rankCandidates(
        fullJobDescription,
        [],
        jobId,
        appHash,
        abortController.signal
      ).catch(() => null); // If cache miss, continues

      if (cachedResult && requestId === activeRequestIdRef.current) {
        setProgress((prev) => ({ ...prev, percent: 100 }));
        setResults(cachedResult);
        setShowModal(true);
        return;
      }

      // Start text extraction for all candidates
      let completedCount = 0;
      const totalCandidates = applications.length;
      const candidatesWithText = [];
      const skippedList = [];

      setProgress({
        phase: "fetching",
        count: 0,
        total: totalCandidates,
        name: "",
        percent: 5,
      });

      // Prepare concurrency tasks for upload and parsing
      const tasks = applications.map((app) => async () => {
        if (abortController.signal.aborted) return;

        const candidateName = app.candidateName || `Candidate #${app.id}`;
        
        try {
          if (requestId !== activeRequestIdRef.current) return;

          setProgress((prev) => ({
            ...prev,
            phase: "parsing",
            name: candidateName,
            percent: Math.min(90, Math.round((completedCount / totalCandidates) * 90)),
          }));

          const text = await fetchAndExtractText(
            app.id,
            app.candidateId || app.id,
            app.appliedAt,
            abortController.signal
          );

          // Validation of parsed text
          if (text && text.trim().length > 100) {
            candidatesWithText.push({
              candidateName,
              resumeText: text,
            });
          } else {
            throw new Error("Resume content too short or invalid.");
          }
        } catch (err) {
          if (abortController.signal.aborted) throw err;
          
          if (process.env.NODE_ENV === "development") {
            console.error(`Skipping applicant ${candidateName} due to error:`, err);
          }
          skippedList.push(`${candidateName}: ${err.message || "Failed to process"}`);
        } finally {
          completedCount++;
          if (requestId === activeRequestIdRef.current && !abortController.signal.aborted) {
            setProgress((prev) => ({
              ...prev,
              count: completedCount,
              percent: Math.min(90, Math.round((completedCount / totalCandidates) * 90)),
            }));
          }
        }
      });

      // Execute with a concurrency limit of 5 parallel uploads/downloads
      await limitConcurrency(tasks, 5);

      if (abortController.signal.aborted) return;
      if (requestId !== activeRequestIdRef.current) return;

      // Update state for skipped candidates
      if (skippedList.length > 0) {
        setSkippedCandidates(skippedList);
      }

      // Fail completely if no candidate parsed successfully
      if (candidatesWithText.length === 0) {
        throw new Error("Unable to analyze applicant resumes.");
      }

      // Send to rank endpoint
      setProgress((prev) => ({
        ...prev,
        phase: "ranking",
        name: "",
        percent: 95,
      }));

      const rankingResult = await rankCandidates(
        fullJobDescription,
        candidatesWithText,
        jobId,
        appHash,
        abortController.signal
      );

      if (requestId !== activeRequestIdRef.current) return;
      if (abortController.signal.aborted) return;

      setProgress((prev) => ({ ...prev, percent: 100 }));
      setResults(rankingResult);
      setShowModal(true);
    } catch (err) {
      if (abortController.signal.aborted) return;
      if (requestId === activeRequestIdRef.current) {
        setError(err.message || "An unexpected error occurred during ranking.");
        setShowModal(true); // Open modal to display the error state
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setLoading(false);
        isProcessingRef.current = false;
      }
    }
  }, [applications, jobId]);

  return {
    recommend,
    loading,
    progress,
    error,
    results,
    showModal,
    setShowModal,
    skippedCandidates,
    cancel,
  };
}
