import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./04-layout/Public_Routes/MainLayout";
import { Login } from "./05-pages/02-PublicPages/01-Login";
import Home from "./05-pages/02-PublicPages/02-Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthRoute } from "./04-layout/Public_Routes/01-AuthRoute.jsx";
import PrivateRoute from "./04-layout/Protected_Routes/01-PrivateRoute.jsx";
import InterviewSetup from "./05-pages/01-ProtectedPages/01-interview.jsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 60 * 60 * 1000, // 60 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false, // ← This prevents multiple calls
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthRoute />, // 🔐 wrapper
      children: [
        {
          element: <MainLayout />, // ✅ layout wrapper
          children: [
            { index: true, element: <Home /> },
          ],
        },
      ],
    },

    {
      path: "/user",
      element: <PrivateRoute />,
      children: [{ path:"interview", element: <InterviewSetup /> }],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-center" autoClose={3000} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
