"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { submitContactAction, type ContactFormState } from "@/app/actions/contact";
import { ClipReveal } from "@/components/ui/ClipReveal";

const INITIAL_STATE: ContactFormState = { status: "idle" };

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-error">
      <AlertCircle size={12} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

interface ContactProps {
  location?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
}

export const Contact = ({ location, email, phone, whatsapp }: ContactProps) => {
  const [state, formAction, isPending] = useActionState(submitContactAction, INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setTouched({});
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status === "error" && state.errors) {
      setTouched({ name: true, email: true, phone: true, message: true });
    }
  }, [state.status, state.errors]);

  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const displayLocation = location || "Kerala, India";
  const displayEmail    = email    || "info@csglaze.com";
  const displayPhone    = phone    || whatsapp || null;

  return (
    <section id="contact" className="section-spacing bg-background relative overflow-hidden">
      {/* Top line */}
      <div className="line-h absolute top-0 left-0 right-0 opacity-25" />

      {/* Spatial background depth */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary opacity-[0.03] rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent opacity-[0.04] rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: "-2s" }} />

      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">

          {/* ── LEFT: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="line-accent animated" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                Get in Touch
              </span>
            </div>

            <ClipReveal>
              <h2
                className="font-heading font-bold text-primary leading-tight mb-4"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Request a Technical Proposal
              </h2>
            </ClipReveal>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px bg-gradient-to-r from-accent via-accent/30 to-transparent mb-6 w-3/4"
            />

            <p className="text-base lg:text-lg text-text-secondary leading-relaxed mb-10 max-w-[480px]">
              Connect with our engineering team to discuss structural requirements, materiality, and project timelines.
            </p>

            {/* Contact Info — spatial glass cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 group p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(252,163,17,0.1)] group-hover:shadow-[0_4px_12px_rgba(252,163,17,0.15)] transition-shadow">
                  <MapPin size={17} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-primary text-sm mb-0.5">Location</h3>
                  <p className="text-text-secondary text-sm">{displayLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(252,163,17,0.1)] group-hover:shadow-[0_4px_12px_rgba(252,163,17,0.15)] transition-shadow">
                  <Mail size={17} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-primary text-sm mb-0.5">Direct Inquiry</h3>
                  <a
                    href={`mailto:${displayEmail}`}
                    className="text-text-secondary text-sm hover:text-accent transition-colors"
                  >
                    {displayEmail}
                  </a>
                </div>
              </div>

              {displayPhone && (
                <div className="flex items-start gap-4 group p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(252,163,17,0.1)] group-hover:shadow-[0_4px_12px_rgba(252,163,17,0.15)] transition-shadow">
                    <Phone size={17} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary text-sm mb-0.5">Phone</h3>
                    <a
                      href={`tel:${displayPhone.replace(/\s+/g, "")}`}
                      className="text-text-secondary text-sm hover:text-accent transition-colors"
                    >
                      {displayPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative vertical line accent */}
            <div className="mt-10 flex items-center gap-4">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent to-transparent opacity-60" />
              <p className="text-xs text-text-tertiary font-mono">
                Response within 1 business day
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT: Form — spatial elevated card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="card-spatial p-7 lg:p-10 relative overflow-hidden"
              style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.02), 0 8px 20px rgba(0,0,0,0.05), 0 24px 64px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,1)" }}
            >
              {/* Corner line accents */}
              <div className="line-corner-tl" />
              <div className="line-corner-br" />

              {state.status === "success" ? (
                <div className="flex flex-col items-center justify-center min-h-[360px] gap-3 text-center w-full">
                  <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mb-1 shadow-[0_4px_16px_rgba(34,197,94,0.15)]">
                    <CheckCircle2 size={28} className="text-success" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-2xl font-heading font-bold text-primary">
                      Proposal Request Sent
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Our engineering team will reach out within 1 business day. We&apos;ve received your enquiry!
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form ref={formRef} className="space-y-5" action={formAction} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="floating-field">
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        placeholder=" "
                        onBlur={blur("name")}
                        className={`w-full px-4 py-3 rounded-xl border bg-[#f5f6f8] text-primary focus:outline-none focus:ring-2 transition-all text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:bg-white focus:shadow-none ${
                          touched.name && state.errors?.name
                            ? "border-error focus:ring-error/20"
                            : "border-border/40 focus:ring-accent/20 focus:border-accent"
                        }`}
                      />
                      <label htmlFor="contact-name">
                        Full Name <span className="text-error">*</span>
                      </label>
                      {touched.name && <FieldErr msg={state.errors?.name} />}
                    </div>

                    {/* Company */}
                    <div className="floating-field">
                      <input
                        type="text"
                        id="contact-company"
                        name="company"
                        placeholder=" "
                        className="w-full px-4 py-3 rounded-xl border border-border/40 bg-[#f5f6f8] text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white focus:shadow-none transition-all text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)]"
                      />
                      <label htmlFor="contact-company">Company</label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="floating-field">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      placeholder=" "
                      onBlur={blur("email")}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#f5f6f8] text-primary focus:outline-none focus:ring-2 transition-all text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:bg-white focus:shadow-none ${
                        touched.email && state.errors?.email
                          ? "border-error focus:ring-error/20"
                          : "border-border/40 focus:ring-accent/20 focus:border-accent"
                      }`}
                    />
                    <label htmlFor="contact-email">
                      Email Address <span className="text-error">*</span>
                    </label>
                    {touched.email && <FieldErr msg={state.errors?.email} />}
                  </div>

                  {/* Phone */}
                  <div className="floating-field">
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder=" "
                      onBlur={blur("phone")}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#f5f6f8] text-primary focus:outline-none focus:ring-2 transition-all text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:bg-white focus:shadow-none ${
                        touched.phone && state.errors?.phone
                          ? "border-error focus:ring-error/20"
                          : "border-border/60 focus:ring-accent/20 focus:border-accent"
                      }`}
                    />
                    <label htmlFor="contact-phone">Phone Number</label>
                    {touched.phone && <FieldErr msg={state.errors?.phone} />}
                  </div>

                  {/* Message */}
                  <div className="floating-field">
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder=" "
                      onBlur={blur("message")}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#f5f6f8] text-primary focus:outline-none focus:ring-2 transition-all resize-none text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:bg-white focus:shadow-none ${
                        touched.message && state.errors?.message
                          ? "border-error focus:ring-error/20"
                          : "border-border/60 focus:ring-accent/20 focus:border-accent"
                      }`}
                    />
                    <label htmlFor="contact-message">
                      Project Details <span className="text-error">*</span>
                    </label>
                    {touched.message && <FieldErr msg={state.errors?.message} />}
                  </div>

                  {/* Server-level error */}
                  {state.status === "error" && state.message && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-light border border-error/20 text-error text-sm">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {state.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-8 py-3.5 font-heading font-semibold text-[15px] text-on-accent gradient-accent rounded-xl shadow-[0_4px_16px_rgba(252,163,17,0.2)] hover:shadow-[0_8px_24px_rgba(252,163,17,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Sending…" : "Submit Specifications"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="line-h absolute bottom-0 left-0 right-0 opacity-20" />
    </section>
  );
};
