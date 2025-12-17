import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import InputArea from "./components/InputArea";
import MatrixBackground from "./components/MatrixBackground";
import { TeachingStyle, Message } from "./types";
import { sendMessageStream, resetChatSession } from "./services/geminiService";
import { Menu, X } from "lucide-react";

const App: React.FC = () => {
  const [style, setStyle] = useState<TeachingStyle>(TeachingStyle.StepByStep);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isStreamingRef = useRef(false);

  useEffect(() => {
    resetChatSession();
  }, []);

  const handleSendMessage = async (text: string, image: string | null) => {
    if (isStreamingRef.current) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      image: image || undefined,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    setIsLoading(true);
    isStreamingRef.current = true;

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: Message = {
      id: botMsgId,
      role: "model",
      content: "",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, initialBotMsg]);

    try {
      // ✅ IMPORTANT FIX: await the stream
      const stream = await sendMessageStream(
        messages,
        text,
        image,
        style
      );

      let fullContent = "";

      for await (const chunk of stream) {
        fullContent += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMsgId
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }

      if (!fullContent) {
        throw new Error("No response received from AI.");
      }

    } catch (error: any) {
      console.error("Chat Error:", error);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMsgId
            ? {
                ...msg,
                content: error.message || "Connection error.",
                isError: true
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      isStreamingRef.current = false;
    }
  };

  const handleClearChat = () => {
    if (isStreamingRef.current) return;
    setMessages([]);
    resetChatSession();
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden relative font-sans text-slate-200">
      <MatrixBackground />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl lg:shadow-none h-full`}
      >
        <Sidebar
          style={style}
          setStyle={setStyle}
          onClearChat={handleClearChat}
        />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-200 rounded-full lg:hidden hover:bg-slate-700 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full h-full relative z-10">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <h1 className="font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Linear Algebra Tutor
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <ChatInterface messages={messages} isLoading={isLoading} />

        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default App;
