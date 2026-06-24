"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary text-white">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Spatial depth layers */}
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.03] hidden lg:block" />
      <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white/[0.03] hidden lg:block" />
      <div className="absolute top-[20%] left-[10%] w-48 h-48 bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-2 w-full"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block mb-5">
              <div className="relative h-[80px] w-auto">
                <Image
                  src="/cs-glaze-logo.png"
                  alt="CS Glaze"
                  width={240}
                  height={80}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            {/* Line accent */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-accent-hover rounded mb-4" />
            <p className="text-white/60 leading-relaxed text-sm max-w-[320px] min-w-[280px]">
              Engineered perfection in structural glazing and premium facade systems for high-end
              commercial and residential projects.
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest mb-5 text-accent">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Façades", "ACP Cladding", "Unitized Systems", "Spider Glazing"].map((item) => (
                <li key={item}>
                  <Link href="#services" className="text-sm text-white/60 hover:text-white transition-all hover:translate-x-1 inline-block duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h4 className="font-heading font-semibold text-xs uppercase tracking-widest mb-5 text-accent">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { name: "Projects", href: "#projects" },
                { name: "Expertise", href: "#expertise" },
                { name: "Contact", href: "#contact" },
                { name: "Careers", href: "#contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-all hover:translate-x-1 inline-block duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar — spatial glass separator */}
        <div className="pt-7 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CS Glaze. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link key={item} href="#contact" className="text-xs text-white/40 hover:text-white/80 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
