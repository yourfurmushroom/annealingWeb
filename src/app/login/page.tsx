'use client'
import { useState } from "react";
import '../Utils/sha256'

export default function Login()
{
    const [username,setUsername]=useState<string>("")
    const [password,setPassword]=useState<string>("")

    return(
        <div className=" min-h-screen w-full bg-white">
            <div className=" fixed flex items-center w-[70%] h-[70vh] bg-gray-300 justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5">
                <form action={"zihui/api/login"}>
                    
                </form>
            </div>
        </div>
    )

}