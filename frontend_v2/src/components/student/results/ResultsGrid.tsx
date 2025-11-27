import { StudentListingCard } from "./StudentListingCard";

interface ResultsGridProps {
  results: any;
  onExpressInterest: (listingId: string) => void;
}

function ResultsGrid({ results, onExpressInterest }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {results.map((listing: Listing, index: number) => (
        <StudentListingCard
          key={`${listing.id}-${index}`}
          listing={listing}
          onExpressInterest={onExpressInterest}
        />
      ))}
    </div>
  );
}

export default ResultsGrid;
