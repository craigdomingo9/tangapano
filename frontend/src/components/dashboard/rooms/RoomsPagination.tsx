import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RoomsPaginationProps {
  currentPage: number;
  totalPages: number;
  isMobile: boolean;
  onPageChange: (page: number) => void;
}

const PaginationEllipsis = () => (
  <PaginationItem>
    <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
      ...
    </span>
  </PaginationItem>
);

export const RoomsPagination = ({
  currentPage,
  totalPages,
  isMobile,
  onPageChange,
}: RoomsPaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPaginationItems = () => {
    if (isMobile) {
      return (
        <>
          <PaginationItem className="cursor-pointer">
            <PaginationLink
              isActive={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {currentPage > 3 && totalPages > 4 && <PaginationEllipsis />}

          {(() => {
            const pages = [];
            if (currentPage > 2 && currentPage <= totalPages) {
              pages.push(currentPage - 1);
            }
            if (currentPage > 1 && currentPage < totalPages) {
              pages.push(currentPage);
            }
            if (currentPage < totalPages - 1 && currentPage >= 1) {
              pages.push(currentPage + 1);
            }

            return pages.slice(0, 2).map((page) => (
              <PaginationItem key={page} className="cursor-pointer">
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ));
          })()}

          {currentPage < totalPages - 2 && totalPages > 4 && (
            <PaginationEllipsis />
          )}

          {totalPages > 1 && (
            <PaginationItem className="cursor-pointer">
              <PaginationLink
                isActive={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
        </>
      );
    }

    return (
      <>
        <PaginationItem className="cursor-pointer">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {currentPage > 3 && totalPages > 3 && <PaginationEllipsis />}

        {Array.from({ length: Math.min(3, totalPages) }).map((_, index) => {
          let pageNumber;
          if (currentPage <= 2) {
            pageNumber = index + 2;
          } else if (currentPage >= totalPages - 1) {
            pageNumber = totalPages - 2 + index;
          } else {
            pageNumber = currentPage - 1 + index;
          }

          if (
            pageNumber > 1 &&
            pageNumber < totalPages &&
            pageNumber <= totalPages
          ) {
            return (
              <PaginationItem key={pageNumber} className="cursor-pointer">
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return null;
        })}

        {currentPage < totalPages - 2 && totalPages > 3 && (
          <PaginationEllipsis />
        )}

        {totalPages > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
      </>
    );
  };

  return (
    <Pagination className="justify-center mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "cursor-pointer",
              currentPage === 1 && "opacity-50 pointer-events-none"
            )}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            className={cn(
              "cursor-pointer",
              currentPage === totalPages && "opacity-50 pointer-events-none"
            )}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
