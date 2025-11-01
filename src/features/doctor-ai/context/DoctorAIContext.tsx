import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { composeUserText } from "../utils/doctorAI.utils";
import { chat, uploadImages } from "../services/doctorAIAPI";

// ===== Types =====
type DoctorAIRole = "user" | "assistant";

export type DoctorAIMessage = {
  role: DoctorAIRole;
  text: string;
  imageUrls?: string[];
};

export type DoctorAIState = {
  conversationId: string | null;
  messages: DoctorAIMessage[];
  description: string;
  input: string;
  files: File[];
  loading: boolean;
  error?: string | null;
};

// ===== Initial =====
const initialDoctorAIState: DoctorAIState = {
  conversationId: null,
  messages: [],
  description: "",
  input: "",
  files: [],
  loading: false,
  error: null,
};

// ===== Actions =====
type DoctorAIActions =
  | { type: "doctorAI/setDescription"; payload: string }
  | { type: "doctorAI/setInput"; payload: string }
  | { type: "doctorAI/addFiles"; payload: File[] }
  | { type: "doctorAI/clearFiles" }
  | { type: "doctorAI/send/pending" }
  | {
      type: "doctorAI/send/fulfilled";
      payload: {
        conversationId: string;
        reply: string;
        userTurn: DoctorAIMessage;
      };
    }
  | { type: "doctorAI/send/rejected"; payload: string }
  | { type: "doctorAI/clearHistory" }
  | { type: "doctorAI/hydrate"; payload: Partial<DoctorAIState> };

function doctorAIReducer(
  state: DoctorAIState,
  action: DoctorAIActions
): DoctorAIState {
  switch (action.type) {
  case "doctorAI/setDescription":
    return { ...state, description: action.payload };

  case "doctorAI/setInput":
    return { ...state, input: action.payload };

  case "doctorAI/addFiles":
    return {
      ...state,
      files: [...state.files, ...action.payload].slice(0, 5),
    };

  case "doctorAI/clearFiles":
    return { ...state, files: [] };

  case "doctorAI/send/pending":
    return { ...state, loading: true, error: null };

  case "doctorAI/send/fulfilled": {
    const { conversationId, reply, userTurn } = action.payload;
    const newMessages: DoctorAIMessage[] = [
      ...state.messages,
      userTurn,
      { role: "assistant" as const, text: reply },
    ];
    return {
      ...state,
      loading: false,
      conversationId,
      messages: newMessages,
      input: "",
      files: [],
    };
  }

  case "doctorAI/send/rejected":
    return { ...state, loading: false, error: action.payload };

  case "doctorAI/clearHistory":
    return { ...state, conversationId: null, messages: [], error: null };

  case "doctorAI/hydrate":
    return { ...state, ...action.payload };

  default:
    return state;
  }
}

// ===== Context =====
type DoctorAIContextValue = {
  state: DoctorAIState;
  setDescription: (v: string) => void;
  setInput: (v: string) => void;
  addFiles: (files: File[]) => void;
  clearFiles: () => void;
  sendMessage: () => Promise<void>;
  clearHistory: () => void;
};

const DoctorAIContext = createContext<DoctorAIContextValue | undefined>(
  undefined
);

// ===== Provider =====
export const DoctorAIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(doctorAIReducer, initialDoctorAIState);

  // Hydrate once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("doctorAI:state");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DoctorAIState>;
        dispatch({ type: "doctorAI/hydrate", payload: parsed });
      }
    } catch (err) {
      // ignore
      console.error(err);
    }
  }, []);

  // Persist conversationId + messages
  useEffect(() => {
    try {
      localStorage.setItem(
        "doctorAI:state",
        JSON.stringify({
          conversationId: state.conversationId,
          messages: state.messages,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }, [state.conversationId, state.messages]);

  const setDescription = useCallback(
    (v: string) => dispatch({ type: "doctorAI/setDescription", payload: v }),
    []
  );

  const setInput = useCallback(
    (v: string) => dispatch({ type: "doctorAI/setInput", payload: v }),
    []
  );

  const addFiles = useCallback(
    (files: File[]) => dispatch({ type: "doctorAI/addFiles", payload: files }),
    []
  );

  const clearFiles = useCallback(
    () => dispatch({ type: "doctorAI/clearFiles" }),
    []
  );

  const sendMessage = useCallback(async () => {
    if (state.loading) return;
    const userText = composeUserText(state.input, state.description);
    if (!userText && state.files.length === 0) return;

    dispatch({ type: "doctorAI/send/pending" });
    try {
      const urls = await uploadImages(state.files);
      const userTurn: DoctorAIMessage = {
        role: "user",
        text: userText,
        imageUrls: urls,
      };
      const data = await chat({
        conversationId: state.conversationId ?? undefined,
        userText,
        imageUrls: urls,
        createIfMissing: true,
      });

      dispatch({
        type: "doctorAI/send/fulfilled",
        payload: {
          conversationId: data.conversationId,
          reply: data.reply,
          userTurn,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Send failed";
      dispatch({ type: "doctorAI/send/rejected", payload: msg });
    }
  }, [state]);

  const clearHistory = useCallback(() => {
    dispatch({ type: "doctorAI/clearHistory" });
    try {
      localStorage.removeItem("doctorAI:state");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      setDescription,
      setInput,
      addFiles,
      clearFiles,
      sendMessage,
      clearHistory,
    }),
    [
      state,
      setDescription,
      setInput,
      addFiles,
      clearFiles,
      sendMessage,
      clearHistory,
    ]
  );

  return (
    <DoctorAIContext.Provider value={value}>
      {children}
    </DoctorAIContext.Provider>
  );
};

// ===== Hook =====
// eslint-disable-next-line react-refresh/only-export-components
export function useDoctorAI(): DoctorAIContextValue {
  const ctx = useContext(DoctorAIContext);
  if (!ctx) throw new Error("useDoctorAI must be used within DoctorAIProvider");
  return ctx;
}
