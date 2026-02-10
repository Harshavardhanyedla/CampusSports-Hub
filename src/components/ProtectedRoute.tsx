import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    if (!isAdminAuthenticated) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
