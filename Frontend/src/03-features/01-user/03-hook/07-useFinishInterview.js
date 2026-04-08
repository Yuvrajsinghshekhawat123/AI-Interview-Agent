import { useMutation } from "@tanstack/react-query";
import { finishInterview } from "../01-api/02-interview.js";

export function useFinishInterview() {
    // Implementation for finishing interview
    return useMutation({
        mutationFn: finishInterview
    })
}