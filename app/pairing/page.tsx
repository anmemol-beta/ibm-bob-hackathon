"use client";

import { useState, useEffect } from "react";
import { API_ROUTES } from "@/lib/constants";
import type { StandinResult, CodeChange } from "@/lib/types";

export default function PairingPage() {
  const [results, setResults] = useState<StandinResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<StandinResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(API_ROUTES.REPO);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (changeIndex: number) => {
    if (!selectedResult) return;

    const updatedChanges = [...selectedResult.changes];
    updatedChanges[changeIndex].status = "approved";
    
    setSelectedResult({ ...selectedResult, changes: updatedChanges });
    alert("Change approved!");
  };

  const handleReject = async (changeIndex: number) => {
    if (!selectedResult) return;

    const updatedChanges = [...selectedResult.changes];
    updatedChanges[changeIndex].status = "rejected";
    
    setSelectedResult({ ...selectedResult, changes: updatedChanges });
    alert("Change rejected!");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-200 text-yellow-800",
      approved: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">👥 Pairing</h1>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">👥 Pairing</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Review AI-generated code changes and approve or reject them.
      </p>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No results yet. Assign scenarios in the Handoff page.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            {results.map((result) => (
              <button
                key={result.scenarioId}
                onClick={() => setSelectedResult(result)}
                className={`w-full text-left p-4 border rounded-lg transition-all ${
                  selectedResult?.scenarioId === result.scenarioId
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:border-gray-400"
                }`}
              >
                <div className="font-medium mb-1">Scenario {result.scenarioId.slice(0, 8)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.changes.length} changes
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(result.completedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            {selectedResult ? (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm">{selectedResult.summary}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Code Changes</h3>
                  {selectedResult.changes.map((change, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium">
                            {change.file}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              change.status
                            )}`}
                          >
                            {change.status}
                          </span>
                        </div>
                        {change.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(idx)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(idx)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                        <code>{change.diff}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a result to review changes
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
