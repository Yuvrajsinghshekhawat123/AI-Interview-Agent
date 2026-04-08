import { useMutation } from "@tanstack/react-query";
import { resumeAnalyze } from "../01-api/01-userLogin";

export function useAnalyzeResume(){
    return useMutation({
        mutationFn:resumeAnalyze
    })
}