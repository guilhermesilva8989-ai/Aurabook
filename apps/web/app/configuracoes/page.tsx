"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Professional = {
  id: string;
  name: string;
  phone?: string | null;
  specialty?: string | null;
  status?: string;
  active?: boolean;
};

type Availability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

type Slot = {
  id?: string;
  startTime: string;
  endTime: string;
};

const API = "http://localhost:3001/api";

const DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

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

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [professional, setProfessional] =
    useState<Professional | null>(null);

  const [schedule, setSchedule] =
    useState<Record<number, Slot[]>>({
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    });

  const [originalIds, setOriginalIds] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("aurabook_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [professionalResponse, availabilityResponse] =
        await Promise.all([
          fetch(`${API}/professionals/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API}/availability/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      if (
        professionalResponse.status === 401 ||
        availabilityResponse.status === 401
      ) {
        localStorage.removeItem("aurabook_token");
        router.replace("/login");
        return;
      }

      if (!professionalResponse.ok) {
        throw new Error(
          "Não foi possível carregar o profissional."
        );
      }

      if (!availabilityResponse.ok) {
        throw new Error(
          "Não foi possível carregar os horários."
        );
      }

      const professionalData =
        await professionalResponse.json();

      const availabilityData: Availability[] =
        await availabilityResponse.json();

      setProfessional(professionalData);

      const nextSchedule: Record<number, Slot[]> = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };

      const ids: string[] = [];

      availabilityData
        .filter((item) => item.active !== false)
        .forEach((item) => {
          nextSchedule[item.dayOfWeek].push({
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
          });

          ids.push(item.id);
        });

      Object.keys(nextSchedule).forEach((day) => {
        nextSchedule[Number(day)].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
      });

      setSchedule(nextSchedule);
      setOriginalIds(ids);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar configurações."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function addSlot(day: number) {
    setSchedule((current) => ({
      ...current,
      [day]: [
        ...current[day],
        {
          startTime: "08:00",
          endTime: "18:00",
        },
      ],
    }));
  }

  function removeSlot(day: number, index: number) {
    setSchedule((current) => ({
      ...current,
      [day]: current[day].filter(
        (_, slotIndex) => slotIndex !== index
      ),
    }));
  }

  function updateSlot(
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) {
    setSchedule((current) => ({
      ...current,
      [day]: current[day].map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              [field]: value,
            }
          : slot
      ),
    }));
  }

  async function saveSchedule() {
    const token = localStorage.getItem("aurabook_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const slots = Object.entries(schedule).flatMap(
        ([day, periods]) =>
          periods.map((period) => ({
            ...period,
            dayOfWeek: Number(day),
          }))
      );

      for (const slot of slots) {
        if (!slot.startTime || !slot.endTime) {
          throw new Error(
            "Preencha o início e o fim de todos os períodos."
          );
        }

        if (slot.startTime === slot.endTime) {
          throw new Error(
            "O horário inicial e final não podem ser iguais."
          );
        }
      }

      const currentIds = slots
        .map((slot) => slot.id)
        .filter(Boolean) as string[];

      const removedIds = originalIds.filter(
        (id) => !currentIds.includes(id)
      );

      for (const id of removedIds) {
        const response = await fetch(
          `${API}/availability/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => ({}));

          throw new Error(
            data.message ||
              "Não foi possível remover um horário."
          );
        }
      }

      for (const slot of slots) {
        const body = {
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        };

        const response = await fetch(
          slot.id
            ? `${API}/availability/${slot.id}`
            : `${API}/availability`,
          {
            method: slot.id ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
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
                  "Não foi possível salvar os horários."
          );
        }
      }

      await loadData();

      setMessage("Horários atualizados com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar horários."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalPeriods = Object.values(schedule).reduce(
    (total, periods) => total + periods.length,
    0
  );

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
            <p className="font-bold">AuraBook</p>
            <p className="text-xs text-slate-500">Agenda inteligente</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <a
            href="/dashboard"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◈ Dashboard
          </a>

          <a
            href="/agenda"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ◷ Agenda
          </a>

          <a
            href="/clientes"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ♙ Clientes
          </a>

          <a
            href="/servicos"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✦ Serviços
          </a>

          <a
            href="/configuracoes"
            className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold text-white"
          >
            ⚙ Configurações
          </a>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="truncate text-sm font-semibold">
            {professional?.name || "Profissional AuraBook"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {professional?.specialty || "AuraBook"}
          </p>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("aurabook_token");
              router.push("/login");
            }}
            className="mt-4 text-xs font-semibold text-violet-300 hover:text-white"
          >
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200/70 bg-white">
          <div className="flex h-20 items-center px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">Seu negócio</p>
              <h1 className="text-xl font-bold">Configurações</h1>
            </div>
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold text-violet-600">
            Seu negócio
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Perfil e horários
          </h1>

          <p className="mt-2 text-slate-500">
            Confira seus dados profissionais e configure
            seus horários de atendimento.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">
                {professional?.name?.charAt(0).toUpperCase() ||
                  "A"}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                  Profissional
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {professional?.name || "Profissional"}
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Info
                label="Especialidade"
                value={
                  professional?.specialty ||
                  "Não informada"
                }
              />

              <Info
                label="Telefone"
                value={formatPhone(
                  professional?.phone
                )}
              />

              <Info
                label="Status"
                value={
                  professional?.status === "APPROVED"
                    ? "Aprovado"
                    : professional?.status ||
                      "Não informado"
                }
              />

              <Info
                label="Conta"
                value={
                  professional?.active === false
                    ? "Inativa"
                    : "Ativa"
                }
              />
            </div>

            <div className="mt-6 rounded-2xl bg-violet-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
                AuraBook
              </p>

              <p className="mt-2 text-sm leading-6 text-violet-800">
                Estes horários são usados para validar
                novos agendamentos e impedir marcações
                fora da sua disponibilidade.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold">
                  Horários de atendimento
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Sua disponibilidade semanal
                </p>
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                {totalPeriods} período(s)
              </span>
            </div>

            <div>
              {DAYS.map((dayName, day) => {
                const periods = schedule[day];

                return (
                  <div
                    key={day}
                    className="border-b border-slate-100 px-6 py-5 last:border-b-0"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                      <div className="w-40 shrink-0 pt-2">
                        <p className="font-semibold">
                          {dayName}
                        </p>

                        {periods.length === 0 && (
                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                            Folga
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        {periods.map(
                          (slot, index) => {
                            const crossesMidnight =
                              slot.startTime >
                              slot.endTime;

                            return (
                              <div
                                key={
                                  slot.id ||
                                  `${day}-${index}`
                                }
                                className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center"
                              >
                                <div className="grid flex-1 grid-cols-2 gap-3">
                                  <label>
                                    <span className="text-xs font-medium text-slate-400">
                                      Início
                                    </span>

                                    <input
                                      type="time"
                                      value={
                                        slot.startTime
                                      }
                                      onChange={(event) =>
                                        updateSlot(
                                          day,
                                          index,
                                          "startTime",
                                          event.target
                                            .value
                                        )
                                      }
                                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-semibold outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />
                                  </label>

                                  <label>
                                    <span className="text-xs font-medium text-slate-400">
                                      Fim
                                    </span>

                                    <input
                                      type="time"
                                      value={
                                        slot.endTime
                                      }
                                      onChange={(event) =>
                                        updateSlot(
                                          day,
                                          index,
                                          "endTime",
                                          event.target
                                            .value
                                        )
                                      }
                                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-semibold outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />
                                  </label>
                                </div>

                                {crossesMidnight && (
                                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                                    Vira o dia
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSlot(
                                      day,
                                      index
                                    )
                                  }
                                  className="rounded-xl border border-red-100 bg-white px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                  Remover
                                </button>
                              </div>
                            );
                          }
                        )}

                        <button
                          type="button"
                          onClick={() => addSlot(day)}
                          className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
                        >
                          + Adicionar período
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
              {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveSchedule}
                  className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Salvando..."
                    : "Salvar horários"}
                </button>
              </div>
            </div>
          </section>
        </div>
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
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
