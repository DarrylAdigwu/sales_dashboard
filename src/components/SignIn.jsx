import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn(){
  const { session } = useAuth()
  console.log(session)

  return(
    <>
      <h1 className="landing-header" style={{color: "black"}}>We here</h1>
    </>
  )
}