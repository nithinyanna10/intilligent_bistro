import { create } from "zustand";
import { ChatMessage } from "../types/ai";

const greetingMessage: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: "Good afternoon. What can I get started for you?",
  timestamp: Date.now(),
};

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  pushUser: (text: string) => void;
  pushAssistant: (msg: Omit<ChatMessage, "id" | "role" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const nextId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState>((set) => ({
  messages: [greetingMessage],
  loading: false,
  error: null,
  pushUser: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: nextId(), role: "user", text, timestamp: Date.now() },
      ],
    })),
  pushAssistant: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: nextId(),
          role: "assistant",
          text: msg.text,
          actions: msg.actions,
          timestamp: Date.now(),
        },
      ],
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ messages: [greetingMessage], loading: false, error: null }),
}));
