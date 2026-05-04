
import { useQuery } from "@tanstack/react-query";
import {  history } from "../../01-api/03-payment";
 export function useHistory()  {
  const query = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await history();
      return response;
    },
    retry: false,
  });


  return query;
}
