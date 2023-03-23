import React from 'react'
import Dashboard from './pages/Dashboard'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PubsDashboard from './pages/PublishersDashboard';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/pubs",
      element: <PubsDashboard />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

