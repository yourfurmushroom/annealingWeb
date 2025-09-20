"use client";
/* eslint-disable */
import { useState } from "react";
import "../Utils/sha256";
import InputForm from "./Component/InputForm"

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="fixed bg-white w-[50%] h-[70vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 overflow-hidden shadow-lg">
      <div className="px-[20%] py-15">
        <h1 className="text-gray-700 text-[40px] font-bold">註冊</h1>
        <p className="text-gray-700">體驗就從現在開始</p>
        <InputForm />
      </div>
    </div>
  );
}
