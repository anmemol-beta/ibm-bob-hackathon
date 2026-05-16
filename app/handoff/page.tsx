"use client";

import { useState, useEffect } from "react";
import { API_ROUTES } from "@/lib/constants";
import type { Handoff } from "@/lib/types";

export default function HandoffPage() {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [selectedHandoff, setSelectedHandoff] = useState<Handoff | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptingHandoff, setAcceptingHandoff] = useState(false);
  const [developerName, setDeveloperName] = useState("");
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  useEffect(() => {
    fetchHandoffs();
  }, []);

  const fetchHandoffs = async () => {
    try {
      const response = await fetch(API_ROUTES.HANDOFF);
      if (response.ok) {
        const data = await response.json();
        setHandoffs(data.handoffs || []);
      }
    } catch (error) {
      console.error("Error fetching handoffs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHandoff = (handoff: Handoff) => {
    setSelectedHandoff(handoff);
  };

  const handleBackToList = () => {
    setSelectedHandoff(null);
    setShowAcceptDialog(false);
    setDeveloperName("");
  };

  const handleAcceptHandoff = async () => {
    if (!selectedHandoff || !developerName.trim()) {
      return;
    }

    setAcceptingHandoff(true);

    try {
      const response = await fetch(API_ROUTES.HANDOFF, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedHandoff.id,
          status: "accepted",
          acceptedBy: developerName.trim(),
        }),
      });

      if (response.ok) {
        alert(`Handoff accepted! You can now work on the scenarios.`);
        fetchHandoffs();
        handleBackToList();
      }
    } catch (error) {
      console.error("Error accepting handoff:", error);
      alert("Failed to accept handoff");
    } finally {
      setAcceptingHandoff(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🤝 Handoff</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading handoffs...</p>
      </div>
    );
  }

  // Detail view for selected handoff
  if (selectedHandoff) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 mb-4"
          >
            ← Back to Handoffs
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Handoff Details</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review the complete context before accepting this handoff
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedHandoff.status)}`}>
              {selectedHandoff.status}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metadata Section */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">📋 Handoff Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                <p className="text-lg font-medium">{selectedHandoff.author}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-lg font-medium">{formatDate(selectedHandoff.timestamp)}</p>
              </div>
              {selectedHandoff.metadata.repoPath && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Repository Path</p>
                  <p className="text-lg font-mono bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded">
                    {selectedHandoff.metadata.repoPath}
                  </p>
                </div>
              )}
              {selectedHandoff.acceptedBy && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accepted By</p>
                    <p className="text-lg font-medium">{selectedHandoff.acceptedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accepted At</p>
                    <p className="text-lg font-medium">
                      {selectedHandoff.acceptedAt ? formatDate(selectedHandoff.acceptedAt) : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Developer Notes */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">📝 Developer Notes</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedHandoff.metadata.developerNotes || "No notes provided"}
              </p>
            </div>
          </div>

          {/* Git Activity Summary */}
          {selectedHandoff.gitActivitySummary && (
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🔀 Git Activity Summary</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {selectedHandoff.gitActivitySummary}
                </pre>
              </div>
            </div>
          )}

          {/* Scenarios */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              🎯 Scenarios ({selectedHandoff.scenarios.length})
            </h2>
            <div className="space-y-4">
              {selectedHandoff.scenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900"
                >
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    Scenario {index + 1}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Situation:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {scenario.situation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Suggested Approach:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {scenario.suggestedApproach}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accept Handoff Section */}
          {selectedHandoff.status === "pending" && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">✅ Accept This Handoff</h2>
              {!showAcceptDialog ? (
                <button
                  onClick={() => setShowAcceptDialog(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  I'm Ready to Accept This Handoff
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="developerName" className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="developerName"
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAcceptHandoff}
                      disabled={acceptingHandoff || !developerName.trim()}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {acceptingHandoff ? "Accepting..." : "Confirm & Accept"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAcceptDialog(false);
                        setDeveloperName("");
                      }}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🤝 Handoff</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        View incoming handoffs from other developers. Review the context and accept handoffs to start working on them.
      </p>

      {handoffs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No handoffs available yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Handoffs will appear here when developers create them in the Author page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {handoffs.map((handoff) => (
            <div
              key={handoff.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 cursor-pointer"
              onClick={() => handleSelectHandoff(handoff)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">
                      Handoff from {handoff.author}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(handoff.status)}`}>
                      {handoff.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Created {formatDate(handoff.timestamp)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {handoff.metadata.developerNotes}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>📋 {handoff.scenarios.length} scenarios</span>
                  {handoff.metadata.repoPath && (
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      {handoff.metadata.repoPath.split("/").pop()}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHandoff(handoff);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Made with Bob
