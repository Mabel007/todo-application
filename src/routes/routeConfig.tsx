import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";

import { routePaths } from "./routePaths";

export const routeConfig = [
  {
    path: routePaths.home,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: routePaths.tasks,
        element: <Tasks />,
      },
    ],
  },
];
