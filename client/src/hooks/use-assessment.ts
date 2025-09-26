import { useMutation, useQuery } from "@tanstack/react-query";

interface AssessmentResults {
  phq9?: number;
  gad7?: number;
  ghq12?: number;
  recommendations?: string[];
}

interface AssessmentHistory {
  id: string;
  completedAt: string;
  phq9?: number;
  gad7?: number;
  ghq12?: number;
}

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: async (results: AssessmentResults) => {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      return response.json();
    },
  });
}

export function useAssessmentHistory() {
  return useQuery({
    queryKey: ["assessment-history"],
    queryFn: async () => {
      const response = await fetch("/api/assessment/history");
      
      if (!response.ok) {
        throw new Error("Failed to fetch assessment history");
      }

      const data = await response.json();
      return data.history as AssessmentHistory[];
    },
  });
}