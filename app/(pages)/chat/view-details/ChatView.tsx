"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  Message,
  InsetText,
  Analytics,
  BackLink,
  WarningText,
  Main,
  Button,
  H3,
  H4,
} from "../../../components";
import styles from "./ChatView.module.css";
import { getViewDetails } from "@/app/utils/storage/storage";
import { ChatViewType } from "../../../types";
import { isEmptyObject } from "@/app/utils/helpers";
import { getPdfDownload } from "@/app/utils/api";

export default function Chat() {
  const [loadedChatView, setLoadedChatView] = useState<ChatViewType[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const combine_previous_chat = (items: ChatViewType): ChatViewType[] => {
    const results: ChatViewType[] = [];
    results.push(items);
    if (!isEmptyObject(items.previous_chat_history)) {
      results.push(items.previous_chat_history);
    }
    return results;
  };
  const handleDownload = async () => {
    try {
      const chatHistory = getViewDetails();
      const data_to_download = combine_previous_chat(chatHistory.items);
      const blob = await getPdfDownload("", "", 0, data_to_download);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `export-chat-${date}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const chatHistory = getViewDetails();
    if (chatHistory) {
      setDate(chatHistory.parsedDate[0]);
      setTime(chatHistory.parsedDate[1]);
      setLoadedChatView(combine_previous_chat(chatHistory.items));
    } else {
      router.push("/chat");
    }
  }, [router]);

  useEffect(() => {
    if (messageContainerRef.current && loadedChatView.length) {
      messageContainerRef.current.scrollBy({ top: 350, behavior: "smooth" });
    }
  }, [loadedChatView]);

  const dateLabel = `Details of chat from ${date}`;
  const timeLabel = `Question asked at ${time}`;
  const previousQuestionLabel = "Previous question asked";
  return (
    <Main className={styles.chatWrapper} id="main">
      <Analytics />

      <BackLink
        data-testid="chat-details-back-link"
        aria-label="Home"
        tabIndex={0}
        onClick={() => router.push("/chat/history")}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Back
        </span>
      </BackLink>
      <H3 className={styles.chatLabel} data-testid="chat-details-date">
        {dateLabel}
      </H3>

      <WarningText>
        <span data-testid="chat-details-warning-text">
          <strong>
            Only use the chat archive for complaints procedures. Do not use old
            chats for advice.
          </strong>
        </span>
      </WarningText>

      {loadedChatView.map((chat, item) => {
        const loadedChat = [chat];
        return (
          <section key={item}>
            <H4 className={styles.chatLabelSecondary}>
              {item == 0 ? timeLabel : previousQuestionLabel}
            </H4>
            <div className={styles.chatWindow}>
              <InsetText
                className={styles.chatWindowClearedText}
                data-testid="chat-details-disclaimer"
              >
                This response may be out of date. We may have replaced personal
                identifiable information (PII) that you entered, for data
                protection reasons.
              </InsetText>

              <section
                className={styles.chatContainer}
                ref={messageContainerRef}
                role="feed"
                tabIndex={0}
                data-testid="chat-details-section-container"
              >
                {/* Required as the parent div has an aria-role of feed so must have at least one article child at all times */}
                {!loadedChat.length && <article></article>}
                {loadedChat.length > 0 && (
                  <>
                    {loadedChat.map((message, index) => (
                      <article
                        key={message.question}
                        data-testid="chat-details-message"
                        aria-posinset={index + 1}
                      >
                        <Message
                          message={message}
                          setLoadedChatHistory={() => {}}
                          setTyping={() => {}}
                          isView={true}
                        />
                      </article>
                    ))}
                  </>
                )}
              </section>
            </div>
          </section>
        );
      })}
      <div>
        <Button
          className={styles.chatSend}
          data-testid="chat-history-download-button"
          disabled={false}
          aria-label="Send"
          buttonColour="#1D70B8"
          onClick={() => handleDownload()}
        >
          Download as PDF
        </Button>
      </div>
    </Main>
  );
}
