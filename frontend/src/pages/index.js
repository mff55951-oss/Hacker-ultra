
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'হ্যালো ইয়াসিন! আমি Nexus AI Ultimate। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);

  // চ্যাট হ্যান্ডেল করার ফাংশন
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const newChat = { role: 'user', content: message };
    setChatHistory([...chatHistory, newChat]);
    setMessage("");

    // এখানে পরবর্তীতে আমরা ব্যাকএন্ড এপিআই কল করবো
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      <Head>
        <title>Nexus AI Ultimate | Developed by MD EYASIN</title>
      </Head>

      {/* টপ নেভিগেশন বার */}
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center bg-[#161b22]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          NEXUS AI PRO
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Status: <span className="text-emerald-500">Online</span></span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">EY</div>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl p-4 h-[calc(100vh-120px)] flex flex-col">
        {/* চ্যাট এরিয়া */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-hide">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${
                chat.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-[#21262d] text-gray-200 rounded-tl-none border border-gray-700'
              }`}>
                <p className="text-sm leading-relaxed">{chat.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ইনপুট বক্স */}
        <div className="p-4 bg-[#161b22] rounded-2xl border border-gray-800 shadow-2xl mt-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার প্রশ্নটি এখানে লিখুন..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* ফুটার/এডমিন কুইক এক্সেস */}
      <footer className="text-center py-2 text-[10px] text-gray-600">
        &copy; 2026 Nexus AI Ultimate | Managed by MD EYASIN
      </footer>
    </div>
  );
}
