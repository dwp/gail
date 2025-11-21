import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postDownloadRequest(req: NextRequest) {
  const { start_date, end_date, page, data } = await req.json();

  const pdfBlob = await requestHandler({
    req,
    route: "/generate-pdf",
    body: JSON.stringify({ start_date, end_date, page, data }),
  });

  return new NextResponse(pdfBlob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    },
  });
}

export const POST = withErrorHandler(postDownloadRequest);
