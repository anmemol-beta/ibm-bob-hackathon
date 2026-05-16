"use client";

import { useState } from "react";
import { API_ROUTES } from "@/lib/constants";

export default function AuthorPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [constraints, setConstraints] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const scenario = {
      title,
      description,
      requirements: requirements.split("\n").filter(r => r.trim()),
      constraints: constraints.split("\n").filter(c => c.trim()),
    };

    try {
      const response = await fetch(API_ROUTES.SCENARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario),
      });

      if (response.ok) {
        alert("Scenario created successfully!");
        setTitle("");
        setDescription("");
        setRequirements("");
        setConstraints("");
      }
    } catch (error) {
      console.error("Error creating scenario:", error);
      alert("Failed to create scenario");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📝 Author Scenario</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Define a coding scenario with requirements and constraints for the AI standin to implement.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Scenario Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Add user authentication"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what needs to be implemented..."
            required
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-2">
            Requirements (one per line)
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Must support email/password login&#10;Must include password reset flow&#10;Must validate email format"
            required
          />
        </div>

        <div>
          <label htmlFor="constraints" className="block text-sm font-medium mb-2">
            Constraints (optional, one per line)
          </label>
          <textarea
            id="constraints"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Use existing database schema&#10;Follow project coding standards&#10;Add unit tests"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Scenario
        </button>
      </form>
    </div>
  );
}

// Made with Bob
