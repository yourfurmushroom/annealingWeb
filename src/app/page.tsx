'use client'
import React, { useActionState, useEffect, useState} from "react";
import Link from 'next/link';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bgMode, setBgMode, isChange] = useActionState(
    (prev: string) => (prev === "light" ? "dark" : "light"),
    "light"
  );


  // ⬇️ 加上這段來實際切換 dark mode class 到 <html>
  useEffect(() => {
    const html = document.documentElement;
    if (bgMode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [bgMode]);

  return (
  <>
    welcome
    <Link
      href="/dashboard"
      className="text-[50px] text-blue-500 hover:scale-150 ease-in-out duration-200"
    >
      click to dashboard
    </Link>
  </>
);
}
