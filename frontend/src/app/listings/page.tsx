import Listings from "@/components/Listings/Listings";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function page({ searchParams }: Props) {
  const params = await searchParams;

  const newParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => newParams.append(key, v));
    } else if (value) {
      newParams.append(key, value);
    }
  });

  return (
    <div className="flex justify-center flex-col items-center [&>div]:w-full bg-neutral-100">
      <div />
      <Listings filterParamsURL={newParams.toString()} />
    </div>
  );
}

export default page;
