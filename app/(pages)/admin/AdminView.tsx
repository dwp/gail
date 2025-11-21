"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Main,
  Analytics,
  Link,
  H3,
  LoadingBox,
  TableRow,
  TableCell,
} from "@/app/components";
import CustomTable from "@/app/components/Shared/CustomTable/CustomTable";
import { getFeedbackList, getCsvDownload } from "@/app/utils/api";
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
import styles from "./AdminView.module.css";
import ErrorCard from "@/app/components/Packages/ErrorCard/ErrorCard";
import ErrorApiMessage from "@/app/components/Shared/ErrorApiMessage/ErrorApiMessage";
import { PageView } from "@/app/enum";
import { storeAdminViewDetails } from "@/app/utils/storage/storage";
import { useRouter } from "next/navigation";
import ErrorFormGroup from "@/app/components/Packages/ErrorFormGroup/ErrorFormGroup";

export default function AdminView() {
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
  const maxRowsForCsv = Number(process.env.NEXT_PUBLIC_MAX_ROW_CSV) || 2000;
  const [chatMessages, setChatMessages] = useState<MessagesResponseType[]>([]);
  const [startDate, setStartDate] = useState(initialDatefieldStart);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorStartText, setErrorStartText] = useState("");
  const [errorEndText, setErrorEndText] = useState("");
  const [apiErrorState, setapiErrorState] = useState(false);
  const [sentiment, setSentiment] = useState<Array<"true" | "false" | "none">>([
    "true",
    "false",
    "none",
  ]);
  const [errorFormGroup, setErrorFormGroup] = useState(false);
  const errFormGroupMessage =
    "Adjust the filters so you have less than 2000 search results.";
  const errorSummary = [
    {
      text: "The download is too big. Adjust the filters so you have less than 2000 search results.",
      href: "#",
    },
  ];

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
    setSentiment(["true", "false", "none"]);
    setErrorFormGroup(false);
    fetchData(initialDatefieldStart, initialEndDate, ["true", "false", "none"]);
  };

  const onExportAll = async (
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setErrorFormGroup(false);
    if (totalRows > maxRowsForCsv) {
      setErrorFormGroup(true);
      return;
    }
    const getCsvDownloadAdapter = async (payload: any) => {
      return await getCsvDownload(
        payload.start_date,
        payload.end_date,
        payload.currentPage,
        payload.feedback_types,
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
      getCsvDownloadAdapter,
      "csv",
      sentiment,
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
        const res = await getFeedbackList(
          start_date,
          end_date,
          page_number,
          sentiment,
        );
        setCurrentPage(page_number);
        setChatMessages(res.data);
        setTotalPages(res.total_pages);
        setTotalRows(res.total_count);
        setLoading(false);
      } catch (err: any) {
        console.log(err);
        setapiErrorState(true);
      } finally {
        setLoading(false);
        setErrorFormGroup(false);
      }
    }
  };

  const fetchData = async (
    start = startDate,
    end = endDate,
    sent = sentiment,
  ) => {
    const pass_date = convertDateToISO(start);
    const current_date = convertDateToISO(end);
    try {
      setLoading(true);
      const res = await getFeedbackList(
        pass_date,
        current_date,
        currentPage,
        sent,
      );
      setLoading(false);
      setChatMessages(res.data);
      setTotalPages(res.total_pages);
      setTotalRows(res.total_count);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      setapiErrorState(true);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  });

  const ErrorMessage = () => (
    <ErrorApiMessage>
      <p>
        There is a technical issue with loading your admin view, please try
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
            title="Admin view"
            description="The view is automatically filtered to show chats from the previous calendar week, to change this - adjust the date filter."
            errorSummary={errorFormGroup ? errorSummary : []}
          />

          <H3 data-testid="admin-history-filter-label">Filters</H3>

          <ErrorFormGroup
            error={errorFormGroup}
            errorMessage={errFormGroupMessage}
            errorId="countries-error"
          >
            <FiltersContainer
              errorStartText={errorStartText}
              errorEndText={errorEndText}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              handleReset={handleReset}
              handleSubmit={handleSubmit}
              sentiment={sentiment}
              setSentiment={setSentiment}
              pageView={PageView.Admin}
              enableHeader={false}
            />

            <ExportAllButton
              rowsLength={totalRows}
              buttonName="Export all filtered chats as CSV"
              resultText={`${totalRows ?? 0} search results`}
              className={styles.exportButtonMarginTop}
              onClick={onExportAll}
            />
          </ErrorFormGroup>

          <CustomTable<MessagesResponseType>
            tableContent={chatMessages}
            currentPage={currentPage}
            setCurrentPage={handlePagination}
            totalPages={totalPages}
            columnTitles={["Question asked", "Date", "Feedback", "Details"]}
            renderRow={(item, id) => {
              const parsedDate = dateFormatForHistoryPage(item.created_at);
              const truncatedQuestion = truncate(item.question, 65);
              return (
                <TableRow
                  key={item.id ?? id}
                  data-testid="admin-history-table-row"
                >
                  <TableCell
                    title={item.question}
                    data-testid="admin-history-table-row-question"
                  >
                    {truncatedQuestion}
                  </TableCell>
                  <TableCell data-testid="admin-history-table-row-date">
                    {parsedDate[0]}
                  </TableCell>
                  <TableCell data-testid="admin-history-table-row-feedback">
                    {item.feedback?.is_response_useful === true
                      ? "Positive"
                      : item.feedback?.is_response_useful === false
                        ? "Negative"
                        : "None"}
                  </TableCell>
                  <TableCell data-testid="admin-history-table-row-view-details">
                    <Link
                      data-testid="admin-history-table-row-view-details-link"
                      tabIndex={0}
                      className={styles.tableLink}
                      onClick={() => {
                        storeAdminViewDetails({ parsedDate, items: item });
                        router.push("/admin/view-details");
                      }}
                    >
                      View details
                    </Link>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </LoadingBox>
      )}
    </Main>
  );
}
