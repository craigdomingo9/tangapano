import { toast } from "sonner";

export function successToast(message: string) {
  toast.success(message, {
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
      "--normal-text":
        "light-dark(var(--color-green-600), var(--color-green-400))",
      "--normal-border":
        "light-dark(var(--color-green-600), var(--color-green-400))",
    } as React.CSSProperties,
  });
}

export function warningToast(message: string) {
  toast.warning(message, {
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))",
      "--normal-text":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
      "--normal-border":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
    } as React.CSSProperties,
  });
}

export function errorToast(message: string) {
  toast.error(message, {
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))",
      "--normal-text": "light-dark(var(--color-red-600), var(--color-red-400))",
      "--normal-border":
        "light-dark(var(--color-red-600), var(--color-red-400))",
    } as React.CSSProperties,
  });
}

export function infoToast(message: string) {
  toast.info("This is for your information, please note.", {
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))",
      "--normal-text": "light-dark(var(--color-sky-600), var(--color-sky-400))",
      "--normal-border":
        "light-dark(var(--color-sky-600), var(--color-sky-400))",
    } as React.CSSProperties,
  });
}
