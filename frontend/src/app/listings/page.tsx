import Listings from "@/components/Listings/Listings";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function page({ searchParams }: Props) {
  const params = await searchParams;

  // Extract amenities (could be string or string[])
  const amenities = params.amenity;
  delete params.amenity;

  const filters = new URLSearchParams();

  // Append the remaining filters
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => filters.append(key, v));
    } else if (value) {
      filters.append(key, value);
    }
  });

  // Append amenities separately
  if (amenities) {
    (Array.isArray(amenities) ? amenities : [amenities]).forEach((amenity) => {
      filters.append("amenity", amenity);
    });
  }

  return (
    <div className="flex justify-center flex-col items-center [&>div]:w-full bg-neutral-100">
      <div />
      <Listings filterParamsURL={filters.toString()} />
    </div>
  );
}

export default page;
