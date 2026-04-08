import React from "react";
 
import { Navigate, Outlet } from "react-router-dom";
import { useLoginUserDetails } from "../../03-features/01-user/03-hook/02-useUserLoginDetails";
import { ClipLoader } from "react-spinners";

export default function PrivateRoute() {
    const { data, isLoading } = useLoginUserDetails();
    
  
   if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <ClipLoader color="#2563eb" loading size={50} />
        </div>
      </div>
    );
  }

   
  if (!data) return <Navigate to="/" replace />;
  return <Outlet />;
}
