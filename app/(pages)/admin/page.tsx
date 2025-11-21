import AdminView from "./AdminView";
import { AdminMetadata } from "@/app/constants/PageMetadata";
import { AuthWrapper } from "@/app/components";

export const dynamic = "force-dynamic";
export const metadata = AdminMetadata;

export default function AdminViewPage() {
  return (
    <AuthWrapper redirectConfig={{ redirect: true, redirectPage: "/chat" }}>
      <AdminView />
    </AuthWrapper>
  );
}
