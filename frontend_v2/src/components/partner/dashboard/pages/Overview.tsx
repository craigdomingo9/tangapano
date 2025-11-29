import Header from "@/components/student/Header";
import PartnerHeaderContent from "../PartnerHeaderContent";
import { RouteProps } from "@/routing/types";

function Overview({ serverData }: RouteProps) {
  const { user, accessToken } = serverData;

  return (
    <div>
      <Header variant="business" sticky className="dark:bg-app-header">
        <PartnerHeaderContent user={user} />
      </Header>
    </div>
  );
}

export default Overview;
