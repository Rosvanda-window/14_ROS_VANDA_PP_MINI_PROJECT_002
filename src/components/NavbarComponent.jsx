"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Avatar, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "../store/useCardStore";

const centerLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop", badge: "NEW" },
  { href: "/manage-products", label: "Manage Products" },
  { href: "/orders", label: "Orders" },
];

function CartBagIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
      />
    </svg>
  );
}

function linkActive(pathname, label) {
  if (label === "Home") return pathname === "/";
  if (label === "Shop") return pathname === "/products" || pathname.startsWith("/products/");
  if (label === "Orders") return pathname === "/orders";
  if (label === "Manage Products") return pathname === "/manage-products";
  return false;
}

function authLinkClass(pathname, path, filled = false) {
  const on = pathname === path;
  if (filled) {
    return on
      ? "rounded-full bg-lime-500 px-4 py-2 text-sm font-semibold text-gray-900"
      : "rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-lime-300";
  }
  return on
    ? "rounded-full px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300"
    : "rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:ring-1 hover:ring-gray-200";
}

export default function NavbarComponent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  
  // CART LOGIC
  const cart = useCartStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  
  // Calculate total items
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
  setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const linkClass = (active) =>
    `relative flex items-center rounded-full px-3 py-2 text-sm font-medium ${
      active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between py-3 px-4">
        {/* LOGO */}
        <Link href="/" className="text-lg font-semibold text-gray-900">
          PurelyStore
        </Link>

        {/* CENTER LINKS */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:flex gap-2">
          {centerLinks.map(({ href, label, badge }) => {
            const active = linkActive(pathname, label);
            return (
              <Link key={href} href={href} className={linkClass(active)}>
                {badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-lime-400 text-[9px] px-1 rounded-full">
                    {badge}
                  </span>
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {status === "loading" ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : session ? (
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <div className="cursor-pointer">
                    <Avatar 
                        name={session.user?.payload?.name?.charAt(0) || "U"}
                        size="sm" 
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={session.user?.name?.charAt(0) || "U"} size="md" />
                      <p className="text-sm font-medium">{session.user?.name || "User"}</p>
                    </div>
                    <div className="mt-4 border-t pt-3 space-y-2">
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left text-sm text-red-500 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link href="/login" className={authLinkClass(pathname, "/login")}>Log in</Link>
                <Link href="/register" className={authLinkClass(pathname, "/register", true)}>Register</Link>
              </>
            )}
          </div>

          {/* DYNAMIC CART ICON */}
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-50 transition">
            <CartBagIcon className="size-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-gray-900 shadow-sm animate-in fade-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </Link>

          <Button isIconOnly variant="light" onPress={() => setOpen(!open)} className="md:hidden">
            {open ? "✕" : "☰"}
          </Button>
        </div>
      </div>
    </header>
  );
}