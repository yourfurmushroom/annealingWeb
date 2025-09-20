import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const message = body.message ?? body;
    console.log("接收到的請求:", message);

    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    const ws = new WebSocket('ws://localhost:9999');

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) ws.close();
        resolve(NextResponse.json({ error: 'WebSocket 超时' }, { status: 504 }));
      }, 10000);

      ws.onopen = () => {
        ws.send(JSON.stringify(message));
      };

      ws.onmessage = (event) => {
        clearTimeout(timer);
        try {
          const data = JSON.parse(event.data.toString());
          console.log("WebSocket 回傳:", data);
          ws.close();
          resolve(NextResponse.json({ success: true, data }, { status: 200 }));
        } catch {
          ws.close();
          resolve(NextResponse.json({ error: '回傳資料格式錯誤' }, { status: 500 }));
        }
      };

      ws.onerror = () => {
        clearTimeout(timer);
        ws.close();
        resolve(NextResponse.json({ error: 'WebSocket 连接失败' }, { status: 500 }));
      };

      ws.onclose = () => {
        console.log("WebSocket 已关闭");
      };
    });
  } catch {
    return NextResponse.json({ error: '无效的请求体' }, { status: 400 });
  }
}
