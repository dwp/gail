import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postequest(req: NextRequest) {
  const data = await requestHandler({
    req,
    route: "/user-groups",
    body: JSON.stringify({}),
  });

  return NextResponse.json({
    ...data,
  });
}

export const POST = withErrorHandler(postequest);
