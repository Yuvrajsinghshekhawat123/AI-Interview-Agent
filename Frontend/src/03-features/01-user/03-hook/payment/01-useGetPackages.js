

import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../01-api/03-payment";
 export function useGetPackages()  {
  const query = useQuery({
    queryKey: ["Packages"],
    queryFn: async () => {
      const response = await getPackages();
      return response;
    },
    retry: false,
  });


  return query;
}
