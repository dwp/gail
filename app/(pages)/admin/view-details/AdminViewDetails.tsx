"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Message, Analytics, BackLink, Main, H3, H4 } from "@/app/components";
import styles from "./AdminViewDetails.module.css";
import { getAdminViewDetails } from "@/app/utils/storage/storage";
import { ChatViewType } from "@/app/types";
import { isEmptyObject } from "@/app/utils/helpers";
import { UserView } from "@/app/enum";
import InfoSection from "@/app/components/Packages/InfoSection/InfoSection";

export default function AdminViewDetails() {
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

  useEffect(() => {
    const chatHistory = getAdminViewDetails();
    if (chatHistory) {
      setDate(chatHistory.parsedDate[0]);
      setTime(chatHistory.parsedDate[1]);
      setLoadedChatView(combine_previous_chat(chatHistory.items));
    } else {
      router.push("/admin");
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
        data-testid="admin-details-back-link"
        aria-label="Home"
        tabIndex={0}
        onClick={() => router.push("/admin")}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Back
        </span>
      </BackLink>
      <H3 className={styles.chatLabel} data-testid="admin-details-date">
        {dateLabel}
      </H3>

      {loadedChatView.map((chat, item) => {
        const loadedChat = [chat];
        const subtitle =
          chat.feedback?.is_response_useful === true
            ? "Yes"
            : chat.feedback?.is_response_useful === false
              ? "No:"
              : "No response";
        const listItems =
          chat.feedback?.is_response_useful === false
            ? chat.feedback.selected_options
            : [];
        const descriptionText = chat.feedback?.feedback_text || "";
        return (
          <span key={chat.question}>
            <H4 className={styles.chatLabelSecondary}>
              {item == 0 ? timeLabel : previousQuestionLabel}
            </H4>
            <div className={styles.chatWindow}>
              <section
                className={styles.chatContainer}
                ref={messageContainerRef}
                role="feed"
                tabIndex={0}
                data-testid="admin-details-section-container"
              >
                {/* Required as the parent div has an aria-role of feed so must have at least one article child at all times */}
                {!loadedChat.length && <article></article>}
                {loadedChat.length > 0 && (
                  <>
                    {loadedChat.map((message, index) => (
                      <article
                        key={message.question}
                        data-testid="admin-details-message"
                        aria-posinset={index + 1}
                      >
                        <Message
                          message={message}
                          setLoadedChatHistory={() => {}}
                          setTyping={() => {}}
                          isView={true}
                          userView={UserView.User}
                        />
                      </article>
                    ))}
                  </>
                )}
              </section>
            </div>
            <InfoSection
              title="Was this response useful?"
              subtitle={subtitle}
              listItems={listItems}
              descriptionText={descriptionText}
            />
          </span>
        );
      })}
      <div className={styles.blankSpace} />
    </Main>
  );
}
