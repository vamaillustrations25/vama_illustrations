import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "917506464033";
const DEFAULT_MESSAGE =
  "Hi Vama Illustration, I would like to enquire more about your services";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const WhatsAppFloat: React.FC = () => {
  const [ripple, setRipple] = useState(false);

  const handleClick = async () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 800);

    // Fire-and-forget backend log
    try {
      await fetch(`${API_BASE}/contact/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "WhatsApp Visitor",
          email: "via-whatsapp@vamaillustrations.com",
          phone: "",
          services_required: "General Enquiry",
          message: DEFAULT_MESSAGE,
        }),
      });
    } catch (_) {
      /* proceed regardless */
    }

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] sm:bottom-8 sm:right-8">
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center sm:h-[4.5rem] sm:w-[4.5rem]"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        {/* Continuous pulse rings */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#c84624]/40" />
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#c84624]/30"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Tap-triggered burst ring */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              className="absolute inset-0 rounded-full border-4 border-[#c84624]"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Main button */}
        <button
          onClick={handleClick}
          aria-label="Chat on WhatsApp"
          className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#c84624] text-white shadow-2xl shadow-[#c84624]/40 transition-all duration-300 hover:scale-110 hover:shadow-[#c84624]/60 active:scale-95"
        >
          {/* Glow ring */}
          <span className="absolute inset-0 rounded-full bg-[#c84624] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />

          {/* Shiny sweep */}
          <span className="absolute inset-0 -translate-x-[150%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]" />

          {/* WhatsApp icon */}
          <svg
            className="relative z-10 h-8 w-8 drop-shadow-lg sm:h-9 sm:w-9"
            fill="currentColor"
            viewBox="0 0 448 512"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default WhatsAppFloat;
