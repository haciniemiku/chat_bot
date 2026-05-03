import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "请输入要发送的消息" },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: body.message }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "");

      return NextResponse.json(
        { error: errorText || "后端流式服务暂时不可用" },
        { status: response.status || 502 },
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "无法连接到后端服务，请确认 FastAPI 已在 8000 端口运行" },
      { status: 502 },
    );
  }
}
