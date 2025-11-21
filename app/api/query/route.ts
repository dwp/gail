import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postQuery(req: NextRequest) {
  const { query, chat_history, location } = await req.json();

  const data = await requestHandler({
    req,
    route: "/query",
    body: JSON.stringify({ query, chat_history, location }),
  });

  return NextResponse.json({ ...data });
}

export const POST = withErrorHandler(postQuery);
