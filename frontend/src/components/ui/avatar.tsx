// "use client";

// import * as React from "react";
// import * as AvatarPrimitive from "@radix-ui/react-avatar";

// import { cn } from "@/lib/utils";

// function Avatar({
//   className,
//   ...props
// }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
//   return (
//     <AvatarPrimitive.Root
//       data-slot="avatar"
//       className={cn(
//         "relative flex size-8 shrink-0 overflow-hidden rounded-full",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// function AvatarImage({
//   className,
//   ...props
// }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
//   return (
//     <AvatarPrimitive.Image
//       data-slot="avatar-image"
//       className={cn("aspect-square size-full", className)}
//       {...props}
//     />
//   );
// }

// function AvatarFallback({
//   className,
//   ...props
// }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
//   return (
//     <AvatarPrimitive.Fallback
//       data-slot="avatar-fallback"
//       className={cn(
//         "bg-muted flex size-full items-center justify-center rounded-full",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// export { Avatar, AvatarImage, AvatarFallback };

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { getImageProps, ImageProps } from "next/image";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// Use proper types for AvatarImage
interface AvatarImageProps extends Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, 'src'> {
  src?: string;
  width?: number;
  height?: number;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ src, alt, width, height, ...props }, ref) => {
  if (!src) {
    return <AvatarPrimitive.Image ref={ref} alt={alt} {...props} />;
  }

  const size = width && height 
    ? { width: Number(width), height: Number(height) } 
    : { fill: true };

  try {
    const { props: nextOptimizedProps } = getImageProps({
      src,
      alt: alt || "",
      ...size,
      ...props,
    } as ImageProps);

    return <AvatarPrimitive.Image ref={ref} {...nextOptimizedProps} />;
  } catch (error) {
    // Fallback to regular image if getImageProps fails
    console.warn('Failed to optimize image with Next.js, using fallback:', error);
    return <AvatarPrimitive.Image ref={ref} src={src} alt={alt} {...props} />;
  }
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };