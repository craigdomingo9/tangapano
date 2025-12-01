import { StudentComponentProps } from "@/lib/types/student";

function ListingDetail({ params, serverData }: StudentComponentProps) {
  console.log(params, serverData);
  return <div>ListingDetail</div>;
}

export default ListingDetail;
