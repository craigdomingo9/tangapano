"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BaseParams } from "./types";
import { useNavigationStore } from "@/lib/stores/navigationStore";

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
  onClick,
  ...props
}: Props) => {
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigationStore();

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

  // Intercept the click to start the loader
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Trigger the Global Loader
    startNavigation();

    // 2. Call any other onClick handlers passed from parent
    if (onClick) onClick(e);
  };

  return (
    <Link
      {...props}
      href={href}
      scroll={true}
      prefetch={true}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};
