import Link from "next/link";
import { ROUTES, APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">{APP_NAME}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Async pair-programming tool for seamless AI collaboration
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href={ROUTES.AUTHOR}
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">📝 Author</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Define coding scenarios with requirements and constraints
          </p>
        </Link>

        <Link
          href={ROUTES.HANDOFF}
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">🤝 Handoff</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Assign tasks to AI standin and monitor progress
          </p>
        </Link>

        <Link
          href={ROUTES.PAIRING}
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">👥 Pairing</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review AI-generated code and approve changes
          </p>
        </Link>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">How it works</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Author creates a coding scenario with specific requirements</li>
          <li>Handoff assigns the scenario to an AI standin for async processing</li>
          <li>AI standin works independently to generate code changes</li>
          <li>Pairing session allows you to review and approve the changes</li>
        </ol>
      </div>
    </div>
  );
}

// Made with Bob
