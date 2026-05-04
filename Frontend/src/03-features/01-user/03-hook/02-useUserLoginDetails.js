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
      try {
        const response = await LoginUserDetails();

        dispatch(setUser(response.user)); // ✅ only on success

        return response;
      } catch (error) {
        // 🔥 VERY IMPORTANT
        dispatch(setUser(null)); // clear user

        throw error; // let react-query handle it
      }
    },
    retry: false,
    refetchOnWindowFocus: false, // 🔥 prevent auto refetch
  });

  return query;
}



