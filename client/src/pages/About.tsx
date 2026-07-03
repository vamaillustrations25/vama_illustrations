import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const storyStats = [
  { value: "2010", label: "Founded" },
  { value: "250+", label: "Wedding stories" },
  { value: "4", label: "Creative disciplines" },
];

const values = [
  {
    title: "Authenticity",
    description:
      "We capture genuine moments, emotion, and ritual without over-directing the story.",
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    title: "Creativity",
    description:
      "Traditional aesthetics and contemporary execution are blended into a single visual language.",
    icon: "M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z",
  },
  {
    title: "Professionalism",
    description:
      "From planning to delivery, every handoff is structured, calm, and detail-oriented.",
    icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  },
];

const About: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="bg-[radial-gradient(circle_at_top,_rgba(200,70,36,0.08),_transparent_38%),linear-gradient(180deg,rgba(255,248,239,0),rgba(255,248,239,0.28))] dark:bg-[radial-gradient(circle_at_top,_rgba(247,209,138,0.09),_transparent_38%),linear-gradient(180deg,rgba(18,11,10,0),rgba(18,11,10,0.22))]"
    >
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c4b26] dark:text-[#f7d18a]">
              About the studio
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#381a12] dark:text-[#fff4df] sm:text-5xl">
              Visual storytelling shaped for Indian celebrations.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5f2b19] dark:text-[#f5dec2] sm:text-lg">
              Vama Illustrations pairs ritual, romance, and editorial polish to
              create wedding imagery and invitations that feel personal,
              elegant, and alive on every screen.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid gap-6 rounded-[2rem] border border-[#4b1e12]/10 bg-white/70 p-5 shadow-[0_30px_90px_rgba(75,30,18,0.08)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr] dark:border-[#f7d18a]/15 dark:bg-white/5 dark:shadow-none sm:p-7"
          >
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {storyStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#4b1e12]/10 bg-[#fff8ef] p-4 dark:border-[#f7d18a]/15 dark:bg-[#1a100e]"
                  >
                    <div className="font-serif text-3xl font-semibold text-[#4b1e12] dark:text-[#f7d18a]">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-[#6f3a24] dark:text-[#f5dec2]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                  Our story
                </h3>
                <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#5f2b19] dark:text-[#f5dec2]">
                  <p>
                    Founded in 2010, Vama Illustrations began as a passion
                    project focused on the emotional texture of Indian weddings.
                    It has since grown into a full-service creative studio
                    spanning photography, videography, stationery, and animated
                    invitations.
                  </p>
                  <p>
                    We work with couples who want their celebration to feel
                    considered from the first invite to the final frame. Every
                    project is designed to hold both ceremony and warmth,
                    balancing tradition with a clean contemporary finish.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#4b1e12]/10 bg-[#2a120c] p-3 dark:border-[#f7d18a]/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(247,209,138,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(200,70,36,0.2),_transparent_30%)]" />
              <div className="relative grid gap-3 sm:grid-cols-2">
                <motion.img
                  variants={fadeUp}
                  src="https://images.unsplash.com/photo-1519741497674-61147937659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                  alt="Vama Illustrations Team"
                  className="h-full min-h-[14rem] w-full rounded-[1.25rem] object-cover shadow-2xl"
                />
                <div className="flex flex-col gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-[#fff4df] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">
                      Creative direction
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#fff4df]/90">
                      Editorial composition, soft cinematic color, and
                      ritual-aware framing.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-[#fff4df] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">
                      Delivery
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#fff4df]/90">
                      Structured timelines, responsive communication, and
                      polished final assets.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-[#fff4df] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">
                      Experience
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#fff4df]/90">
                      Designed to feel premium on desktop and effortless on
                      mobile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 border-t border-[#4b1e12]/10 pt-12 dark:border-[#f7d18a]/15">
            <motion.div
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h3 className="font-serif text-3xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                Our philosophy
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#6f3a24] dark:text-[#f5dec2] sm:text-base">
                Each principle below is reflected in the way we frame, sequence,
                and deliver every wedding story.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="mt-8 grid gap-5 md:grid-cols-3"
            >
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/75 p-6 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1 dark:border-[#f7d18a]/15 dark:bg-white/5"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#4b1e12] text-[#f7d18a] shadow-lg shadow-[#4b1e12]/15">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d={value.icon} />
                    </svg>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                    {value.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-[#6f3a24] dark:text-[#f5dec2]">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
