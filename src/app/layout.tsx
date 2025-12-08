'use client'
/* eslint-disable */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const [pageName, setPageName, isLoaded] = useActionState((prev: string, nextPage: string) => {
    return nextPage
  }, '')

  useEffect(() => {
    console.log(pageName)
    if (pageName === "Dashboard") {
      router.push("/")
    }
    else if (pageName === "Digital") {
      router.push("/digitalAnnealing")
    }
    else if (pageName === "TSP") {
      router.push("/TSP")
    }
    else if (pageName === "Login") {
      router.push("/login")
    }
    else if (pageName === "Register") {
      router.push("/register")
    }
  }, [pageName])
  return (
    <html lang="en">
      <head>
        <title>oh</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar setPageName={setPageName}></Navbar>
        {children}
      </body>
    </html>
  );
}
