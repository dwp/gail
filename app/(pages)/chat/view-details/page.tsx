import ChatView from "./ChatView";
import { ChatMetadata } from "@/app/constants/PageMetadata";

export const metadata = ChatMetadata;

export default function ChatViewPage() {
  return <ChatView />;
}
