"use client";

import { redirect } from "next/navigation";
import { Button } from "../components";

// type LandingPageProps = {
//   searchParams: Promise<{ code?: string }>;
// };

export default function LandingPage() {
  // { searchParams }: LandingPageProps
  // const params = await searchParams;
  // const code = params?.code;
  // if (code) {
  //   redirect("/");
  // }

  return (
    <Button
      onClick={() => {
        redirect("/agreement");
      }}
    >
      Click me
    </Button>
  );
}
