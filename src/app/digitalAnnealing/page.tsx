'use client'
/* eslint-disable */
import React, { useActionState, useEffect, useRef } from "react";
import Navbar from "../dashboard/Component/Navbar";
import { useRouter } from 'next/navigation';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [pageName, setPageName, isLoaded] = useActionState((prev: string, nextPage: string) => {
        return nextPage
    }, 'Digital')
    useEffect(() => {
        console.log(pageName)
        if (pageName === "Dashboard") {
            router.push("/dashboard")
        }
        else if (pageName === "Digital") {
            router.push("/digitalAnnealing")
        }
    }, [pageName])
    useEffect(() => {
        const loadUnity = async () => {
            const buildUrl = "/zihui/digitalAnnealing/Build";
            const loaderUrl = buildUrl + "/digitalAnnealing.loader.js";

            const config = {
                dataUrl: buildUrl + "/digitalAnnealing.data",
                frameworkUrl: buildUrl + "/digitalAnnealing.framework.js",
                codeUrl: buildUrl + "/digitalAnnealing.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "DefaultCompany",
                productName: "digitalAnnealing",
                productVersion: "1.0",
                showBanner: (msg: string, type: string) => {
                    console.warn(`[Unity ${type}]: ${msg}`);
                },
            };

            const script = document.createElement("script");
            script.src = loaderUrl;
            script.onload = () => {
                // @ts-ignore
                createUnityInstance(canvasRef.current, config, (progress: number) => {
                    console.log(`Loading: ${Math.round(progress * 100)}%`);
                }).then((unityInstance: any) => {
                    console.log("Unity loaded!");
                }).catch((err: any) => {
                    console.error("Unity error:", err);
                });
            };
            document.body.appendChild(script);
        };

        loadUnity();
    }, []);

    return (
        <>
            <Navbar setPageName={(e) => setPageName(e)}></Navbar>
            <div id="unity-container" className="unity-desktop">
                <canvas
                    ref={canvasRef}
                    id="unity-canvas"
                    width={1024}
                    height={768}
                    style={{ background: "#231F20" }}
                    tabIndex={-1}
                ></canvas>
            </div>
        </>
    );
}
