export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">

        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            AuraBook
          </h1>

          <p className="mt-4 text-xl text-zinc-600">
            A agenda inteligente para profissionais que querem crescer
          </p>
        </div>


        <h2 className="max-w-3xl text-4xl font-bold leading-tight text-zinc-900">
          Organize seus horários.
          <br />
          Receba clientes.
          <br />
          Nunca perca oportunidades.
        </h2>


        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Uma plataforma completa para agendamento online,
          WhatsApp, lista de espera e gestão do seu negócio.
        </p>


        <button className="mt-10 rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-purple-700">
          Começar agora
        </button>


        <div className="mt-20 grid gap-6 md:grid-cols-4">

          <Card text="Agenda online" />

          <Card text="WhatsApp integrado" />

          <Card text="Lista de espera" />

          <Card text="Lembretes automáticos" />

        </div>

      </section>
    </main>
  );
}


function Card({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="font-medium text-zinc-800">
        ✓ {text}
      </p>
    </div>
  );
}