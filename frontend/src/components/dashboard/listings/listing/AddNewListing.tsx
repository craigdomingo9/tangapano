import fetchCampuses from "@/lib/services/api/fetchCampuses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewListingFormSchema } from "@/lib/services/forms/dashboard/listings/addNewListingForm";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/universal/Form/Elements/InputField";
import CampusSelector from "@/components/HomePage/CampusSelector";
import NeighborhoodSelector from "@/components/HomePage/NeighborhoodSelector";
import IntegerInputWithButton from "@/components/universal/Form/Elements/IntegerInputWithButton";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useListingDialogState } from "@/lib/hooks/store";
import CheckBoxField from "@/components/universal/Form/Elements/CheckBoxField";
import { Input } from "@/components/ui/input";

function AddNewListing() {
  const form = useForm({
    resolver: zodResolver(addNewListingFormSchema),
    defaultValues: { title: "" },
  });

  const queryClient = useQueryClient();
  const { setEntities: setDialog } = useListingDialogState();

  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => fetchCampuses({ params: {} }),
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof addNewListingFormSchema>) =>
      axios.post("/server/api/landlord-listings", data),
    onSuccess: () => {
      form.reset();
      setDialog(false);
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      toast.success("Listing was added successfully.");
    },
  });

  async function onSubmit(data: z.infer<typeof addNewListingFormSchema>) {
    await mutation.mutateAsync(data);
  }

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
          >
            <div className="grid space-y-4 items-center place-items-center">
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
                defaultValue={""}
              />
              <NeighborhoodSelector
                form={form}
                campuses={campuses}
                labelClassName="text-black"
                selectClassName="w-64"
              />
              <IntegerInputWithButton
                form={form}
                fieldName="distance_from_campus"
                label="Distance from campus"
                defaultValue={15}
                min={1}
                max={120}
                step={1}
              />
              <CheckBoxField
                form={form}
                fieldName="apply_agent_fee"
                label="Apply Agent Fee"
                defaultChecked
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
    </div>
  );
}

export default AddNewListing;
