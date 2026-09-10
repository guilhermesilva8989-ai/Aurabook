"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  notes?: string | null;
  createdAt: string;
};

export default function ClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/clients",
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

        setClients(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, [router]);

  const filteredClients = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return clients;
    }

    return clients.filter((client) =>
      [
        client.name,
        client.email ?? "",
        client.phone ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [clients, search]);

  function logout() {
    localStorage.removeItem("aurabook_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando clientes...
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
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◈ Dashboard
          </button>

          <button
            onClick={() => router.push("/agenda")}
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◷ Agenda
          </button>

          <button className="flex w-full rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold">
            ♙ Clientes
          </button>

          <button className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400">
            ✦ Serviços
          </button>

          <button className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400">
            ⚙ Configurações
          </button>
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
                Clientes
              </h1>
            </div>

            <button className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">
              + Novo cliente
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-600">
                Sua base de clientes
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Clientes cadastrados
              </h2>

              <p className="mt-2 text-slate-500">
                Consulte e organize as informações dos seus clientes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold">
                {clients.length}
              </p>
            </div>
          </section>

          <section className="mt-8">
            <div className="max-w-md">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, e-mail ou telefone..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="font-bold">
                Lista de clientes
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredClients.length} cliente(s) encontrado(s)
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredClients.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600">
                    ♙
                  </div>

                  <p className="mt-4 font-semibold">
                    Nenhum cliente encontrado
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tente realizar outra busca.
                  </p>
                </div>
              )}

              {filteredClients.map((client) => (
                <article
                  key={client.id}
                  className="grid gap-5 px-6 py-5 transition hover:bg-slate-50/70 md:grid-cols-[1.2fr_1fr_1fr_140px] md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                      {client.name
                        .split(" ")
                        .slice(0, 2)
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {client.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Cliente AuraBook
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {client.email || "E-mail não informado"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      E-mail
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {client.phone || "Telefone não informado"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Telefone
                    </p>
                  </div>

                  <div className="md:text-right">
                    <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600">
                      Ver cliente
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
