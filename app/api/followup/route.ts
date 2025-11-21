import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postFollowUp(req: NextRequest) {
  const { prev_chat, location } = await req.json();

  const data = await requestHandler({
    req,
    route: "/followup",
    body: JSON.stringify({ prev_chat, location }),
  });

  return NextResponse.json({
    ...data,
    generatedFollowUps: true,
  });
}

export const POST = withErrorHandler(postFollowUp);
