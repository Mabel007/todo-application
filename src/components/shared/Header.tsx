import { Link, NavLink } from "react-router";

import { routePaths } from "@/routes/routePaths";

import { AppLogo } from "../layout/AppLogo";

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "focus-visible:ring-ring focus-visible:ring-offset-ring-offset relative rounded-sm px-1 py-2 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    isActive
      ? "text-navigation-active after:bg-navigation-active-indicator font-semibold after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full"
      : "text-navigation-foreground hover:text-navigation-hover",
  ].join(" ");

export default function Header() {
  return (
    <header className={"bg-card border-divider w-full border-b px-6 py-4"}>
      <div
        className={
          "mx-auto flex w-full max-w-4xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
        }
      >
        <Link
          to={routePaths.home}
          className={
            "focus-visible:ring-ring focus-visible:ring-offset-ring-offset rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          }
        >
          <AppLogo className={"h-5 w-auto"} />
        </Link>

        <nav aria-label={"Primary navigation"} className={"flex gap-4"}>
          <NavLink to={routePaths.home} end className={navigationLinkClassName}>
            Home
          </NavLink>
          <NavLink to={routePaths.tasks} className={navigationLinkClassName}>
            Tasks
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
