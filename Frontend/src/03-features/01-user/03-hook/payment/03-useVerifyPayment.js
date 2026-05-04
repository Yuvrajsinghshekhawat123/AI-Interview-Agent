import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../../01-api/03-payment";

export function useVerifyPayment(){
     
    return useMutation({
        mutationFn:verifyPayment
         
    });
}
