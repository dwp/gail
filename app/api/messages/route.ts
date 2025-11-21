import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postMessagesRequest(req: NextRequest) {
  const { start_date, end_date, page } = await req.json();

  const data = await requestHandler({
    req,
    route: "/messages",
    body: JSON.stringify({ start_date, end_date, page }),
  });

  return NextResponse.json({
    ...data,
  });
}

export const POST = withErrorHandler(postMessagesRequest);
