import StudentHeroBackground from "../portal/StudentHeroBackground";
import Header from "../Header";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import StudentHeroText from "../portal/StudentHeroText";
import SearchCard from "../portal/SearchCard";
import StudentFooter from "../portal/StudentFooter";

function StudentHome() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative selection:bg-crimson/20 selection:text-crimson flex flex-col transition-colors duration-300">
      <StudentHeroBackground />
      <Header variant="student">
        <Link href={"/partner/login"} prefetch={true} className="flex gap-2">
          <button className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Partner Login</span>
          </button>
        </Link>
      </Header>
      <StudentHeroText />
      <SearchCard />
      <StudentFooter />
    </div>
  );
}

export default StudentHome;
