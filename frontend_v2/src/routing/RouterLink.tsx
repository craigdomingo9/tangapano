"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BaseParams } from "./types";

interface Props {
  to: BaseParams;
  preserveParams?: boolean;
  className?: string;
  [key: string]: any;
}

export const RouterLink = ({
  to,
  preserveParams = false,
  children,
  ...props
}: Props) => {
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const newParams = new URLSearchParams(
      preserveParams ? searchParams.toString() : ""
    );

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
