import React from "react";
import "../assets/style/Chatbot.css";
import { SendHorizontal } from "lucide-react"

const Chatbot = () => {
  return (
    <div className="chat-bot-here-wrapper">
      <div className="chat-bot-here-messages">
        <div className="chat-bot-here-message chat-bot-here-ai">
          Hello! How can I help you today?
        </div>
        <div className="chat-bot-here-message chat-bot-here-user">
          Tell me about my fitness progress.
        </div>
      </div>
      <div className="chat-bot-here-input-section">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-bot-here-input"
        />
        <button className="chat-bot-here-send-btn">
          <span className="icon">
            <SendHorizontal size={20}/>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
