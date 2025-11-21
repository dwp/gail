import { refineQuery, generateFollowUps } from "@/app/utils/api";
import { ChatHistoryType } from "@/app/types";
import styles from "./RefineButton.module.css";

type RefineButtonProps = {
  button: "summarise" | "elaborate" | "followup";
  text: string;
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  hasBeenRefined: boolean;
};

export default function RefineButton({
  button,
  text,
  setLoadedChatHistory,
  setTyping,
  message,
  hasBeenRefined,
}: Readonly<RefineButtonProps>) {
  const location = sessionStorage.getItem("location") ?? "";

  const sendRefinedQuery = async () => {
    setTyping(true);
    setLoadedChatHistory((state: ChatHistoryType[]) => [
      ...state,
      { question: text },
    ]);
    if (button === "elaborate" || button === "summarise") {
      try {
        const history = await refineQuery(button, location);
        setLoadedChatHistory(history);
        setTyping(false);
      } catch (error: any) {
        console.log(error);
        setTyping(false);
      }
    } else if (button === "followup") {
      try {
        const history = await generateFollowUps(
          message.question,
          message.answer,
          message.citations || [],
          location,
        );
        setLoadedChatHistory(history);
        setTyping(false);
      } catch (error: any) {
        console.log(error);
        setTyping(false);
      }
    }
  };

  return (
    <button
      aria-label={text}
      className={`govuk-button ${styles.govuk_button_inverse} ${
        hasBeenRefined ? styles.govuk_button_override : ""
      }`}
      data-testid={`refine-button-${button}`}
      onClick={sendRefinedQuery}
    >
      {text}
    </button>
  );
}
