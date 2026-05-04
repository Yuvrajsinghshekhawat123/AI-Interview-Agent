import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../../01-api/03-payment";

export function useCreateOrder(){
     
    return useMutation({
        mutationFn:createOrder
         
    });
}
