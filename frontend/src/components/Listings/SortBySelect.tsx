import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";



function SortBySelect() {

  const [sortValue, setSortValue] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!sortValue) return;

    const params = new URLSearchParams(window.location.search);
    params.set("ordering", sortValue);

    router.push(`/listings?${params.toString()}`);
    router.refresh();
  }, [sortValue, router])

  return (
    <div className="flex justify-end m-2">
      <Select value={sortValue} onValueChange={setSortValue} defaultValue="price">
        <Label className="mr-2">Sort By</Label>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={"e.g. Rent"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            <SelectItem value="price">Rent</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SortBySelect
