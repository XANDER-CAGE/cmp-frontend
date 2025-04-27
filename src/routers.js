import { Navigate } from "react-router-dom";
import Login from "./pages/login";
import OAuthCallback from "./pages/oauth-callback";


export const loginRoutes = [
    { path: "/login", element: <Login /> },
	{ path: "/oauth-callback", element: <OAuthCallback /> },
    { path: '*', element: <Navigate to='/login' /> },
]