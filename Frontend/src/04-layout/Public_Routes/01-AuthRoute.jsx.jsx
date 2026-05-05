//📌 AuthRoute.jsx (hide auth pages for logged-in users)
import { Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useLoginUserDetails } from "../../03-features/01-user/03-hook/02-useUserLoginDetails";
 

export function AuthRoute() {
     useLoginUserDetails();
    
  
   

   

  return <Outlet />;
}
