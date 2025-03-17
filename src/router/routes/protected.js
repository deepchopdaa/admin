import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    return token ? (
        <div className="app-content content overflow-hidden">
            <div className="content-overlay"></div>
                <div className="container-xxl p-0">
                    {children}
                </div>
     
        </div>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;
