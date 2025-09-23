'use client'
/* eslint-disable */
import React, { useEffect, useState, startTransition } from "react";
import Navbar from "../Navbar";
import ShiftArea from "./Component/ShiftArea";
import AttributePanel from "./Component/AttributePanel";
import { useRouter } from 'next/navigation';

interface WorkerData {
  name: string;
  status: string[];
}
interface Constraint {
  name: string;
  parameters: Record<string, any>;
}

export default function Home() {
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(30);
  const [name, setName] = useState<string>("untitled");
  const [isModify, setModify] = useState<boolean>(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [gridStatus, setGridStatus] = useState<string[][]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [ws, setWs] = useState<WebSocket | null>(null);

  const [returnData, setReturnData] = useState<string>("[]");

  useEffect(() => {
    // TODO: 換成你的實際 WS URL
    const socket = new WebSocket(`${window.location.origin.replace(/^http/, 'ws')}/zihui/ws/`);

    socket.onopen = () => {
      console.log("✅ WebSocket 已連線");
    };

    socket.onmessage = (event) => {
      setIsPending(false);
      try {
        const data = JSON.parse(event.data);
        console.log("收到 WS:", data);

        const parsed: WorkerData[] = data["data"];
        setRow(parsed.length);
        setColumn(parsed[0]?.status.length || 0);
        setGridStatus(parsed.map((worker) => [...worker.status]));

        // 存起來給 GenerateWorkerData 使用
        setReturnData(JSON.stringify(parsed));
      } catch (err) {
        console.error("WS 解析失敗:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket 錯誤:", err);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket 已關閉");
    };

    setWs(socket);

    // 離開頁面時關閉連線
    return () => {
      socket.close();
    };
  }, []);

  // 發送資料
  const toWS = (operation: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsPending(true);
      ws.send(
        JSON.stringify({
         ...JSON.parse(operation), schedulename: name, user: "a" ,
        })
      );
    } else {
      console.warn("WS 尚未連線");
    }
  };

  // 保持你的 GenerateWorkerData
  const GenerateWorkerData = (returnData: string) => {
    let parsed: WorkerData[];

    try {
      parsed = JSON.parse(returnData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      parsed = [];
    }

    if (parsed.length < row) {
      const toAdd = row - parsed.length;
      for (let i = 0; i < toAdd; i++) {
        parsed.push({
          name: `Worker ${parsed.length + 1}`,
          status: Array(column).fill("上班"),
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
        status.push(...Array(column - status.length).fill("上班"));
      }
      return { ...worker, status };
    });
    return parsed;
  };

  const refresh = (parsed: WorkerData[]) => {
    const initialStatus = Array(row)
      .fill(null)
      .map(() => Array(column).fill("上班"));

    parsed.forEach((worker, rowIndex) => {
      if (rowIndex < row) {
        worker.status.forEach((status, colIndex) => {
          if (colIndex < column) {
            initialStatus[rowIndex][colIndex] = status;
          }
        });
      }
    });

    setGridStatus(initialStatus);
  };

  // 初始 gridStatus (避免空白)
  useEffect(() => {
    const parsed: WorkerData[] = GenerateWorkerData(returnData);
    const initialStatus = Array(row)
      .fill(null)
      .map(() => Array(column).fill("上班"));

    parsed.forEach((worker, rowIndex) => {
      if (rowIndex < row) {
        worker.status.forEach((status, colIndex) => {
          if (colIndex < column) {
            initialStatus[rowIndex][colIndex] = status;
          }
        });
      }
    });

    setGridStatus(initialStatus);
  }, [row, column]);

  return (
    <>
      <div className=" w-full flex gap-x-20 bg-gray-100">
        {isPending && (
          <div className="fixed top-[5vh] left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[100] flex items-center justify-center">
            <div className=" w-[20%] h-[30vh] bg-white text-black text-2xl rounded-4xl flex justify-center items-center">
              <div className="animate-pulse">計算中...</div>
            </div>
          </div>
        )}
        <div className="w-[50%] mt-5 h-fit ml-20">
          <ShiftArea
            constraints={constraints}
            setConstraints={setConstraints}
            gridStatus={gridStatus}
            setGridStatus={setGridStatus}
            isModify={isModify}
            setModify={setModify}
            refresh={() => refresh(GenerateWorkerData(returnData))}
            toWs={(e) => {
              startTransition(() => {
                toWS(e);
              });
            }}
            name={name}
            column={column}
            data={GenerateWorkerData(returnData)}
          ></ShiftArea>
        </div>
        <div className=" w-[100%] mt-5 h-fit">
          <AttributePanel
            constraints={constraints}
            setConstraints={setConstraints}
            gridStatus={gridStatus}
            setRow={setRow}
            setColumn={setColumn}
            row={row}
            column={column}
          ></AttributePanel>
        </div>
      </div>
    </>
  );
}
