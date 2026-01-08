import { sendQueryMessage } from "./";

export const sendQuery = async (query: string, location: string) => {
  const chat_history = sendQueryMessage(query, location);
  return chat_history;
};
