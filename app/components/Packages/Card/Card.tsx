"use client";

import { useModal, useSidebar } from "@/app/providers";
import styles from "./Card.module.css";

type CardProps = {
  text: string;
  onClick: Function;
  className?: string;
};

export default function Card({ text, onClick, className }: CardProps) {
  const { isSidebarVisible } = useSidebar();
  const { isModalVisible } = useModal();
  const isModalOpen = Object.values(isModalVisible).includes(true);

  return (
    <button
      className={className ?? styles.exampleCard}
      data-testid="card-text"
      aria-label={text}
      onClick={() => onClick(text)}
      tabIndex={
        isModalOpen || (isSidebarVisible && window.innerWidth <= 768) ? -1 : 0
      }
    >
      {text}
    </button>
  );
}
