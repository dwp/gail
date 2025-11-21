import { request } from "undici";
import { NextRequest } from "next/server";
import { setAccessToken } from "@/app/utils/api";

const { NEXT_PUBLIC_BASE_URL } = process.env;

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("session-id") ?? "";
  const constructedRoute = `${NEXT_PUBLIC_BASE_URL}/download-messages-csv`;
  const { start_date, end_date, page, feedback_types } = await req.json();
  try {
    const { statusCode, headers, body } = await request(constructedRoute, {
      method: "POST",
      headers: {
        "x-access-token": setAccessToken(req),
        "session-id": sessionId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_date, end_date, page, feedback_types }),
    });

    if (statusCode !== 200) {
      return new Response(`Backend error: ${statusCode}`, {
        status: statusCode,
      });
    }

    // undici's body is a stream, convert to Buffer for binary CSV blob
    const csvBuffer = Buffer.from(await body.arrayBuffer());
    return new Response(csvBuffer, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=messages.csv",
        ...(headers["content-length"] && {
          "Content-Length": headers["content-length"] as string,
        }),
      },
    });
  } catch (error) {
    return new Response(`Request failed: ${error}`, { status: 500 });
  }
}
