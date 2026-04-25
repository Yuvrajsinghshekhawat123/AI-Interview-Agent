import { useQuery } from "@tanstack/react-query";
import { interviewHistoryDetailed } from "../01-api/02-interview";
 export function useInterviewHistory() {
  const query = useQuery({
    queryKey: ["interviewHistory"],
    queryFn: async () => {
      const response = await interviewHistoryDetailed();
      return response;
    },
    retry: false,
  });


  return query;
}
