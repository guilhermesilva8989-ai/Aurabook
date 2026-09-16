"use client";

import MobileNav from "@/app/components/MobileNav";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  notes?: string | null;
  createdAt?: string;
};

export default function ClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClient() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/clients/${id}`,
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

        if (!response.ok) {
          throw new Error("Não foi possível carregar o cliente.");
        }

        const data = await response.json();
        setClient(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar cliente."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadClient();
    }
  }, [id, router]);

  function formatDate(value?: string | null) {
    if (!value) return "Não informado";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value));
  }

  function formatPhone(value?: string | null) {
    if (!value) return "Não informado";

    const digits = value.replace(/\D/g, "");

    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return value;
  }

  function initials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando cliente...
          </p>
        </div>
      </main>
    );
  }

  if (error || !client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7fc] px-6">
        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-red-600">
            {error || "Cliente não encontrado."}
          </p>

          <button
            onClick={() => router.push("/clientes")}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Voltar para clientes
          </button>
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
            href="/dashboard"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◈ Dashboard
          </a>

          <a
            href="/agenda"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◷ Agenda
          </a>

          <a
            href="/clientes"
            className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
          >
            ♙ Clientes
          </a>

          <a
            href="/servicos"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✦ Serviços
          </a>

          <a
            href="/configuracoes"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ⚙ Configurações
          </a>
        </nav>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("aurabook_token");
            router.push("/login");
          }}
          className="mt-auto rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          Sair da conta
        </button>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200/70 bg-white">
          <div className="flex h-20 items-center px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">
                Gerenciamento
              </p>
              <h1 className="text-xl font-bold">
                Detalhes do cliente
              </h1>
            </div>
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.push("/clientes")}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para clientes
        </button>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              Clientes
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Detalhes do cliente
            </h1>

            <p className="mt-2 text-slate-500">
              Consulte as informações cadastradas.
            </p>
          </div>

          <button
            onClick={() =>
              router.push(`/clientes/${client.id}/editar`)
            }
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            Editar cliente
          </button>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">
                {initials(client.name)}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                  Cliente AuraBook
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {client.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
            <Info
              label="E-mail"
              value={client.email || "Não informado"}
            />

            <Info
              label="Telefone"
              value={formatPhone(client.phone)}
            />

            <Info
              label="Data de nascimento"
              value={formatDate(client.birthDate)}
            />

            <Info
              label="Cadastro"
              value={formatDate(client.createdAt)}
            />

            <div className="md:col-span-2">
              <Info
                label="Observações"
                value={client.notes || "Nenhuma observação cadastrada."}
              />
            </div>
          </div>
        </section>
          </div>
        </div>
      </div>
      <MobileNav />
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-5 py-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
