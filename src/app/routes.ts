import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PromoteAdmin from "./pages/PromoteAdmin";
import Admin from "./pages/Admin";
import AdminLeads from "./pages/AdminLeads";
import AdminSettings from "./pages/AdminSettings";
import AdminAutomation from "./pages/AdminAutomation";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/promote-admin",
    Component: PromoteAdmin,
  },
  {
    path: "/admin",
    Component: Admin,
  },
  {
    path: "/admin/leads",
    Component: AdminLeads,
  },
  {
    path: "/admin/settings",
    Component: AdminSettings,
  },
  {
    path: "/admin/automation",
    Component: AdminAutomation,
  },
]);
