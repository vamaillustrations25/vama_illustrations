import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { galleryApi, type Gallery } from '../lib/api';
import { useCart } from '../context/CartContext';

// Fallback data shown while the API is loading or if it's empty
const FALLBACK: Gallery[] = [
  {
    id: 0,
    title: 'Royal Phera',
    tag: 'photography',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: true,
    recommendations: [],
    created_at: '',
  },
  {
    id: 1,
    title: 'Marigold Haldi',
    tag: 'color_story',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: false,
    recommendations: [],
    created_at: '',
  },
  {
    id: 2,
    title: 'Moonlit Sangeet',
    tag: 'film',
    image_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: false,
    recommendations: [],
    created_at: '',
  },
  {
    id: 3,
    title: 'Heirloom Invites',
    tag: 'stationery',
    image_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: false,
    recommendations: [],
    created_at: '',
  },
  {
    id: 4,
    title: 'Palace Portraits',
    tag: 'editorial',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: false,
    recommendations: [],
    created_at: '',
  },
  {
    id: 5,
    title: 'Family Gold',
    tag: 'documentary',
    image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
    description: '',
    is_featured: false,
    recommendations: [],
    created_at: '',
  },
];

const TAG_LABELS: Record<string, string> = {
  photography: 'Photography',
  film: 'Wedding Film',
  stationery: 'Stationery',
  editorial: 'Editorial',
  documentary: 'Documentary',
  color_story: 'Color Story',
};

const Collections = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    galleryApi
      .list()
      .then((data) => {
        setGalleries(data.length > 0 ? data : FALLBACK);
      })
      .catch(() => {
        // API unavailable — use fallback gracefully
        setGalleries(FALLBACK);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const display = loading ? FALLBACK : galleries;

  return (
    <div className="bg-[#fff8ef] px-4 py-20 dark:bg-[#120b0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-[#c84624]">Collections</p>
          <h1 className="max-w-4xl font-serif text-6xl font-semibold leading-tight text-[#381a12] dark:text-[#fff4df]">
            A gallery built for color, ritual, and cinematic chaos.
          </h1>
          {error && (
            <p className="mt-4 text-sm text-[#c84624]/70">
              Showing preview — live gallery will appear once connected.
            </p>
          )}
        </motion.div>

        {loading ? (
          // Skeleton loading state
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[420px] animate-pulse rounded-[2rem] bg-[#4b1e12]/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {display.map((item, index) => (
              <motion.article
                key={item.id}
                className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#2a120c]"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: index * 0.06 }}
              >
                <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedGallery(item)}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160604] via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="mb-3 inline-flex rounded-full bg-[#f7d18a] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#381a12]">
                    {TAG_LABELS[item.tag] ?? item.tag}
                  </span>
                  <h2 className="font-serif text-4xl font-semibold text-white">{item.title}</h2>
                  {item.description && (
                    <p className="mt-2 text-sm text-[#ffe9c2]/80">{item.description}</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3 transition-all duration-500 ease-out md:translate-y-8 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      className="flex-1 rounded-full bg-[#f7d18a] px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-[#381a12] transition-colors hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/contact?event=${encodeURIComponent(item.tag)}`}
                      className="flex-1 rounded-full border border-[#f7d18a]/50 bg-black/40 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-[#f7d18a] backdrop-blur-sm transition-colors hover:bg-[#f7d18a] hover:text-[#381a12]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelectedGallery(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex h-[85vh] w-[90vw] max-w-[80vw] flex-col overflow-hidden rounded-3xl border border-[#2a120c] bg-[#fff8ef] shadow-2xl dark:border-white/20 dark:bg-[#1a0c08] lg:h-[80vh] lg:w-full lg:flex-row"
              onClick={(e) => e.stopPropagation()} 
            >
              <button
                className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-[#c84624]"
                onClick={() => setSelectedGallery(null)}
              >
                ✕
              </button>
              
              {/* Main Image (Top on Mobile, Left on Desktop) */}
              <div className="relative h-1/2 w-full shrink-0 bg-black lg:h-full lg:w-1/2">
                <img
                  src={selectedGallery.image_url}
                  alt={selectedGallery.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Details & Related Images (Bottom on Mobile, Right on Desktop) */}
              <div className="flex h-1/2 w-full flex-col overflow-y-auto p-6 sm:p-8 lg:h-full lg:w-1/2 lg:overflow-visible lg:p-14">
                <div className="flex flex-col gap-4 lg:gap-6">
                  <div>
                    <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#c84624]">
                      {TAG_LABELS[selectedGallery.tag] ?? selectedGallery.tag}
                    </span>
                    <h3 className="font-serif text-3xl font-semibold text-[#381a12] dark:text-[#fff8ef] xl:text-4xl">
                      {selectedGallery.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#5f2b19] dark:text-[#ffe9c2]/70 xl:text-base">
                      {selectedGallery.description || "A glimpse into our crafted visuals. This collection encapsulates our signature warm and cinematic aesthetic. Every moment is captured with meticulous attention to detail."}
                    </p>
                  </div>
                  <button
                    className="w-fit rounded-full bg-[#f7d18a] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#381a12] shadow-xl transition-transform hover:-translate-y-1 hover:bg-white"
                    onClick={() => {
                      addToCart(selectedGallery);
                      setSelectedGallery(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="mt-auto pt-8">
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#5f2b19]/60 dark:text-[#fff8ef]/40">
                    More from this Collection
                  </h4>
                  <div className="flex gap-4">
                    {/* Render actual selected recommendations */}
                    {selectedGallery.recommendations?.length > 0 ? (
                      selectedGallery.recommendations.map((recId) => {
                        const recGal = galleries.find(g => g.id === recId);
                        if (!recGal) return null;
                        return (
                          <div key={recId} onClick={() => setSelectedGallery(recGal)} className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#2a120c] ring-1 ring-[#4b1e12]/20 dark:ring-white/10" title={recGal.title}>
                            <img
                              src={recGal.image_url}
                              alt={recGal.title}
                              className="h-full w-full object-cover opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100"
                            />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm italic text-[#5f2b19]/60 dark:text-[#fff8ef]/40">No related collections selected.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;
