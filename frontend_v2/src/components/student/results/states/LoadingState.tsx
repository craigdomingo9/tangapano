import { StudentListingCardSkeleton } from "../StudentListingCardSkeleton";

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in duration-500">
      {[1, 2, 3, 4].map((i) => (
        <StudentListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default LoadingState;
