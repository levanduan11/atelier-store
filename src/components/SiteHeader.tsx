"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/outerwear", label: "Outerwear" },
  { href: "/accessories", label: "Accessories" },
  { href: "/new", label: "New In" },
];

// "overlay" floats over a hero in white (pair with a dark gradient behind it);
// "solid" sits in the page flow in black with a hairline underneath.
export function SiteHeader({ variant = "overlay" }: { variant?: "overlay" | "solid" }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={
        variant === "overlay"
          ? "absolute inset-x-0 top-0 z-20 text-paper"
          : "border-line relative z-20 border-b bg-paper text-ink"
      }
    >
      <div className="container-page site-header justify-between">
        <nav aria-label="Primary" className="hidden flex-1 gap-8 whitespace-nowrap lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-nav">
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="link-nav lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <Link
          href="/"
          className="text-heading absolute left-1/2 -translate-x-1/2 tracking-[0.3em]"
        >
          Atelier
        </Link>

        <div className="flex flex-1 justify-end gap-6 whitespace-nowrap">
          <Link href="/search" className="link-nav hidden lg:inline">
            Search
          </Link>
          <Link href="/account" className="link-nav hidden lg:inline">
            Account
          </Link>
          <Link href="/cart" className="link-nav">
            Bag (0)
          </Link>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="bg-ink text-paper container-page flex flex-col gap-5 pb-8 pt-6 lg:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-lg uppercase"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="link-nav mt-2">
            Account
          </Link>
        </nav>
      )}
    </header>
  );
}
