import { useQuery } from "@tanstack/react-query";
import { LoginUserDetails } from "../01-api/01-userLogin";
import { useDispatch } from "react-redux";
import {setUser } from "../../../00-app/01-userSlice";
 




//  useEffect works only inside components or custom hooks — not normal functions
 export function useLoginUserDetails() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      console.log("API call initiated");

      const response = await LoginUserDetails();

      // ✅ ONLY dispatch here
      dispatch(setUser(response.user));

      return response;
    },
    retry: false,
  });

  // ❌ REMOVE BOTH useEffects

  return query;
}




