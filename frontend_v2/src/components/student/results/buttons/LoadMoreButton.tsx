import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

function LoadMoreButton({ isLoading, onClick }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mb-12">
      <Button
        onClick={() => onClick()}
        disabled={isLoading}
        size="lg"
        className="bg-lapis hover:bg-lapis-hover text-white px-8 rounded-full cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          "Load More Results"
        )}
      </Button>
    </div>
  );
}

export default LoadMoreButton;
