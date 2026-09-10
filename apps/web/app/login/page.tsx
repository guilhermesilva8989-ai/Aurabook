"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("guilherme@teste.com");
  const [password, setPassword] = useState("Teste1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Não foi possível entrar."
        );
      }

      localStorage.setItem(
        "aurabook_token",
        data.accessToken
      );

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#fbfaff]">
      <section className="relative hidden w-1/2 overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold">
            A
          </div>

          <div>
            <p className="text-xl font-bold">AuraBook</p>
            <p className="text-xs text-slate-400">
              Agenda inteligente
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Organização sem complicação
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
            Sua agenda inteira,
            <br />
            em um só lugar.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Controle clientes, serviços, profissionais e
            agendamentos de forma simples e eficiente.
          </p>
        </div>

        <p className="relative text-sm text-slate-500">
          © 2026 AuraBook
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-bold text-white">
                A
              </div>
              <p className="text-xl font-bold">AuraBook</p>
            </div>
          </div>

          <p className="text-sm font-semibold text-violet-600">
            Bem-vindo de volta
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Entre na sua conta
          </h2>

          <p className="mt-3 text-slate-500">
            Acesse sua agenda e acompanhe seu negócio.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-violet-600 px-5 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading
                ? "Entrando..."
                : "Entrar no AuraBook"}
            </button>
          </form>

          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full text-center text-sm font-semibold text-slate-500 transition hover:text-violet-600"
          >
            ← Voltar para o início
          </button>
        </div>
      </section>
    </main>
  );
}
