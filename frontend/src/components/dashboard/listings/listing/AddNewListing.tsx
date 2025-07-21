import fetchAmenities from "@/lib/services/api/fetchAmenities"
import fetchCampuses from "@/lib/services/api/fetchCampuses"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useListingDialogState } from "./ListingDialog";
import { addNewListingFormSchema, createAddNewListingForm } from "@/lib/services/forms/dashboard/listings/addNewListingForm";
import { z } from "zod"
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import CampusSelector from "@/components/HomePage/CampusSelector";
import NeighborhoodSelector from "@/components/HomePage/NeighborhoodSelector";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import axios from "axios";


function AddNewListing() {
  const form = createAddNewListingForm();
  const queryClient = useQueryClient();
  const { setEntities: setDialog } = useListingDialogState();

  const { data: campuses } = useQuery({ 
    queryKey: ['campuses'], 
    queryFn: fetchCampuses
  });


  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof addNewListingFormSchema>) => axios.post("/api/landlord-listings", data),
    onSuccess: () => {
      form.reset();
      setDialog(false);
      queryClient.invalidateQueries({queryKey: ["landlord-listings"]});
    }
  })

  async function onSubmit(data: z.infer<typeof addNewListingFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
            <div className="grid space-y-4">
              <InputField 
                form={form} 
                fieldName="title" 
                label="Title" 
                placeholder="eg. Malvin Residence" 
                defaultValue={""}
                inputClassName="w-64"
              />
              <CampusSelector
                form={form}
                campuses={campuses}
                labelClassName="text-black"
                selectClassName="w-64"
              />
              <NeighborhoodSelector
                form={form}
                campuses={campuses}
                labelClassName="text-black"
                selectClassName="w-64"
              />
              <InputField 
                form={form} 
                fieldName="distance_from_campus" 
                label="Distance From Campus (in minutes)" 
                placeholder="eg. 15" 
                defaultValue={""}
                inputClassName="w-64"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button onClick={() => setDialog(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium">Cancel</Button>
              <Button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium">
                {mutation.isPending ? (
                  <MoonLoader
                    color="white"
                    size={15}
                  />
                ) : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddNewListing
