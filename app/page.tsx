import RoastForm from "@/components/RoastForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            🔥 Roast My GitHub
          </h1>
          <p className="text-zinc-400 text-lg">
            Enter a GitHub username and get a brutally honest (and funny) roast
            of their public repos.
          </p>
        </div>

        <RoastForm />

        <footer className="text-center text-xs text-zinc-600 pt-4">
          Powered by GitHub API + Claude · Roasts are fiction, not facts.
        </footer>
      </div>
    </main>
  );
}
