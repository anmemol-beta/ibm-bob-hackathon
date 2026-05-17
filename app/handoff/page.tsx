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
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white text-3xl mb-4 shadow-lg">
              🤝
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Handoff
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              View incoming handoffs from other developers
            </p>
          </div>
          <div className="flex items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-medium">Loading handoffs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail view for selected handoff
  if (selectedHandoff) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-6 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Handoffs
            </button>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  Handoff Details
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Review the complete context before accepting this handoff
                </p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusBadge(selectedHandoff.status)} shadow-md`}>
                {selectedHandoff.status}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Metadata Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Handoff Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Author</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedHandoff.author}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedHandoff.timestamp)}</p>
                </div>
                {selectedHandoff.metadata.repoPath && (
                  <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Repository Path</p>
                    <p className="text-lg font-mono bg-gray-100 dark:bg-gray-950 px-3 py-2 rounded-lg text-gray-900 dark:text-white">
                      {selectedHandoff.metadata.repoPath}
                    </p>
                  </div>
                )}
                {selectedHandoff.acceptedBy && (
                  <>
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Accepted By</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedHandoff.acceptedBy}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Accepted At</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedHandoff.acceptedAt ? formatDate(selectedHandoff.acceptedAt) : "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Developer Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Developer Notes
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedHandoff.metadata.developerNotes || "No notes provided"}
                </p>
              </div>
            </div>

            {/* Git Activity Summary */}
            {selectedHandoff.gitActivitySummary && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-2xl">🔀</span>
                  Git Activity Summary
                </h2>
                <div className="bg-gray-900 dark:bg-black rounded-xl p-6 overflow-x-auto border border-gray-700">
                  <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                    {selectedHandoff.gitActivitySummary}
                  </pre>
                </div>
              </div>
            )}

            {/* Scenarios */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Scenarios ({selectedHandoff.scenarios.length})
              </h2>
              <div className="space-y-4">
                {selectedHandoff.scenarios.map((scenario, index) => (
                  <div
                    key={scenario.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Scenario {index + 1}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          Situation:
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg leading-relaxed">
                          {scenario.situation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          Suggested Approach:
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg leading-relaxed">
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
              <div className="bg-gradient-to-br from-blue-50 to-primary-50 dark:from-blue-950 dark:to-primary-950 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  Accept This Handoff
                </h2>
                {!showAcceptDialog ? (
                  <button
                    onClick={() => setShowAcceptDialog(true)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 rounded-xl transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    I'm Ready to Accept This Handoff
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="developerName" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="developerName"
                        value={developerName}
                        onChange={(e) => setDeveloperName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAcceptHandoff}
                        disabled={acceptingHandoff || !developerName.trim()}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        {acceptingHandoff ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Accepting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Confirm & Accept</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowAcceptDialog(false);
                          setDeveloperName("");
                        }}
                        className="px-6 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold border-2 border-gray-300 dark:border-gray-600"
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
      </div>
    );
  }

  // List view
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white text-3xl mb-4 shadow-lg">
            🤝
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Handoff
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            View incoming handoffs from other developers. Review the context and accept handoffs to start working on them.
          </p>
        </div>

        {handoffs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="text-6xl mb-6">📭</div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              No handoffs available yet
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Handoffs will appear here when developers create them in the Author page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {handoffs.map((handoff) => (
              <div
                key={handoff.id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all bg-white dark:bg-gray-800 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 group"
                onClick={() => handleSelectHandoff(handoff)}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        Handoff from {handoff.author}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(handoff.status)}`}>
                        {handoff.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Created {formatDate(handoff.timestamp)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {handoff.metadata.developerNotes}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {handoff.scenarios.length} scenarios
                    </span>
                    {handoff.metadata.repoPath && (
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                        {handoff.metadata.repoPath.split("/").pop()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHandoff(handoff);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
