import React, { useEffect, useState } from "react";
import "../assets/style/Chatbot.css";
import { SendHorizontal } from "lucide-react";
import API from "../utils/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  fetchWorkout,
  fetchAchievements,
  fetchPlans,
  chatBotPrompt,
} from "../services/Helpers";
import { FormatResponse } from "../components/FormatResponse";

const Chatbot = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendloading, setsendLoading] = useState(false);
  const [responseloading, setResponseLoading] = useState(false);
  const [dumloading, setDumLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWorkout(setDumLoading, setWorkouts);
      await fetchAchievements(setDumLoading, setAchievements);
      await fetchPlans(setDumLoading, setPlans);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const aiData = {
    currentUser,
    workoutPlans: workouts,
    achievements,
    schedule: plans,
    userMessage: input,
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setsendLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    const prompt = chatBotPrompt(aiData);
    setsendLoading(false);
    setResponseLoading(true);
    try {
      const res = await API.post("/chatBot/question", { prompt });
      const aiReply =
        res.data?.data || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error generating response." },
      ]);
    } finally {
      setResponseLoading(false);
    }
  };

  if (loading) return <Loader size="70" style={{ height: "70vh" }} />;

  return (
    <div className="chat-bot-here-wrapper">
      <div className="chat-bot-here-messages">
        <div className="chat-bot-here-message chat-bot-here-ai">
          Hey there 👋 <br />
          How can I assist you today?
        </div>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bot-here-message ${
              msg.role === "ai" ? "chat-bot-here-ai" : "chat-bot-here-user"
            }`}
          >
            <FormatResponse text={msg.content} />
          </div>
        ))}
        {responseloading && (
          <div className="chat-bot-here-message chat-bot-here-ai">
            <Loader size="20" />
          </div>
        )}
      </div>

      <div className="chat-bot-here-input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-bot-here-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          disabled={sendloading || responseloading}
          className="chat-bot-here-send-btn"
        >
          {sendloading ? (
            <Loader color="white" size="16" />
          ) : (
            <SendHorizontal size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
