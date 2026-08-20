import * as React from "react";
import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  url?: string;
};

export function MenuItem({ label, url }: MenuItemProps) {
  return (
    <NavigationMenuItem>
      <Link href={url ?? "/"} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn([navigationMenuTriggerStyle(), "h-[50px] rounded-none font-bold px-5 bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10"])}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
