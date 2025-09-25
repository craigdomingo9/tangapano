import InputField from "@/components/universal/Form/Elements/InputField";
import { editExistingListingFormSchema } from "@/lib/services/forms/dashboard/listings/editExistingListingForm";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchCampuses from "@/lib/services/api/fetchCampuses";
import CampusSelector from "@/components/HomePage/CampusSelector";
import NeighborhoodSelector from "@/components/HomePage/NeighborhoodSelector";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CheckBoxField from "@/components/universal/Form/Elements/CheckBoxField";
import { MoonLoader } from "react-spinners";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useListingDialogState, useSelectedListing } from "@/lib/hooks/store";
import { useEffect } from "react";
import IntegerInputWithButton from "@/components/universal/Form/Elements/IntegerInputWithButton";

function EditExistingListing() {
  const form = useForm({
    resolver: zodResolver(editExistingListingFormSchema),
  });
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setDialog, entities: dialogState } =
    useListingDialogState();

  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => fetchCampuses({ params: {} }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editExistingListingFormSchema>) =>
      axios.patch(`/server/api/landlord-listings/${selectedListing?.id}`, data),
    onSuccess: () => {
      form.reset();
      setDialog(false);
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      toast.success("Listing was updated successfully.");
    },
  });

  async function onSubmit(data: z.infer<typeof editExistingListingFormSchema>) {
    await mutation.mutateAsync(data);
  }

  useEffect(() => {
    return () => {
      form.unregister();
      form.clearErrors();
      form.reset();
    };
  }, [dialogState]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log(errors)
          )}
        >
          <div className="grid space-y-4 place-items-center">
            <InputField
              form={form}
              fieldName="title"
              label="Title"
              placeholder="eg. Malvin Residence"
              defaultValue={selectedListing.title}
              inputClassName="w-64"
            />
            <CampusSelector
              form={form}
              campuses={campuses}
              labelClassName="text-black"
              selectClassName="w-64"
              defaultValue={selectedListing.campus.id.toString()}
              placeholder={selectedListing.campus.name}
            />
            <NeighborhoodSelector
              form={form}
              campuses={campuses}
              labelClassName="text-black"
              selectClassName="w-64"
              defaultValue={selectedListing.neighborhood.id.toString()}
              placeholder={selectedListing.neighborhood.name}
            />
            <IntegerInputWithButton
              form={form}
              fieldName="distance_from_campus"
              label="Distance from campus (in minutes)"
              defaultValue={Number(selectedListing.distance_from_campus)}
              min={1}
              max={120}
              step={1}
              className="max-w-64"
            />
            <CheckBoxField
              form={form}
              fieldName="apply_agent_fee"
              label="Apply Agent Fee"
              defaultChecked={selectedListing.apply_agent_fee}
              className="w-64"
            />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button
              onClick={() => setDialog(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg text-white font-medium"
            >
              {mutation.isPending ? (
                <MoonLoader color="white" size={15} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditExistingListing;
