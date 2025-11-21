"use client";

import { useState, useEffect } from "react";
import { Paragraph } from "@/app/components";
import { sendQuery } from "@/app/utils/api";
import { ChatHistoryType } from "@/app/types";
import styles from "./FollowUps.module.css";

type FollowUpProps = {
  followUpQs: string[] | [];
  setLoadedChatHistory: Function;
  setTyping: Function;
};

export default function FollowUps({
  followUpQs,
  setLoadedChatHistory,
  setTyping,
}: FollowUpProps) {
  const [location, setLocation] = useState("");

  useEffect(() => {
    const location = sessionStorage.getItem("location") || "";
    setLocation(location);
  }, []);

  const FollowUpQ = ({ question }: { question: string }) => {
    return (
      <button
        className={styles.followup_q}
        aria-label={question}
        data-testid="followup-question"
        onClick={() => {
          setLoadedChatHistory((state: ChatHistoryType[]) => [
            ...state,
            { question },
          ]);
          setTyping(true);
          sendQuery(question, location).then((history) => {
            setLoadedChatHistory(history);
            setTyping(false);
          });
        }}
      >
        {question}
      </button>
    );
  };

  return (
    <>
      <Paragraph
        className={styles.message_label}
        data-testid="message-answer-label"
      >
        DWP Ask
      </Paragraph>

      <div
        className={styles.followups_container}
        role="region"
        data-testid="follow-ups-container"
      >
        <Paragraph className={styles.followup_label}>
          Related follow-up questions
        </Paragraph>
        {followUpQs.map((question, index) => (
          <FollowUpQ key={index} question={question} />
        ))}
      </div>
    </>
  );
}
