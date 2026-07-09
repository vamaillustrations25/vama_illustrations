import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { contactApi, authApi, galleryApi, type ContactEnquiry, type Gallery } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { CustomSelect } from '../components/CustomSelect';

// ── Constants ─────────────────────────────────────────────────────────────────

const ORDER_STATUSES = {
  under_discussion: { label: 'Under Discussion', cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/40' },
  project_ongoing: { label: 'Project Ongoing', cls: 'bg-sky-500/15 text-sky-400 border border-sky-500/40' },
  completed_pending: { label: 'Completed (Payment Pending)', cls: 'bg-orange-500/15 text-orange-400 border border-orange-500/40' },
  completed_received: { label: 'Completed (Payment Received)', cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' },
} as const;
type OrderStatus = keyof typeof ORDER_STATUSES;

const ENQ_STATUSES: { value: string; label: string; cls: string }[] = [
  { value: 'under_discussion', label: 'Under Discussion', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/40' },
  { value: 'project_ongoing', label: 'Project Ongoing', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/40' },
  { value: 'completed_pending', label: 'Completed (Payment Pending)', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/40' },
  { value: 'completed_received', label: 'Completed (Payment Received)', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
  { value: 'others', label: 'Others', cls: 'bg-[#f7d18a]/15 text-[#f7d18a] border-[#f7d18a]/30' },
];

const NOTE_COLORS = ['#fef3c7', '#fce7f3', '#e0f2fe', '#dcfce7', '#f3e8ff', '#fff7ed'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TABS = [
  { id: 'gallery', label: 'Galleries', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { id: 'enquiries', label: 'Enquiries', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { id: 'analytics', label: 'Analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { id: 'planner', label: 'Planner', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { id: 'settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const GALLERY_CATEGORIES: Record<string, string[]> = {
  'Wedding Keepsakes': ['Printed Invites', 'Wedding Newspaper', 'Wedding Magazine', 'Mini Book (Digital/Handmade)', 'Wedding Planner / Wedding Diary'],
  'Welcome & Guest Arrival': ['Welcome Note', 'Key Card Holder Itinerary', 'Event Itinerary', 'Passport Itinerary', 'Ritual Card', 'Tent Cards'],
  'Wedding Decor': ['Welcome Boards', 'Resin Welcome Boards', 'Fun Signs & Funky Boards', 'Puzzle Boards'],
  'Dining & Reception Essentials': ['Menu Card', 'Popcorn Tubes', 'Straws Topper', 'Cake Topper'],
  'Wedding Favors & Guest Gifts': ['Envelopes', 'Thank You Card', 'Resin Initial Keychain', 'Badges', 'Magnets', 'Chocolate Wrapper with Logo'],
  'Baarat / Pheras Accessories': ['Petal Cones', 'Wedding Bands', 'Wedding Currency', 'Wedding Bells'],
  'Games & Entertainment': ['Tambola Tickets', 'Scratch Cards', 'Wedding Contract'],
  'Logo Essentials': ['Logo Stickers', 'Car Stickers', 'Paper Bags with Logo', 'Jute Bags with Logo'],
  'Other Essentials': ['Luggage Tags', 'Resin Varmala Preservation', 'Hangover Kits'],
};

const GALLERY_TITLE_OPTIONS = Object.keys(GALLERY_CATEGORIES).map(t => ({ label: t, value: t }));



// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function useLS<T>(key: string, init: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = (v: T | ((prev: T) => T)) => {
    setVal(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [val, set];
}

const downloadCSV = (orders: Order[], revenue: number) => {
  const rows = [
    ['Date', 'Client', 'Email', 'Phone', 'Service', 'Amount (INR)', 'Status'],
    ...orders.map(o => [o.date, o.client, o.email || '', o.phone || '', o.service, String(o.amount), ORDER_STATUSES[o.status].label]),
    [],
    ['', '', '', '', 'TOTAL REVENUE', String(revenue), ''],
  ];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vama-analytics-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  client: string;
  service: string;
  amount: number;
  status: OrderStatus;
  date: string;
  email?: string;
  phone?: string;
}

interface StickyNote {
  id: string;
  content: string;
  color: string;
}

// ── Calendar sub-component ────────────────────────────────────────────────────

const CalendarPanel = () => {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useLS<Record<string, string>>('vama_cal', {});
  const [editing, setEditing] = useState<{ key: string; text: string } | null>(null);

  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const firstDay = new Date(cur.year, cur.month, 1).getDay();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Clean up events from past dates
  useEffect(() => {
    let changed = false;
    const next = { ...events };
    for (const key of Object.keys(next)) {
      if (key < todayKey) {
        delete next[key];
        changed = true;
      }
    }
    if (changed) {
      setEvents(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navBtn = 'grid h-8 w-8 place-items-center rounded-xl border border-[#4b1e12]/12 text-lg text-[#381a12] transition hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#f7d18a] dark:hover:bg-white/10';

  return (
    <div className="rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <button className={navBtn} onClick={() => setCur(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })}>‹</button>
        <p className="font-serif text-lg font-semibold text-[#381a12] dark:text-[#fff4df]">{MONTHS[cur.month]} {cur.year}</p>
        <button className={navBtn} onClick={() => setCur(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })}>›</button>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map(d => <p key={d} className="py-1 text-xs font-bold text-[#8c4b26] dark:text-[#f7d18a]">{d}</p>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = `${cur.year}-${String(cur.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = key === todayKey;
          const isPast = key < todayKey;
          return (
            <button key={key} onClick={() => !isPast && setEditing({ key, text: events[key] ?? '' })}
              disabled={isPast}
              className={`relative flex h-9 w-full items-center justify-center rounded-xl text-sm transition
                ${isPast ? 'text-[#381a12]/30 dark:text-[#fff4df]/30 cursor-not-allowed' : isToday ? 'bg-[#c84624] font-bold text-white shadow-md shadow-[#c84624]/30' : 'text-[#381a12] hover:bg-[#f6dfbd] dark:text-[#fff4df] dark:hover:bg-white/10'}`}
            >
              {day}
              {events[key] && !isPast && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#f7d18a]" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-[#8c4b26] dark:text-[#f7d18a]">Note for {editing.key}</p>
            <textarea rows={2} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })}
              className="w-full rounded-xl border border-[#4b1e12]/12 bg-white px-3 py-2 text-sm text-[#381a12] outline-none focus:border-[#c84624] dark:border-[#f7d18a]/15 dark:bg-[#170f0d] dark:text-[#fff4df]"
              placeholder="Add a note for this date…" />
            <div className="flex gap-2">
              <button onClick={() => { setEvents(prev => { const n = { ...prev }; if (editing.text.trim()) n[editing.key] = editing.text; else delete n[editing.key]; return n; }); setEditing(null); }}
                className="rounded-xl bg-[#c84624] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#9f2f18]">Save</button>
              <button onClick={() => setEditing(null)} className="rounded-xl border border-[#4b1e12]/12 px-4 py-1.5 text-xs text-[#381a12] hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#fff4df]">Cancel</button>
              {events[editing.key] && <button onClick={() => { setEvents(prev => { const n = { ...prev }; delete n[editing.key]; return n; }); setEditing(null); }}
                className="ml-auto rounded-xl border border-[#c84624]/30 px-4 py-1.5 text-xs text-[#c84624] hover:bg-[#c84624]/10">Remove</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {Object.keys(events).length > 0 && (
        <div className="mt-4 border-t border-[#4b1e12]/10 pt-4 dark:border-[#f7d18a]/10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8c4b26] dark:text-[#f7d18a]">Marked Dates</p>
          <div className="space-y-1.5">
            {Object.entries(events).sort().map(([k, v]) => (
              <div key={k} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 font-semibold text-[#c84624]">{k}</span>
                <span className="text-[#6f3a24] dark:text-[#f5dec2]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <div className="grid h-full place-items-center text-xs font-semibold text-[#8c4b26]/50 dark:text-[#f7d18a]/50">No data</div>;

  let currentAngle = 0;
  return (
    <svg viewBox="0 0 32 32" className="h-24 w-24 shrink-0 -rotate-90 rounded-full shadow-inner">
      {data.map((d, i) => {
        const sliceAngle = (d.value / total) * 360;
        if (sliceAngle === 0) return null;
        if (sliceAngle === 360) return <circle key={i} r="16" cx="16" cy="16" fill={d.color} />;

        const startX = 16 + 16 * Math.cos((Math.PI * currentAngle) / 180);
        const startY = 16 + 16 * Math.sin((Math.PI * currentAngle) / 180);

        currentAngle += sliceAngle;

        const endX = 16 + 16 * Math.cos((Math.PI * currentAngle) / 180);
        const endY = 16 + 16 * Math.sin((Math.PI * currentAngle) / 180);

        const largeArcFlag = sliceAngle > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M 16 16 L ${startX} ${startY} A 16 16 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
            fill={d.color}
          />
        );
      })}
    </svg>
  );
};

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const inp = 'block w-full rounded-2xl border border-[#4b1e12]/12 bg-white px-4 py-3 text-sm text-[#381a12] outline-none transition focus:border-[#c84624] focus:ring-4 focus:ring-[#c84624]/10 dark:border-[#f7d18a]/15 dark:bg-[#170f0d] dark:text-[#fff4df] dark:placeholder:text-white/40';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/admin-login', { replace: true });
    }
  };

  // ── Gallery state
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galLoading, setGalLoading] = useState(false);
  const [isGalModalOpen, setIsGalModalOpen] = useState(false);
  const [editingGal, setEditingGal] = useState<Partial<Gallery> | null>(null);
  const [uploadingGalImg, setUploadingGalImg] = useState(false);

  // ── Enquiries state
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [enqLoading, setEnqLoading] = useState(false);
  const [enqError, setEnqError] = useState(false);
  const [enqNotes, setEnqNotes] = useLS<Record<number, { status: string; notes: string }>>('vama_enq_notes', {});
  const [openEnq, setOpenEnq] = useState<number | null>(null);
  const [convertingEnq, setConvertingEnq] = useState<number | null>(null);
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState<number | null>(null);

  const handleSendWhatsApp = async (enq: ContactEnquiry) => {
    try {
      setSendingWhatsApp(enq.id);
      const { template } = await contactApi.getWhatsAppTemplate({ name: enq.name, services_required: enq.services_required });
      const waUrl = `https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(template)}`;
      window.open(waUrl, "_blank");
    } catch (err: any) {
      alert(err.detail || 'Failed to render WhatsApp template');
    } finally {
      setSendingWhatsApp(null);
    }
  };

  const handleSendEmail = async (enq: ContactEnquiry) => {
    try {
      setSendingEmail(enq.id);
      await contactApi.sendEmail({
        name: enq.name,
        email: enq.email,
        services_required: enq.services_required
      });
      alert('Email sent successfully!');
    } catch (err: any) {
      alert(err.detail || 'Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  // ── Analytics state
  const [revenue, setRevenue] = useLS<number>('vama_revenue', 0);
  const [orders, setOrders] = useLS<Order[]>('vama_orders', []);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({ status: 'under_discussion', date: new Date().toISOString().split('T')[0] });

  // ── Planner state
  const [notes, setNotes] = useLS<StickyNote[]>('vama_notes', []);
  const [newNote, setNewNote] = useState('');

  // ── Settings state
  const [settings, setSettings] = useState({ studioName: 'Vama Illustrations', email: 'vamaillustrations@gmail.com' });
  const [saved, setSaved] = useState(false);

  // ── Fetch enquiries when tab activates
  useEffect(() => {
    if (activeTab === 'enquiries') {
      setEnqLoading(true); setEnqError(false);
      contactApi.list()
        .then(data => setEnquiries(data))
        .catch(() => setEnqError(true))
        .finally(() => setEnqLoading(false));
    } else if (activeTab === 'gallery') {
      setGalLoading(true);
      galleryApi.list()
        .then(data => setGalleries(data))
        .catch(() => { })
        .finally(() => setGalLoading(false));
    }
  }, [activeTab]);

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGal || !editingGal.image_url) {
      alert("Please wait for the image to upload or provide an image.");
      return;
    }
    try {
      if (editingGal.id) {
        const updated = await galleryApi.update(editingGal.id, editingGal);
        setGalleries(prev => prev.map(g => g.id === updated.id ? updated : g));
      } else {
        const created = await galleryApi.create(editingGal);
        setGalleries(prev => [created, ...prev]);
      }
      setIsGalModalOpen(false);
    } catch (err) {
      alert('Failed to save gallery');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingGalImg(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage.from('galleries').upload(fileName, file);
      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          alert('The "galleries" bucket does not exist in your Supabase project. Please create a public bucket named "galleries" in the Supabase Dashboard.');
        } else {
          throw uploadError;
        }
        return;
      }

      const { data } = supabase.storage.from('galleries').getPublicUrl(fileName);
      if (data) {
        setEditingGal(prev => ({ ...prev, image_url: data.publicUrl }));
      }
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploadingGalImg(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;
    try {
      await galleryApi.remove(id);
      setGalleries(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      alert('Failed to delete gallery');
    }
  };

  // ── Helpers
  const addOrder = () => {
    if (!newOrder.client || !newOrder.service || !newOrder.amount) return;
    const o: Order = { id: Date.now().toString(), client: newOrder.client!, service: newOrder.service!, amount: Number(newOrder.amount), status: (newOrder.status ?? 'under_discussion') as OrderStatus, date: newOrder.date!, email: newOrder.email, phone: newOrder.phone };
    setOrders(prev => [o, ...prev]);
    setNewOrder({ status: 'under_discussion', date: new Date().toISOString().split('T')[0] });
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const n: StickyNote = { id: Date.now().toString(), content: newNote, color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)] };
    setNotes(prev => [n, ...prev]);
    setNewNote('');
  };

  const statusSummary = (Object.keys(ORDER_STATUSES) as OrderStatus[]).map(s => ({
    ...ORDER_STATUSES[s],
    count: orders.filter(o => o.status === s).length,
    total: orders.filter(o => o.status === s).reduce((a, b) => a + b.amount, 0),
  }));

  const totalRevenue = orders.filter(o => o.status === 'completed_received').reduce((a, b) => a + b.amount, 0) + revenue;

  const pieData = [
    { label: 'Under Discussion', value: statusSummary.find(s => s.label === 'Under Discussion')?.total || 0, color: '#fbbf24' },
    { label: 'Project Ongoing', value: statusSummary.find(s => s.label === 'Project Ongoing')?.total || 0, color: '#38bdf8' },
    { label: 'Payment Pending', value: statusSummary.find(s => s.label === 'Completed (Payment Pending)')?.total || 0, color: '#f97316' },
    { label: 'Payment Received', value: statusSummary.find(s => s.label === 'Completed (Payment Received)')?.total || 0, color: '#10b981' },
    { label: 'Manual Offset', value: revenue, color: '#a8a29e' },
  ].filter(d => d.value > 0);

  // ── Sidebar
  const SidebarContent = () => (
    <>
      <div className="border-b border-[#f7d18a]/15 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f7d18a]">Admin Panel</p>
        <p className="mt-1 font-serif text-xl text-white">Vama Studio</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
            className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-[#f7d18a] text-[#2a120c] shadow-lg shadow-[#f7d18a]/20' : 'text-[#f5dec2] hover:bg-white/10'}`}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-[#f7d18a]/15 px-6 py-4">
        <p className="text-xs text-[#f5dec2]/50">Logged in as Admin</p>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#fff8ef] dark:bg-[#120b0a]">

      {/* ── Desktop Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col bg-[#2a120c] lg:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: 'spring', damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#2a120c] lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#4b1e12]/10 bg-[#fff8ef]/95 px-6 py-4 backdrop-blur dark:border-[#f7d18a]/10 dark:bg-[#120b0a]/95">
          <div className="flex items-center gap-4">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-[#4b1e12]/15 text-[#381a12] lg:hidden dark:border-[#f7d18a]/20 dark:text-[#f7d18a]"
              onClick={() => setSidebarOpen(true)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c4b26] dark:text-[#f7d18a]">
                {TABS.find(t => t.id === activeTab)?.label}
              </p>
              <h1 className="font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                {{ gallery: 'Portfolio Gallery', enquiries: 'Contact Enquiries', analytics: 'Revenue & Orders', planner: 'Studio Planner', settings: 'Studio Settings' }[activeTab]}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-9 min-w-16 place-items-center rounded-full border border-[#4b1e12]/15 bg-white/60 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b1e12] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#fff4df] dark:hover:bg-white/20"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <div className="h-9 w-9 rounded-full bg-[#4b1e12] grid place-items-center shadow-lg shadow-[#4b1e12]/20">
              <span className="text-xs font-bold text-[#f7d18a]">VA</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 pb-20 lg:p-8 lg:pb-8">
          <AnimatePresence mode="wait">

            {/* ─────────── GALLERIES ─────────── */}
            {activeTab === 'gallery' && (
              <motion.div key="gallery" variants={stagger} initial="hidden" animate="visible" exit="hidden">
                <motion.div variants={fadeUp} className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-[#6f3a24] dark:text-[#f5dec2]">{galleries.length} items</p>
                  <button onClick={() => { setEditingGal({ is_featured: false }); setIsGalModalOpen(true); }} className="inline-flex items-center gap-2 rounded-full bg-[#c84624] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#c84624]/25 transition hover:-translate-y-0.5 hover:bg-[#9f2f18]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Gallery
                  </button>
                </motion.div>
                <motion.div variants={stagger} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {galLoading && Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-[1.75rem] border border-[#4b1e12]/10 bg-[#4b1e12]/5 dark:border-[#f7d18a]/10 dark:bg-white/5 animate-pulse">
                      <div className="relative h-44 bg-[#4b1e12]/10 dark:bg-white/10" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 w-3/4 rounded bg-[#4b1e12]/10 dark:bg-white/10" />
                        <div className="h-4 w-1/3 rounded-full bg-[#4b1e12]/10 dark:bg-white/10" />
                      </div>
                    </div>
                  ))}
                  {!galLoading && galleries.map(item => (
                    <motion.div key={item.id} variants={fadeUp} whileHover={{ y: -6 }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-[#4b1e12]/10 bg-white shadow-sm dark:border-[#f7d18a]/10 dark:bg-white/5">
                      <div className="relative h-44 overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#160604]/60 to-transparent" />
                        {item.is_featured && <span className="absolute left-3 top-3 rounded-full bg-[#f7d18a] px-2.5 py-0.5 text-xs font-bold text-[#381a12]">Featured</span>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-[#381a12] dark:text-[#fff4df]">{item.title}</p>
                            <span className="mt-1 inline-flex rounded-full bg-[#4b1e12]/8 px-2.5 py-0.5 text-xs font-medium text-[#8c4b26] dark:bg-[#f7d18a]/10 dark:text-[#f7d18a]">{item.tag}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingGal(item); setIsGalModalOpen(true); }} className="rounded-xl border border-[#4b1e12]/12 px-3 py-1.5 text-xs font-medium text-[#5f2b19] transition hover:bg-[#f6dfbd] dark:border-[#f7d18a]/15 dark:text-[#f5dec2]">Edit</button>
                            <button onClick={() => handleDeleteGallery(item.id)} className="rounded-xl border border-[#c84624]/20 px-3 py-1.5 text-xs font-medium text-[#c84624] transition hover:bg-[#c84624]/10">Delete</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ─────────── ENQUIRIES ─────────── */}
            {activeTab === 'enquiries' && (
              <motion.div key="enquiries" variants={stagger} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
                {enqLoading && (
                  <div className="grid gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-[1.5rem] bg-[#4b1e12]/8 dark:bg-white/5" />)}
                  </div>
                )}
                {enqError && (
                  <motion.div variants={fadeUp} className="rounded-[1.5rem] border border-orange-500/30 bg-orange-500/10 p-6 text-center text-sm text-orange-400">
                    Could not load enquiries. Make sure the Django server is running on port 8000.
                  </motion.div>
                )}
                {!enqLoading && !enqError && enquiries.length === 0 && (
                  <motion.div variants={fadeUp} className="rounded-[2rem] border border-[#4b1e12]/10 bg-white/80 p-10 text-center dark:border-[#f7d18a]/10 dark:bg-white/5">
                    <p className="font-serif text-xl font-semibold text-[#381a12] dark:text-[#fff4df]">No enquiries yet</p>
                    <p className="mt-2 text-sm text-[#6f3a24] dark:text-[#f5dec2]">Submissions from your Contact form will appear here.</p>
                  </motion.div>
                )}
                {!enqLoading && enquiries.map((enq, idx) => {
                  const note = enqNotes[enq.id] ?? { status: '', notes: '' };
                  const isOpen = openEnq === enq.id;
                  const statusMeta = ENQ_STATUSES.find(s => s.value === note.status);
                  return (
                    <motion.div key={enq.id} variants={fadeUp}
                      className={`rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/90 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5 ${isOpen ? 'relative z-20' : 'relative z-10'}`}>
                      {/* Header row */}
                      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#4b1e12] text-xs font-bold text-[#f7d18a]">#{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#381a12] dark:text-[#fff4df]">{enq.name}</p>
                          <p className="truncate text-xs text-[#6f3a24] dark:text-[#f5dec2]">{enq.email} · {enq.phone}</p>
                        </div>
                        <span className="text-xs text-[#8c4b26] dark:text-[#f7d18a]">{fmtDate(enq.created_at)}</span>
                        {statusMeta && (
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.cls}`}>{statusMeta.label}</span>
                        )}
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendEmail(enq)}
                            disabled={sendingEmail === enq.id}
                            className={`grid h-8 w-8 place-items-center rounded-xl border border-[#4b1e12]/15 text-[#8c4b26] transition hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#f7d18a] dark:hover:bg-white/10 ${sendingEmail === enq.id ? 'opacity-50 cursor-wait' : ''}`}
                            title="Send Email">
                            {sendingEmail === enq.id ? (
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(enq)}
                            disabled={sendingWhatsApp === enq.id}
                            className={`grid h-8 w-8 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20 ${sendingWhatsApp === enq.id ? 'opacity-50 cursor-wait' : ''}`}
                            title="Send WhatsApp">
                            {sendingWhatsApp === enq.id ? (
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                            ) : (
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.116 1.524 5.843L.058 23.998l6.335-1.457C8.084 23.476 10.002 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.869 0-3.632-.48-5.164-1.332l-.37-.22-3.76.865.942-3.67-.24-.383A9.934 9.934 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" /></svg>
                            )}
                          </button>

                          <button onClick={() => setOpenEnq(isOpen ? null : enq.id)}
                            className={`grid h-8 w-8 place-items-center rounded-xl border transition ${isOpen ? 'border-[#c84624]/40 bg-[#c84624]/10 text-[#c84624]' : 'border-[#4b1e12]/15 text-[#381a12] hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#f7d18a]'}`}
                            title="Notes">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                            className="border-t border-[#4b1e12]/10 dark:border-[#f7d18a]/10">
                            <div className="grid gap-5 p-5 md:grid-cols-2">
                              {/* Enquiry details */}
                              <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c4b26] dark:text-[#f7d18a]">Enquiry Details</p>
                                {[['Services Required', enq.services_required || '—'], ['Phone', enq.phone || '—'], ['Submitted', fmtDate(enq.created_at)]].map(([l, v]) => (
                                  <div key={l} className="flex gap-2 text-sm"><span className="w-24 shrink-0 font-medium text-[#381a12] dark:text-[#fff4df]">{l}</span><span className="text-[#6f3a24] dark:text-[#f5dec2]">{v}</span></div>
                                ))}
                                <div className="mt-1">
                                  <p className="text-xs font-medium text-[#381a12] dark:text-[#fff4df]">Message</p>
                                  <p className="mt-1 rounded-xl bg-[#4b1e12]/5 p-3 text-sm text-[#6f3a24] dark:bg-white/5 dark:text-[#f5dec2]">{enq.message}</p>
                                </div>
                              </div>

                              {/* Admin notes */}
                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c4b26] dark:text-[#f7d18a]">Admin Notes</p>
                                <CustomSelect
                                  value={note.status}
                                  onChange={(val) => setEnqNotes(prev => ({ ...prev, [enq.id]: { ...note, status: val } }))}
                                  options={ENQ_STATUSES}
                                  placeholder="— Select Status —"
                                />
                                <div>
                                  <label className="mb-1 block text-xs font-semibold text-[#381a12] dark:text-[#fff4df]">OTHERS / Custom Notes</label>
                                  <textarea rows={3} value={note.notes}
                                    onChange={e => setEnqNotes(prev => ({ ...prev, [enq.id]: { ...note, notes: e.target.value } }))}
                                    className={`${inp} rounded-2xl`}
                                    placeholder="Write your notes here…" />
                                </div>
                                <button onClick={() => setOpenEnq(null)}
                                  className="w-full rounded-full bg-[#c84624] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#c84624]/20 hover:bg-[#9f2f18]">
                                  Save & Close
                                </button>

                                {convertingEnq !== enq.id ? (
                                  <button onClick={() => {
                                    setConvertingEnq(enq.id);
                                    setNewOrder({ client: enq.name, email: enq.email, phone: enq.phone, service: enq.services_required || '', amount: undefined, status: 'under_discussion', date: new Date().toISOString().split('T')[0] });
                                  }}
                                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c84624]/20 bg-[#c84624]/5 py-2.5 text-sm font-semibold text-[#c84624] transition hover:bg-[#c84624]/10 dark:border-[#f7d18a]/20 dark:bg-[#f7d18a]/5 dark:text-[#f7d18a] dark:hover:bg-[#f7d18a]/10"
                                  >
                                    Move to orders
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                                  </button>
                                ) : (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-3 rounded-2xl border border-[#4b1e12]/10 bg-black/5 p-4 dark:border-[#f7d18a]/10 dark:bg-white/5">
                                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c4b26] dark:text-[#f7d18a]">Convert to Order</p>
                                    <input placeholder="Client name" value={newOrder.client ?? ''} onChange={e => setNewOrder(p => ({ ...p, client: e.target.value }))} className={inp} />
                                    <input placeholder="Service / project" value={newOrder.service ?? ''} onChange={e => setNewOrder(p => ({ ...p, service: e.target.value }))} className={inp} />
                                    <input type="number" placeholder="Amount ₹" value={newOrder.amount ?? ''} onChange={e => setNewOrder(p => ({ ...p, amount: Number(e.target.value) }))} className={inp} />
                                    <CustomSelect
                                      value={newOrder.status || 'under_discussion'}
                                      onChange={(val) => setNewOrder(p => ({ ...p, status: val as OrderStatus }))}
                                      options={Object.entries(ORDER_STATUSES).map(([k, v]) => ({ label: v.label, value: k }))}
                                      placeholder="Status"
                                    />
                                    <div className="flex gap-2 pt-1">
                                      <button onClick={() => setConvertingEnq(null)} className="flex-1 rounded-xl border border-[#4b1e12]/15 py-2 text-sm font-medium text-[#381a12] hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#f5dec2] dark:hover:bg-white/10">Cancel</button>
                                      <button onClick={() => {
                                        if (!newOrder.client || !newOrder.service || !newOrder.amount) return;
                                        addOrder();
                                        setConvertingEnq(null);
                                        setActiveTab('analytics');
                                      }} className="flex-1 rounded-xl bg-[#c84624] py-2 text-sm font-bold text-white shadow-md hover:bg-[#9f2f18]">Confirm</button>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* ─────────── ANALYTICS ─────────── */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" variants={stagger} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
                {/* Revenue + download */}
                <motion.div variants={fadeUp} className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Manual revenue */}
                  <div className="col-span-2 flex flex-col justify-center rounded-[1.5rem] border border-[#4b1e12]/10 bg-[#2a120c] p-5 text-white shadow-lg dark:border-[#f7d18a]/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f7d18a]">Total Revenue</p>
                    <p className="mt-2 font-serif text-4xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="mt-1 text-xs text-[#f5dec2]/60">Auto-calculated from received payments + manual offset</p>
                    <div className="mt-4 flex items-center gap-2">
                      <label className="text-xs text-[#f5dec2]/80">Manual offset ₹</label>
                      <input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))}
                        className="w-32 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:border-[#f7d18a]" />
                    </div>
                  </div>
                  {/* Status cards */}
                  {statusSummary.map(s => (
                    <div key={s.label} className="flex flex-col justify-center rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5">
                      <div>
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>
                      </div>
                      <p className="mt-3 font-serif text-3xl font-bold text-[#381a12] dark:text-[#fff4df]">{s.count}</p>
                      <p className="mt-0.5 text-xs text-[#8c4b26] dark:text-[#f7d18a]">₹{s.total.toLocaleString('en-IN')} value</p>
                    </div>
                  ))}
                  {/* Pie Chart */}
                  <div className="col-span-2 flex items-center gap-6 rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5">
                    <PieChart data={pieData} />
                    <div className="flex flex-col justify-center gap-1.5">
                      {pieData.map(d => (
                        <div key={d.label} className="flex items-center gap-2">
                          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-xs font-medium text-[#381a12] dark:text-[#fff4df]">{d.label}</span>
                          <span className="text-xs font-bold text-[#8c4b26] dark:text-[#f7d18a]">₹{d.value.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      {pieData.length === 0 && <span className="text-xs text-[#8c4b26]/70 dark:text-[#f7d18a]/70">No revenue data yet.</span>}
                    </div>
                  </div>
                </motion.div>

                {/* Add order */}
                <motion.div variants={fadeUp} className="relative z-20 rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5">
                  <p className="mb-4 text-sm font-bold text-[#381a12] dark:text-[#fff4df]">Add Order / Project</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                    <input placeholder="Client name" value={newOrder.client ?? ''} onChange={e => setNewOrder(p => ({ ...p, client: e.target.value }))} className={inp} />
                    <input placeholder="Email (optional)" type="email" value={newOrder.email ?? ''} onChange={e => setNewOrder(p => ({ ...p, email: e.target.value }))} className={inp} />
                    <input placeholder="Phone (optional)" type="tel" value={newOrder.phone ?? ''} onChange={e => setNewOrder(p => ({ ...p, phone: e.target.value }))} className={inp} />
                    <input placeholder="Service / project" value={newOrder.service ?? ''} onChange={e => setNewOrder(p => ({ ...p, service: e.target.value }))} className={inp} />
                    <input type="number" placeholder="Amount ₹" value={newOrder.amount ?? ''} onChange={e => setNewOrder(p => ({ ...p, amount: Number(e.target.value) }))} className={inp} />
                    <CustomSelect
                      value={newOrder.status || ''}
                      onChange={(val) => setNewOrder(p => ({ ...p, status: val as OrderStatus }))}
                      options={Object.entries(ORDER_STATUSES).map(([k, v]) => ({ label: v.label, value: k }))}
                      placeholder="Status"
                    />
                    <button onClick={addOrder} className="rounded-2xl bg-[#c84624] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#c84624]/20 hover:bg-[#9f2f18]">+ Add</button>
                  </div>
                </motion.div>

                {/* Orders table */}
                <motion.div variants={fadeUp} className="relative z-10 overflow-hidden rounded-[1.5rem] border border-[#4b1e12]/10 bg-white/80 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5">
                  <div className="flex items-center justify-between px-5 py-4">
                    <p className="font-semibold text-[#381a12] dark:text-[#fff4df]">Orders ({orders.length})</p>
                    <button onClick={() => downloadCSV(orders, totalRevenue)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#4b1e12]/12 px-4 py-2 text-xs font-semibold text-[#381a12] transition hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:text-[#f7d18a] dark:hover:bg-white/10">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                      Download Excel / CSV
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="px-5 pb-8 text-center text-sm text-[#6f3a24] dark:text-[#f5dec2]">No orders yet. Add your first one above.</p>
                  ) : (
                    <div className="overflow-x-auto pb-24">
                      <table className="w-full text-sm">
                        <thead className="border-t border-[#4b1e12]/10 dark:border-[#f7d18a]/10">
                          <tr>{['Date', 'Client', 'Service', 'Amount', 'Status', 'MORE'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.15em] text-[#8c4b26] dark:text-[#f7d18a]">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-[#4b1e12]/5 dark:divide-[#f7d18a]/5">
                          {orders.map(o => (
                            <tr key={o.id} className="transition hover:bg-[#4b1e12]/3 dark:hover:bg-white/3">
                              <td className="px-5 py-3 text-[#6f3a24] dark:text-[#f5dec2]">{o.date}</td>
                              <td className="px-5 py-3 font-medium text-[#381a12] dark:text-[#fff4df]">{o.client}</td>
                              <td className="px-5 py-3 text-[#6f3a24] dark:text-[#f5dec2]">{o.service}</td>
                              <td className="px-5 py-3 font-semibold text-[#381a12] dark:text-[#fff4df]">₹{o.amount.toLocaleString('en-IN')}</td>
                              <td className="px-5 py-3">
                                <CustomSelect
                                  value={o.status}
                                  onChange={(val) => setOrders(prev => prev.map(order => order.id === o.id ? { ...order, status: val as OrderStatus } : order))}
                                  options={Object.entries(ORDER_STATUSES).map(([k, v]) => ({ label: v.label, value: k }))}
                                  className="w-48 !py-1.5 !text-xs"
                                />
                              </td>
                              <td className="px-5 py-3 text-right">
                                <button onClick={() => setOrders(prev => prev.filter(x => x.id !== o.id))}
                                  className="p-1 text-[#c84624] transition hover:text-[#9f2f18] dark:hover:text-[#f7d18a]" title="Remove Order">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ─────────── PLANNER ─────────── */}
            {activeTab === 'planner' && (
              <motion.div key="planner" variants={stagger} initial="hidden" animate="visible" exit="hidden"
                className="grid gap-6 xl:grid-cols-[1fr_340px]">
                {/* Sticky notes */}
                <motion.div variants={fadeUp}>
                  <div className="mb-4 flex items-end gap-3">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()}
                      className={`${inp} flex-1`} placeholder="Write a sticky note and press Enter…" />
                    <button onClick={addNote} className="shrink-0 rounded-2xl bg-[#c84624] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#c84624]/20 hover:bg-[#9f2f18]">+ Add</button>
                  </div>
                  {notes.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#4b1e12]/15 text-center dark:border-[#f7d18a]/15">
                      <p className="text-3xl">📌</p>
                      <p className="mt-2 text-sm text-[#6f3a24] dark:text-[#f5dec2]">No sticky notes yet. Add one above!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {notes.map(note => (
                        <motion.div key={note.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                          className="relative min-h-[140px] rounded-[1.25rem] border p-4 shadow-sm backdrop-blur transition-colors"
                          style={{ backgroundColor: theme === 'dark' ? `${note.color}15` : `${note.color}40`, borderColor: theme === 'dark' ? `${note.color}30` : `${note.color}60` }}>
                          <button onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-[#c84624]/10 text-[#c84624] transition hover:bg-[#c84624]/20" title="Delete Note">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                          <textarea
                            value={note.content}
                            onChange={e => setNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: e.target.value } : n))}
                            className="mt-6 w-full resize-none bg-transparent p-0 font-serif text-sm font-medium text-[#381a12] outline-none placeholder:text-[#381a12]/30 dark:text-[#fff4df] dark:placeholder:text-[#fff4df]/30"
                            rows={4}
                            placeholder="Empty note..."
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Calendar */}
                <motion.div variants={fadeUp}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8c4b26] dark:text-[#f7d18a]">Calendar</p>
                  <CalendarPanel />
                </motion.div>
              </motion.div>
            )}

            {/* ─────────── SETTINGS ─────────── */}
            {activeTab === 'settings' && (
              <motion.div key="settings" variants={stagger} initial="hidden" animate="visible" exit="hidden">
                <motion.div variants={fadeUp} className="mx-auto max-w-2xl rounded-[2rem] border border-[#4b1e12]/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-[#f7d18a]/10 dark:bg-white/5 sm:p-8">
                  <h2 className="font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff4df]">Studio Settings</h2>
                  <form onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); }} className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">Studio Name</label>
                      <input type="text" value={settings.studioName} onChange={e => setSettings(s => ({ ...s, studioName: e.target.value }))} className={inp} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#381a12] dark:text-[#fff4df]">Contact Email</label>
                      <input type="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} className={inp} />
                    </div>
                    <AnimatePresence>
                      {saved && (
                        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="rounded-2xl bg-[#f7d18a]/20 border border-[#f7d18a]/40 px-4 py-3 text-sm font-medium text-[#381a12] dark:text-[#fff4df]">
                          Settings saved successfully.
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <button type="submit" className="w-full rounded-full bg-[#c84624] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c84624]/25 hover:-translate-y-0.5 hover:bg-[#9f2f18] transition-all">Save Settings</button>
                  </form>
                  <div className="mt-8 border-t border-[#4b1e12]/10 pt-8 dark:border-[#f7d18a]/10">
                    <h3 className="mb-4 font-serif text-lg font-medium text-[#381a12] dark:text-[#fff4df]">Account</h3>
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/20 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Log Out
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex border-t border-[#4b1e12]/10 bg-[#fff8ef]/95 backdrop-blur dark:border-[#f7d18a]/10 dark:bg-[#120b0a]/95 lg:hidden">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${activeTab === tab.id ? 'text-[#c84624]' : 'text-[#8c4b26]/60 dark:text-[#f5dec2]/50'}`}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
      {/* ── Gallery Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isGalModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[#4b1e12]/10 bg-[#fff8ef] shadow-2xl dark:border-[#f7d18a]/10 dark:bg-[#120b0a]">
              <div className="flex items-center justify-between border-b border-[#4b1e12]/10 p-6 dark:border-[#f7d18a]/10">
                <h3 className="font-serif text-xl font-semibold text-[#381a12] dark:text-[#fff4df]">{editingGal?.id ? 'Edit Gallery' : 'Add Gallery'}</h3>
                <button onClick={() => setIsGalModalOpen(false)} className="text-[#6f3a24] transition hover:text-[#c84624] dark:text-[#f7d18a]/50 dark:hover:text-[#f7d18a]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSaveGallery} className="p-6 flex flex-col md:flex-row gap-8">

                {/* Left side: Image Upload & Preview */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/70">Image</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingGalImg}
                      className="w-full rounded-xl border border-[#4b1e12]/20 bg-white/50 px-4 py-2 text-sm text-[#381a12] file:mr-4 file:rounded-full file:border-0 file:bg-[#c84624]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#c84624] hover:file:bg-[#c84624]/20 outline-none transition focus:border-[#c84624] focus:ring-2 focus:ring-[#c84624]/20 dark:border-[#f7d18a]/20 dark:bg-black/20 dark:text-[#fff4df]" />
                    {uploadingGalImg && <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#c84624] border-t-transparent" />}
                  </div>
                  {editingGal?.image_url ? (
                    <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-[#4b1e12]/20 dark:border-[#f7d18a]/20 min-h-[250px]">
                      <img src={editingGal.image_url} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="mt-4 flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#4b1e12]/20 bg-white/20 dark:border-[#f7d18a]/10 dark:bg-black/20 min-h-[250px] text-[#6f3a24]/50 dark:text-[#f5dec2]/30">
                      <svg className="h-10 w-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm font-medium">No Image Selected</span>
                    </div>
                  )}
                </div>

                {/* Right side: Other inputs */}
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/70">Title</label>
                    <CustomSelect
                      value={editingGal?.title || ''}
                      onChange={(val) => {
                        setEditingGal({ ...editingGal, title: val, tag: '' });
                      }}
                      options={GALLERY_TITLE_OPTIONS}
                      placeholder="Select a category…"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/70">Tag</label>
                    <CustomSelect
                      value={editingGal?.tag || ''}
                      onChange={(val) => setEditingGal({ ...editingGal, tag: val })}
                      options={
                        editingGal?.title && GALLERY_CATEGORIES[editingGal.title]
                          ? GALLERY_CATEGORIES[editingGal.title].map(t => ({ label: t, value: t }))
                          : []
                      }
                      placeholder={editingGal?.title ? 'Select a tag…' : 'Select a title first'}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/70">Description</label>
                    <textarea rows={3} value={editingGal?.description || ''} onChange={e => setEditingGal({ ...editingGal, description: e.target.value })}
                      className="w-full rounded-xl border border-[#4b1e12]/20 bg-white/50 px-4 py-2.5 text-sm text-[#381a12] outline-none transition focus:border-[#c84624] focus:ring-2 focus:ring-[#c84624]/20 dark:border-[#f7d18a]/20 dark:bg-black/20 dark:text-[#fff4df]" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingGal?.is_featured || false} onChange={e => setEditingGal({ ...editingGal, is_featured: e.target.checked })}
                      className="rounded border-[#4b1e12]/30 text-[#c84624] focus:ring-[#c84624]" />
                    <span className="text-sm text-[#6f3a24] dark:text-[#f5dec2]">Featured Gallery</span>
                  </label>

                  <div className="mt-4 border-t border-[#4b1e12]/10 pt-4 dark:border-[#f7d18a]/10">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/70">Recommendations (Max 3)</label>
                    <div className="max-h-32 overflow-y-auto space-y-2 rounded-xl border border-[#4b1e12]/20 bg-white/30 p-3 dark:border-[#f7d18a]/20 dark:bg-black/20">
                      {galleries.filter(g => g.id !== editingGal?.id).map(g => {
                        const isSelected = editingGal?.recommendations?.includes(g.id);
                        return (
                          <label key={g.id} className="flex items-center gap-2 cursor-pointer text-sm text-[#6f3a24] dark:text-[#f5dec2]">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={e => {
                                const currentRecs = editingGal?.recommendations || [];
                                if (e.target.checked) {
                                  if (currentRecs.length >= 3) {
                                    alert('You can only select up to 3 recommendations.');
                                    return;
                                  }
                                  setEditingGal({ ...editingGal, recommendations: [...currentRecs, g.id] });
                                } else {
                                  setEditingGal({ ...editingGal, recommendations: currentRecs.filter(id => id !== g.id) });
                                }
                              }}
                              className="rounded border-[#4b1e12]/30 text-[#c84624] focus:ring-[#c84624]"
                            />
                            {g.tag}
                          </label>
                        );
                      })}
                      {galleries.filter(g => g.id !== editingGal?.id).length === 0 && (
                        <p className="text-xs text-[#6f3a24]/60 dark:text-[#f5dec2]/50 italic">No other galleries available.</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto pt-8 flex gap-3">
                    <button type="button" onClick={() => setIsGalModalOpen(false)}
                      className="flex-1 rounded-xl bg-[#4b1e12]/10 py-3 text-sm font-semibold text-[#6f3a24] transition hover:bg-[#4b1e12]/15 dark:bg-[#f7d18a]/10 dark:text-[#f7d18a] dark:hover:bg-[#f7d18a]/20">
                      Cancel
                    </button>
                    <button type="submit" disabled={uploadingGalImg}
                      className="flex-1 rounded-xl bg-[#c84624] py-3 text-sm font-semibold text-white shadow-lg shadow-[#c84624]/25 transition hover:-translate-y-0.5 hover:bg-[#9f2f18] disabled:opacity-50 disabled:hover:translate-y-0">
                      {uploadingGalImg ? 'Uploading Image...' : 'Save Gallery'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;