"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

const PasswordField = ({
  title,
  form,
  fieldName,
}: {
  title: string;
  form: UseFormReturn<any, any, any>;
  fieldName: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const id = useId();

  return (
    <div className="w-full max-w-xs space-y-2 text-gray-700">
      <Label htmlFor={id}>{title}</Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          {...form.register(fieldName)}
          placeholder="••••••••••••"
          className="pr-9 text-sm"
        />
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className="sr-only">
            {isVisible ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      {form.formState.errors?.[fieldName] && (
        <p className="text-destructive text-xs">
          {form.formState.errors?.[fieldName]?.message as any}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
