import Listings from "@/components/Listings/Listings";

type Props = {
  searchParams: { [key: string]: any }
}

async function page({searchParams}: Props) {

  const params = await searchParams;

  const amenities = params.amenity;
  delete params.amenity;

  const filters = new URLSearchParams(params);
  amenities?.map((amenity: string) => {
    filters.append("amenity", amenity);
  });

  return (
    <div className="flex justify-center min-h-dvh flex-col items-center [&>div]:w-full">
      <div />
      <Listings 
        filterParamsURL={filters.toString()} 
      />
    </div>
  )
}

export default page