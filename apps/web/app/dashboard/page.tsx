"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Appointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
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

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clientsCount, setClientsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const headers = {
        Authorization: "Bearer " + token,
      };

      try {
        const [meResponse, appointmentsResponse, clientsResponse, servicesResponse] =
          await Promise.all([
            fetch("http://localhost:3001/api/auth/me", { headers }),
            fetch("http://localhost:3001/api/appointments", { headers }),
            fetch("http://localhost:3001/api/clients", { headers }),
            fetch("http://localhost:3001/api/services", { headers }),
          ]);

        if (meResponse.status === 401) {
          localStorage.removeItem("aurabook_token");
          router.replace("/login");
          return;
        }

        const me = await meResponse.json();
        const appointmentsData = await appointmentsResponse.json();
        const clientsData = await clientsResponse.json();
        const servicesData = await servicesResponse.json();

        setUser(me.user ?? me);
        setAppointments(
          Array.isArray(appointmentsData) ? appointmentsData : []
        );
        setClientsCount(Array.isArray(clientsData) ? clientsData.length : 0);
        setServicesCount(Array.isArray(servicesData) ? servicesData.length : 0);
      } catch {
        console.error("Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

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
            Carregando AuraBook...
          </p>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter(
    (item) => item.startsAt.slice(0, 10) === today
  );

  const confirmed = appointments.filter(
    (item) => item.status === "CONFIRMED"
  ).length;

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
          <button className="flex w-full items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold">
            ◈ Dashboard
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            ◷ Agenda
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            ♙ Clientes
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            ✦ Serviços
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            ⚙ Configurações
          </button>
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="truncate text-sm font-semibold">
            {user?.name || "Usuário AuraBook"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {user?.email}
          </p>

          <button
            onClick={logout}
            className="mt-4 text-xs font-semibold text-violet-300 hover:text-white"
          >
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200/70 bg-white">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">
                Visão geral
              </p>
              <h1 className="text-xl font-bold">
                Dashboard
              </h1>
            </div>

            <button className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">
              + Novo agendamento
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section>
            <p className="text-sm font-medium text-violet-600">
              Bem-vindo ao AuraBook
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Olá, {user?.name || "Guilherme"} 👋
            </h2>

            <p className="mt-2 text-slate-500">
              Aqui está o resumo do seu negócio hoje.
            </p>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Card
              label="Agendamentos hoje"
              value={String(todayAppointments.length)}
              detail="Horários de hoje"
              icon="◷"
            />

            <Card
              label="Confirmados"
              value={String(confirmed)}
              detail="Na agenda"
              icon="✓"
            />

            <Card
              label="Clientes"
              value={String(clientsCount)}
              detail="Cadastrados"
              icon="♙"
            />

            <Card
              label="Serviços"
              value={String(servicesCount)}
              detail="Disponíveis"
              icon="✦"
            />
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">
                    Próximos agendamentos
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Seus atendimentos cadastrados
                  </p>
                </div>

                <span className="text-sm font-semibold text-violet-600">
                  {appointments.length} no total
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {appointments.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Nenhum agendamento encontrado.
                  </div>
                )}

                {appointments.slice(0, 5).map((appointment) => {
                  const date = new Date(appointment.startsAt);

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
                    >
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <span className="text-sm font-bold">
                          {date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {appointment.client?.name || "Cliente"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {appointment.service?.name || "Serviço"} ·{" "}
                          {appointment.professional?.name || "Profissional"}
                        </p>
                      </div>

                      <Status status={appointment.status} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-7 text-white shadow-xl shadow-violet-200">
              <p className="text-sm font-semibold text-violet-100">
                AuraBook
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Sua agenda em um só lugar.
              </h3>

              <p className="mt-3 text-sm leading-6 text-violet-100">
                Profissionais, clientes, serviços e horários organizados para você.
              </p>

              <div className="mt-8 rounded-2xl bg-white/15 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-widest text-violet-100">
                  Total de agendamentos
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {appointments.length}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {detail}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 font-bold text-violet-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    CANCELLED: "bg-red-50 text-red-700",
    COMPLETED: "bg-blue-50 text-blue-700",
    NO_SHOW: "bg-slate-100 text-slate-600",
  };

  const labels: Record<string, string> = {
    CONFIRMED: "Confirmado",
    PENDING: "Pendente",
    CANCELLED: "Cancelado",
    COMPLETED: "Concluído",
    NO_SHOW: "Não compareceu",
  };

  return (
    <span
      className={
        "rounded-full px-3 py-1.5 text-xs font-semibold " +
        (styles[status] || "bg-slate-100 text-slate-600")
      }
    >
      {labels[status] || status}
    </span>
  );
}
