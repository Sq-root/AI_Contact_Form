"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Hamburger button (mobile only) ─────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-[60] flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span
          className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
            open ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
            open ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* ── Full-screen overlay ──────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-apl-ink transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-apl-line px-5 py-4">
          <div className="font-anton text-[13px] tracking-[2px]">
            AKSHAR PREMIER
            <span className="ml-2 text-apl-yellow">· S3</span>
          </div>
          <button
            onClick={close}
            className="font-mono text-[10px] tracking-[2px] text-white/50 hover:text-white"
          >
            CLOSE ×
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col justify-center gap-1 px-5">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="border-b border-apl-line py-5 font-anton text-[40px] uppercase tracking-[2px] text-white transition-colors hover:text-apl-yellow"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="p-5">
          <Link
            href="/register"
            onClick={close}
            className="block bg-apl-yellow py-5 text-center font-anton text-[18px] tracking-[1.5px] text-apl-ink"
          >
            JOIN SEASON 3 →
          </Link>
        </div>
      </div>
    </>
  );
}
