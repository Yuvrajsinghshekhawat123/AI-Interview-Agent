import { useMutation } from "@tanstack/react-query";
import { submitAnswers } from "../01-api/02-interview.js";

export function useSubmitAnswers() {
    // Implementation for submitting answers
    return useMutation({
        mutationFn: submitAnswers
    })
}