"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  useActiveListing,
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";

const CheckCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const RemoveCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
  </svg>
);

function ListingRooms() {
  const { entities: activeListing } = useActiveListing();
  const { setEntities: setRoomsDialog } = useRoomsDialogState();
  const { setEntities: setSelectedListing } = useSelectedListing();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { setEntities: setSelectedRoom } = useSelectedRoom();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setItemsPerPage(4);
    else setItemsPerPage(6);
  }, [isMobile]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // You can adjust this number

  const { data, status, isPending } = useQuery({
    queryKey: ["rooms", activeListing?.id],
    queryFn: () =>
      axios.get(`/server/api/landlord-listings/${activeListing?.id}/rooms`),
    enabled: !!activeListing?.id,
  });

  if (!activeListing.rooms) {
    return null;
  }

  if (status !== "success" || isPending) {
    return (
      <div className="flex flex-col justify-start w-full">
        <div>
          <div className="flex flex-col gap-2 mt-6">
            <Skeleton className="h-8 w-72 mb-2" />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, indx) => (
            <div key={indx} className="grid space-y-2">
              <Skeleton className="h-16 w-full rounded-b-none" />
              <Skeleton className="h-28 w-full mb-4 rounded-t-none" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const rooms = data?.data || [];

  // Pagination logic
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRooms = rooms.slice(startIndex, endIndex);

  return (
    <div className="mb-10">
      <main>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-6">
          {activeListing.title} - Rooms
          <p className="text-sm text-gray-500 mb-2">
            Click a room to view details
          </p>
        </h3>

        {rooms.length === 0 && (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 text-sm">
              No rooms available for this listing.
              <br />
              Add some rooms to get started.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:h-[350px] md:h-[500px] lg:grid-cols-3 lg:h-[350px] place-items-center gap-6">
          {paginatedRooms.map((room: Room, indx: number) => {
            const studentsLeft = room.max_occupants - room.current_occupants;
            const statusInfo =
              room.is_full === true
                ? {
                    text: "Occupied",
                    color: "bg-green-500",
                    icon: <CheckCircleIcon className="text-white w-6 h-6" />,
                  }
                : {
                    text: `${studentsLeft} student${
                      studentsLeft > 1 ? "s" : ""
                    } left`,
                    color: "bg-yellow-500",
                    icon: <RemoveCircleIcon className="text-white w-6 h-6" />,
                  };
            return (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedListing(activeListing);
                  setRoomsDialog(true);
                  setSelectedRoom(room);
                  setOperation("edit");
                }}
                className={`
                    bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
                    w-[340px] sm:w-[280px] lg:w-[250px]
                    transition-all duration-300 cursor-pointer
                    hover:shadow-xl hover:scale-105
                    ${
                      room.is_full
                        ? "border-l-4 border-green-500"
                        : "border-l-4 border-yellow-500"
                    }
                  `}
              >
                {/* Status header with dynamic color */}
                <div
                  className={`${statusInfo.color} p-4 flex items-center justify-between`}
                >
                  <h2 className="text-xl font-bold text-white">
                    Room {room.room_number}
                  </h2>
                  {statusInfo.icon}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rent:
                    </span>
                    <span className="text-md font-semibold">
                      {room.rent_per_month}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span className="text-lg font-semibold">
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="justify-center mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    "cursor-pointer",
                    currentPage === 1 && "opacity-50"
                  )}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index} className="cursor-pointer">
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  className={cn(
                    "cursor-pointer",
                    currentPage === totalPages && "opacity-50"
                  )}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}

export default ListingRooms;
