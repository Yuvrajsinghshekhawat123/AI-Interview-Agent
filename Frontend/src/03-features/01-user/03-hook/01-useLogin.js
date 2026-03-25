
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../01-api/01-userLogin";

export function useLogin(){
     
    return useMutation({
        mutationFn:loginUser
         
    });
}
