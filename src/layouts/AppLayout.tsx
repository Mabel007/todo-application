import { Link, Outlet } from "react-router";

import { routePaths } from "@/routes/routePaths";

export default function AppLayout() {
  return (
    <main className="flex-center min-h-screen">
      <section className="space-y-8 text-center">
        <h1 className="text-4xl font-bold">Welcome</h1>

        <nav>
          <Link to={routePaths.home}>Home</Link> | <Link to={routePaths.tasks}>Tasks</Link>
        </nav>

        <div className="layout-content">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
