export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HILDA
            </h1>
            <p className="text-2xl text-zinc-600 dark:text-zinc-400 mb-2">
              Human In the Loop Deployment Agent
            </p>
            <p className="text-lg text-zinc-500 dark:text-zinc-500">
              Intelligent deployment workflows with human oversight
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                🤖 LangGraph Workflows
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Orchestrate complex deployment processes using LangGraph&apos;s state machine architecture.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                👥 Human Oversight
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Critical deployment steps require human approval before proceeding.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                🔗 GitHub Integration
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Seamlessly integrate with GitHub repositories and webhooks.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                🗄️ Supabase Backend
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Store deployment state and approval history in Supabase.
              </p>
            </div>
          </div>

          {/* Project Structure */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              📁 Project Structure
            </h3>
            <div className="font-mono text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
              <div>├── <span className="text-blue-600 dark:text-blue-400">ai/</span> - LangGraph workflows and nodes</div>
              <div>├── <span className="text-blue-600 dark:text-blue-400">lib/</span> - Supabase client, Octokit, utilities</div>
              <div>├── <span className="text-blue-600 dark:text-blue-400">components/</span> - React UI components</div>
              <div>├── <span className="text-blue-600 dark:text-blue-400">types/</span> - TypeScript type definitions</div>
              <div>├── <span className="text-blue-600 dark:text-blue-400">app/</span></div>
              <div>│   ├── <span className="text-blue-600 dark:text-blue-400">api/webhooks/</span> - API webhook endpoints</div>
              <div>│   └── <span className="text-zinc-500">page.tsx</span> - Main application page</div>
              <div>└── <span className="text-zinc-500">.env.example</span> - Environment configuration template</div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Configure your environment variables and start the development server:
            </p>
            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 font-mono text-sm text-zinc-300">
              <div>cp .env.example .env.local</div>
              <div className="text-zinc-500 mt-2"># Edit .env.local with your credentials</div>
              <div className="mt-2">npm run dev</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
