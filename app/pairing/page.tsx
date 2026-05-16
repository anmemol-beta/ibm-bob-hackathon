"use client";

import { useState, useEffect, useRef } from "react";
import { API_ROUTES } from "@/lib/constants";
import type { ChatMessage, StandinChatResponse, Handoff, HandoffScenario } from "@/lib/types";

export default function PairingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedHandoffId, setSelectedHandoffId] = useState<string>("");
  const [repoPath, setRepoPath] = useState<string>("");
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [loadingHandoffs, setLoadingHandoffs] = useState(true);
  const [matchedScenario, setMatchedScenario] = useState<HandoffScenario | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch available handoffs on mount
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
      setLoadingHandoffs(false);
    }
  };

  // Simple keyword matching to find relevant scenarios
  const findMatchingScenario = (question: string): HandoffScenario | null => {
    if (!selectedHandoffId) return null;
    
    const handoff = handoffs.find(h => h.id === selectedHandoffId);
    if (!handoff || !handoff.scenarios.length) return null;

    const questionLower = question.toLowerCase();
    
    // Find scenario with highest keyword match
    let bestMatch: HandoffScenario | null = null;
    let bestScore = 0;

    handoff.scenarios.forEach(scenario => {
      const situationLower = scenario.situation.toLowerCase();
      const approachLower = scenario.suggestedApproach.toLowerCase();
      
      // Count keyword matches
      const keywords = questionLower.split(/\s+/).filter(w => w.length > 3);
      let score = 0;
      
      keywords.forEach(keyword => {
        if (situationLower.includes(keyword)) score += 2;
        if (approachLower.includes(keyword)) score += 1;
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = scenario;
      }
    });

    return bestScore > 0 ? bestMatch : null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Check for matching scenario
    const matched = findMatchingScenario(inputValue);
    setMatchedScenario(matched);

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

  const handleSelectHandoff = (handoffId: string) => {
    setSelectedHandoffId(handoffId);
    setMatchedScenario(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">👥 Pairing</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ask questions and get answers as your absent teammate would give them. Select a handoff to see relevant scenarios.
        </p>

        {/* Handoff Selection */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Handoff Context</h2>
          
          {loadingHandoffs ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading handoffs...</span>
              </div>
            </div>
          ) : handoffs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No handoffs available yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Create a handoff in the Author page to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                {handoffs.map((handoff) => (
                  <button
                    key={handoff.id}
                    onClick={() => handleSelectHandoff(handoff.id)}
                    className={`text-left p-4 border-2 rounded-lg transition-all ${
                      selectedHandoffId === handoff.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {handoff.author}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        handoff.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : handoff.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {handoff.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {handoff.metadata.developerNotes}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>📋 {handoff.scenarios.length} scenarios</span>
                      <span>•</span>
                      <span>{new Date(handoff.timestamp).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Repository Path Input */}
              <div className="pt-3 border-t">
                <label className="block text-sm font-medium mb-2">
                  Repository Path (optional)
                </label>
                <input
                  type="text"
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  placeholder="e.g., /path/to/repo or leave empty for current"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Chat Area - 2/3 width */}
        <div className="md:col-span-2 flex flex-col h-[calc(100vh-28rem)]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-lg font-medium mb-2">Start a conversation</p>
                  <p className="text-sm max-w-md">
                    {selectedHandoffId
                      ? "Ask questions about the handoff scenarios, code changes, or implementation details."
                      : "Select a handoff above to begin, then ask questions about the codebase or scenarios."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
                      <div className="whitespace-pre-wrap break-words text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedHandoffId
                ? "Ask a question about the code, recent changes, or scenarios..."
                : "Select a handoff first to start asking questions..."}
              className="flex-1 px-4 py-3 border rounded-lg resize-none dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={loading || !selectedHandoffId}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading || !selectedHandoffId}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        {/* Scenarios Sidebar - 1/3 width */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-5 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Relevant Scenarios</span>
            </h2>
            
            {!selectedHandoffId ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">
                  Select a handoff to see scenarios
                </p>
              </div>
            ) : matchedScenario ? (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg">💡</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Matched Scenario
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Situation:
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            {matchedScenario.situation}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Suggested Approach:
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            {matchedScenario.suggestedApproach}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Show all scenarios */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    All Scenarios
                  </h3>
                  <div className="space-y-3">
                    {handoffs
                      .find(h => h.id === selectedHandoffId)
                      ?.scenarios.map((scenario, idx) => (
                        <div
                          key={scenario.id}
                          className={`p-3 rounded-lg border text-sm ${
                            scenario.id === matchedScenario.id
                              ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                          }`}
                        >
                          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Scenario {idx + 1}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                            {scenario.situation}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {handoffs
                  .find(h => h.id === selectedHandoffId)
                  ?.scenarios.map((scenario, idx) => (
                    <div
                      key={scenario.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
                    >
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm">
                        Scenario {idx + 1}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-3">
                        {scenario.situation}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs line-clamp-2">
                        💡 {scenario.suggestedApproach}
                      </p>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No scenarios available
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
