import ErrorBoundary from "@/components/shared/ApplicationErrorBoundary";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import NotFoundPage from "@/pages/NotFoundPage";
import Tasks from "@/pages/Tasks";

import { routePaths } from "./routePaths";

export const routeConfig = [
  {
    path: routePaths.home,
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: routePaths.tasks,
        element: <Tasks />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
