import { Film, Key, Terminal, Globe } from 'lucide-react';

export function SetupScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="flex items-center gap-3 mb-8">
          <Film className="text-amber-400" size={36} />
          <h1 className="text-3xl font-bold">
            Movies <span className="text-amber-400">Ranker</span>
          </h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key size={20} className="text-amber-400" />
            One-time Setup
          </h2>
          <p className="text-zinc-400 text-sm mb-5">
            This app uses the free TMDB API to fetch the top 250 rated movies.
            Getting a key takes about 2 minutes.
          </p>
          <ol className="space-y-3 text-sm text-zinc-300">
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold flex-shrink-0">1.</span>
              <span>
                Create a free account at{' '}
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  themoviedb.org
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold flex-shrink-0">2.</span>
              <span>
                Go to{' '}
                <strong className="text-white">Settings → API</strong> and
                request a Developer API key
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold flex-shrink-0">3.</span>
              <span>
                Create a{' '}
                <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">
                  .env
                </code>{' '}
                file in the project root:
              </span>
            </li>
          </ol>
          <div className="mt-4 bg-zinc-950 rounded-lg p-4 font-mono text-sm border border-zinc-800">
            <div className="text-zinc-500 mb-1"># .env</div>
            <div>
              <span className="text-blue-400">VITE_TMDB_API_KEY</span>
              <span className="text-zinc-400">=</span>
              <span className="text-green-400">your_api_key_here</span>
            </div>
          </div>
          <li className="flex gap-3 text-sm text-zinc-300 mt-3 list-none">
            <span className="text-amber-400 font-bold flex-shrink-0">4.</span>
            <span>
              Restart the dev server — the app will load automatically
            </span>
          </li>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Terminal size={20} className="text-amber-400" />
            Run Locally
          </h2>
          <div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm space-y-1 border border-zinc-800">
            <div className="text-zinc-500"># install & start</div>
            <div className="text-green-400">npm install</div>
            <div className="text-green-400">npm run dev</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe size={20} className="text-amber-400" />
            Deploy to Netlify
          </h2>
          <ol className="space-y-2 text-sm text-zinc-300">
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">1.</span>
              Push this project to GitHub
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">2.</span>
              Import the repo on netlify.com
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">3.</span>
              Add{' '}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">
                VITE_TMDB_API_KEY
              </code>{' '}
              in Site Settings → Environment Variables
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">4.</span>
              Deploy! Build command:{' '}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">
                npm run build
              </code>
              , Publish dir:{' '}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">
                dist
              </code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
