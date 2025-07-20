import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import createEntityStore from "@/lib/store/entityStore"
import { useEffect } from "react";
import AmenitiesDialogContent from "./AmenitiesDialogContent";


export const useAmenitiesDialogState = createEntityStore<boolean>(false);
export const useSelectedAmenities = createEntityStore<Amenity[]>([]);

function AmenitiesDialog() {
  const { entities: dialog, setEntities: setDialog } = useAmenitiesDialogState();

  useEffect(() => {}, [dialog])

  return (
    <DialogContainer 
      state={dialog} 
      title={'Manage Amenities'} 
      description="Manage the amenities for your listing."
      onChange={() => setDialog(!dialog)}
    >
      <AmenitiesDialogContent />
    </DialogContainer>
  )
}

export default AmenitiesDialog

