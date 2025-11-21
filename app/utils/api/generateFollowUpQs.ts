import {
  loadHistory,
  addHistory,
  calculateIndex,
  updateHistory,
  catchError,
} from "@/app/utils";
import type { Citations } from "@/app/types";
import { getSessionId } from "../storage/storage";

export default async function generateFollowUpQs(
  question: string,
  answer: string,
  citations: Citations,
  location: string,
) {
  // Define chat history object
  let chat_history = loadHistory();
  const sessionId = getSessionId();
  // Insert the question into session storage
  addHistory({ question: "Generate related follow-up questions" });

  let index = calculateIndex("generate");

  try {
    const data = await fetch(`/api/followup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": sessionId,
      },
      body: JSON.stringify({
        prev_chat: {
          question,
          answer,
          citations,
        },
        location,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const parsedResponse = await data.json();

    if (parsedResponse.error) {
      // If the response object includes an error value, then a HTTP error has occured
      // An error should be thrown which is caught by catchError and handled appropriately
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }

    chat_history = loadHistory();

    // Update session storage chat history
    index = calculateIndex("query");
    const lastItem = chat_history[index];
    updateHistory({
      ...lastItem,
      followUpQs: parsedResponse.follow_up_qs,
      answer: "",
      default_response: parsedResponse.default_response ?? false,
      generated: true,
      // Refined must be sent back as true to hide the refine buttons in the frontend
      refined: true,
      id: parsedResponse.id,
    });
  } catch (error: any) {
    // The HTTP error code should be passed to this function so an appropriate message can be displayed on the frontend and the metadata for the chat history object can be updated
    catchError(error?.cause?.code || 500);
  }

  // Reload chat_history to return it
  chat_history = loadHistory();
  return chat_history;
}
