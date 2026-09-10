"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Professional = {
  id: string;
  name: string;
  phone?: string | null;
  specialty?: string | null;
  status: string;
  active: boolean;
};

type Availability = {
  id: string;
  professionalId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

const days = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [professional, setProfessional] =
    useState<Professional | null>(null);

  const [availability, setAvailability] =
    useState<Availability[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const headers = {
        Authorization: "Bearer " + token,
      };

      try {
        const [professionalResponse, availabilityResponse] =
          await Promise.all([
            fetch(
              "http://localhost:3001/api/professionals/me",
              { headers }
            ),
            fetch(
              "http://localhost:3001/api/availability/me",
              { headers }
            ),
          ]);

        if (
          professionalResponse.status === 401 ||
          availabilityResponse.status === 401
        ) {
          localStorage.removeItem("aurabook_token");
          router.replace("/login");
          return;
        }

        const professionalData =
          await professionalResponse.json();

        const availabilityData =
          await availabilityResponse.json();

        setProfessional(professionalData);

        setAvailability(
          Array.isArray(availabilityData)
            ? availabilityData.filter(
                (item: Availability) => item.active
              )
            : []
        );
      } catch (error) {
        console.error(
          "Erro ao carregar configurações:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [router]);

  const schedule = useMemo(() => {
    return days.map((day) => ({
      ...day,
      periods: availability.filter(
        (item) => item.dayOfWeek === day.value
      ),
    }));
  }, [availability]);

  function logout() {
    localStorage.removeItem("aurabook_token");
    router.push("/login");
  }

  function isOvernight(
    startTime: string,
    endTime: string
  ) {
    return endTime <= startTime;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando configurações...
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
            <p className="font-bold">
              AuraBook
            </p>

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

          <button
            onClick={() => router.push("/clientes")}
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ♙ Clientes
          </button>

          <button
            onClick={() => router.push("/servicos")}
            className="flex w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✦ Serviços
          </button>

          <button className="flex w-full rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold">
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
          <div className="flex h-20 items-center px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">
                Conta e funcionamento
              </p>

              <h1 className="text-xl font-bold">
                Configurações
              </h1>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section>
            <p className="text-sm font-semibold text-violet-600">
              Seu negócio
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Perfil e horários
            </h2>

            <p className="mt-2 text-slate-500">
              Confira seus dados profissionais e horários de atendimento.
            </p>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.65fr_1.35fr]">
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">
                  {professional?.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase() || "A"}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Profissional
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {professional?.name ||
                      "Profissional AuraBook"}
                  </h3>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                <Info
                  label="Especialidade"
                  value={
                    professional?.specialty ||
                    "Não informada"
                  }
                />

                <Info
                  label="Telefone"
                  value={
                    professional?.phone ||
                    "Não informado"
                  }
                />

                <Info
                  label="Status"
                  value={
                    professional?.status === "APPROVED"
                      ? "Aprovado"
                      : professional?.status || "-"
                  }
                />

                <Info
                  label="Conta"
                  value={
                    professional?.active
                      ? "Ativa"
                      : "Inativa"
                  }
                />
              </div>

              <div className="mt-7 rounded-2xl bg-violet-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
                  AuraBook
                </p>

                <p className="mt-2 text-sm leading-6 text-violet-900">
                  Estes horários são usados para validar novos agendamentos e evitar marcações fora da sua disponibilidade.
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="font-bold">
                    Horários de atendimento
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Sua disponibilidade semanal
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                  {availability.length} período(s)
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {schedule.map((day) => (
                  <div
                    key={day.value}
                    className="grid gap-3 px-6 py-5 md:grid-cols-[180px_1fr_100px] md:items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {day.label}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {day.periods.length === 0 ? (
                        <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                          Folga
                        </span>
                      ) : (
                        day.periods.map((period) => (
                          <div
                            key={period.id}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <span className="rounded-xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                              {period.startTime} às{" "}
                              {period.endTime}
                            </span>

                            {isOvernight(
                              period.startTime,
                              period.endTime
                            ) && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                vira o dia
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="md:text-right">
                      <span
                        className={
                          "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold " +
                          (day.periods.length > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500")
                        }
                      >
                        {day.periods.length > 0
                          ? "Disponível"
                          : "Folga"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
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
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
