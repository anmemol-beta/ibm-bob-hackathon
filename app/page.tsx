"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ROUTES, APP_NAME } from "@/lib/constants";

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Set up intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all elements with animate-on-scroll class
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-blue-50 dark:from-primary-950 dark:via-accent-950 dark:to-blue-950 opacity-50" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-float" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent-300 dark:bg-accent-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-on-scroll animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Async Pair Programming</span>
                <br />
                <span className="text-gray-900 dark:text-white">Across Time Zones</span>
              </h1>
            </div>
            
            <div className="animate-on-scroll animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Bridge the 13-hour gap. Capture context at commit time, hand off seamlessly, and let AI stand in for your absent teammate.
              </p>
            </div>

            <div className="animate-on-scroll animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: "0.2s" }}>
              <Link
                href={ROUTES.AUTHOR}
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Time Zone Visual */}
            <div className="mt-16 animate-on-scroll animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-center gap-8 sm:gap-16">
                <div className="text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Boston</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">9:00 AM</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-primary-500 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-2">13 hours apart</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Seoul</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-on-scroll animate-fade-in-up text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                The Problem
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Global teams face an impossible challenge
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-on-scroll animate-fade-in-left bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-2xl p-8 border border-red-200 dark:border-red-800">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Never Online Together</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  When your teammate in Seoul finishes their day, you're just starting yours in Boston. A 13-hour time zone gap means zero overlap for real-time collaboration.
                </p>
              </div>

              <div className="animate-on-scroll animate-fade-in-right bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800">
                <div className="text-4xl mb-4">❓</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Context Lost in Translation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Git commits and Slack messages can't capture the full context. Why did they make that choice? What were they thinking? Questions pile up with no one to answer.
                </p>
              </div>

              <div className="animate-on-scroll animate-fade-in-left bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">24-Hour Feedback Loops</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ask a question, wait a full day for an answer. Every clarification adds another 24 hours. Progress grinds to a halt.
                </p>
              </div>

              <div className="animate-on-scroll animate-fade-in-right bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Blocked & Frustrated</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You're stuck on their code, they're blocked on yours. The async handoff becomes a bottleneck instead of a bridge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll animate-fade-in-up text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Three simple steps to seamless async collaboration
              </p>
            </div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="animate-on-scroll animate-fade-in-left flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Capture at Commit Time</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      Use the <code className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono">asyncpair</code> CLI to capture a rich handoff at commit time. It automatically pulls git activity and lets you add developer notes about what you were working on, what's incomplete, and what comes next.
                    </p>
                    <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-green-400">
                      <div>$ asyncpair capture</div>
                      <div className="text-gray-500">✓ Captured git activity</div>
                      <div className="text-gray-500">✓ Generated handoff scenarios</div>
                      <div className="text-gray-500">✓ Ready for teammate pickup</div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 order-1 md:order-2">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-2xl">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="animate-on-scroll animate-fade-in-right flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-2xl">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Teammate Picks It Up</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      Your teammate opens the web app, reviews the handoff with full context—git activity, developer notes, and AI-generated scenarios predicting what they'll likely face. They accept the handoff and get to work.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">Git Activity</span>
                      <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium">Developer Notes</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">AI Scenarios</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="animate-on-scroll animate-fade-in-left flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ask the AI Stand-In</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      Got questions? The AI stand-in answers as your absent teammate would—with full context from the handoff, git history, and scenarios. No more 24-hour wait times. Get unblocked instantly.
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">👤</div>
                        <div className="flex-1 bg-primary-100 dark:bg-primary-900 rounded-lg p-3 text-sm">
                          Why did you use this pattern here?
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">🤖</div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-sm">
                          Based on the git history, I chose this pattern because...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 order-1 md:order-2">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll animate-fade-in-up text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Everything you need for seamless async collaboration
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-on-scroll animate-fade-in-up group">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Instant Context Capture</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Automatically extract git activity, commits, and diffs. Add your notes about what's done and what's next.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">AI-Generated Scenarios</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Predict what your teammate will face and suggest approaches before they even ask.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Contextual AI Chat</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Ask questions and get answers with full context from git history, notes, and scenarios.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-up group">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Zero Setup Required</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Works with your existing git workflow. No complex integrations or configuration needed.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Flexible & Customizable</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Edit scenarios, add reference repos, and tailor handoffs to your team's workflow.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-xl h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Get answers instantly instead of waiting 24 hours. Keep your momentum going.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll animate-fade-in-up text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                The AsyncPair CLI
              </h2>
              <p className="text-xl text-gray-300">
                Powerful command-line tool for seamless handoffs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll animate-fade-in-left">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-lg">⚡</span>
                      Quick Setup
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Install globally with npm and initialize in any git repository. Works with your existing workflow.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-accent-600 flex items-center justify-center text-lg">🎯</span>
                      Smart Capture
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Automatically extracts recent commits, diffs, and file changes. Add your context and generate scenarios.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-lg">🔗</span>
                      Seamless Integration
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Syncs with the web app automatically. Your teammate sees the handoff instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll animate-fade-in-right">
                <div className="bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-sm text-gray-400">terminal</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-gray-400"># Install the CLI</div>
                    <div className="text-green-400">$ npm install -g asyncpair</div>
                    <div className="mt-4 text-gray-400"># Initialize in your repo</div>
                    <div className="text-green-400">$ asyncpair init</div>
                    <div className="text-gray-500">✓ Initialized AsyncPair</div>
                    <div className="mt-4 text-gray-400"># Capture a handoff</div>
                    <div className="text-green-400">$ asyncpair capture</div>
                    <div className="text-gray-500">✓ Captured 5 commits</div>
                    <div className="text-gray-500">✓ Generated 3 scenarios</div>
                    <div className="text-gray-500">✓ Handoff ready!</div>
                    <div className="mt-4 text-blue-400">→ View at: ibm-bob-hackathon-two.vercel.app/handoff</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-primary-600 via-accent-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-on-scroll animate-fade-in-up">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Bridge the Time Zone Gap?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Start collaborating asynchronously with full context and AI assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={ROUTES.AUTHOR}
                  className="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  Create Your First Handoff
                </Link>
                <Link
                  href={ROUTES.HANDOFF}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
                >
                  View Handoffs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Made with Bob
