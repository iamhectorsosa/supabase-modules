"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DynamicNavigationLinks: React.FC<{
  items: { href: string; label: string }[];
}> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className="space-x-1 lg:space-x-0 lg:space-y-1">
      {items.map(({ href, label }) => (
        <Button
          key={href}
          className="lg:w-full lg:justify-start"
          asChild
          variant="ghost"
        >
          {href === pathname ? (
            <span className="bg-accent">{label}</span>
          ) : (
            <Link href={href}>{label}</Link>
          )}
        </Button>
      ))}
    </div>
  );
};
