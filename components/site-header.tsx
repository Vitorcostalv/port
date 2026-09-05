"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { navItems, person } from "@/content/portfolio";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-[var(--rule)] bg-[rgba(9,11,10,0.86)] backdrop-blur-md"
          : "border-[var(--rule-faint)] bg-transparent"
      }`}
    >
      <div
        className={`shell flex items-center justify-between transition-[height] duration-500 ${
          scrolled ? "h-14" : "h-[4.5rem]"
        }`}
      >
        <a
          href="#hero"
          className="group flex items-baseline gap-2.5 font-display text-2xl font-medium tracking-[0.06em] text-parchment"
        >
          <span>VC</span>
          <span className="font-mono text-[0.5625rem] uppercase tracking-seal text-brass transition-colors group-hover:text-brass-hi">
            MMXXVI
          </span>
        </a>

        <nav aria-label="Seções" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-draw pb-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-parchment-dim transition-colors duration-300 hover:text-parchment"
            >
              {item.label}
            </a>
          ))}
          <a
            href={person.cv}
            download
            className="link-draw pb-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-brass transition-colors duration-300 hover:text-brass-hi"
          >
            Currículo
          </a>
        </nav>

        <Dialog.Root>
          <Dialog.Trigger
            className="grid size-11 place-items-center border border-[var(--rule)] text-parchment transition-colors duration-300 hover:border-brass hover:text-brass-hi lg:hidden"
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-[60] bg-[rgba(9,11,10,0.82)] backdrop-blur-sm" />
            <Dialog.Popup className="fixed inset-x-0 top-0 z-[70] border-b border-[var(--rule)] bg-stone px-5 pb-8 pt-5 outline-none sm:px-8">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-mono text-[0.6875rem] uppercase tracking-seal text-brass">
                  Índice
                </Dialog.Title>
                <Dialog.Close
                  className="grid size-11 place-items-center border border-[var(--rule)] text-parchment transition-colors duration-300 hover:border-brass hover:text-brass-hi"
                  aria-label="Fechar menu"
                >
                  <CloseIcon />
                </Dialog.Close>
              </div>

              <nav aria-label="Seções" className="mt-6 flex flex-col">
                {navItems.map((item, index) => (
                  <Dialog.Close
                    key={item.href}
                    render={
                      <a
                        href={item.href}
                        className="flex min-h-14 items-baseline gap-4 border-t border-[var(--rule-faint)] py-3 font-display text-2xl text-parchment transition-colors duration-300 hover:text-brass-hi"
                      />
                    }
                  >
                    <span className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Dialog.Close>
                ))}
                <Dialog.Close
                  render={
                    <a
                      href={person.cv}
                      download
                      className="flex min-h-14 items-baseline gap-4 border-y border-[var(--rule-faint)] py-3 font-display text-2xl text-brass transition-colors duration-300 hover:text-brass-hi"
                    />
                  }
                >
                  <span className="font-mono text-[0.625rem] tracking-[0.2em] text-brass">
                    07
                  </span>
                  Currículo
                </Dialog.Close>
              </nav>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
