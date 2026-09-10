"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: string | number;
  active: boolean;
};

export default function EditarServicoPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadService() {
      const token = localStorage.getItem("aurabook_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/services/${id}`,
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

        if (!response.ok) {
          throw new Error("Não foi possível carregar o serviço.");
        }

        const service: Service = await response.json();

        setName(service.name);
        setDescription(service.description || "");
        setDuration(String(service.duration));
        setPrice(String(service.price).replace(".", ","));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar serviço."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadService();
    }
  }, [id, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim() || !duration || !price) {
      setError("Preencha nome, duração e valor.");
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
        `http://localhost:3001/api/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || undefined,
            duration: Number(duration),
            price: Number(price.replace(",", ".")),
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
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message ||
                "Não foi possível atualizar o serviço."
        );
      }

      router.push("/servicos");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar serviço."
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
            Carregando serviço...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7fc] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/servicos")}
          className="text-sm font-semibold text-slate-500 transition hover:text-violet-600"
        >
          ← Voltar para serviços
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-600">
            Serviços
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Editar serviço
          </h1>

          <p className="mt-2 text-slate-500">
            Atualize as informações do serviço.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-semibold">
              Nome do serviço *
            </span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-sm font-semibold">
              Descrição
            </span>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label>
              <span className="text-sm font-semibold">
                Duração em minutos *
              </span>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold">
                Valor *
              </span>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  R$
                </span>

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/servicos")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
