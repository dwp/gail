import {
  loadHistory,
  addHistory,
  calculateIndex,
  updateHistory,
  catchError,
  filterChatHistory,
} from "@/app/utils";
import type { QueryResponseType } from "@/app/types";
import { getSessionId } from "../storage/storage";

export default async function sendQueryMessage(
  query: string,
  location: string,
) {
  // Define chat history object
  let chat_history = loadHistory();
  // Insert the question into session storage
  addHistory({ question: query });
  const sessionId = getSessionId();

  const filteredChatHistory = filterChatHistory(chat_history);

  // Send query and handle response
  try {
    const data = await fetch(`/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": sessionId,
      },
      body: JSON.stringify({
        query,
        chat_history: filteredChatHistory,
        location,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const parsedResponse: QueryResponseType = await data.json();

    if (parsedResponse.error) {
      // If the response object includes an error value, then a HTTP error has occured
      // An error should be thrown which is caught by catchError and handled appropriately
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }

    // Update session storage chat history
    chat_history = loadHistory();
    const index = calculateIndex("query");
    const lastItem = chat_history[index];
    updateHistory({
      ...lastItem,
      answer: parsedResponse.answer,
      citations: parsedResponse.citations || [],
      default_response: parsedResponse.default_response ?? false,
      id: parsedResponse.id ?? null,
    });
  } catch (error: any) {
    console.log(error);
    // The HTTP error code should be passed to this function so an appropriate message can be displayed on the frontend and the metadata for the chat history object can be updated
    catchError(error?.cause?.code || 500);
  }

  // Reload chat_history to return it
  chat_history = loadHistory();
  return chat_history;
}
