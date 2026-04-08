import { useMutation } from "@tanstack/react-query";
import { generateQuestions } from "../01-api/02-interview";

export function useGenerateQuestions() {
    // Implementation for generating questions
    return useMutation({
        mutationFn:generateQuestions
    })
}