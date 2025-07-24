'use client'
import React, { startTransition, useActionState, useEffect, useState } from "react";
import Navbar from "./Component/Navbar";
import ShiftArea from "./Component/ShiftArea";
import AttributePanel from "./Component/AttributePanel";
import {useRouter}  from 'next/navigation';

async function Dummy(item: string): Promise<string> {
    console.log(item)
    return new Promise((resolve) => {
        setTimeout(() => resolve('[{"name":"aaa","status":["上班","休息"]},{"name":"bbb","status":["上班","上班"]}]'), 10000);
    });
}

interface WorkerData {
    name: string;
    status: string[];
}

export default function Home() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageName, setPageName, isLoaded] = useActionState((prev: string, nextPage: string) => {
        return nextPage
    }, 'Dashboard')
    useEffect(()=>{
        console.log(pageName)
        if(pageName === "Dashboard")
        {
            router.push("/dashboard")
        }
        else if(pageName==="Digital")
        {
            router.push("/digitalAnnealing")
        }
    },[pageName])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [row, setRow] = useState<number>(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [column, setColumn] = useState<number>(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [name, setName] = useState<string>("untitled")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isModify, setModify] = useState<boolean>(false)


    const [returnData, toWS, isPending] = useActionState(async (prev: string, operation: string) => {
        const res = await Dummy(operation);
        return res;
    }, '[{"name":"aaa","status":["上班","休息"]},{"name":"bbb","status":["上班","上班"]}]')

    const GenerateWorkerData = (returnData: string) => {
        let parsed: WorkerData[];

        try {
            parsed = JSON.parse(returnData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            parsed = [];
        }

        if (parsed.length < row) {
            const toAdd = row - parsed.length;
            for (let i = 0; i < toAdd; i++) {
                parsed.push({
                    name: `Worker ${parsed.length + 1}`,
                    status: Array(column).fill('上班'),
                });
            }
        } else if (parsed.length > row) {
            parsed = parsed.slice(0, row);
        }

        parsed = parsed.map((worker) => {
            const status = [...worker.status];
            if (status.length > column) {
                status.length = column;
            } else if (status.length < column) {
                status.push(...Array(column - status.length).fill('上班'));
            }
            return { ...worker, status };
        });
        return parsed
    }

    const refresh = (parsed: WorkerData[]) => {
        const initialStatus = Array(row).fill(null).map(() => Array(column).fill('上班'));

        parsed.forEach((worker, rowIndex) => {
            if (rowIndex < row) {
                worker.status.forEach((status, colIndex) => {
                    if (colIndex < column) {
                        initialStatus[rowIndex][colIndex] = status;
                    }
                });
            }
        });

        setGridStatus(initialStatus)

    }

    const [gridStatus, setGridStatus] = useState<string[][]>(() => {
        const parsed: WorkerData[] = GenerateWorkerData(returnData);
        const initialStatus = Array(row).fill(null).map(() => Array(column).fill('上班'));

        parsed.forEach((worker, rowIndex) => {
            if (rowIndex < row) {
                worker.status.forEach((status, colIndex) => {
                    if (colIndex < column) {
                        initialStatus[rowIndex][colIndex] = status;
                    }
                });
            }
        });

        return initialStatus;
    });

    useEffect(() => {
    setGridStatus((prev) => {
        const newGrid = [...prev];

        // 補足 row 數
        while (newGrid.length < row) {
            newGrid.push(Array(column).fill('上班'));
        }

        // 裁剪多餘的 row
        if (newGrid.length > row) {
            newGrid.length = row;
        }

        // 補足/裁剪 column
        for (let i = 0; i < newGrid.length; i++) {
            if (newGrid[i].length < column) {
                newGrid[i] = [...newGrid[i], ...Array(column - newGrid[i].length).fill('上班')];
            } else if (newGrid[i].length > column) {
                newGrid[i] = newGrid[i].slice(0, column);
            }
        }

        return newGrid;
    });
}, [row, column]);

    return (
        <>
            <div>
                <Navbar setPageName={(e: string) => setPageName(e)}></Navbar>
            </div>
            <div className=" w-full flex gap-x-20 bg-gray-100">
                {isPending && (
                    <div className="fixed top-[5vh] left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[100] flex items-center justify-center">
                        <div className=" w-[20%] h-[30vh] bg-white text-black text-2xl rounded-4xl flex justify-center items-center"><div className="animate-pulse">計算中...</div></div>
                    </div>
                )}
                <div className="w-[50%] mt-5 h-fit ml-20">
                    <ShiftArea gridStatus={gridStatus} setGridStatus={setGridStatus} isModify={isModify} setModify={setModify} refresh={() => refresh(GenerateWorkerData(returnData))} toWs={(e) => { startTransition(() => { toWS(e) }) }} name={name} column={column} data={GenerateWorkerData(returnData)}></ShiftArea>
                </div>
                <div className=" w-[100%] mt-5 h-fit">
                    <AttributePanel gridStatus={gridStatus} setRow={setRow} setColumn={setColumn} row={row} column={column}></AttributePanel>
                </div>

            </div>
        </>
    );
}
