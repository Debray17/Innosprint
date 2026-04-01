import axios from "axios";
import {
  CHATBOT_API_BASE_URL,
  CHATBOT_ENDPOINTS,
  CHATBOT_OWNER_ID_HEADER,
  CHATBOT_OWNER_ID_STORAGE_KEY,
} from "../config/apiConfig";
import { getStoredToken, normalizeApiError } from "./api";

const chatbotApi = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
  timeout: 60000,
  withCredentials: false,
});

chatbotApi.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

chatbotApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

export const getStoredChatbotOwnerId = () => {
  try {
    return window.localStorage.getItem(CHATBOT_OWNER_ID_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
};

export const setStoredChatbotOwnerId = (ownerId) => {
  try {
    if (!ownerId) {
      window.localStorage.removeItem(CHATBOT_OWNER_ID_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(CHATBOT_OWNER_ID_STORAGE_KEY, ownerId);
  } catch (error) {
    // Ignore storage failures.
  }
};

const buildOwnerHeaders = (ownerId) => ({
  [CHATBOT_OWNER_ID_HEADER]: ownerId,
});

export const listChatSessions = async (ownerId) => {
  const response = await chatbotApi.get(CHATBOT_ENDPOINTS.SESSIONS, {
    headers: buildOwnerHeaders(ownerId),
  });
  return response.data;
};

export const createChatSession = async (ownerId, payload) => {
  const response = await chatbotApi.post(CHATBOT_ENDPOINTS.SESSIONS, payload, {
    headers: buildOwnerHeaders(ownerId),
  });
  return response.data;
};

export const renameChatSession = async (ownerId, threadId, payload) => {
  const response = await chatbotApi.patch(
    CHATBOT_ENDPOINTS.SESSION(threadId),
    payload,
    {
      headers: buildOwnerHeaders(ownerId),
    },
  );
  return response.data;
};

export const deleteChatSession = async (ownerId, threadId) => {
  const response = await chatbotApi.delete(CHATBOT_ENDPOINTS.SESSION(threadId), {
    headers: buildOwnerHeaders(ownerId),
  });
  return response.data;
};

export const sendChatMessage = async (ownerId, threadId, payload) => {
  const response = await chatbotApi.post(
    CHATBOT_ENDPOINTS.MESSAGE(threadId),
    payload,
    {
      headers: buildOwnerHeaders(ownerId),
    },
  );
  return response.data;
};

export const streamChatMessage = async ({
  ownerId,
  threadId,
  message,
  signal,
  onChunk,
}) => {
  const token = getStoredToken();
  const response = await fetch(
    `${CHATBOT_API_BASE_URL}${CHATBOT_ENDPOINTS.MESSAGE_STREAM(threadId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        [CHATBOT_OWNER_ID_HEADER]: ownerId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
      signal,
    },
  );

  if (!response.ok || !response.body) {
    const errorText = await response.text();
    throw normalizeApiError({
      response: {
        status: response.status,
        data: errorText,
      },
      message: errorText || "Failed to stream chat response",
    });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    events.forEach((eventBlock) => {
      const dataLine = eventBlock
        .split("\n")
        .find((line) => line.startsWith("data: "));
      if (!dataLine) return;

      try {
        const payload = JSON.parse(dataLine.slice(6));
        onChunk?.(payload);
      } catch (error) {
        // Ignore malformed chunks.
      }
    });
  }
};
