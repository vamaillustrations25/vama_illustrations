import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { galleryApi, type Gallery } from '../lib/api';
import { useCart } from '../context/CartContext';

// ── Skeleton for lazy loading ─────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="aspect-square animate-pulse rounded-2xl bg-[#4b1e12]/10 dark:bg-white/5" />
);

const SkeletonSection = () => (
  <div className="mb-16">
    <div className="mx-auto mb-8 h-4 w-48 animate-pulse rounded-full bg-[#4b1e12]/10 dark:bg-white/5" />
    <div className="mx-auto mb-2 h-8 w-72 animate-pulse rounded-full bg-[#4b1e12]/10 dark:bg-white/5" />
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

// ── Animated image card ───────────────────────────────────────────────────────

const ImageCard = ({
  item,
  index,
  onSelect,
  onAddToCart,
}: {
  item: Gallery;
  index: number;
  onSelect: (g: Gallery) => void;
  onAddToCart: (g: Gallery) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[#2a120c] shadow-md"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(item)}
    >
      <img
        src={item.image_url}
        alt={item.tag}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
      />

      {/* Always-visible gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#160604]/80 via-transparent to-transparent transition-opacity duration-300 group-hover:from-[#160604]/90" />

      {/* Bottom content — tag always visible, buttons slide in on hover */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4">
        {/* Tag name — always visible, shifts up on hover to make room for buttons */}
        <span className="mb-0 inline-block w-fit rounded-full bg-[#f7d18a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#381a12] transition-all duration-300 group-hover:mb-2">
          {item.tag}
        </span>

        {/* Action buttons — hidden by default, slide up on hover */}
        <div className="flex max-h-0 gap-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
          <button
            className="flex-1 rounded-full bg-[#f7d18a] py-2 text-[11px] font-bold uppercase tracking-wider text-[#381a12] transition-colors hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            Add to Cart
          </button>
          <Link
            to={`/contact?event=${encodeURIComponent(item.tag)}`}
            className="flex-1 rounded-full border border-[#f7d18a]/50 bg-black/40 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#f7d18a] backdrop-blur-sm transition-colors hover:bg-[#f7d18a] hover:text-[#381a12]"
            onClick={(e) => e.stopPropagation()}
          >
            Enquire
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ── Category section ──────────────────────────────────────────────────────────

const CategorySection = ({
  title,
  items,
  onSelect,
  onAddToCart,
}: {
  title: string;
  items: Gallery[];
  onSelect: (g: Gallery) => void;
  onAddToCart: (g: Gallery) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.section
      ref={ref}
      id={`category-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="mb-20 scroll-mt-28"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Section heading */}
      <div className="mb-8 text-center">
        <motion.div
          className="mx-auto mb-3 h-px w-16 bg-[#c84624]"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.h2
          className="font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff4df] sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-[#c84624]/70"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {items.length} {items.length === 1 ? 'design' : 'designs'}
        </motion.p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, i) => (
          <ImageCard
            key={item.id}
            item={item}
            index={i}
            onSelect={onSelect}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </motion.section>
  );
};

// ── Main Collections page ─────────────────────────────────────────────────────

const Collections = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    galleryApi
      .list()
      .then((data) => {
        setGalleries(data);
      })
      .catch(() => {
        setGalleries([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group galleries by title (category)
  const grouped = galleries.reduce<Record<string, Gallery[]>>((acc, g) => {
    const key = g.title || 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  // Maintain a stable order based on the GALLERY_CATEGORIES order if available
  const orderedTitles = Object.keys(grouped);

  // Build a flat list of tags with their parent category for search
  const tagIndex = galleries.map(g => ({ tag: g.tag, title: g.title }));
  // Deduplicate by tag+title
  const uniqueTags = tagIndex.filter((t, i, arr) =>
    arr.findIndex(x => x.tag === t.tag && x.title === t.title) === i
  );
  const filteredTags = searchQuery.trim()
    ? uniqueTags.filter(t => t.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    : uniqueTags;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToCategory = (title: string) => {
    setSearchQuery('');
    setSearchOpen(false);
    const el = document.getElementById(`category-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#fff8ef] px-4 py-20 dark:bg-[#120b0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.34em] text-[#c84624]">Collections</p>

          {/* Search bar */}
          <div ref={searchRef} className="relative mx-auto mb-8 max-w-lg">
            <div className="flex items-center overflow-hidden rounded-full border border-[#4b1e12]/15 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 focus-within:border-[#c84624] focus-within:ring-2 focus-within:ring-[#c84624]/20 dark:border-[#f7d18a]/20 dark:bg-white/5 dark:focus-within:border-[#f7d18a] dark:focus-within:ring-[#f7d18a]/20">
              <svg className="ml-4 h-5 w-5 shrink-0 text-[#8c4b26]/60 dark:text-[#f7d18a]/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search by product…"
                className="w-full bg-transparent px-3 py-3 text-sm text-[#381a12] placeholder-[#8c4b26]/40 outline-none dark:text-[#fff4df] dark:placeholder-[#f7d18a]/30"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="mr-3 text-[#8c4b26]/40 transition hover:text-[#c84624] dark:text-[#f7d18a]/30 dark:hover:text-[#f7d18a]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {searchOpen && filteredTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#4b1e12]/10 bg-[#fff8ef] shadow-xl dark:border-[#f7d18a]/15 dark:bg-[#1a0c08]"
                >
                  {filteredTags.map(({ tag, title }) => (
                    <button
                      key={`${title}-${tag}`}
                      onClick={() => scrollToCategory(title)}
                      className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-[#381a12] transition-colors hover:bg-[#c84624]/5 dark:text-[#fff4df] dark:hover:bg-[#f7d18a]/5"
                    >
                      <span className="font-medium">{tag}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c4b26]/50 dark:text-[#f7d18a]/40">{title}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-tight text-[#381a12] dark:text-[#fff4df] sm:text-5xl lg:text-6xl">
            A collection of timeless wedding stationery.
          </h1>
          {error && (
            <p className="mt-4 text-sm text-[#c84624]/70">
              No collections available yet — check back soon!
            </p>
          )}
        </motion.div>

        {/* Loading skeletons */}
        {loading ? (
          <>
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </>
        ) : orderedTitles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-[#5f2b19]/60 dark:text-[#fff8ef]/40">
              No collections to display yet.
            </p>
          </div>
        ) : (
          orderedTitles.map((title) => (
            <CategorySection
              key={title}
              title={title}
              items={grouped[title]}
              onSelect={setSelectedGallery}
              onAddToCart={addToCart}
            />
          ))
        )}
      </div>

      {/* ── Lightbox Modal ─────────────────────────────────────────────────── */}
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

              {/* Main Image */}
              <div className="relative h-1/2 w-full shrink-0 bg-black lg:h-full lg:w-1/2">
                <img
                  src={selectedGallery.image_url}
                  alt={selectedGallery.tag}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Details & Related */}
              <div className="flex h-1/2 w-full flex-col overflow-y-auto p-6 sm:p-8 lg:h-full lg:w-1/2 lg:overflow-visible lg:p-14">
                <div className="flex flex-col gap-4 lg:gap-6">
                  <div>
                    <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#c84624]">
                      {selectedGallery.title}
                    </span>
                    <h3 className="font-serif text-3xl font-semibold text-[#381a12] dark:text-[#fff8ef] xl:text-4xl">
                      {selectedGallery.tag}
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
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {selectedGallery.recommendations?.length > 0 ? (
                      selectedGallery.recommendations.map((recId) => {
                        const recGal = galleries.find(g => g.id === recId);
                        if (!recGal) return null;
                        return (
                          <div key={recId} onClick={() => setSelectedGallery(recGal)} className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#2a120c] ring-1 ring-[#4b1e12]/20 dark:ring-white/10" title={recGal.tag}>
                            <img
                              src={recGal.image_url}
                              alt={recGal.tag}
                              className="h-full w-full object-cover opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100"
                            />
                          </div>
                        );
                      })
                    ) : (
                      // Show other items from the same category as related
                      grouped[selectedGallery.title]
                        ?.filter(g => g.id !== selectedGallery.id)
                        .slice(0, 5)
                        .map((g) => (
                          <div key={g.id} onClick={() => setSelectedGallery(g)} className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#2a120c] ring-1 ring-[#4b1e12]/20 dark:ring-white/10" title={g.tag}>
                            <img
                              src={g.image_url}
                              alt={g.tag}
                              className="h-full w-full object-cover opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100"
                            />
                          </div>
                        ))
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
