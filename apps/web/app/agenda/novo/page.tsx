"use client";

import MobileNav from "@/app/components/MobileNav";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  name: string;
  duration: number;
  price: string | number;
};

type Professional = {
  id: string;
  name: string;
};

export default function NovoAgendamentoPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professional, setProfessional] =
    useState<Professional | null>(null);

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const headers = {
        Authorization: "Bearer " + token,
      };

      try {
        const [
          clientsResponse,
          servicesResponse,
          professionalResponse,
        ] = await Promise.all([
          fetch("/api/clients", {
            headers,
          }),
          fetch("/api/services", {
            headers,
          }),
          fetch(
            "/api/professionals/me",
            { headers }
          ),
        ]);

        if (
          clientsResponse.status === 401 ||
          servicesResponse.status === 401 ||
          professionalResponse.status === 401
        ) {
          localStorage.removeItem("aurabook_token");
          router.replace("/login");
          return;
        }

        const clientsData = await clientsResponse.json();
        const servicesData = await servicesResponse.json();
        const professionalData =
          await professionalResponse.json();

        setClients(
          Array.isArray(clientsData) ? clientsData : []
        );

        setServices(
          Array.isArray(servicesData)
            ? servicesData.filter(
                (service: Service & { active?: boolean }) =>
                  service.active !== false
              )
            : []
        );

        setProfessional(professionalData);
      } catch {
        setError(
          "Não foi possível carregar os dados do agendamento."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !professional ||
      !clientId ||
      !serviceId ||
      !date ||
      !time
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    setError("");

    const token = localStorage.getItem("aurabook_token");

    const startsAt = new Date(
      `${date}T${time}:00`
    ).toISOString();

    try {
      const response = await fetch(
        "/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            professionalId: professional.id,
            clientId,
            serviceId,
            startsAt,
            notes: notes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Não foi possível criar o agendamento."
        );
      }

      router.push("/agenda");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar agendamento."
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
            Carregando...
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
            className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
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
                Novo agendamento
              </h1>
            </div>
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/agenda")}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para agenda
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-600">
            Agenda
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Novo agendamento
          </h1>

          <p className="mt-2 text-slate-500">
            Selecione cliente, serviço, data e horário.
          </p>
        </div>

        {(clients.length === 0 || services.length === 0) && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">
              Antes de criar seu primeiro agendamento
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Você precisa cadastrar pelo menos um cliente e um serviço.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {clients.length === 0 && (
                <a
                  href="/clientes/novo"
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                  + Cadastrar cliente
                </a>
              )}

              {services.length === 0 && (
                <a
                  href="/servicos/novo"
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                  + Cadastrar serviço
                </a>
              )}

              <a
                href="/configuracoes"
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Configurar horários
              </a>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">
                Cliente *
              </span>

              <select
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              >
                <option value="">
                  Selecione um cliente
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Serviço *
              </span>

              <select
                value={serviceId}
                onChange={(event) =>
                  setServiceId(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              >
                <option value="">
                  Selecione um serviço
                </option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name} · {service.duration} min ·{" "}
                    {Number(service.price).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Data *
              </span>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Horário *
              </span>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
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
              placeholder="Informações adicionais sobre o atendimento..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="mt-6 rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
              Profissional
            </p>

            <p className="mt-1 font-semibold text-violet-900">
              {professional?.name ||
                "Profissional não encontrado"}
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
              onClick={() => router.push("/agenda")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving || clients.length === 0 || services.length === 0}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Criando..."
                : "Criar agendamento"}
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
