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
    href: "mailto:vamaillustrations@gmail.com",
    icon: "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2-.5 6.8 5 6.8-5H5.2Zm13.3 2-6.3 4.6a1 1 0 0 1-1.2 0L4.7 7v11.5h13.8V7Z",
  },
  {
    label: "Phone",
    value: "+91 7506464033",
    href: "tel:+917506464033",
    icon: "M6.7 3.5h3.2l1.4 4-2 1.2a13.3 13.3 0 0 0 5.5 5.5l1.2-2 4 1.4v3.2c0 1-.8 1.8-1.8 1.8C10.9 18.6 5.4 13.1 3.8 5.3c-.2-1 .6-1.8 1.8-1.8Z",
  },
  {
    label: "Address",
    value: "Mumbai, Maharashtra, India",
    href: "https://maps.google.com/?q=Mumbai,+Maharashtra,+India",
    icon: "M12 2.5A7.5 7.5 0 0 0 4.5 10c0 5.1 7.5 11.5 7.5 11.5S19.5 15.1 19.5 10A7.5 7.5 0 0 0 12 2.5Zm0 10.3a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z",
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
    event_type: searchParams.get("event") || "",
    message: "",
  });

  // Keep it synced if the URL changes while on the page
  useEffect(() => {
    const eventParam = searchParams.get("event");
    if (eventParam) {
      setForm((prev) => ({ ...prev, event_type: eventParam }));
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
        phone: form.phone || undefined,
        event_type: form.event_type || undefined,
        message: form.message,
      });
      setFormState("success");
      clearCart();
      setForm({ name: "", email: "", phone: "", event_type: "", message: "" });
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
              We'll respond with the next steps and availability.
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
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Event type */}
                <div className="sm:col-span-1">
                  <label htmlFor="event_type" className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                    Event type
                  </label>
                  <input
                    type="text" id="event_type" name="event_type"
                    value={form.event_type} onChange={handleChange} disabled={isLoading}
                    className={inputClass}
                    placeholder="Wedding, invitation, film..."
                  />
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
                    placeholder="Tell us about your wedding plans, timeline, or project idea"
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

                {/* Submit */}
                <div className="sm:col-span-2">
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
                <h3 className="mt-3 font-serif text-3xl font-semibold">Fast replies, clear next steps.</h3>
                <p className="mt-4 text-sm leading-7 text-[#f5dec2]">
                  We usually respond with availability, timeline guidance, and a tailored quote after reviewing your enquiry.
                </p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">Response window</p>
                    <p className="mt-2 text-sm text-[#fff4df]/90">Typically within 1 business day.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">Working style</p>
                    <p className="mt-2 text-sm text-[#fff4df]/90">Remote-friendly planning with in-person support where needed.</p>
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
                    <div className="min-w-0">
                      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c4b26] dark:text-[#f7d18a]">
                        {channel.label}
                      </div>
                      <div className="mt-2 text-base font-medium text-[#381a12] transition-colors group-hover:text-[#c84624] dark:text-[#fff4df] dark:group-hover:text-[#f7d18a]">
                        {channel.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
