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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📝 Author Handoff Scenarios</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate handoff scenarios based on git activity and developer notes. The AI will predict situations the next developer will likely face and suggest approaches.
        </p>
      </div>

      {scenarios.length === 0 ? (
        <form onSubmit={handleGenerate} className="space-y-6 bg-white dark:bg-gray-800 border rounded-lg p-8">
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter your name"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This will be shown to the developer picking up the handoff
            </p>
          </div>

          <div>
            <label htmlFor="repoPath" className="block text-sm font-medium mb-2">
              Repository Path (optional)
            </label>
            <input
              type="text"
              id="repoPath"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
              placeholder="/path/to/your/repo"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              If provided, recent git commits will be automatically fetched
            </p>
          </div>

          <div>
            <label htmlFor="gitActivity" className="block text-sm font-medium mb-2">
              Git Activity
            </label>
            <textarea
              id="gitActivity"
              value={gitActivity}
              onChange={(e) => setGitActivity(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
              placeholder="Paste recent git commits, diffs, or activity here...&#10;&#10;Or leave empty if you provided a repository path above."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reference Repositories (optional)
            </label>
            <div className="space-y-2">
              {referenceRepos.map((repo, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={repo}
                    onChange={(e) => handleUpdateReferenceRepo(index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                    placeholder="/path/to/reference/repo"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReferenceRepo(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddReferenceRepo}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                + Add Reference Repository
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add paths to other repositories to help the AI understand your coding patterns and history
            </p>
          </div>

          <div>
            <label htmlFor="developerNotes" className="block text-sm font-medium mb-2">
              Developer Notes
            </label>
            <textarea
              id="developerNotes"
              value={developerNotes}
              onChange={(e) => setDeveloperNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
              placeholder="Add context about what you were working on, what's incomplete, known issues, etc.&#10;&#10;Example:&#10;- Implemented user authentication flow&#10;- Still need to add password reset&#10;- Known issue: email validation needs improvement"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Scenarios...</span>
              </>
            ) : (
              "Generate Handoff Scenarios"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generated Scenarios ({scenarios.length})</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Start Over
              </button>
            </div>

            <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                className="p-6 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Scenario {index + 1}
                  </h3>
                  <div className="flex gap-2">
                    {editingId === scenario.id ? (
                      <button
                        onClick={() => handleSaveScenario(scenario.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditScenario(scenario.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Situation
                    </label>
                    {editingId === scenario.id ? (
                      <textarea
                        value={scenario.situation}
                        onChange={(e) => handleUpdateScenario(scenario.id, "situation", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {scenario.situation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Suggested Approach
                    </label>
                    {editingId === scenario.id ? (
                      <textarea
                        value={scenario.suggestedApproach}
                        onChange={(e) => handleUpdateScenario(scenario.id, "suggestedApproach", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {scenario.suggestedApproach}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Generate New Scenarios
            </button>
            <button
              onClick={handleSaveHandoff}
              disabled={isSaving || !author.trim()}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Handoff...</span>
                </>
              ) : (
                "Save Handoff & Continue"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
