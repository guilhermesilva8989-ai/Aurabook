"use client";

import MobileNav from "@/app/components/MobileNav";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoServicoPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim() || !duration || !price) {
      setError(
        "Preencha nome, duração e valor do serviço."
      );
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
        "/api/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim() || undefined,
            duration: Number(duration),
            price: Number(
              price.replace(",", ".")
            ),
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
                "Não foi possível cadastrar o serviço."
        );
      }

      router.push("/servicos");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao cadastrar serviço."
      );
    } finally {
      setSaving(false);
    }
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ♙ Clientes
          </a>

          <a
            href="/servicos"
            className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
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
                Novo serviço
              </h1>
            </div>
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/servicos")}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para serviços
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-600">
            Serviços
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Novo serviço
          </h1>

          <p className="mt-2 text-slate-500">
            Cadastre um serviço disponível para seus clientes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <label className="block">
            <span className="text-sm font-semibold">
              Nome do serviço *
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ex.: Corte masculino"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-sm font-semibold">
              Descrição
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              placeholder="Descreva o serviço..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">
                Duração em minutos *
              </span>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                placeholder="30"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Valor *
              </span>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  R$
                </span>

                <input
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="50,00"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-4">
            <p className="text-sm font-medium text-violet-900">
              O novo serviço será criado como ativo e ficará disponível para novos agendamentos.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/servicos")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Cadastrando..."
                : "Cadastrar serviço"}
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
