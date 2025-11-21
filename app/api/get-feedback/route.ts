import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function getFeedback(req: NextRequest) {
  const data = await requestHandler({
    req,
    route: "/get-feedback",
  });

  return NextResponse.json({
    ...data,
  });
}

export const GET = withErrorHandler(getFeedback);
