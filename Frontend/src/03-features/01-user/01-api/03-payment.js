import axiosClient from "./00-axiosClient";

export async function getPackages() {
    const resp=await axiosClient.get("/payment/packages");
    return resp.data;
}   
export async function getPurchasedPackages() {
    const resp=await axiosClient.get("/payment/getPurchasedPackages");
    return resp.data;
}   
export async function createOrder(data) {
    const resp=await axiosClient.post("/payment/create-order",data);
    return resp.data;
}   
export async function verifyPayment(data) {
    const resp=await axiosClient.post("/payment/verify-payment",data);
    return resp.data;
}   


export async function balance() {
    const resp=await axiosClient.get("/payment/balance");
    return resp.data;
}


export async function history() {
    const resp=await axiosClient.get("/payment/history");
    return resp.data;
}

