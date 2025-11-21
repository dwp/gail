import FeedbackHistory from "./FeedbackHistory";
import { FeedbackMetadata } from "@/app/constants/PageMetadata";

export const metadata = FeedbackMetadata;

export default function FeedbackPage() {
  return <FeedbackHistory />;
}
