"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS, DEFAULT_MOCK_REPOS } from "@/lib/constants";

export default function SettingsPage() {
  const [referenceRepos, setReferenceRepos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DEFAULT_REFERENCE_REPOS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReferenceRepos(Array.isArray(parsed) ? parsed : [...DEFAULT_MOCK_REPOS]);
      } catch (error) {
        console.error("Failed to parse stored reference repos:", error);
        setReferenceRepos([...DEFAULT_MOCK_REPOS]);
      }
    } else {
      // Default to mock repos for zero-setup demo
      setReferenceRepos([...DEFAULT_MOCK_REPOS]);
    }
  }, []);

  const handleAddRepo = () => {
    setReferenceRepos([...referenceRepos, ""]);
  };

  const handleRemoveRepo = (index: number) => {
    setReferenceRepos(referenceRepos.filter((_, i) => i !== index));
  };

  const handleUpdateRepo = (index: number, value: string) => {
    const updated = [...referenceRepos];
    updated[index] = value;
    setReferenceRepos(updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Filter out empty entries before saving
      const filtered = referenceRepos.filter(repo => repo.trim());
      localStorage.setItem(STORAGE_KEYS.DEFAULT_REFERENCE_REPOS, JSON.stringify(filtered));

      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setReferenceRepos([...DEFAULT_MOCK_REPOS]);
    setSaveMessage("Reset to default mock repositories");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl mb-4 shadow-lg">
            ⚙️
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Configure default reference repositories that are pre-populated when creating new handoffs.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Default Reference Repositories
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            These repository identifiers are automatically added to the Author page when creating
            new handoffs. Use mock identifiers (like{" "}
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-xs">sarah-chen-auth-history</code>)
            or local file paths (like{" "}
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-xs">/path/to/repo</code>).
          </p>

          <div className="space-y-3 mb-4">
            {referenceRepos.map((repo, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => handleUpdateRepo(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white transition-all"
                  placeholder="Repository identifier or path"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRepo(index)}
                  className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRepo}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-all text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium mb-6"
          >
            + Add Repository
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium shadow-md"
            >
              Reset to Defaults
            </button>
          </div>

          {saveMessage && (
            <div
              className={
                "mt-4 p-4 rounded-xl border-2 " +
                (saveMessage.includes("Failed")
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800")
              }
            >
              {saveMessage}
            </div>
          )}
        </div>

        <div className="bg-primary-50 dark:bg-gray-800/50 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
            💡 About Reference Repositories
          </h3>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong className="text-gray-900 dark:text-white">Mock repositories:</strong> Use
              identifiers like{" "}
              <code className="bg-white/70 dark:bg-gray-900/70 px-2 py-1 rounded-md text-xs">sarah-chen-auth-history</code>{" "}
              for demo purposes without needing real git repos.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Local repositories:</strong> Use
              absolute paths like{" "}
              <code className="bg-white/70 dark:bg-gray-900/70 px-2 py-1 rounded-md text-xs">/Users/you/projects/my-repo</code>{" "}
              to reference actual git repositories on your machine.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Per-handoff customization:</strong>{" "}
              These are just defaults. You can add, remove, or modify repositories for each
              individual handoff in the Author page.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
