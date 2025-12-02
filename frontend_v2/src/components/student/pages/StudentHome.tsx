import StudentHeroBackground from "../portal/StudentHeroBackground";
import Header from "../Header";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import StudentHeroText from "../portal/StudentHeroText";
import SearchCard from "../portal/SearchCard";
import StudentFooter from "../portal/StudentFooter";
import { StudentComponentProps } from "@/lib/types/student";
import LoginButton from "../LoginButton";

function StudentHome({ params }: StudentComponentProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative selection:bg-crimson/20 selection:text-crimson flex flex-col transition-colors duration-300">
      <StudentHeroBackground />
      <Header variant="student">
        <LoginButton />
      </Header>
      <StudentHeroText />
      <SearchCard />
      <StudentFooter />
    </div>
  );
}

export default StudentHome;
