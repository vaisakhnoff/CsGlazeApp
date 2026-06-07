"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type Fields = { name: string; company: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Full name is required.";
  else if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.message.trim()) e.message = "Please describe your project.";
  else if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  return e;
}

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
      <AlertCircle size={11} className="flex-shrink-0" />{msg}
    </p>
  );
}

export const Contact = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [fields, setFields]   = useState<Fields>({ name: "", company: "", email: "", message: "" });
  const [errors, setErrors]   = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setFields(f => ({ ...f, [k]: v }));
    if (touched[k]) setErrors(err => ({ ...err, [k]: validate({ ...fields, [k]: v })[k] }));
  };

  const blur = (k: keyof Fields) => () => {
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(err => ({ ...err, [k]: validate(fields)[k] }));
  };

  const inputCls = (k: keyof Fields) =>
    `bg-transparent border-b py-2 text-on-surface focus:outline-none transition-all font-inter w-full ${
      touched[k] && errors[k] ? "border-red-500/60 focus:border-red-400" : "border-outline-variant/20 focus:border-tertiary focus:border-b-2"
    }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, company: true, email: true, message: true };
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 bg-surface-dim relative z-10 border-t border-outline-variant/10 overflow-hidden"
    >
      {/* Scanline sweep */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/15 to-transparent"
        initial={{ top: 0, opacity: 0 }}
        animate={inView ? { top: ["0%", "100%"], opacity: [0, 0.5, 0] } : {}}
        transition={{ duration: 1.6, ease: "linear", delay: 0.2 }}
      />
      {/* HUD corners */}
      <div className="absolute top-6 left-6 pointer-events-none opacity-20">
        <svg width="36" height="36" fill="none"><line x1="0" y1="0" x2="22" y2="0" stroke="black" strokeWidth="1.5"/><line x1="0" y1="0" x2="0" y2="22" stroke="black" strokeWidth="1.5"/></svg>
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none opacity-20">
        <svg width="36" height="36" fill="none"><line x1="36" y1="36" x2="14" y2="36" stroke="black" strokeWidth="1.5"/><line x1="36" y1="36" x2="36" y2="14" stroke="black" strokeWidth="1.5"/></svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-montserrat text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-6">
              Request a Technical Proposal
            </h2>
            <p className="font-inter text-on-surface-variant text-lg mb-12 max-w-md">
              Connect with our engineering team to discuss structural requirements, materiality, and project timelines.
            </p>
            <div className="space-y-8">
              {[{ label: "Location", value: "Global HQ, Dubai, UAE" }, { label: "Direct Inquiry", value: "engineering@csglaze.com" }]
                .map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
                    <h4 className="font-geist text-xs uppercase tracking-widest text-on-surface-variant mb-2">{item.label}</h4>
                    <p className="font-inter text-on-surface">{item.value}</p>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-surface-container p-8 md:p-12 border border-outline-variant/20 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none"/>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(0,0,0,0.05) 0%, transparent 66%)" }}/>

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center">
                <CheckCircle2 size={48} className="text-primary" />
                <h3 className="font-montserrat text-2xl font-semibold text-black">Proposal Request Sent</h3>
                <p className="font-inter text-black/55 text-sm max-w-xs">Our engineering team will reach out within 1 business day.</p>
                <button onClick={() => { setSubmitted(false); setFields({ name: "", company: "", email: "", message: "" }); setTouched({}); setErrors({}); }}
                  className="mt-4 text-xs font-geist uppercase tracking-widest text-black/45 hover:text-black transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form className="space-y-8 relative" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-geist text-xs uppercase tracking-widest text-on-surface-variant">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" id="name" value={fields.name} onChange={set("name")} onBlur={blur("name")}
                      className={inputCls("name")} placeholder="John Smith" />
                    <FieldErr msg={touched.name ? errors.name : undefined} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="font-geist text-xs uppercase tracking-widest text-on-surface-variant">Company</label>
                    <input type="text" id="company" value={fields.company} onChange={set("company")} onBlur={blur("company")}
                      className={inputCls("company")} placeholder="Acme Corp" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-geist text-xs uppercase tracking-widest text-on-surface-variant">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input type="email" id="email" value={fields.email} onChange={set("email")} onBlur={blur("email")}
                    className={inputCls("email")} placeholder="you@company.com" />
                  <FieldErr msg={touched.email ? errors.email : undefined} />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-geist text-xs uppercase tracking-widest text-on-surface-variant">
                    Project Details <span className="text-red-400">*</span>
                  </label>
                  <textarea id="message" rows={4} value={fields.message} onChange={set("message")} onBlur={blur("message")}
                    className={inputCls("message")} placeholder="Describe your project scope, location, and timeline…" />
                  <FieldErr msg={touched.message ? errors.message : undefined} />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">Submit Specifications</Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
