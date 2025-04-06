import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const isAuthenticated = () => {
    // ... your authentication logic here, e.g., checking localStorage or context
    return Boolean(true);
};

const RequireAuth = ({ children }) => {
    let location = useLocation();

    if (!isAuthenticated()) {
        // This will display a toast notification prompting the user to log in
        toast.info('Please login to continue', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        // Redirect them to the login page and pass along the current location in state
        // so we can send them back to the page they tried to visit after they login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;