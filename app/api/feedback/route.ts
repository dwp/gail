import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postFeedback(req: NextRequest) {
  const { id, types, message, is_response_useful } = await req.json();

  const data = await requestHandler({
    req,
    route: "/feedback",
    body: JSON.stringify({ id, types, message, is_response_useful }),
  });

  return NextResponse.json({
    ...data,
  });
}

export const POST = withErrorHandler(postFeedback);
