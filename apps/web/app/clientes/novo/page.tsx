"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoClientePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        "http://localhost:3001/api/clients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
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
          data.message || "Não foi possível cadastrar o cliente."
        );
      }

      router.push("/clientes");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao cadastrar cliente."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7fc] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/clientes")}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para clientes
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-600">
            Clientes
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Novo cliente
          </h1>

          <p className="mt-2 text-slate-500">
            Cadastre as informações do cliente.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold">
                Nome *
              </span>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Nome completo"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

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
                placeholder="cliente@email.com"
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
                  setPhone(event.target.value)
                }
                placeholder="(16) 99999-9999"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block md:col-span-2">
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
          </div>

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
              placeholder="Informações adicionais sobre o cliente..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/clientes")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Cadastrando..." : "Cadastrar cliente"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
