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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl mb-4 shadow-lg">
            👥
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Pairing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ask questions and get answers as your absent teammate would give them. Select a handoff to see relevant scenarios.
          </p>
        </div>

        {/* Handoff Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Select Handoff Context
          </h2>
          
          {loadingHandoffs ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Loading handoffs...</span>
              </div>
            </div>
          ) : handoffs.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                No handoffs available yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Create a handoff in the Author page to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                {handoffs.map((handoff) => (
                  <button
                    key={handoff.id}
                    onClick={() => handleSelectHandoff(handoff.id)}
                    className={`text-left p-4 border-2 rounded-xl transition-all ${
                      selectedHandoffId === handoff.id
                        ? "border-primary-600 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        {handoff.author}
                      </h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
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
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {handoff.scenarios.length} scenarios
                      </span>
                      <span>•</span>
                      <span>{new Date(handoff.timestamp).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Repository Path Input */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                  Repository Path <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  placeholder="e.g., /path/to/repo or leave empty for current"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 h-[calc(100vh-32rem)] overflow-y-auto border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-4 bg-white dark:bg-gray-800 space-y-4 shadow-xl">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Start a conversation</p>
                    <p className="text-sm max-w-md mx-auto leading-relaxed">
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
                        className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                            : "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-bold ${message.role === "user" ? "text-blue-100" : "text-gray-600 dark:text-gray-400"}`}>
                            {message.role === "user" ? "You" : "AI Teammate"}
                          </span>
                          <span className={`text-xs ${message.role === "user" ? "text-blue-200" : "text-gray-500 dark:text-gray-500"}`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl px-5 py-4 border border-gray-200 dark:border-gray-700 shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedHandoffId
                  ? "Ask a question about the code, recent changes, or scenarios..."
                  : "Select a handoff first to start asking questions..."}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl resize-none dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-md"
                rows={2}
                disabled={loading || !selectedHandoffId}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading || !selectedHandoffId}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Send</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scenarios Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 sticky top-24 shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="text-xl">🎯</span>
                <span>Relevant Scenarios</span>
              </h2>
              
              {!selectedHandoffId ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm font-medium">
                    Select a handoff to see scenarios
                  </p>
                </div>
              ) : matchedScenario ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-primary-50 dark:from-blue-950 dark:to-primary-950 border-2 border-primary-200 dark:border-primary-800 rounded-xl p-4 shadow-md">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-3">
                          Matched Scenario
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-semibold text-primary-800 dark:text-primary-200 mb-1">
                              Situation:
                            </p>
                            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                              {matchedScenario.situation}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-primary-800 dark:text-primary-200 mb-1">
                              Suggested Approach:
                            </p>
                            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                              {matchedScenario.suggestedApproach}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Show all scenarios */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      All Scenarios
                    </h3>
                    <div className="space-y-2">
                      {handoffs
                        .find(h => h.id === selectedHandoffId)
                        ?.scenarios.map((scenario, idx) => (
                          <div
                            key={scenario.id}
                            className={`p-3 rounded-lg border text-sm transition-all ${
                              scenario.id === matchedScenario.id
                                ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-950 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Scenario {idx + 1}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">
                              {scenario.situation}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {handoffs
                    .find(h => h.id === selectedHandoffId)
                    ?.scenarios.map((scenario, idx) => (
                      <div
                        key={scenario.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                      >
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">
                          Scenario {idx + 1}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-3 leading-relaxed">
                          {scenario.situation}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs line-clamp-2 leading-relaxed">
                          💡 {scenario.suggestedApproach}
                        </p>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        No scenarios available
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
