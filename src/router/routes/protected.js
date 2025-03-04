import { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Dummy authentication function (replace with actual logic)
const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Example using localStorage
};


const ProtectedRoute = ({ children }) => {
    useEffect(()=>{
        return () => {
            document.body.classList.add("app-content content overflow-hidden"); // Restore class when leaving
          };
    })
    console.log(children)
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
