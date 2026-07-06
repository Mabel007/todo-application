import { APP_NAME } from "@/constants/app";

type AppProps = {
  appName: string;
  version: number;
};

function App() {
  const app: AppProps = {
    appName: APP_NAME,
    version: 1.0,
  };

  return (
    <main>
      <h1>{app.appName}</h1>

      <p>Version {app.version}</p>

      <p>React + TypeScript + Vite successfully configured.</p>
    </main>
  );
}

export default App;