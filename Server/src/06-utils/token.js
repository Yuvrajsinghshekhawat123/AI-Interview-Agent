import jwt from "jsonwebtoken"

export function setAccessTokenCookies(res,payload){
    const access_Token=jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1m"});

    res.cookie("access_Token",access_Token,{
        httpOnly:true,
        secure:false,
        sameSite:"Lax",
        path: "/",
        maxAge:  60 * 1000 
    })

    return access_Token;
}



 export  function setRefreshTokenCookie(res,payload) {
    const  refresh_Token=jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:"20h"}); // token validity in JWT

    res.cookie("refresh_Token", refresh_Token,{
        httpOnly:true,
        secure: false, // only over HTTPS in production,
         sameSite: "Lax", // "strict" blocks cross-origin, so use "none"
         path: "/",
         maxAge:  24 * 60 * 60 * 1000 // 1 day in ms  , Cookie expires in 24h , JWT itself expires in 20h
    });

    return  refresh_Token;
};