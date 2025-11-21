"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Main,
  Analytics,
  LoadingBox,
  Link,
  TableCell,
  TableRow,
} from "@/app/components";
import CustomTable from "@/app/components/Shared/CustomTable/CustomTable";
import { getMessages, getPdfDownload } from "@/app/utils/api";
import { MessagesResponseType } from "@/app/types";
import {
  convertDateToISO,
  convertDateToParts,
  dateFormatForHistoryPage,
  truncate,
} from "@/app/utils/helpers";
import { handleDownload, validateDateRange } from "@/app/utils/shared/helper";
import FiltersContainer from "@/app/components/Shared/FiltersContainer/FiltersContainer";
import PageDescription from "@/app/components/Shared/PageDescription/PageDescription";
import ExportAllButton from "@/app/components/Shared/ExportAllButton/ExportAllButton";
import styles from "./ChatHistory.module.css";
import ErrorCard from "@/app/components/Packages/ErrorCard/ErrorCard";
import ErrorApiMessage from "@/app/components/Shared/ErrorApiMessage/ErrorApiMessage";
import { PageView } from "@/app/enum";
import { storeViewDetails } from "@/app/utils/storage/storage";
import { useRouter } from "next/navigation";

export default function ChatHistory() {
  const now = new Date();
  const current_date = convertDateToParts(now);
  const pass_date = new Date();
  pass_date.setDate(now.getDate() - 7);
  const datefield_start = convertDateToParts(pass_date);

  const initialDatefieldStart = {
    day: datefield_start.day,
    month: datefield_start.month,
    year: datefield_start.year,
  };
  const initialEndDate = {
    day: current_date.day,
    month: current_date.month,
    year: current_date.year,
  };

  const [chatMessages, setChatMessages] = useState<MessagesResponseType[]>([]);
  const [startDate, setStartDate] = useState(initialDatefieldStart);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorStartText, setErrorStartText] = useState("");
  const [errorEndText, setErrorEndText] = useState("");
  const [apiErrorState, setapiErrorState] = useState(false);

  const hasFetched = useRef(false);
  const router = useRouter();

  const handlePagination = async (page: number) => {
    setCurrentPage(page);
    await handleSubmit(page);
  };

  const handleReset = () => {
    setStartDate(initialDatefieldStart);
    setEndDate(initialEndDate);
    setErrorStartText("");
    setErrorEndText("");
  };

  const onExportAll = (
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const getPdfDownloadAdapter = async (payload: any) => {
      return await getPdfDownload(
        payload.start_date,
        payload.end_date,
        payload.currentPage,
      );
    };
    handleDownload(
      setErrorStartText,
      setErrorEndText,
      setLoading,
      setapiErrorState,
      startDate,
      endDate,
      currentPage,
      getPdfDownloadAdapter,
      "pdf",
    );
  };

  const handleSubmit = async (page?: number) => {
    const page_number = page ?? 1;
    const validDate = validateDateRange(
      setErrorStartText,
      setErrorEndText,
      startDate,
      endDate,
    );
    if (validDate.valid) {
      const start_date = convertDateToISO(startDate);
      const end_date = convertDateToISO(endDate);
      try {
        setLoading(true);
        const res = await getMessages(start_date, end_date, page_number);
        setCurrentPage(page_number);
        setChatMessages(res.data);
        setTotalPages(res.total_pages);
        setLoading(false);
      } catch (err: any) {
        console.log(err);
        setapiErrorState(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchData = async () => {
      const pass_date = convertDateToISO(startDate);
      const current_date = convertDateToISO(endDate);
      try {
        setLoading(true);
        const res = await getMessages(pass_date, current_date, currentPage);
        setLoading(false);
        setChatMessages(res.data);
        setTotalPages(res.total_pages);
      } catch (err: any) {
        console.log(err);
        setLoading(false);
        setapiErrorState(true);
      }
    };
    fetchData();
  });

  const ErrorMessage = () => (
    <ErrorApiMessage>
      <p>
        There is a technical issue with loading your chat archive, please try
        again later or{" "}
        <Link className="govuk-link" href="/">
          return to home
        </Link>{" "}
        to ask DWP Ask a question.
      </p>
    </ErrorApiMessage>
  );

  return (
    <Main>
      <Analytics />
      {apiErrorState ? (
        <ErrorCard>{ErrorMessage()}</ErrorCard>
      ) : (
        <LoadingBox className={styles.loading} loading={loading}>
          <PageDescription
            backLink="/chat"
            title="Chat archive"
            warningText="Only use the chat archive for complaints procedures. Do not use old chats for advice."
            description="The view is automatically filtered to show chats from the previous calendar week, to change this - adjust the date filter."
          />

          <div className="govuk-form-group">
            <FiltersContainer
              errorStartText={errorStartText}
              errorEndText={errorEndText}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              handleReset={handleReset}
              handleSubmit={handleSubmit}
              pageView={PageView.Chat}
              headerText="Filter"
            />
          </div>

          <CustomTable<MessagesResponseType>
            tableContent={chatMessages}
            currentPage={currentPage}
            setCurrentPage={handlePagination}
            totalPages={totalPages}
            columnTitles={["Question asked", "Date", "Details"]}
            renderRow={(item, id) => {
              const parsedDate = dateFormatForHistoryPage(item.created_at);
              const truncatedQuestion = truncate(item.question, 70);
              return (
                <TableRow
                  key={item.id ?? id}
                  data-testid="chat-history-table-row"
                >
                  <TableCell
                    title={item.question}
                    data-testid="chat-history-table-row-question"
                  >
                    {truncatedQuestion}
                  </TableCell>
                  <TableCell data-testid="chat-history-table-row-date">
                    {parsedDate[0]}
                  </TableCell>
                  <TableCell data-testid="chat-history-table-row-view-details">
                    <span
                      onClick={() => {
                        storeViewDetails({ parsedDate, items: item });
                        router.push("/chat/view-details");
                      }}
                    >
                      <Link
                        href="/chat/view-details"
                        data-testid="chat-history-table-row-view-details-link"
                        tabIndex={0}
                        className={styles.tableLink}
                      >
                        View details
                      </Link>
                    </span>
                  </TableCell>
                </TableRow>
              );
            }}
          />
          {totalPages > 0 && (
            <ExportAllButton
              buttonName="Export all filtered chats as PDF"
              className={styles.exportButtonMarginTop}
              onClick={onExportAll}
            />
          )}
        </LoadingBox>
      )}
    </Main>
  );
}
