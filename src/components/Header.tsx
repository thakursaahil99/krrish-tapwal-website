"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { ArrowUpRightIcon, CloseIcon, MenuIcon, MountainIcon, YouTubeIcon } from "./icons";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide while scrolling down, show again on scroll up
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4 || y < 400) setHidden(false);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href.includes("#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : ""
        } ${scrolled && !open ? "bg-ink/70 shadow-[0_1px_0_rgb(243_244_248/0.08)] backdrop-blur-xl" : ""}`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6 md:h-24">
          <Link href="/" className="group relative z-10 flex items-center gap-3" aria-label={`${site.name} — Home`}>
            <span className="grid size-10 place-items-center rounded-full bg-neon text-ink transition duration-500 group-hover:rotate-[-12deg] group-hover:scale-105">
              <MountainIcon width={22} height={22} strokeWidth={2.2} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight">{site.name}</span>
              <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone">{site.brand}</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="glass flex items-center gap-1 rounded-full px-2 py-1.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-[0.8rem] font-semibold transition duration-300 ${
                      isActive(l.href) ? "bg-snow text-ink" : "text-snow/80 hover:bg-snow/10 hover:text-snow"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !min-h-11 !px-5 sm:inline-flex">
              <YouTubeIcon width={18} height={18} /> Subscribe
            </a>
            <button
              type="button"
              className="glass grid size-11 place-items-center rounded-full lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
            </button>
          </div>
        </div>
        {/* Reading progress */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-neon" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </header>

      {/* Mobile menu: full-screen sheet with staggered links */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-20">
          <ul>
            {navLinks.map((l, i) => (
              <li key={l.href} className="overflow-hidden border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-4 font-display text-4xl font-bold tracking-tight transition duration-700 ease-[var(--ease-out-expo)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  } ${isActive(l.href) ? "text-neon" : "text-snow"}`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  {l.label}
                  <ArrowUpRightIcon width={24} height={24} className="text-stone" />
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10 w-full">
            <YouTubeIcon width={18} height={18} /> Subscribe on YouTube
          </a>
        </nav>
      </div>
    </>
  );
}
