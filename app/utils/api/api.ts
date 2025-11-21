import {
  generateFollowUpQs,
  sendQueryMessage,
  summariseQuery,
  elaborateQuery,
} from "./";
import type { Citations } from "@/app/types";

export const sendQuery = async (query: string, location: string) => {
  const chat_history = sendQueryMessage(query, location);
  return chat_history;
};

export const summarise = async (location: string) => {
  const chat_history = summariseQuery(location);
  return chat_history;
};

export const elaborate = async (location: string) => {
  const chat_history = elaborateQuery(location);
  return chat_history;
};

export const refineQuery = async (
  type: "summarise" | "elaborate",
  location: string,
) => {
  let chat_history = [];
  if (type === "summarise") {
    chat_history = await summarise(location);
  } else if (type === "elaborate") {
    chat_history = await elaborate(location);
  }
  return chat_history ?? [];
};

export const generateFollowUps = async (
  question: string,
  answer: string,
  citations: Citations,
  location: string,
) => {
  const chat_history = generateFollowUpQs(
    question,
    answer,
    citations,
    location,
  );
  return chat_history;
};
