import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-slate-900">{APP_NAME}</h1>

        <p className="mt-4 text-slate-600">React 19 + TypeScript + Vite + Tailwind CSS</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-blue-500 p-6 text-center text-white">Mobile</div>

          <div className="rounded-lg bg-emerald-500 p-6 text-center text-white">Desktop</div>

          <Button>ShadCN configured Successfully!</Button>
        </div>
      </section>
    </main>
  );
}

export default App;
