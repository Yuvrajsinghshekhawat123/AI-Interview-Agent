
import axiosClient from "./00-axiosClient";


 export async function loginUser(token) {
  const resp = await axiosClient.post(
    "/auth/login",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ use passed token
      },
    }
  );

  return resp.data;
}



//get user deteails after login 
export async function LoginUserDetails() {
    const response =await axiosClient.get("/userDetails");
    return response.data;
}


export async function LogutUser() {
    const response=await axiosClient.post("/logout");
    return response.data;
}



export async function resumeAnalyze(data) {
    const response=await axiosClient.post("/analyze-resume",data,{
      headers: {
      "Content-Type": "multipart/form-data",
    },
    });
    return response.data;
}
