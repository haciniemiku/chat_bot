"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  UserRound,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestions = [
  "帮我把这段话改得更正式一些",
  "用三句话解释一下这个项目的后端 API",
  "给我一个学习 Next.js 的小计划",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const characterCount = input.trim().length;

  const statusText = useMemo(() => {
    if (isLoading) return "AI 正在流式输出";
    if (error) return "连接需要检查";
    return "后端 API: /chat";
  }, [error, isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(messageText = input) {
    const content = messageText.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    const assistantMessageId = crypto.randomUUID();

    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "请求失败");
      }

      if (!response.body) {
        throw new Error("浏览器没有拿到响应流");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: message.content + chunk,
                }
              : message,
          ),
        );
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "请求失败";

      setError(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === assistantMessageId
            ? {
                ...item,
                content: message,
              }
            : item,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-zinc-950 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">LLM 智能助手</h1>
              <p className="text-sm text-zinc-500">
                基于后端 FastAPI 与模型服务的流式对话界面
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm",
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : error ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>{statusText}</span>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setMessages([]);
                setError("");
              }}
              disabled={!hasMessages && !error}
            >
              <RotateCcw className="h-4 w-4" />
              清空
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-5 py-5 lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r border-zinc-200/80 pr-5 lg:block">
            <div className="sticky top-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-zinc-900">快捷问题</p>
                <div className="mt-3 space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendMessage(suggestion)}
                      disabled={isLoading}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-3 text-left text-sm leading-5 text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquareText className="h-4 w-4" />
                  使用状态
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-zinc-500">消息数</dt>
                    <dd className="font-medium">{messages.length}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-zinc-500">输入字数</dt>
                    <dd className="font-medium">{characterCount}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-zinc-500">响应方式</dt>
                    <dd className="font-medium">Stream</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          <div className="flex min-h-[calc(100vh-150px)] flex-col overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {!hasMessages ? (
                <div className="flex min-h-[460px] items-center justify-center">
                  <div className="max-w-lg text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-zinc-950 text-white">
                      <Bot className="h-7 w-7" />
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold">
                      开始一次新的对话
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      输入问题后会通过 Next.js 代理请求后端 /chat 接口，回复会边生成边显示。
                    </p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-3">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => void sendMessage(suggestion)}
                          className="rounded-md border border-zinc-200 px-3 py-3 text-left text-sm leading-5 text-zinc-700 transition hover:bg-zinc-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          message.role === "user"
                            ? "bg-zinc-950 text-white"
                            : "bg-[#dcebd8] text-zinc-900",
                        )}
                      >
                        {message.role === "user" ? (
                          <UserRound className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[82%] rounded-md px-4 py-3 shadow-sm",
                          message.role === "user"
                            ? "bg-zinc-950 text-white"
                            : "border border-zinc-200 bg-zinc-50 text-zinc-900",
                        )}
                      >
                        {message.content ? (
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.content}
                          </p>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            正在建立流式连接
                          </span>
                        )}
                        <time
                          className={cn(
                            "mt-2 block text-xs",
                            message.role === "user" ? "text-zinc-300" : "text-zinc-500",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </time>
                      </div>
                    </article>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-zinc-200 bg-white p-3 sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题，按 Enter 发送"
                  disabled={isLoading}
                  maxLength={1000}
                  className="min-h-24 flex-1"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !input.trim()}
                  className="h-12 sm:h-auto sm:w-28"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                  发送
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>Shift + Enter 换行</span>
                <span>{input.length}/1000</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
