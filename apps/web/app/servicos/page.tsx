"use client";

import MobileNav from "@/app/components/MobileNav";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: string | number;
  active: boolean;
};

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/services",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("aurabook_token");
          router.replace("/login");
          return;
        }

        const data = await response.json();

        setServices(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [router]);

  function logout() {
    localStorage.removeItem("aurabook_token");
    router.push("/login");
  }

  function formatMoney(value: string | number) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando serviços...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7fc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 p-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold">
            A
          </div>

          <div>
            <p className="font-bold">AuraBook</p>
            <p className="text-xs text-slate-500">
              Agenda inteligente
            </p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <a
            
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
           href="/dashboard">
            ◈ Dashboard
          </a>

          <a
            
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
           href="/agenda">
            ◷ Agenda
          </a>

          <a
            
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
           href="/clientes">
            ♙ Clientes
          </a>

          <a className="flex w-full rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold"  href="/servicos">
            ✦ Serviços
          </a>

          <a className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400"  href="/configuracoes">
            ⚙ Configurações
          </a>
        </nav>

        <button
          onClick={logout}
          className="mt-auto rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          Sair da conta
        </button>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200/70 bg-white">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">
                Gerenciamento
              </p>

              <h1 className="text-xl font-bold">
                Serviços
              </h1>
            </div>

            <button
              onClick={() => router.push("/servicos/novo")}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              + Novo serviço
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-600">
                Catálogo de serviços
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Serviços oferecidos
              </h2>

              <p className="mt-2 text-slate-500">
                Gerencie preços, duração e disponibilidade dos seus serviços.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold">
                {services.length}
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl text-violet-600">
                    ✦
                  </div>

                  <span
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-semibold " +
                      (service.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500")
                    }
                  >
                    {service.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {service.name}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                  {service.description || "Sem descrição cadastrada."}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Duração
                    </p>

                    <p className="mt-1 font-bold">
                      {service.duration} min
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-4">
                    <p className="text-xs text-violet-500">
                      Valor
                    </p>

                    <p className="mt-1 font-bold text-violet-700">
                      {formatMoney(service.price)}
                    </p>
                  </div>
                </div>

                <button
                    onClick={() =>
                      router.push(`/servicos/${service.id}/editar`)
                    }
                    className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
                  >
                    Editar serviço
                  </button>
              </article>
            ))}

            {services.length === 0 && (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-14 text-center">
                <p className="font-semibold">
                  Nenhum serviço cadastrado
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Cadastre seu primeiro serviço para começar.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
      <MobileNav />
    </main>
  );
}
