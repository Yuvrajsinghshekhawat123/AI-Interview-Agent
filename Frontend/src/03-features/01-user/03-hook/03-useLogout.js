import { useMutation } from "@tanstack/react-query";
import { LogutUser } from "../01-api/01-userLogin";


export function useLogout(){
    return useMutation({
        mutationFn:LogutUser
    })
}