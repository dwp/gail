import { AuthWrapper } from "@/app/components";
import AdminViewDetails from "./AdminViewDetails";
import { AdminViewMetadata } from "@/app/constants/PageMetadata";

export const dynamic = "force-dynamic";
export const metadata = AdminViewMetadata;

export default function AdminViewPage() {
  return (
    <AuthWrapper redirectConfig={{ redirect: true, redirectPage: "/chat" }}>
      <AdminViewDetails />
    </AuthWrapper>
  );
}
