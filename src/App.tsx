import { LogoHorizontal } from "@/assets";
import { APP_CONFIG } from "@/constants/app";

function App() {
  return (
    <main className="flex-center min-h-screen">
      <section className="space-y-8 text-center">
        <img src={LogoHorizontal} alt={`${APP_CONFIG.name} logo`} className="mx-auto w-72" />

        <h1 className="text-5xl font-bold">{APP_CONFIG.name}</h1>

        <p className="text-muted-foreground max-w-xl">{APP_CONFIG.description}</p>
      </section>
    </main>
  );
}

export default App;
