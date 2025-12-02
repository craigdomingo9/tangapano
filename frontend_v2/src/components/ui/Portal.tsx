"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * A Portal component that renders its children into a new DOM node
 * appended to the end of the document body.
 *
 * This component is useful for rendering content that should not be
 * constrained by the parent component's layout (e.g. a modal or
 * tooltip). It also allows for easy cleanup of the rendered content
 * by removing the DOM node when the component is unmounted.
 */

export const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};
