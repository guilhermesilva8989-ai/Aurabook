"use client";

import MobileNav from "@/app/components/MobileNav";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  name: string;
  duration: number;
  price: string | number;
  active?: boolean;
};

type Professional = {
  id: string;
  name: string;
};

type Appointment = {
  id: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
  startsAt: string;
  notes?: string | null;
};

const API = "http://localhost:3001/api";

export default function EditarAgendamentoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professional, setProfessional] =
    useState<Professional | null>(null);

  const [professionalId, setProfessionalId] = useState("");
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
          appointmentResponse,
          clientsResponse,
          servicesResponse,
          professionalResponse,
        ] = await Promise.all([
          fetch(`${API}/appointments/${id}`, { headers }),
          fetch(`${API}/clients`, { headers }),
          fetch(`${API}/services`, { headers }),
          fetch(`${API}/professionals/me`, { headers }),
        ]);

        if (
          appointmentResponse.status === 401 ||
          clientsResponse.status === 401 ||
          servicesResponse.status === 401 ||
          professionalResponse.status === 401
        ) {
          localStorage.removeItem("aurabook_token");
          router.replace("/login");
          return;
        }

        if (!appointmentResponse.ok) {
          throw new Error("Agendamento não encontrado.");
        }

        const appointmentData: Appointment =
          await appointmentResponse.json();

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
                (service: Service) =>
                  service.active !== false ||
                  service.id === appointmentData.serviceId
              )
            : []
        );

        setProfessional(professionalData);

        setProfessionalId(
          appointmentData.professionalId ||
            professionalData.id
        );

        setClientId(appointmentData.clientId);
        setServiceId(appointmentData.serviceId);
        setNotes(appointmentData.notes || "");

        const start = new Date(appointmentData.startsAt);

        const localDate = [
          start.getFullYear(),
          String(start.getMonth() + 1).padStart(2, "0"),
          String(start.getDate()).padStart(2, "0"),
        ].join("-");

        const localTime = [
          String(start.getHours()).padStart(2, "0"),
          String(start.getMinutes()).padStart(2, "0"),
        ].join(":");

        setDate(localDate);
        setTime(localTime);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o agendamento."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !professionalId ||
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

    const token =
      localStorage.getItem("aurabook_token");

    const startsAt = new Date(
      `${date}T${time}:00`
    ).toISOString();

    try {
      const response = await fetch(
        `${API}/appointments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            professionalId,
            clientId,
            serviceId,
            startsAt,
            notes: notes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({}));

        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message ||
                "Não foi possível atualizar o agendamento."
        );
      }

      router.push("/agenda");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar agendamento."
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
            Carregando agendamento...
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
            <p className="text-xs text-slate-500">Agenda inteligente</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <a href="/dashboard" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">
            ◈ Dashboard
          </a>

          <a href="/agenda" className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white">
            ◷ Agenda
          </a>

          <a href="/clientes" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">
            ♙ Clientes
          </a>

          <a href="/servicos" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">
            ✦ Serviços
          </a>

          <a href="/configuracoes" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">
            ⚙ Configurações
          </a>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <div className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
        <button
          type="button"
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
            Editar agendamento
          </h1>

          <p className="mt-2 text-slate-500">
            Altere cliente, serviço, data ou horário.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label>
              <span className="text-sm font-semibold">
                Cliente *
              </span>

              <select
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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

            <label>
              <span className="text-sm font-semibold">
                Serviço *
              </span>

              <select
                value={serviceId}
                onChange={(event) =>
                  setServiceId(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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

            <label>
              <span className="text-sm font-semibold">
                Data *
              </span>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold">
                Horário *
              </span>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Salvando..."
                : "Salvar alterações"}
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
