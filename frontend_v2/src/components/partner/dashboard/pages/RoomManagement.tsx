import { FullScreenView } from "@/components/ui/FullScreenView";
import { useListingDetail } from "@/hooks/use-reference-data";
import { useRouterPush } from "@/hooks/use-router-push";
import { RouteProps } from "@/routing/types";
import { ErrorPage } from "../overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import RoomsHeaderArea from "../rooms/RoomsHeaderArea";
import RoomsGrid from "../rooms/RoomsGrid";
import { useState } from "react";
import RoomEditorModal from "../rooms/RoomEditorModal";
import createEntityStore from "@/lib/stores/entityStore";
import useRoomActions from "@/hooks/use-room-actions";

export const useEditingRoom = createEntityStore<Room>({} as Room);

function RoomManagement({ params, serverData }: RouteProps) {
  const { push } = useRouterPush();
  const { listingId } = params;
  const { accessToken } = serverData;

  const { data: listing, isLoading } = useListingDetail(listingId!);

  const { entities: editingRoom, reset: resetEditingRoom } = useEditingRoom();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createRoom, updateRoom } = useRoomActions(accessToken, listingId);

  function handleSaveRoom(room: Room) {
    if (room.id) {
      updateRoom.mutate({
        data: room,
        roomId: room.id,
      });
    } else createRoom.mutate(room);

    setIsModalOpen(false);
    resetEditingRoom();
  }

  // Guards
  if (!accessToken) return <ErrorPage type="access" />;
  if (!listingId) return null;
  if (isLoading) return <LoadingScreen />;
  if (!listing) return <ErrorPage type="404" />;

  return (
    <FullScreenView
      title={`Rooms - ${listing.title}`}
      onBack={() => push({ page: "overview" })}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-2">
        {/* Header Area */}
        <RoomsHeaderArea setModalOpen={setIsModalOpen} listingId={listingId} />

        {/* Rooms Grid */}
        <RoomsGrid listing={listing} setIsModalOpen={setIsModalOpen} />

        {/* Modal */}
        {editingRoom && isModalOpen && (
          <RoomEditorModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveRoom}
          />
        )}
      </div>
    </FullScreenView>
  );
}

export default RoomManagement;
