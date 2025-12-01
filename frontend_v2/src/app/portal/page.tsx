import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { Suspense } from "react";
import StudentRouter from "./StudentRouter";
import { StudentContext, StudentParams } from "@/lib/types/student";
import { getListingMetadata } from "@/lib/api/server/fetch-listing";
import { Metadata, ResolvingMetadata } from "next";
import { resolveStudentMetadata } from "@/lib/metadata/student";

type StudentPortalProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// 1. GENERATE METADATA
export async function generateMetadata(
  { searchParams }: StudentPortalProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Delegate logic to the resolver
  return resolveStudentMetadata(await searchParams);
}

function StudentPortal({ searchParams }: StudentPortalProps) {
  return (
    <main className="flex flex-col min-h-screen">
      <Suspense fallback={<LoadingScreen />}>
        {/* Pass ONLY data. The routes are handled inside PartnerRouter. */}
        <StudentRouter
          serverData={{} as StudentContext}
          params={{} as StudentParams}
        />
      </Suspense>
    </main>
  );
}

export default StudentPortal;
