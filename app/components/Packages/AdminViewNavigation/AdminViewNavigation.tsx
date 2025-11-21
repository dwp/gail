import AuthWrapper from "../../AuthWrapper/AuthWrapper";
import Link from "../Link/Link";

type AdminViewNavigationProps = {
  className?: string;
};

export default function AdminViewNavigation({
  className,
}: AdminViewNavigationProps = {}) {
  return (
    <AuthWrapper redirectConfig={{ redirect: false }}>
      <Link
        href="/admin"
        className={`govuk-link ${className ?? ""}`}
        data-testid="admin-view-link-chat-page"
      >
        Admin
      </Link>
    </AuthWrapper>
  );
}
