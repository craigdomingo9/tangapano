import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";


function ImageSelectorField({
  form, 
  defaultImage, 
  fieldName, 
  label, 
}: {
  form: UseFormReturn<any, any, any>,
  defaultImage?: string,
  fieldName: string,
  label: string,
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!defaultImage) return;

    setImagePreview(defaultImage);
  }, [defaultImage, imagePreview])
  


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field : { onChange} }) => (
        <FormItem>
          <FormLabel className="text-opacity font-semibold">{label}</FormLabel>
            <FormControl>
              <div className="grid">
                <Input
                  type="file" 
                  accept="image/*" 
                  className="file:mr-4 file:py-1 file:px-1 file:rounded-full file:border-0 text-sm file:text-xs file:font-semibold w-64 cursor-pointer hover:file:"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onChange(e.target.files[0]); // Set the first file
                      handleImageChange(e);
                    }
                  }}
                  id={fieldName}
                />
              </div>
            </FormControl>
          <FormMessage />
        </FormItem>
        )}
        />
  )
}

export default ImageSelectorField


