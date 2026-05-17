"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ROUTES, ROUTES } from "@/lib/constants";
import { HandoffScenario } from "@/lib/types";

export default function AuthorPage() {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [gitActivity, setGitActivity] = useState("");
  const [developerNotes, setDeveloperNotes] = useState("");
  const [repoPath, setRepoPath] = useState("");
  const [referenceRepos, setReferenceRepos] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<HandoffScenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.SCENARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gitActivity,
          developerNotes,
          repoPath: repoPath.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate scenarios");
      }

      const data = await response.json();
      setScenarios(data.scenarios || []);
    } catch (err) {
      console.error("Error generating scenarios:", err);
      setError(err instanceof Error ? err.message : "Failed to generate scenarios");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditScenario = (id: string) => {
    setEditingId(id);
  };

  const handleSaveScenario = (id: string) => {
    setEditingId(null);
  };

  const handleUpdateScenario = (id: string, field: "situation" | "suggestedApproach", value: string) => {
    setScenarios(scenarios.map(scenario => 
      scenario.id === id 
        ? { ...scenario, [field]: value }
        : scenario
    ));
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  const handleReset = () => {
    setAuthor("");
    setGitActivity("");
    setDeveloperNotes("");
    setRepoPath("");
    setReferenceRepos([]);
    setScenarios([]);
    setError(null);
    setEditingId(null);
  };

  const handleAddReferenceRepo = () => {
    setReferenceRepos([...referenceRepos, ""]);
  };

  const handleRemoveReferenceRepo = (index: number) => {
    setReferenceRepos(referenceRepos.filter((_, i) => i !== index));
  };

  const handleUpdateReferenceRepo = (index: number, value: string) => {
    const updated = [...referenceRepos];
    updated[index] = value;
    setReferenceRepos(updated);
  };

  const handleSaveHandoff = async () => {
    if (!author.trim()) {
      setError("Please enter your name before saving the handoff");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.HANDOFF, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          gitActivitySummary: gitActivity,
          scenarios,
          metadata: {
            repoPath: repoPath.trim() || undefined,
            developerNotes,
            referenceRepos: referenceRepos.filter(r => r.trim()).length > 0
              ? referenceRepos.filter(r => r.trim())
              : undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save handoff");
      }

      // Success - redirect to handoff page
      router.push(ROUTES.HANDOFF);
    } catch (err) {
      console.error("Error saving handoff:", err);
      setError(err instanceof Error ? err.message : "Failed to save handoff");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl mb-4 shadow-lg">
            📝
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Author Handoff Scenarios
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate handoff scenarios based on git activity and developer notes. The AI will predict situations the next developer will likely face and suggest approaches.
          </p>
        </div>

        {scenarios.length === 0 ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="author" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                    placeholder="Enter your name"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This will be shown to the developer picking up the handoff
                  </p>
                </div>

                <div>
                  <label htmlFor="repoPath" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                    Repository Path <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="repoPath"
                    value={repoPath}
                    onChange={(e) => setRepoPath(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                    placeholder="/path/to/your/repo"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    If provided, recent git commits will be automatically fetched
                  </p>
                </div>

                <div>
                  <label htmlFor="gitActivity" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                    Git Activity
                  </label>
                  <textarea
                    id="gitActivity"
                    value={gitActivity}
                    onChange={(e) => setGitActivity(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white font-mono text-sm transition-all"
                    placeholder="Paste recent git commits, diffs, or activity here...&#10;&#10;Or leave empty if you provided a repository path above."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                    Reference Repositories <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="space-y-3">
                    {referenceRepos.map((repo, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={repo}
                          onChange={(e) => handleUpdateReferenceRepo(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                          placeholder="/path/to/reference/repo"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveReferenceRepo(index)}
                          className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddReferenceRepo}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-all text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                    >
                      + Add Reference Repository
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Add paths to other repositories to help the AI understand your coding patterns and history
                  </p>
                </div>

                <div>
                  <label htmlFor="developerNotes" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                    Developer Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="developerNotes"
                    value={developerNotes}
                    onChange={(e) => setDeveloperNotes(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                    placeholder="Add context about what you were working on, what's incomplete, known issues, etc.&#10;&#10;Example:&#10;- Implemented user authentication flow&#10;- Still need to add password reset&#10;- Known issue: email validation needs improvement"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Scenarios...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Handoff Scenarios</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Generated Scenarios</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{scenarios.length} scenarios ready for handoff</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium shadow-md"
                >
                  Start Over
                </button>
              </div>

              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <div
                    key={scenario.id}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Scenario {index + 1}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {editingId === scenario.id ? (
                          <button
                            onClick={() => handleSaveScenario(scenario.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all font-medium shadow-md"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditScenario(scenario.id)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-all font-medium shadow-md"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteScenario(scenario.id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all font-medium shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Situation
                        </label>
                        {editingId === scenario.id ? (
                          <textarea
                            value={scenario.situation}
                            onChange={(e) => handleUpdateScenario(scenario.id, "situation", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            {scenario.situation}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Suggested Approach
                        </label>
                        {editingId === scenario.id ? (
                          <textarea
                            value={scenario.suggestedApproach}
                            onChange={(e) => handleUpdateScenario(scenario.id, "suggestedApproach", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            {scenario.suggestedApproach}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white py-4 rounded-xl hover:bg-gray-700 transition-all font-semibold text-lg shadow-lg"
              >
                Generate New Scenarios
              </button>
              <button
                onClick={handleSaveHandoff}
                disabled={isSaving || !author.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Handoff...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Handoff & Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
