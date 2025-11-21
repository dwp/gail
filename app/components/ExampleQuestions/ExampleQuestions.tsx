"use client";

import { useEffect, useState } from "react";
import { sendQuery } from "@/app/utils/api";
import { ChatHistoryType } from "@/app/types";
import { Paragraph } from "@/app/components";
import { exampleQs } from "@/app/constants/ExampleQuestions";
import Card from "../Packages/Card/Card";
import styles from "./ExampleQuestions.module.css";

export default function ExampleQuestions({
  setLoadedChatHistory,
  setTyping,
}: {
  setLoadedChatHistory: Function;
  setTyping: Function;
}) {
  const [location, setLocation] = useState("");

  useEffect(() => {
    const location = sessionStorage.getItem("location") || "";
    setLocation(location);
  }, []);

  const handleCardClick = (text: string) => {
    setLoadedChatHistory((state: ChatHistoryType[]) => [
      ...state,
      { question: text },
    ]);
    setTyping(true);
    sendQuery(text, location).then((history) => {
      setLoadedChatHistory(history);
      setTyping(false);
    });
  };

  return (
    <div className={styles.exampleContainer}>
      <div className={styles.exampleContent}>
        <Paragraph className={styles.exampleQuestionsLabel}>
          Example questions
        </Paragraph>
        <div
          className={styles.exampleGrid}
          data-testid="example-questions-grid"
        >
          {exampleQs.map((q, index) => (
            <Card text={q} key={index} onClick={handleCardClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
