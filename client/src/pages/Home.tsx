import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroImage =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85';

const rituals = [
  {
    title: 'Haldi Heat',
    text: 'Turmeric, laughter, aerial details, and fast-cut reels that feel sunlit and mischievous.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Sangeet Pulse',
    text: 'Stage lights, choreography, family chaos, and cinematic movement cut to the beat.',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Phera Glow',
    text: 'Sacred fire, silk, vows, and quiet frames that feel heirloom-worthy from day one.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
  },
];

const services = ['Invites', 'Stationery', 'Social Media', 'Branding', 'Illustrations', 'Website', 'Wedding Wardrobe', 'Wedding Logo'];

const Home = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate min-h-[calc(100vh-74px)] overflow-hidden">
        <motion.img
          src={heroImage}
          alt="Indian wedding couple surrounded by celebration"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-[#180905]/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fff8ef] to-transparent dark:from-[#120b0a]" />

        <motion.div
          className="mandala-ring left-[6%] top-[18%]"
          initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
          animate={{ opacity: 0.75, rotate: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.div
          className="mandala-ring right-[8%] top-[54%] h-28 w-28 opacity-60"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-74px)] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 lg:px-8">
          <motion.p
            className="mb-5 w-fit rounded-full border border-[#f7d18a]/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#f7d18a] backdrop-blur-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Luxury Wedding Hub
          </motion.p>

          <motion.h1
            className="max-w-5xl font-serif text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            A Wedding brand built around “Your Story”.
          </motion.h1>

          <motion.div
            className="mt-8 flex max-w-3xl flex-col gap-6 text-[#ffe9c2] md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
          >
            <p className="text-lg leading-relaxed">
              We craft be-spoke Wedding identities through E-Invitations, Stationery,Illustrations and thoughtful Designs that's beautifully and uniquely 'Yours'.
            </p>
            <Link
              to="/collections"
              className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-[#f7d18a] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#381a12] shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Portfolio
                <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
              </span>
              
              {/* Blobs container */}
              <div className="absolute inset-0 z-0 h-full w-full pointer-events-none" style={{ filter: "url('#goo')" }}>
                <span className="absolute left-[-10%] top-[120%] h-full w-[35%] rounded-full bg-white transition-transform duration-1000 ease-out group-hover:-translate-y-[160%] scale-[1.7]" style={{ transitionDelay: '0s' }} />
                <span className="absolute left-[20%] top-[120%] h-full w-[35%] rounded-full bg-white transition-transform duration-1000 ease-out group-hover:-translate-y-[160%] scale-[1.7]" style={{ transitionDelay: '0.15s' }} />
                <span className="absolute left-[50%] top-[120%] h-full w-[35%] rounded-full bg-white transition-transform duration-1000 ease-out group-hover:-translate-y-[160%] scale-[1.7]" style={{ transitionDelay: '0.3s' }} />
                <span className="absolute left-[80%] top-[120%] h-full w-[35%] rounded-full bg-white transition-transform duration-1000 ease-out group-hover:-translate-y-[160%] scale-[1.7]" style={{ transitionDelay: '0.45s' }} />
              </div>
            </Link>

            {/* SVG Filter for Gooey Effect */}
            <svg style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg" version="1.1">
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                </filter>
              </defs>
            </svg>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#4b1e12]/10 bg-[#3b170f] py-4 text-[#f7d18a]">
        <div className="marquee-track">
          {Array(10).fill(services).flat().map((item, index) => (
            <span key={`${item}-${index}`} className="mx-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.34em]">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative bg-[#fff8ef] px-4 py-24 dark:bg-[#120b0a] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.34em] text-[#c84624]">Ritual edits</p>
              <h2 className="max-w-3xl font-serif text-5xl font-semibold leading-tight text-[#381a12] dark:text-[#fff4df]">
                Every design deserves its own Personality
              </h2>
            </div>
            <p className="max-w-md text-[#704026] dark:text-[#f5dec2]">
              Every celebration has its own rhythm, character, and charm. Our designs are thoughtfully crafted to bring those moments to life with beauty and purpose..
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {rituals.map((ritual, index) => (
              <motion.article
                key={ritual.title}
                className="group relative min-h-[460px] overflow-hidden rounded-[2rem] border border-[#4b1e12]/10 bg-[#2a120c] shadow-2xl shadow-[#4b1e12]/10"
                initial={{ opacity: 0, y: 60, rotate: index === 1 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ y: -12, rotate: index === 1 ? -1 : 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75, delay: index * 0.12 }}
              >
                <img
                  src={ritual.image}
                  alt={ritual.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#160604] via-[#160604]/35 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <span className="mb-4 inline-flex rounded-full border border-[#f7d18a]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f7d18a]">
                    0{index + 1}
                  </span>
                  <h3 className="mb-3 font-serif text-4xl font-semibold text-white">{ritual.title}</h3>
                  <p className="text-[#ffe9c2]">{ritual.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2a120c] px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-[#f7d18a]">Signature Designs</p>
            <h2 className="font-serif text-5xl font-semibold leading-tight">
              Invitations that begin long before the baraat does.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[#f5dec2]">
              Animated save-the-dates, story reels, kinetic type, illustrated couple crests, and RSVP flows
              designed as part of the same wedding world.
            </p>
          </motion.div>

          <motion.div
            className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-[#f7d18a]/20 bg-[#fff8ef]/5 p-4"
            initial={{ opacity: 0, scale: 0.88, rotate: 3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8 }}
          >
            <div className="invite-card invite-card-one">
              <span>Your Story</span>
              <strong>Invitation Suite</strong>
            </div>
            <div className="invite-card invite-card-two">
              <span>Wedding Website</span>
              <strong>One Tap Away</strong>
            </div>
            <div className="invite-card invite-card-three">
              <span>RSVP</span>
              <strong>Save The Date</strong>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
