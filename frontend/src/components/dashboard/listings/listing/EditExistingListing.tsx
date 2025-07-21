import SelectField from "@/components/HomePage/SelectField";
import InputField from "@/components/universal/Form/Elements/InputField";
import { createEditExistingListingForm, editExistingListingFormSchema } from "@/lib/services/forms/dashboard/listings/editExistingListingForm";
import { Form } from "react-hook-form";
import { useSelectedListing } from "../../CardButtons";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchCampuses from "@/lib/services/api/fetchCampuses";
import CampusSelector from "@/components/HomePage/CampusSelector";
import NeighborhoodSelector from "@/components/HomePage/NeighborhoodSelector";
import { Button } from "@/components/ui/button";
import { useListingDialogState } from "./ListingDialog";
import axios from "axios";
import CheckBoxField from "@/components/universal/Form/Elements/CheckBoxField";
import { MoonLoader } from "react-spinners";


function EditExistingListing() {
  const form = createEditExistingListingForm();
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setDialog } = useListingDialogState();

  const { data: campuses } = useQuery({ 
    queryKey: ['campuses'], 
    queryFn: fetchCampuses
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editExistingListingFormSchema>) => axios.patch(`/api/landlord-listings/${selectedListing?.id}`, data),
    onSuccess: () => {
      form.reset();
      setDialog(false);
      queryClient.invalidateQueries({queryKey: ["landlord-listings"]});
    }
  })

  async function onSubmit(data: z.infer<typeof editExistingListingFormSchema>) {

  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
          <div className="grid grid-cols-2 space-y-2 space-x-2">
            {/* <InputField 
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
            <CheckBoxField 
              form={form} 
              fieldName="is_available"
              label="Is Available"
              defaultChecked
            /> */}
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
  )
}

export default EditExistingListing
