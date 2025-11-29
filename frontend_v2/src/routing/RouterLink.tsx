"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComponentProps, useMemo } from "react";
import { AppParams } from "./types";

interface Props extends Omit<ComponentProps<typeof Link>, "href"> {
  to: AppParams;
  preserveParams?: boolean;
}

export const RouterLink = ({
  to,
  preserveParams = false,
  children,
  ...props
}: Props) => {
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    // 1. Start with existing params if preserving, else empty
    const newParams = new URLSearchParams(
      preserveParams ? searchParams.toString() : ""
    );

    // 2. Merge in new params
    Object.entries(to).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    return "?" + newParams.toString();
  }, [to, preserveParams, searchParams]);

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};
