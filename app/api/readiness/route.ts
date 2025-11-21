import { NextResponse } from "next/server";

let isReady = true;

process.on("SIGTERM", () => {
  console.log("SIGTERM received, starting graceful shutdown");
  isReady = false;
  setTimeout(() => {
    console.log("Graceful shutdown is complete");
    process.exit(0);
  }, 5000);
});

export async function GET() {
  if (isReady) {
    return NextResponse.json({ status: "ready" }, { status: 200 });
  } else {
    return NextResponse.json({ status: "not ready" }, { status: 503 });
  }
}
