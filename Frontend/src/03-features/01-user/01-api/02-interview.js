import axiosClient from "./00-axiosClient";



export async function generateQuestions(data) {
    const resp=await axiosClient.post("/interview/generate-questions", data);
    return resp.data;
}


export async function submitAnswers(data) {
    const resp=await axiosClient.post("/interview/submit-answers", data);
    return resp.data;
}


export async function finishInterview(data) {
    const resp=await axiosClient.post("/interview/finish-interview", data);
    return resp.data;
}