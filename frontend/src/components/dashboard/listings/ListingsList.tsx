import ListingCard from "./ListingCard";

type Props = {
  listings: Listing[];
};

function ListingsList({ listings }: Props) {
  // console.log(listings);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-4">
      {listings?.map((listing: Listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default ListingsList;
