"use client";

import Link from "../Packages/Link/Link";
import { useResponsive, useSidebar } from "@/app/providers";

export default function SkipLink() {
  const { isSmallScreen } = useResponsive();
  const { isSidebarVisible } = useSidebar();

  return (
    <Link
      tabIndex={isSidebarVisible && isSmallScreen ? -1 : 0}
      data-testid="skip-link"
      href="#main"
      className="govuk-skip-link"
      data-module="govuk-skip-link"
    >
      Skip to main content
    </Link>
  );
}
