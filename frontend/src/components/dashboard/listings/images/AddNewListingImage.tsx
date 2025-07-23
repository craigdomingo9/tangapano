import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
import ImageSelectorField from "@/components/universal/Form/Elements/ImageSelectorField";
import { addNewListingImageFormSchema, createAddNewListingImageForm } from "@/lib/services/forms/dashboard/listings/addNewListingImage"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";
import { useListingImageDialogOperation } from "./ListingImageDialog";
import { MoonLoader } from "react-spinners";
import InputField from "@/components/universal/Form/Elements/InputField";
import { useSelectedListing } from "../../CardButtons";
import { toast } from "sonner";


function AddNewListingImage() {
  const { setEntities: setOperation } = useListingImageDialogOperation();
  const { entities: selectedListing } = useSelectedListing();

  const form = createAddNewListingImageForm();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: any) => axios.post("/api/landlord-listings/images", data),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({queryKey: ["landlord-listings"]});
      queryClient.invalidateQueries({queryKey: ["images", selectedListing?.id]});
      setOperation("list");
      toast.success("Image was added successfully.")
    }
  })

  async function onSubmit(data: z.infer<typeof addNewListingImageFormSchema>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) formData.append(key, value);

    formData.append("listing", selectedListing.id);
    await mutation.mutateAsync(formData);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
          <div className="grid space-y-4 place-items-center">
            <ImageSelectorField
              form={form} 
              fieldName="image" 
              label="Listing Image" 
            />
            <InputField
              form={form} 
              fieldName="caption" 
              label="Image Caption (Optional)" 
              inputClassName="w-64"
              defaultValue={" "}
            />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button onClick={() => setOperation("list")} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium">Cancel</Button>
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

export default AddNewListingImage
