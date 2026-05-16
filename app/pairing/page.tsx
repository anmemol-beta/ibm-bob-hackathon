"use client";

import { useState, useEffect, useRef } from "react";
import { API_ROUTES } from "@/lib/constants";
import type { ChatMessage, StandinChatResponse } from "@/lib/types";

export default function PairingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedHandoffId, setSelectedHandoffId] = useState<string>("");
  const [repoPath, setRepoPath] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.STANDIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputValue,
          handoffId: selectedHandoffId || undefined,
          repoPath: repoPath || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: StandinChatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: data.messageId,
        role: "assistant",
        content: data.answer,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">👥 Pairing</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ask questions and get answers as your absent teammate would give them.
        </p>

        {/* Configuration Section */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Handoff ID (optional)
            </label>
            <input
              type="text"
              value={selectedHandoffId}
              onChange={(e) => setSelectedHandoffId(e.target.value)}
              placeholder="Enter handoff ID for context"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Repository Path (optional)
            </label>
            <input
              type="text"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              placeholder="e.g., /path/to/repo or leave empty for current"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">👋 Start a conversation</p>
            <p className="text-sm">
              Ask questions about the codebase, recent changes, or handoff scenarios.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">
                    {message.role === "user" ? "You" : "AI Teammate"}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about the code, recent changes, or handoff scenarios..."
          className="flex-1 px-4 py-3 border rounded-lg resize-none dark:bg-gray-800 dark:border-gray-700"
          rows={2}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// Made with Bob
