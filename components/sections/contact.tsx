"use client";

import emailjs from "@emailjs/browser";
import { type FormEvent, useId, useState } from "react";
import { ArrowUpRightIcon, MailIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { contactChannels, person } from "@/content/portfolio";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const ids = useId();
  const sending = status.kind === "sending";

  /** Marca o campo como tocado: o estilo de inválido só vale depois disso,
   *  para nunca acusar erro em campo que o usuário ainda nem visitou. */
  function markTouched(event: { currentTarget: HTMLElement }) {
    event.currentTarget.dataset.touched = "true";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      const data = new FormData(form);
      const subject = encodeURIComponent(String(data.get("subject") || "Contato pelo portfólio"));
      const body = encodeURIComponent(
        `Nome: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
      );
      window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
      setStatus({ kind: "success", message: "Abrindo seu cliente de email." });
      return;
    }

    setStatus({ kind: "sending" });

    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });
      form.reset();
      for (const field of form.querySelectorAll<HTMLElement>("[data-touched]")) {
        delete field.dataset.touched;
      }
      setStatus({
        kind: "success",
        message: "Mensagem enviada. Respondo assim que possível.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Falha no envio. Use o email direto ou o LinkedIn ao lado.",
      });
    }
  }

  const fields = [
    { name: "name", label: "Nome", type: "text", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "subject", label: "Assunto", type: "text", autoComplete: "off" },
  ] as const;

  return (
    <section id="contato" className="defer-paint border-t border-[var(--rule)] py-28 sm:py-36">
      <div className="shell">
        <Reveal className="lg:max-w-[62%]">
          <p className="eyebrow">
            <span className="text-parchment-dim/60">06 </span>Correspondência
          </p>
          <h2 className="display mt-6 text-[clamp(2rem,7vw,3rem)]">
            Vamos transformar regra complexa em interface previsível.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="grid gap-6" noValidate={false}>
              {fields.map((field) => (
                <div key={field.name} className="grid gap-2">
                  <label
                    htmlFor={`${ids}-${field.name}`}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-parchment-dim"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`${ids}-${field.name}`}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    disabled={sending}
                    onBlur={markTouched}
                    className="control"
                  />
                </div>
              ))}

              <div className="grid gap-2">
                <label
                  htmlFor={`${ids}-message`}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-parchment-dim"
                >
                  Mensagem
                </label>
                <textarea
                  id={`${ids}-message`}
                  name="message"
                  rows={6}
                  required
                  disabled={sending}
                  onBlur={markTouched}
                  className="control resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <button type="submit" className="btn-brass" disabled={sending}>
                  <MailIcon />
                  {sending ? "Enviando…" : "Enviar mensagem"}
                </button>

                {/* Retorno dentro do próprio formulário, não em toast solto. */}
                <p
                  role="status"
                  aria-live="polite"
                  className={`flex min-h-5 items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${
                    status.kind === "error" ? "text-[#a8564f]" : "text-brass-hi"
                  }`}
                >
                  {status.kind !== "idle" ? (
                    <span
                      className={`inline-block size-1.5 shrink-0 ${
                        status.kind === "error"
                          ? "bg-[#a8564f]"
                          : status.kind === "sending"
                            ? "animate-pulse bg-brass"
                            : "bg-brass-hi"
                      }`}
                      aria-hidden
                    />
                  ) : null}
                  {status.kind === "sending" ? "Enviando" : ""}
                  {status.kind === "success" || status.kind === "error"
                    ? status.message
                    : ""}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.08}>
            <p className="font-mono text-[0.625rem] uppercase tracking-seal text-brass">
              Canais diretos
            </p>
            <ul className="mt-6">
              {contactChannels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex min-h-14 items-baseline justify-between gap-4 border-t border-[var(--rule-faint)] py-4 transition-colors duration-300"
                  >
                    <span>
                      <span className="block font-mono text-[0.625rem] uppercase tracking-[0.18em] text-parchment-dim/70">
                        {channel.label}
                      </span>
                      <span className="link-draw mt-1 inline-block font-display text-xl text-parchment transition-colors duration-300 group-hover:text-brass-hi group-hover:[background-size:100%_1px]">
                        {channel.value}
                      </span>
                    </span>
                    <ArrowUpRightIcon className="shrink-0 text-brass" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
