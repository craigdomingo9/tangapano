// components/rooms/listing-rooms.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useActiveListing,
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";
import { RoomsLoading } from "./RoomsLoading";
import { RoomsGrid } from "./RoomsGrid";
import { RoomsPagination } from "./RoomsPagination";

export function ListingRooms() {
  const { entities: activeListing } = useActiveListing();
  const { setEntities: setRoomsDialog } = useRoomsDialogState();
  const { setEntities: setSelectedListing } = useSelectedListing();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { setEntities: setSelectedRoom } = useSelectedRoom();

  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    setItemsPerPage(isMobile ? 4 : 6);
  }, [isMobile]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeListing]);

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
    return <RoomsLoading />;
  }

  const rooms = data?.data || [];
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRooms = rooms.slice(startIndex, endIndex);

  const handleRoomClick = (room: any) => {
    setSelectedListing(activeListing);
    setRoomsDialog(true);
    setSelectedRoom(room);
    setOperation("edit");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-10">
      <main>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-6">
          {activeListing.title} - Rooms
          <p className="text-sm text-gray-500 mb-2">
            Click a room to view details
          </p>
        </h3>

        <RoomsGrid
          rooms={paginatedRooms}
          listingTitle={activeListing.title}
          onRoomClick={handleRoomClick}
        />

        <RoomsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          isMobile={isMobile}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default ListingRooms;
