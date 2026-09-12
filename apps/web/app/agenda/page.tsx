"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  notes?: string | null;
  professional?: {
    name: string;
  };
  client?: {
    name: string;
  };
  service?: {
    name: string;
    price: string | number;
  };
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  COMPLETED: "Concluído",
  NO_SHOW: "Não compareceu",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  NO_SHOW: "bg-slate-100 text-slate-600",
};

export default function AgendaPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/appointments",
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

        setAppointments(
          Array.isArray(data)
            ? data.sort(
                (a, b) =>
                  new Date(a.startsAt).getTime() -
                  new Date(b.startsAt).getTime()
              )
            : []
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [router]);

  async function updateAppointmentStatus(
    id: string,
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
  ) {
    const token = localStorage.getItem("aurabook_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setUpdatingId(id);
    setActionError("");

    try {
      const response = await fetch(
        `http://localhost:3001/api/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;

        throw new Error(
          message || "Não foi possível atualizar o agendamento."
        );
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status }
            : appointment
        )
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o agendamento."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredAppointments = useMemo(() => {
    if (filter === "ALL") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === filter
    );
  }, [appointments, filter]);

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
            Carregando agenda...
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

          <button className="flex w-full rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold">
            ◷ Agenda
          </button>

          <button className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400">
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
                Agenda
              </h1>
            </div>

            <button
              onClick={() => router.push("/agenda/novo")}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              + Novo agendamento
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-600">
                Seus horários
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Agenda de atendimentos
              </h2>

              <p className="mt-2 text-slate-500">
                Visualize e acompanhe todos os agendamentos do seu negócio.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold">
                {appointments.length}
              </p>
            </div>
          </section>

          <section className="mt-8 flex flex-wrap gap-2">
            {[
              ["ALL", "Todos"],
              ["PENDING", "Pendentes"],
              ["CONFIRMED", "Confirmados"],
              ["COMPLETED", "Concluídos"],
              ["CANCELLED", "Cancelados"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={
                  "rounded-xl px-4 py-2.5 text-sm font-semibold transition " +
                  (filter === value
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300")
                }
              >
                {label}
              </button>
            ))}
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="font-bold">
                Atendimentos
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAppointments.length} agendamento(s) encontrado(s)
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {actionError && (
                <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {actionError}
                </div>
              )}

              {filteredAppointments.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600">
                    ◷
                  </div>

                  <p className="mt-4 font-semibold">
                    Nenhum agendamento encontrado
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Não existem horários para este filtro.
                  </p>
                </div>
              )}

              {filteredAppointments.map((appointment) => {
                const start = new Date(appointment.startsAt);
                const end = new Date(appointment.endsAt);

                return (
                  <article
                    key={appointment.id}
                    className="grid gap-5 px-6 py-5 transition hover:bg-slate-50/70 md:grid-cols-[110px_1fr_180px_150px] md:items-center"
                  >
                    <div>
                      <p className="text-lg font-bold text-violet-600">
                        {start.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        até{" "}
                        {end.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        {appointment.client?.name || "Cliente"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.service?.name || "Serviço"} ·{" "}
                        {appointment.professional?.name || "Profissional"}
                      </p>

                      {appointment.notes && (
                        <p className="mt-2 text-xs text-slate-400">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {start.toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Data do atendimento
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={
                        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold " +
                        (statusStyles[appointment.status] ||
                          "bg-slate-100 text-slate-600")
                      }
                    >
                      {statusLabels[appointment.status] ||
                        appointment.status}
                    </span>

                    {appointment.status === "PENDING" && (
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "CONFIRMED"
                            )
                          }
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === appointment.id
                            ? "Atualizando..."
                            : "Confirmar"}
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "CANCELLED"
                            )
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {appointment.status === "CONFIRMED" && (
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "COMPLETED"
                            )
                          }
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Concluir
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "NO_SHOW"
                            )
                          }
                          className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Não compareceu
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment.id}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "CANCELLED"
                            )
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
