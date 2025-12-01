import { StudentComponentProps } from "@/lib/types/student";

function ExpressInterest({ params, serverData }: StudentComponentProps) {
  console.log(params, serverData);

  return <div>ExpressInterest</div>;
}

export default ExpressInterest;
