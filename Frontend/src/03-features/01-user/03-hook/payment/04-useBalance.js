
import { useQuery } from "@tanstack/react-query";
import { balance } from "../../01-api/03-payment";
 export function useBalance()  {
  const query = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const response = await balance();
      return response;
    },
    retry: false,
  });


  return query;
}
