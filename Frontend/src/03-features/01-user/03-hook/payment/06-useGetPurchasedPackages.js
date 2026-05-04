import { useQuery } from "@tanstack/react-query";
import { getPurchasedPackages } from "../../01-api/03-payment";

 export function useGetPurchasedPackages()  {
  const query = useQuery({
    queryKey: ["purchasedpackages"],
    queryFn: async () => {
      const response = await getPurchasedPackages();
      return response;
    },
    retry: false,
  });


  return query;
}
