import Link from "next/link";
import { ROUTES, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">{APP_NAME}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Async pair-programming tool for seamless AI collaboration
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href={ROUTES.AUTHOR}
          className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Author
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create handoff scenarios with context about your recent work and what's next
          </p>
        </Link>

        <Link
          href={ROUTES.HANDOFF}
          className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">🤝</div>
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Handoff
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and accept handoffs from teammates with full context and scenarios
          </p>
        </Link>

        <Link
          href={ROUTES.PAIRING}
          className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Pairing
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Chat with AI standin to get answers as your absent teammate would give them
          </p>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          How it works
        </h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              1
            </span>
            <p className="text-gray-700 dark:text-gray-300 pt-1">
              <strong className="font-semibold">Author</strong> creates handoff scenarios with git activity and developer notes
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              2
            </span>
            <p className="text-gray-700 dark:text-gray-300 pt-1">
              <strong className="font-semibold">Handoff</strong> is reviewed and accepted by the next developer
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              3
            </span>
            <p className="text-gray-700 dark:text-gray-300 pt-1">
              <strong className="font-semibold">Pairing</strong> session lets you ask questions and get contextual answers
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              4
            </span>
            <p className="text-gray-700 dark:text-gray-300 pt-1">
              <strong className="font-semibold">Scenarios</strong> surface inline when your questions match handoff context
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}

// Made with Bob
