import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { contactApi, type ApiError } from "../lib/api";
import { useCart } from "../context/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const contactChannels = [
  {
    label: "Email",
    value: "vamaillustrations@gmail.com",
    href: "mailto:vamaillustrations@gmail.com?subject=Enquiry&body=Hi%20Vama%20Illustration%2C%20I%20would%20like%20to%20enquire%20more%20about%20your%20services",
    icon: "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2-.5 6.8 5 6.8-5H5.2Zm13.3 2-6.3 4.6a1 1 0 0 1-1.2 0L4.7 7v11.5h13.8V7Z",
  },
  {
    label: "Phone",
    value: "+91 7506464033",
    href: "https://wa.me/917506464033?text=Hi%20Vama%20Illustration%2C%20I%20would%20like%20to%20enquire%20more%20about%20your%20services",
    icon: "M10 2.5a7.5 7.5 0 0 0-6.1 11.8l-1.3 3.8 4-1a7.5 7.5 0 1 0 3.4-14.6Zm-4 5.3c-.3 0-.7.1-1 .3-.3.3-1 .8-1 2s1 2.3 1.2 2.6c.1.2 1.8 2.7 4.3 3.8.6.3 1 .4 1.4.5.6.2 1.1.1 1.5.1.4-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.6-.3l-1.5-.7c-.3-.1-.5-.2-.7 0-.2.3-.6.7-.7.9-.1.2-.3.2-.6.1-.3-.2-1.3-.5-2.2-1.3-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.2-.3.1-.5 0-.2-.3-.8-.4-1.1-.1-.3-.2-.3-.4-.3h-.3Z",
  },
];

type FormState = "idle" | "loading" | "success" | "error";

const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [formState, setFormState] = useState<FormState>("idle");
  const [fieldErrors, setFieldErrors] = useState<ApiError>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    services_required: searchParams.get("event") || "",
    message: "",
  });

  // Keep it synced if the URL changes while on the page
  useEffect(() => {
    const eventParam = searchParams.get("event");
    if (eventParam) {
      setForm((prev) => ({ ...prev, services_required: eventParam }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setFieldErrors({});

    try {
      await contactApi.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        services_required: form.services_required,
        message: form.message,
      });
      setFormState("success");
      clearCart();
      setForm({ name: "", email: "", phone: "", services_required: "", message: "" });
    } catch (err) {
      // DRF returns field-level errors as { field: ["msg"] }
      if (err && typeof err === "object") {
        setFieldErrors(err as ApiError);
      }
      setFormState("error");
    }
  };

  const inputClass =
    "block w-full rounded-2xl border border-[#4b1e12]/12 bg-white px-4 py-3.5 text-[#381a12] shadow-sm outline-none transition focus:border-[#c84624] focus:ring-4 focus:ring-[#c84624]/10 disabled:opacity-50 dark:border-[#f7d18a]/15 dark:bg-[#170f0d] dark:text-[#fff4df] dark:placeholder:text-white/40";

  const isLoading = formState === "loading";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="bg-[radial-gradient(circle_at_top,_rgba(200,70,36,0.08),_transparent_35%),linear-gradient(180deg,rgba(255,248,239,0),rgba(255,248,239,0.28))] dark:bg-[radial-gradient(circle_at_top,_rgba(247,209,138,0.09),_transparent_35%),linear-gradient(180deg,rgba(18,11,10,0),rgba(18,11,10,0.22))]"
    >
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c4b26] dark:text-[#f7d18a]">
              Contact us
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#381a12] dark:text-[#fff4df] sm:text-5xl">
              Tell us about the celebration you are planning.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5f2b19] dark:text-[#f5dec2] sm:text-lg">
              Share your date, venue, and the kind of story you want to create.
              We'll get back to you with availability, pricing and a detailed proposal.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">

            {/* ── Form card ──────────────────────────────────────── */}
            <div className="rounded-[2rem] border border-[#4b1e12]/10 bg-white/75 p-5 shadow-[0_30px_90px_rgba(75,30,18,0.08)] backdrop-blur dark:border-[#f7d18a]/15 dark:bg-white/5 sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-[#4b1e12]/10 pb-5 dark:border-[#f7d18a]/15">
                <div>
                  <h3 className="text-2xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                    Send an enquiry
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#6f3a24] dark:text-[#f5dec2]">
                    We usually respond within 1 business day with availability and pricing.
                  </p>
                </div>
                <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#4b1e12] text-[#f7d18a] shadow-lg shadow-[#4b1e12]/20 sm:grid">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2-.5 6.8 5 6.8-5H5.2Zm13.3 2-6.3 4.6a1 1 0 0 1-1.2 0L4.7 7v11.5h13.8V7Z" />
                  </svg>
                </div>
              </div>

              {/* ── Success Banner ── */}
              <AnimatePresence>
                {formState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 rounded-2xl bg-[#f7d18a]/20 border border-[#f7d18a]/40 px-5 py-4 text-sm font-medium text-[#381a12] dark:text-[#fff4df]"
                  >
                    🙏 Your enquiry has been received — we'll be in touch soon!
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    Your name
                  </label>
                  <input
                    type="text" id="name" name="name" required
                    value={form.name} onChange={handleChange} disabled={isLoading}
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-[#c84624]">{fieldErrors.name[0]}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    Email address
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    value={form.email} onChange={handleChange} disabled={isLoading}
                    className={inputClass}
                    placeholder="Enter your email"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-[#c84624]">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    Phone number
                  </label>
                  <input
                    type="tel" id="phone" name="phone" required
                    value={form.phone} onChange={handleChange} disabled={isLoading}
                    className={inputClass}
                    placeholder="Enter your Whatsapp number"
                  />
                </div>

                {/* Services required */}
                <div className="sm:col-span-1">
                  <label htmlFor="services_required" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    Services required
                  </label>
                  <input
                    type="text" id="services_required" name="services_required" required
                    value={form.services_required} onChange={handleChange} disabled={isLoading}
                    className={inputClass}
                    placeholder="Stationery, Invites, Social Media..."
                  />
                  {fieldErrors.services_required && (
                    <p className="mt-1 text-xs text-[#c84624]">{fieldErrors.services_required[0]}</p>
                  )}
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    How can we help you?
                  </label>
                  <textarea
                    id="message" name="message" rows={6} required
                    value={form.message} onChange={handleChange} disabled={isLoading}
                    className={`${inputClass} rounded-3xl`}
                    placeholder="Tell us about your Wedding Date, Wedding Events and Customization Ideas"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-xs text-[#c84624]">{fieldErrors.message[0]}</p>
                  )}
                </div>

                {/* General error */}
                {formState === "error" && Object.keys(fieldErrors).length === 0 && (
                  <p className="sm:col-span-2 text-sm text-[#c84624]">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Actions */}
                <div className="sm:col-span-2 space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c84624] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c84624]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9f2f18] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {isLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        "Send message"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const waTemplate = `Hi Vama Illustrations! 🌸

I'd like to enquire about your wedding stationery services.

👤 Name: ${form.name || '—'}
📧 Email: ${form.email || '—'}
📱 Phone: ${form.phone || '—'}
🎨 Services Required: ${form.services_required || '—'}

💌 Wedding Details:
${form.message || '—'}

Looking forward to hearing from you. Thank you!`;

                        // Silently submit the enquiry to the backend so admin can see it
                        try {
                          await contactApi.submit({
                            name: form.name,
                            email: form.email,
                            phone: form.phone,
                            services_required: form.services_required,
                            message: form.message,
                          });
                        } catch (_) { /* proceed to WhatsApp even if backend save fails */ }

                        window.open(`https://wa.me/917506464033?text=${encodeURIComponent(waTemplate)}`, "_blank");
                      }}
                      className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-[#c84624] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c84624]/25 transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#9f2f18] hover:shadow-xl hover:shadow-[#c84624]/40"
                    >
                      {/* Crazy pulse ring behind */}
                      <span className="absolute -inset-1 animate-pulse rounded-full bg-[#c84624] opacity-0 blur-md transition duration-500 group-hover:opacity-60"></span>

                      {/* Shiny sweep effect on hover */}
                      <span className="absolute inset-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]"></span>

                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                        WhatsApp Now
                      </span>
                    </button>
                  </div>

                  <a
                    href="https://www.instagram.com/vamaillustrations?igsh=MTFudHR1ZWZqdGRwaA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border-2 border-[#c84624] bg-transparent px-5 py-3.5 text-sm font-semibold text-[#c84624] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c84624]/20 dark:border-[#f7d18a] dark:text-[#f7d18a] dark:hover:shadow-[#f7d18a]/20"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-[#c84624] transition-transform duration-500 ease-out group-hover:translate-x-0 dark:bg-[#f7d18a]" />
                    <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white dark:group-hover:text-[#381a12]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                      View our portfolio
                      <svg className="ml-0.5 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </span>
                  </a>
                </div>
              </form>
            </div>

            {/* ── Sidebar ────────────────────────────────────────── */}
            <div className="space-y-5">
              <motion.div
                variants={fadeUp}
                className="rounded-[2rem] border border-[#4b1e12]/10 bg-[#2a120c] p-6 text-[#fff4df] shadow-[0_30px_90px_rgba(75,30,18,0.22)] dark:border-[#f7d18a]/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f7d18a]">Get in touch</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold">What Happens Next?</h3>
                <p className="mt-4 text-sm leading-7 text-[#f5dec2]">
                  Once we receive your enquiry, here's what you can expect.
                </p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">Initial Response</p>
                    <p className="mt-2 text-sm text-[#fff4df]/90">We'll review your requirements and get back to you within 24–48 business hours.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">Consultation</p>
                    <p className="mt-2 text-sm text-[#fff4df]/90">We'll discuss your vision, wedding aesthetics, stationery requirements, timeline, and budget.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">Design Process</p>
                    <p className="mt-2 text-sm text-[#fff4df]/90">After confirmation, we'll create bespoke concepts, refine them through feedback, and bring every detail to perfection.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {contactChannels.map((channel) => (
                  <motion.a
                    key={channel.label}
                    variants={fadeUp}
                    href={channel.href}
                    className="group flex items-start gap-4 rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c84624]/30 dark:border-[#f7d18a]/15 dark:bg-white/5"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#4b1e12] text-[#f7d18a] shadow-lg shadow-[#4b1e12]/15">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={channel.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c4b26] dark:text-[#f7d18a]">
                        {channel.label}
                      </div>
                      <div className="mt-2 text-base font-medium break-words sm:break-all md:break-words text-[#381a12] transition-colors group-hover:text-[#c84624] dark:text-[#fff4df] dark:group-hover:text-[#f7d18a]">
                        {channel.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

            </div>
          </motion.div>

          {/* Footer-style text below both sections */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <p className="text-[15px] font-medium tracking-wide text-[#8c4b26] dark:text-[#f7d18a]">
              Based in Mumbai, Maharashtra <span className="mx-2 opacity-50">•</span> Serving Couples across India and Worldwide
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
