import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, requestHandler } from "@/app/utils/api";

async function postElaborate(req: NextRequest) {
  const { prev_chat, location } = await req.json();

  const data = await requestHandler({
    req,
    route: "/elaborate",
    body: JSON.stringify({ prev_chat, location }),
  });

  return NextResponse.json({
    ...data,
    refined: true,
  });
}

export const POST = withErrorHandler(postElaborate);
