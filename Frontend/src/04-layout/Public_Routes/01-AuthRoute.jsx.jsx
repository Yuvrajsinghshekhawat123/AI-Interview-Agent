//📌 AuthRoute.jsx (hide auth pages for logged-in users)
import { Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useLoginUserDetails } from "../../03-features/01-user/03-hook/02-useUserLoginDetails";
 

export function AuthRoute() {
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

   

  return <Outlet />;
}
