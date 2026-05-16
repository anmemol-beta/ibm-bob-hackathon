"use client";

import { useState, useEffect } from "react";
import { API_ROUTES } from "@/lib/constants";
import type { Scenario } from "@/lib/types";

export default function HandoffPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch(API_ROUTES.SCENARIOS);
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToStandin = async (scenarioId: string) => {
    try {
      const response = await fetch(API_ROUTES.STANDIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });

      if (response.ok) {
        alert("Scenario assigned to AI standin!");
        fetchScenarios();
      }
    } catch (error) {
      console.error("Error assigning scenario:", error);
      alert("Failed to assign scenario");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-200 text-gray-800",
      pending: "bg-yellow-200 text-yellow-800",
      processing: "bg-blue-200 text-blue-800",
      ready: "bg-green-200 text-green-800",
      completed: "bg-purple-200 text-purple-800",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🤝 Handoff</h1>
        <p className="text-gray-600">Loading scenarios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🤝 Handoff</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Assign scenarios to AI standin for async processing and monitor their progress.
      </p>

      {scenarios.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No scenarios yet. Create one in the Author page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        scenario.status
                      )}`}
                    >
                      {scenario.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(scenario.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {scenario.status === "draft" || scenario.status === "pending" ? (
                  <button
                    onClick={() => handleAssignToStandin(scenario.id)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign to AI
                  </button>
                ) : null}
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {scenario.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Made with Bob
