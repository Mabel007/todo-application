import { Outlet } from "react-router";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function AppLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="w-full px-6 py-8">
        <div className="w-full lg:mx-auto lg:max-w-4xl">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
