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
  { value: "2024", label: "Founded" },
  { value: "250+", label: "Wedding designs" },
  { value: "3", label: "Creative disciplines" },
];

const values = [
  {
    title: "Authenticity",
    description:
      "We create designs that reflect your personality, traditions, and love story—not passing trends.",
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    title: "Creativity",
    description:
      "Every project is approached with fresh ideas, custom illustrations, and details that make your celebration truly memorable.",
    icon: "M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z",
  },
  {
    title: "Craftsmanship",
    description:
      "From digital invitations to luxury stationery, every design is crafted with precision, care, and an eye for timeless elegance.",
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
              About Vama illustrations
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#381a12] dark:text-[#fff4df] sm:text-5xl">
              Designed from a personal story, crafted for your forever.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5f2b19] dark:text-[#f5dec2] sm:text-lg">
              Vama Illustrations was born from a moment that changed everything. What started as a heartfelt project for my sister's wedding in 2024 has now grown into a creative studio dedicated to designing wedding experiences that feel deeply personal and beautifully timeless.
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
                    Hi, I'm Vanshi Mehta, a Graphic Designer and Social Media Manager based in Mumbai, with a passion for creating meaningful visual experiences.
                    My journey into the wedding industry began in the most unexpected way through my sister's wedding in 2024.
                    With absolutely no experience in wedding invitations, I borrowed a friend's iPad, taught myself the basics of Procreate, and illustrated our very first invitation.<br></br>
                    What started as a heartfelt project quickly became my passion.
                    That one invitation became the beginning of Vama Illustrations. Starting with E-Invitations, I gradually expanded into Wedding Stationery and Wedding Social Media. Today, every design is thoughtfully crafted with creativity, elegance, and attention to detail, ensuring each couple's story is beautifully brought to life.<br></br>
                    As Vama Illustrations grew, I wanted its online presence to reflect the same elegance behind every design. A heartfelt thanks to my friend, Dhruv Sanghavi, for bringing this vision to life through a website that truly represents Vama.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#4b1e12]/10 bg-[#2a120c] p-3 dark:border-[#f7d18a]/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(247,209,138,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(200,70,36,0.2),_transparent_30%)]" />
              <div className="relative grid gap-3 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-[1.25rem] shadow-2xl">
                  <motion.img
                    variants={fadeUp}
                    src="/vanshi.jpg"
                    alt="Vanshi Mehta - Vama Illustrations"
                    className="h-full w-full min-h-[18rem] sm:min-h-[22rem] md:min-h-[26rem] object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  {/* Subtle inner shadow overlay for depth */}
                  <div className="absolute inset-0 rounded-[1.25rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-[#fff4df] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d18a]">
                      PERSONALIZED DESIGN
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#fff4df]/90">
                      Every illustration, font, colour palette, and finishing touch is thoughtfully crafted to create timeless keepsakes you'll cherish forever.
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
                      END-TO-END EXPERIENCE
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#fff4df]/90">
                      From digital invitations to luxury stationery and wedding social media, we ensure a seamless and memorable design journey.
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
                Our Philosophy
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#6f3a24] dark:text-[#f5dec2] sm:text-base">
                Every wedding is a story waiting to be told.<br></br>
                Our purpose is to transform your memories, traditions, and personalities into designs that you'll treasure long after the celebrations are over.
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
