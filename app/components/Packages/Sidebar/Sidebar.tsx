"use client";

import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { H4, Paragraph, BackLink, SectionBreak, Link } from "@/app/components";
import SourceLink from "../SourceLink/SourceLink";
import { useSidebar, useLocation, useModal } from "@/app/providers";
import { type ChatHistoryType } from "@/app/types";
import { loadHistory } from "@/app/utils";

export default function Sidebar() {
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const { setModalVisible } = useModal();
  const { location } = useLocation();
  const [showContent, setShowContent] = useState(isSidebarVisible);
  const [citationsVisible, setCitationsVisible] = useState<ChatHistoryType>(
    {} as ChatHistoryType,
  );

  // Initialise from stored history on mount and subscribe to updates
  useEffect(() => {
    const initHistory = loadHistory();
    if (initHistory && initHistory.length > 0) {
      setCitationsVisible(initHistory[initHistory.length - 1]);
    }

    const sourceLinksHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ChatHistoryType[] | undefined;
      if (detail && detail.length > 0) {
        setCitationsVisible(detail[detail.length - 1]);
      }
    };

    window.addEventListener("loadedChatHistoryUpdated", sourceLinksHandler);
    return () => {
      window.removeEventListener(
        "loadedChatHistoryUpdated",
        sourceLinksHandler,
      );
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowContent(true);
      } else {
        setShowContent(isSidebarVisible);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSidebarVisible) {
          toggleSidebar();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar, isSidebarVisible]);

  return (
    <div
      className={`${styles.sidebarWrapper} ${isSidebarVisible ? styles.open : ""}`}
      role="alert"
      data-testid="sidebar-wrapper"
    >
      {showContent && (
        <div
          className={styles.sidebarClientWrapper}
          data-testid="sidebar-client-wrapper"
        >
          {location && (
            <React.Fragment>
              <Paragraph data-testid="sidebar-claimant-country">
                Claimant country of residence selected:{" "}
                <strong>{location}</strong>
              </Paragraph>
              <Link
                data-testid="sidebar-change-country-link"
                onClick={() => setModalVisible("clearChat")}
              >
                Change (will start a new chat)
              </Link>
              <SectionBreak level="m" visible />
            </React.Fragment>
          )}
          <H4 className={styles.sidebarUCTitle} data-testid="sidebar-title">
            Universal Learning guidance links
          </H4>
          <Paragraph data-testid="sidebar-description">
            These links are in response to your question. All links open in a
            new tab.
          </Paragraph>
          <BackLink
            data-testid="sidebar-backlink"
            className={styles.closeSidebar}
            onClick={() => toggleSidebar()}
          >
            Back to chat
          </BackLink>
          {citationsVisible?.citations &&
            citationsVisible.citations.map((source, index) => (
              <section key={source.title} data-testid="sidebar-source-links">
                <SourceLink index={index} source={source} />
                {citationsVisible?.citations &&
                  index !== citationsVisible.citations.length - 1 && (
                    <SectionBreak level="m" visible={false} />
                  )}
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
