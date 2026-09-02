import { Link } from "react-router";

import { buttonVariants } from "@/components/ui/button";
import { routePaths } from "@/routes/routePaths";

export default function NotFoundPage() {
  return (
    <div className="flex-center">
      <section className="space-y-8 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2>Page Not Found</h2>
        <p className="text-muted-foreground mx-auto max-w-xl">
          Sorry, we couldn’t find the page you’re looking for. Perhaps the address was mistyped or
          the page has moved.
        </p>

        <Link to={routePaths.home} className={buttonVariants({ className: "mt-6" })}>
          Go Back Home
        </Link>
      </section>
    </div>
  );
}
