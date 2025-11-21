import ChatHistory from "./ChatHistory";
import { ChatHistoryMetadata } from "@/app/constants/PageMetadata";

export const metadata = ChatHistoryMetadata;

export default function ChatHistoryPage() {
  return <ChatHistory />;
}
