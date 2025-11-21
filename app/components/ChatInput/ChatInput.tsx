"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Typing, QueryTextArea } from "@/app/components";
import { ChatHistoryType, ErrorStateType } from "@/app/types";
import { sendQuery } from "@/app/utils/api";
import styles from "./ChatInput.module.css";
import { getLocation } from "@/app/utils";
import { useLocation } from "@/app/providers";

const initialErrorState = {
  invalidchar: false,
  blank: false,
  charcount: false,
  location: false,
};

export default function ChatInput({
  loadedChatHistory,
  setLoadedChatHistory,
  typing,
  setTyping,
  isModalOpen,
}: {
  loadedChatHistory: ChatHistoryType[];
  setLoadedChatHistory: Function;
  typing: boolean;
  setTyping: Function;
  isModalOpen: boolean;
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<ErrorStateType>(initialErrorState);
  const { location } = useLocation();
  const [localLocation, setLocalLocation] = useState("");

  const isError = Object.values(error).includes(true);
  const onChange = (
    event?: React.ChangeEvent<HTMLTextAreaElement> | null,
    plainText?: string | null,
  ) => {
    setQuery(plainText ? plainText : event ? event.target.value : "");
    setError((state) => ({ ...state, blank: false }));
  };

  useEffect(() => {
    if (location) {
      setError((state) => ({ ...state, location: false }));
    }
  }, [loadedChatHistory, location]);

  useEffect(() => {
    const locationFromStorage = getLocation();
    setLocalLocation(locationFromStorage || location || "");
  }, [location]);

  const sendQueryAndClear = useCallback(() => {
    if (!location) {
      setError((state) => ({ ...state, location: true }));
      return;
    }
    if (query.length === 0) {
      setError((state) => ({ ...state, blank: true }));
    }
    if (isError || isModalOpen || query === "") {
      return;
    } else {
      setTyping(true);
      setLoadedChatHistory((state: ChatHistoryType[]) => [
        ...state,
        { question: query },
      ]);
      sendQuery(query, localLocation).then((history) => {
        setLoadedChatHistory(history);
        setTyping(false);
      });
      setQuery("");
      setError(initialErrorState);
    }
  }, [
    query,
    isModalOpen,
    localLocation,
    setLoadedChatHistory,
    setTyping,
    isError,
    location,
  ]);

  const submitQueryEnter = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.shiftKey == false) {
      event.preventDefault();
      sendQueryAndClear();
    }
  };

  return (
    <>
      {typing && <Typing />}
      <div className={styles.chatInputContainer}>
        <div className={styles.chatInput} data-testid="chat-input-text-area">
          <QueryTextArea
            error={error}
            setError={setError}
            value={query}
            isModalOpen={isModalOpen}
            onChange={onChange}
            onKeyDown={submitQueryEnter}
            sendQueryAndClear={sendQueryAndClear}
          />
        </div>
      </div>
    </>
  );
}
