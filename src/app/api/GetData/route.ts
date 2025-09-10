import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message ?? body; // 支援 {message: {...}} 或直接 {...}
    console.log("接收到的請求:", message);

    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    const ws = new WebSocket('ws://localhost:9999');

    return new Promise((resolve) => {
      ws.onopen = () => {
        ws.send(JSON.stringify(message));
      };

      // ✅ 這裡接收 WebSocket server 回傳的資料
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log("WebSocket 回傳:", data);
          ws.close();
          resolve(NextResponse.json({ success: true, data }, { status: 200 }));
        } catch (err) {
          ws.close();
          resolve(NextResponse.json({ error: '回傳資料格式錯誤' }, { status: 500 }));
        }
      };

      ws.onerror = () => {
        ws.close();
        resolve(NextResponse.json({ error: 'WebSocket 连接失败' }, { status: 500 }));
      };

      ws.onclose = () => {
        console.log("WebSocket 已关闭");
      };
    });
  } catch (error) {
    return NextResponse.json({ error: '无效的请求体' }, { status: 400 });
  }
}
