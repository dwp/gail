"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Main,
  Analytics,
  BackLink,
  H2,
  Button,
  LoadingBox,
} from "@/app/components";
import { getFeedback, downloadMessagesCsv } from "@/app/utils/api";
import { FeedbackResponseType } from "@/app/types";
import FeedbackTable from "@/app/components/FeedbackTable/FeedbackTable";
import ErrorCard from "@/app/components/Packages/ErrorCard/ErrorCard";

export default function FeedbackHistory() {
  const router = useRouter();
  const [feedbackData, setFeedbackData] = useState<FeedbackResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiErrorState, setApiErrorState] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await getFeedback();
        setFeedbackData(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setApiErrorState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <Main>
      <Analytics />
      {apiErrorState ? (
        <ErrorCard>
          <p>
            There was an error loading the feedback data. Please try again
            later.
          </p>
        </ErrorCard>
      ) : (
        <LoadingBox loading={loading}>
          <BackLink
            data-testid="feedback-back-link"
            aria-label="Back"
            tabIndex={0}
            onClick={() => router.push("/chat")}
          >
            <span className="chatBacklink">Back</span>
          </BackLink>
          <H2>User Feedback</H2>
          <p>View all user feedback submitted on DWP Ask.</p>
          <Button
            data-testid="download-messages-csv-button"
            onClick={() => downloadMessagesCsv()}
          >
            Download Messages CSV
          </Button>
          <FeedbackTable tableContent={feedbackData} />
        </LoadingBox>
      )}
    </Main>
  );
}
