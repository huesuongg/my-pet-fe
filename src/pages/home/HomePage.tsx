
import HeroSection2 from "./components/HeroSection2";
import { useState } from "react";
import ChatBot from "../../features/chatbot-ai/Chatbot";
import FloatingChatButton from "../../features/chatbot-ai/FloatingChatButton";
import HeroSection from "./components/HeroSection";
import ServiceSection from "./components/ServiceSection";
import ProductSection from "./components/ProductSection";
import TestimonialSection from "./components/TestimonialSection";

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
          backendUrl="https://your-backend.com/chat" // ← endpoint của bạn
          buildPayload={(text, history) => ({ prompt: text, history })}
        />
        <FloatingChatButton onClick={() => setOpen(true)} />
      </>
    </>
  );
};

export default HomePage;
