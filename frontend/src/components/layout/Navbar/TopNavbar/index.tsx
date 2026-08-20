import Link from "next/link";
import React from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import { Heart, ShoppingBag, ShoppingBasket } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import LoginPopover from "../LoginPopover";
import { uiLabels } from "@/data/ui-labels";

const data: NavMenu = [
  {
    id: 1,
    label: "☰  CATEGORY",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Rings",
        url: "/shop#men-clothes",
        description: "In attractive and spectacular colors and designs",
      },
      {
        id: 12,
        label: "Necklaces",
        url: "/shop#women-clothes",
        description: "Ladies, your style and tastes are important to us",
      },
      {
        id: 13,
        label: "Bracelets",
        url: "/shop#kids-clothes",
        description: "For all ages, with happy and beautiful colors",
      },
      {
        id: 14,
        label: "Objects",
        url: "/shop#bag-shoes",
        description: "Suitable for men, women and all tastes and styles",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "人気商品",
    url: "/shop#on-sale",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "おすすめの商品",
    url: "/shop#new-arrivals",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "新着商品",
    url: "/shop#brands",
    children: [],
  },
  { id: 5, type: "MenuItem", label: "人気商品", url: "/shop#popular", children: [] },
  { id: 6, type: "MenuItem", label: "割引商品", url: "/shop#sale", children: [] },
];

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 bg-[#1d293d] z-20 text-white shadow-sm">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 px-2 sm:px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-3 shrink-0">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className="inline-flex items-center whitespace-nowrap text-[18px] sm:text-xl lg:text-[22px] font-black leading-none tracking-[0.06em] mr-2 lg:mr-[90px] min-w-0 md:min-w-[190px]"
            aria-label={`${uiLabels.brand} home`}
          >
            <span className="text-white">{uiLabels.brand}</span>
          </Link>
        </div>
        <NavigationMenu className="category-nav-bar hidden md:flex order-last absolute -bottom-[50px] left-0 right-0 bg-[#173b52] w-full max-w-none h-[50px] p-0 justify-start">
          <NavigationMenuList className="space-x-0 [&>li+li]:!ml-0">
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeToggle />
        <InputGroup className="header-search hidden md:flex bg-white mr-3 lg:mr-12 text-[#333] rounded-sm h-[38px] max-w-[700px] overflow-hidden !p-0 !gap-0 focus-within:!shadow-none border-0 outline-none">
          <InputGroup.Input
            type="search"
            name="search"
            placeholder={uiLabels.searchPlaceholder}
            className="bg-transparent text-[#333] placeholder:text-[#777] px-4 h-full"
          />
          <button type="submit" aria-label="Search products" className="header-search-button shrink-0 w-14 h-full appearance-none border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 bg-[#173b52] hover:bg-[#0e2d41] flex items-center justify-center transition-colors">
            <Image priority src="/icons/search-black.svg" height={22} width={22} alt="" className="invert" />
          </button>
        </InputGroup>
        <div className="flex items-center gap-0 sm:gap-3 lg:gap-4 ml-auto min-w-0 md:min-w-[190px] justify-end shrink-0">
          <Link href="/search" className="block md:hidden mr-1 p-1">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-w-[22px] max-h-[22px] invert"
            />
          </Link>
          <LoginPopover />
          <Link href="/wishlist" className="group relative min-w-9 sm:min-w-12 flex flex-col items-center gap-1 p-0 sm:p-1 text-[#8d8f91] hover:text-white" aria-label="View favourites">
            <span className="relative w-8 h-8 flex items-center justify-center"><ShoppingBag size={29} strokeWidth={1.7}/><Heart size={11} strokeWidth={2} className="absolute top-[11px]"/><b className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-md bg-[#777] text-white text-[10px] leading-5 text-center">0</b></span>
            <span className="hidden sm:block text-[10px] font-bold text-white">{uiLabels.favourite}</span>
          </Link>
          <Link href="/cart" className="group relative min-w-9 sm:min-w-12 flex flex-col items-center gap-1 p-0 sm:p-1 text-[#8d8f91] hover:text-white" aria-label="View checkout cart">
            <span className="relative w-8 h-8 flex items-center justify-center"><ShoppingBasket size={31} strokeWidth={1.7}/><b className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-md bg-[#777] text-white text-[10px] leading-5 text-center">0</b></span>
            <span className="hidden sm:block text-[10px] font-bold text-white">{uiLabels.cart}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
