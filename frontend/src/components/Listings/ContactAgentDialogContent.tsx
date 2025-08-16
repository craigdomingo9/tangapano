import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/services/api/config";
import { useSelectedListingByStudent } from "@/lib/hooks/store";

function ContactAgentDialogContent() {
  const { entities: selectedListing } = useSelectedListingByStudent();
  const [selectedRoom, setSelectedRoom] = useState<Room>(
    selectedListing.rooms.at(0) as Room
  );

  const agentPhoneNumber = selectedListing.campus.agent.phone_number;
  const message = `Hello, I'm interested in the accommodation "${selectedListing.title}" listed on your platform.\nRoom ID: ${selectedRoom.id} Rent:${selectedRoom.rent_per_month}\nCan you please provide more details?`;

  // const whatsappUrl = `https://wa.me/${agentPhoneNumber}?text=${encodeURIComponent(
  //   message
  // )}`;

  const mutation = useMutation({
    mutationFn: (data: { contacted_agent: string; room: string }) =>
      axiosInstance.post("/interests/interests/", data),
  });

  async function handleClick() {
    await mutation.mutateAsync({
      contacted_agent: selectedListing.campus.agent.id,
      room: selectedRoom.id,
    });

    openWhatsApp();
  }

  function openWhatsApp() {
    // Use a temporary link element
    const link = document.createElement("a");
    link.href = `https://api.whatsapp.com/send?phone=${agentPhoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer"; // For security best practice

    // Append the link to the body (not strictly necessary but good practice)
    document.body.appendChild(link);

    // Programmatically click the link
    link.click();

    // Remove the temporary link element
    document.body.removeChild(link);
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      <p className="text-gray-800 font-semibold text-center text-sm">
        Please select the room you're interested in.
      </p>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mt-4">
        {selectedListing.rooms?.map((room, index) => {
          const spotsLeft = room.max_occupants - room.current_occupants;
          const spotsLeftText = `${spotsLeft} spot${
            spotsLeft > 1 ? "s" : ""
          } available`;

          return (
            <div
              key={room.id}
              className={cn(
                "flex items-center cursor-pointer justify-between last:mb-2 p-3 transition-all animate-in delay-100 rounded-lg bg-white shadow-sm",
                selectedRoom.id === room.id && "border bg-green-100",
                selectedRoom.id !== room.id && "border border-gray-200"
              )}
              onClick={() => setSelectedRoom(room)}
            >
              <div>
                <p className="font-semibold text-gray-800">Room {index + 1}</p>
                <p className="text-gray-600 text-sm">
                  ${parseFloat(room.rent_per_month).toFixed(2)}/month &middot;{" "}
                  {spotsLeftText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <Button className="h-12 w-full bg-af-blue" onClick={handleClick}>
          Contact Agent
        </Button>
      </div>
    </div>
  );
}

export default ContactAgentDialogContent;
