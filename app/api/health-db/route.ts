import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function getDBHealthCheck(req: NextRequest) {
  const data = await requestHandler({ req, route: "/health/db" });

  return NextResponse.json({
    ...data,
  });
}

export const GET = withErrorHandler(getDBHealthCheck);
