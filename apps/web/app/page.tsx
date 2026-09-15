const appointments = [
  {
    time: "09:00",
    name: "Marcos Oliveira",
    service: "Corte de cabelo",
    duration: "30 min",
    status: "Confirmado",
  },
  {
    time: "10:00",
    name: "Lucas Mendes",
    service: "Barba",
    duration: "20 min",
    status: "Confirmado",
  },
  {
    time: "11:00",
    name: "Rafael Santos",
    service: "Corte + Barba",
    duration: "50 min",
    status: "Pendente",
  },
];

const features = [
  {
    icon: "calendar",
    title: "Agenda inteligente",
    description:
      "Controle seus horários, bloqueios, folgas e atendimentos em um só lugar.",
  },
  {
    icon: "users",
    title: "Gestão de clientes",
    description:
      "Mantenha o histórico e as informações dos seus clientes organizados.",
  },
  {
    icon: "bell",
    title: "Lembretes automáticos",
    description:
      "Reduza faltas e mantenha seus clientes informados sobre os agendamentos.",
  },
  {
    icon: "clock",
    title: "Disponibilidade",
    description:
      "Configure horários de trabalho, folgas e jornadas que atravessam a madrugada.",
  },
];

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  if (name === "calendar") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
      >
        <path d="M7 2v4M17 2v4M3.5 9.5h17" />
        <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
      >
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6M16 5.5a3 3 0 0 1 0 5.5M17 14c2.7.4 4.2 2.4 4.5 5" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
      >
        <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <path d="M5 12h14M14 7l5 5-5 5" />
      </svg>
    );
  }

  return null;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-slate-950">
      <div className="pointer-events-none absolute left-1/2 top-[-350px] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />

      <header className="relative z-10 border-b border-purple-100/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-purple-200">
              A
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">AuraBook</p>
              <p className="-mt-1 text-xs text-slate-500">
                Agenda inteligente
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-violet-600" href="#recursos">
              Recursos
            </a>
            <a className="transition hover:text-violet-600" href="#agenda">
              Agenda
            </a>
            <a className="transition hover:text-violet-600" href="#negocio">
              Para seu negócio
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
            href="/cadastro"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
          >
            Entrar
          </a>

            <a
            href="/cadastro"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Começar agora
          </a>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Sua agenda, mais inteligente
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Menos tempo
            <br />
            organizando.
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Mais tempo crescendo.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Organize sua agenda, clientes, profissionais e serviços em uma
            plataforma simples feita para quem vive de atendimento.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
            href="/cadastro"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-200 transition hover:bg-violet-700"
          >
            Criar minha agenda
              <Icon
                name="arrow"
                className="h-5 w-5 transition group-hover:translate-x-1"
              />
            </a>

            <a
            href="#recursos"
            className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
          >
            Ver como funciona
          </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>✓ Configuração rápida</span>
            <span>✓ Agenda online</span>
            <span>✓ Gestão completa</span>
          </div>
        </div>

        <div id="agenda" className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[48px] bg-gradient-to-br from-violet-200/50 to-fuchsia-200/30 blur-2xl" />

          <div className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_30px_80px_rgba(77,46,124,0.16)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Minha agenda
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Quinta-feira, 10 de setembro
                </p>
              </div>

              <button className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white">
                + Novo horário
              </button>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-100">
              <div className="p-5">
                <p className="text-xs font-medium text-slate-500">Hoje</p>
                <p className="mt-1 text-2xl font-bold">8</p>
                <p className="mt-1 text-xs text-emerald-600">+2 esta semana</p>
              </div>

              <div className="border-x border-slate-100 p-5">
                <p className="text-xs font-medium text-slate-500">
                  Confirmados
                </p>
                <p className="mt-1 text-2xl font-bold">6</p>
                <p className="mt-1 text-xs text-slate-400">75% da agenda</p>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium text-slate-500">
                  Faturamento
                </p>
                <p className="mt-1 text-2xl font-bold">R$ 320</p>
                <p className="mt-1 text-xs text-violet-600">Hoje</p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Próximos atendimentos</p>
                <p className="text-xs font-medium text-violet-600">
                  Ver agenda completa
                </p>
              </div>

              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.time}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="w-14 shrink-0">
                      <p className="font-bold text-slate-950">
                        {appointment.time}
                      </p>
                      <p className="text-xs text-slate-400">
                        {appointment.duration}
                      </p>
                    </div>

                    <div className="h-10 w-px bg-slate-200" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {appointment.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {appointment.service}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                        appointment.status === "Confirmado"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                Sua agenda está organizada para hoje
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recursos"
        className="border-y border-slate-100 bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              Tudo em um só lugar
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Feito para simplificar sua rotina
            </h2>

            <p className="mt-4 text-slate-600">
              O AuraBook cuida da organização enquanto você cuida dos seus
              clientes.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Icon name={feature.icon} />
                </div>

                <h3 className="mt-5 font-bold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="negocio" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-slate-950 px-8 py-14 text-white md:px-14 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
              AuraBook
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
              Sua agenda merece trabalhar por você.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              Centralize seus atendimentos e tenha mais controle sobre seu
              negócio.
            </p>
          </div>

          <a
          href="/login"
          className="mt-8 rounded-2xl bg-white px-7 py-4 text-center font-bold text-slate-950 transition hover:bg-violet-100 lg:mt-0"
        >
          Começar gratuitamente
        </a>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
              A
            </div>
            AuraBook
          </div>

          <p>Agenda inteligente para profissionais.</p>
        </div>
      </footer>
    </main>
  );
}
