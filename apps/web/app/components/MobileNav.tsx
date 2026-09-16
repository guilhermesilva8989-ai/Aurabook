"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "◈",
  },
  {
    href: "/agenda",
    label: "Agenda",
    icon: "◷",
  },
  {
    href: "/clientes",
    label: "Clientes",
    icon: "♙",
  },
  {
    href: "/servicos",
    label: "Serviços",
    icon: "✦",
  },
  {
    href: "/configuracoes",
    label: "Config.",
    icon: "⚙",
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(href + "/");
  }

  function logout() {
    localStorage.removeItem("aurabook_token");
    router.replace("/login");
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="h-24 lg:hidden"
      />

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950 px-2 pb-2 pt-2 text-white shadow-2xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-6 gap-1">
          {items.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition " +
                  (active
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white")
                }
              >
                <span className="text-base leading-none">
                  {item.icon}
                </span>

                <span className="max-w-full truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={logout}
            className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-base leading-none">
              ↪
            </span>

            <span>Sair</span>
          </button>
        </div>
      </nav>
    </>
  );
}
