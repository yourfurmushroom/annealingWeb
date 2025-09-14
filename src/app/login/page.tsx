"use client";
import { useState } from "react";
import '../Utils/sha256'
import { useFormStatus } from "react-dom";
import "../Utils/sha256";
import LoginCard from "./Component/LoginCard";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <LoginCard />
  );
}
