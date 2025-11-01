import HeroSection2 from "./components/HeroSection2";
import { useState } from "react";
import ChatBot from "../../features/chatbot-ai/Chatbot";
import FloatingChatButton from "../../features/chatbot-ai/FloatingChatButton";
import HeroSection from "./components/HeroSection";
import ServiceSection from "./components/ServiceSection";
import ProductSection from "./components/ProductSection";
import TestimonialSection from "./components/TestimonialSection";
import type { ChatbotResponse } from "../../features/chatbot-ai/chatbotAPI";

export const HomePage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeroSection />
      <ServiceSection />
      <HeroSection2 />
      <ProductSection />
      <TestimonialSection />
      <>
        <ChatBot
          open={open}
          onClose={() => setOpen(false)}
          backendUrl="https://my-pet-api.onrender.com/api/chatbot"
          buildPayload={(text) => ({
            prompt: text, // Backend expect 'prompt' field
          })}
          pickText={(response: unknown) => {
            // Backend trả về { answer: string } với HTML formatted
            if (typeof response === "object" && response !== null && "answer" in response) {
              const chatbotResp = response as ChatbotResponse;
              return chatbotResp.answer || "";
            }
            // Fallback cho các format khác
            if (typeof response === "object" && response !== null) {
              const obj = response as { reply?: string; response?: string; message?: string };
              return obj.reply || obj.response || obj.message || JSON.stringify(response);
            }
            // Nếu response là string
            if (typeof response === "string") {
              return response;
            }
            // Final fallback
            return JSON.stringify(response);
          }}
        />
        <FloatingChatButton onClick={() => setOpen(true)} />
      </>
    </>
  );
};

export default HomePage;
