import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "./chat.css";


// Define types for the messages
interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false); // State for chat visibility
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("https://60b4-2402-9d80-41e-1860-dc3d-374-7f00-a43b.ngrok-free.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader");
      }

      const decoder = new TextDecoder("utf-8");
      let botResponse = "";

      setIsTyping(false);

      const processLine = (line: string) => {
        if (line != null) {
          const data = JSON.parse(line);
          botResponse += data.response;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            if (newMessages[newMessages.length - 1].sender === "bot") {
              newMessages[newMessages.length - 1].text = botResponse;
            } else {
              newMessages.push({ sender: "bot", text: botResponse });
            }
            return newMessages;
          });
        } else if (line === "event: end") {
          setIsTyping(false);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        lines.forEach(processLine);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
    
  
      {isChatVisible ? (
        <div
        className="chat-container"
        style={{
          justifyContent: "space-between",
          overflowY: "auto",
          width:"378px"
        }}
      >
      <div className="glassy-transparent">
        <button className="darkBtn" onClick={() => setDarkTheme(!darkTheme)}>
          {!darkTheme ? "🌙" : "☀️"}
        </button>
        <button className="closeBtn" onClick={() => setIsChatVisible(!isChatVisible)}>
          {isChatVisible ? "❌" : "⬆️"}
        </button>
      </div>
        <div className={`${darkTheme ? "dark-theme" : ""}`}>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender}`}>
                <div className={`message ${msg.sender}`}>
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node,  className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return  match ? (
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, "")}
         
                            language={match[1]}
                            PreTag="div"
                            
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </div>
              </div>
            ))}
  
            {isTyping && (
              <div className="message-container bot">
                <div className="message bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button className="button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
        </div>
      ) : (
        <button style={{position: "fixed", bottom:"50px",right:"40px",width:"50px",height:"50px"}} className="closeBtn" onClick={() => setIsChatVisible(!isChatVisible)}>
       {isChatVisible ? (
        "❌"
      ) : (
        <i  style={{ fontSize: "50px", color: "#0078d4" ,width:"50px",height:"50px"}} className="fas fa-comment-dots"></i>
      )}
      </button>
      )}
    </div>
  );
};

export default Chat;
