"use client";

import { useEffect, useState } from "react";
import {
  Link,
  Paragraph,
  Feedback,
  FeedbackExpanded,
  SanitisedMarkdown,
  CountryCards,
} from "@/app/components";
import { useResponsive, useSidebar, useLocation } from "@/app/providers";
import { trimWhitespace, confirmChangeLocation } from "@/app/utils";
import { ChatHistoryType } from "@/app/types";
import { createAnswerMarkdownOptions } from "./AnswerMarkdownConfig";
import styles from "./Answer.module.css";

type AnswerProps = {
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  isView?: boolean;
};

type IsFeedbackHelpful = "yes" | "no" | null;

const errorText =
  "Apologies, we have had a technical issue. Please try again in a few minutes.";

export default function Answer({
  message,
  setLoadedChatHistory,
  isView,
}: Readonly<AnswerProps>) {
  const [isFeedbackHelpful, setIsFeedbackHelpful] =
    useState<IsFeedbackHelpful>(null);
  const [feedbackCompleted, setFeedbackCompleted] = useState(
    message.feedback_given || false,
  );

  const { location, setLocation } = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { toggleSidebar, isSidebarVisible } = useSidebar();
  const { isSmallScreen } = useResponsive();
  const answer = message.answer;
  const isError = message.type === "error" || answer === errorText;
  const summarised = message.question === "Summarise";
  const elaborated = message.question === "Elaborate";
  const isSourceLinks = message.citations && message.citations.length > 0;
  const shouldShowAiStatement =
    (isSourceLinks || summarised || elaborated) && !message.default_response;
  const responseLength = `${summarised ? "a shorter" : elaborated ? "a more detailed" : "this"}`;

  const aiStatement1 = `${shouldShowAiStatement ? `AI created ${responseLength} response which might help answer your question.` : ""}`;
  const aiStatement2 = "Check the accuracy against the links suggested.";

  const options = createAnswerMarkdownOptions(styles);

  return (
    <article
      data-testid="message-answer-container"
      onCopy={trimWhitespace}
      tabIndex={isSidebarVisible && isSmallScreen ? -1 : 0}
    >
      <Paragraph
        className={styles.message_label}
        data-testid="message-answer-label"
      >
        DWP Ask
      </Paragraph>

      {/* Markdown response */}
      <div className={styles.answer} data-testid="message-answer">
        {!isError && shouldShowAiStatement && (
          <div className={styles.ai_disclaimer_span}>
            <strong
              className={styles.ai_disclaimer}
              data-testid="ai-answer-disclaimer"
            >
              {`${aiStatement1} ${aiStatement2}`}
            </strong>
          </div>
        )}

        {!isError && isSourceLinks && (
          <Link
            tabIndex={isSidebarVisible ? -1 : 0}
            className={styles.viewGuidanceLink}
            onClick={() => toggleSidebar()}
          >
            View the guidance links
          </Link>
        )}

        <SanitisedMarkdown
          data-testid="answer-markdown"
          options={options}
          className={styles.markdownContainer}
        >
          {answer}
        </SanitisedMarkdown>

        {message.type === "chooseCountry" && isMounted && !location && (
          <CountryCards
            onClickHandler={(country: string) => {
              const newItem = confirmChangeLocation(country);
              // update provider so all consumers react immediately
              setLocation(country);
              if (newItem) {
                setLoadedChatHistory((prev: ChatHistoryType[]) => [
                  ...prev,
                  newItem,
                ]);
              }
            }}
          />
        )}

        {!isError &&
          !isFeedbackHelpful &&
          !isView &&
          message.id !== undefined &&
          !message.default_response && (
            <Feedback
              feedbackCompleted={feedbackCompleted}
              setIsFeedbackHelpful={setIsFeedbackHelpful}
              messageId={message.id}
            />
          )}
        {!isError &&
          isFeedbackHelpful === "no" &&
          !feedbackCompleted &&
          message.id !== undefined &&
          !isView && (
            <FeedbackExpanded
              setFeedbackCompleted={setFeedbackCompleted}
              setIsFeedbackHelpful={setIsFeedbackHelpful}
              messageId={message.id}
            />
          )}
      </div>
    </article>
  );
}
