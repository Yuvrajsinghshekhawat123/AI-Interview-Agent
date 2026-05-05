import React from "react";
 
import { Navigate, Outlet } from "react-router-dom";
import { useLoginUserDetails } from "../../03-features/01-user/03-hook/02-useUserLoginDetails";
import { ClipLoader } from "react-spinners";

import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, isFetching } = useLoginUserDetails();

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ClipLoader color="#2563eb" loading size={50} />
      </div>
    );
  }

  if (!user && !data?.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
