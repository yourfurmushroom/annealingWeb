"use client";
import { useState } from "react";
import '../Utils/sha256'
import LoginCard from "./Component/LoginCard";
/* eslint-disable */

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <LoginCard />
  );
}
