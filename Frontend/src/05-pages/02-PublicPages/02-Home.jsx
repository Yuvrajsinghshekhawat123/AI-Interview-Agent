import React from "react";
import { useLoginUserDetails } from "../../03-features/01-user/03-hook/02-useUserLoginDetails";
import { useSelector } from "react-redux";
 

export default function Home() {
  const user = useSelector((state) => state.user.user);
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
    </div>
  );
}
