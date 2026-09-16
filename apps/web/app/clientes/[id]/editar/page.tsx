"use client";

import MobileNav from "@/app/components/MobileNav";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  notes?: string | null;
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          `http://localhost:3001/api/clients/${id}`,
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

        const client: Client = await response.json();

        setName(client.name);
        setEmail(client.email || "");
        setPhone(formatPhone(client.phone || ""));
        setNotes(client.notes || "");

        if (client.birthDate) {
          setBirthDate(client.birthDate.slice(0, 10));
        }
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    const token = localStorage.getItem("aurabook_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3001/api/clients/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim() || undefined,
            phone: phone.replace(/\D/g, "") || undefined,
            birthDate: birthDate
              ? new Date(birthDate + "T12:00:00").toISOString()
              : undefined,
            notes: notes.trim() || undefined,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("aurabook_token");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message ||
                "Não foi possível atualizar o cliente."
        );
      }

      router.push(`/clientes/${id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar cliente."
      );
    } finally {
      setSaving(false);
    }
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
                Editar cliente
              </h1>
            </div>
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push(`/clientes/${id}`)}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para o cliente
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-600">
            Clientes
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Editar cliente
          </h1>

          <p className="mt-2 text-slate-500">
            Atualize as informações cadastradas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <label className="block">
            <span className="text-sm font-semibold">
              Nome *
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">
                E-mail
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Telefone
              </span>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(formatPhone(event.target.value))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold">
              Data de nascimento
            </span>

            <input
              type="date"
              value={birthDate}
              onChange={(event) =>
                setBirthDate(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-sm font-semibold">
              Observações
            </span>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/clientes/${id}`)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
      <MobileNav />
    </main>
  );
}
