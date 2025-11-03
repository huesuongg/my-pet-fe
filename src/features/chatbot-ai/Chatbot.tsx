import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import styles from "./chatBot.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";


import botAvatar from "../../assets/bot.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


// --- types ---
export type Message = {
  id: string | number;
  role: "bot" | "user" | "system";
  text: string;
  avatar?: string; // url
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  backendUrl?: string;
  buildPayload?: (userText: string, history: Message[]) => unknown; // << was any
  pickText?: (resp: unknown) => string; // << was any
};

type QuotableResponse = { content: string; author?: string };

// type guard cho quotable
function isQuotable(x: unknown): x is QuotableResponse {
  return typeof x === "object" && x !== null && "content" in x;
}

const DEFAULT_SEED: Message[] = [
  { id: 1, role: "bot", text: "Xin chào 👋\nMình có thể giúp gì cho bạn ạạ?", avatar: botAvatar },
];

const ChatBot: React.FC<Props> = ({
  open,
  onClose,
  title = "Chatbot",
  backendUrl,
  buildPayload,
  pickText,
}) => {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_SEED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
    
  const userAvatar = user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages.length, loading]);

  useEffect(() => {
    // huỷ request khi đóng modal
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const containerClass = useMemo(
    () => `${styles.chatbox} ${open ? styles.open : styles.closed}`,
    [open]
  );

  const fetchBotReply = useCallback(
    async (userText: string, history: Message[]) => {
      setLoading(true);
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        let data: unknown; // << was any

        if (backendUrl) {
          const payload = buildPayload?.(userText, history) ?? {
            message: userText,
            history: history.slice(-10),
          };
          const res = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: ac.signal,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = (await res.json()) as unknown;
        } else {
          const res = await fetch("https://api.quotable.io/random", {
            signal: ac.signal,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = (await res.json()) as unknown;
        }

        const text =
          pickText?.(data) ??
          (isQuotable(data)
            ? `“${data.content}” — ${data.author ?? "Anonymous"}`
            : typeof data === "string"
              ? data
              : JSON.stringify(data));

        return text || "Hmm, I couldn’t find a good answer this time.";
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError")
          return undefined;
        return "Sorry, something went wrong fetching the response.";
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, buildPayload, pickText]
  );

  async function handleSend() {
    const txt = input.trim();
    if (!txt || loading) return;

    const userMsgId = Date.now();

    // append user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        text: txt,
        avatar: userAvatar,
      },
    ]);
    setInput("");

    // optimistic typing indicator cho bot
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        role: "bot",
        text: "...",
        avatar: botAvatar,
      },
    ]);

    const reply = await fetchBotReply(
      txt,
      messages.concat({
        id: userMsgId,
        role: "user",
        text: txt,
        avatar: userAvatar,
      })
    );

    if (reply === undefined) {
      // bị abort khi đóng modal
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      return;
    }

    // replace typing với real reply
    setMessages((prev) =>
      prev
        .filter((m) => m.id !== typingId)
        .concat({
          id: `bot-${Date.now()}`,
          role: "bot",
          text: reply,
          avatar: botAvatar,
        })
    );
  }

  if (!open) return null;

  return (
    <section
      className={containerClass}
      role="dialog"
      aria-modal="true"
      aria-label="AI Chatbot"
    >
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button
          className={styles.closeBtn}
          aria-label="Close chat"
          onClick={onClose}
        >
          <CloseRoundedIcon fontSize="small" />
        </button>
      </header>

      <div className={styles.body} ref={listRef}>
        {messages.map((m) => {
          const isUser = m.role === "user";
          const isTyping = m.text === "...";
          return (
            <div
              key={m.id}
              className={`${styles.row} ${isUser ? styles.right : styles.left}`}
            >
              {/* Avatar */}
              <div className={styles.avatar}>
                {m.avatar ? (
                  <img
                    src={m.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : null}
              </div>
              <div className={styles.bubble}>
                {isTyping ? (
                  <span className={styles.typing}>
                    <i className={styles.dot} /> <i className={styles.dot} />{" "}
                    <i className={styles.dot} />
                  </span>
                ) : (
                  // Nếu text có chứa HTML (từ backend), render nó
                  m.text.includes('<') && m.text.includes('>') ? (
                    <div 
                      className={styles.line}
                      dangerouslySetInnerHTML={{ __html: m.text }}
                    />
                  ) : (
                    // Nếu không có HTML, render như bình thường
                    m.text.split("\n").map((line, i) => (
                      <p key={i} className={styles.line}>
                        {line}
                      </p>
                    ))
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <input
          className={styles.input}
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          className={styles.sendBtn}
          aria-label="Send message"
          onClick={handleSend}
          disabled={loading}
        >
          <SendRoundedIcon fontSize="small" />
        </button>
      </footer>
    </section>
  );
};

export default ChatBot;
