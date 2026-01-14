import { createBrowserRouter } from "react-router";
import { Dashboard } from "./routes/Dashboard.jsx";
import { SignIn } from "./components/SignIn.jsx";
import { Header } from "./components/Header.jsx";
import { SignUp } from "./components/SignUp.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
  )
  }
]);