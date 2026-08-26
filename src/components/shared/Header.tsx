import { Link } from "react-router";

import { routePaths } from "@/routes/routePaths";

import { AppLogo } from "../layout/AppLogo";
export default function Header() {
  return (
    <header className="mt-4 w-full px-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <Link to={routePaths.home}>
          <AppLogo className="h-12 w-auto" />
        </Link>

        <nav className="flex gap-4">
          <Link to={routePaths.home} className="font-medium text-gray-600 hover:text-[#0F2459]">
            Home
          </Link>
          <Link to={routePaths.tasks} className="font-medium text-gray-600 hover:text-[#0F2459]">
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
}
