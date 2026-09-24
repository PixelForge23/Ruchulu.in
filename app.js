/* =============================================================
   app.js — React components for రుచులు
   Loads data from DataService (data.js). Never touches Firebase
   or localStorage directly.
   ============================================================= */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import htm from 'https://esm.sh/htm@3.1.1';

import {
  DataService,
  TELUGU_MONTHS,
  todayISO,
  formatTeluguDate,
  makeSlug,
  IMG,
} from './data.js';

const html = htm.bind(React.createElement);

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const colors = { success: 'bg-green-700', error: 'bg-red-600', info: 'bg-stone-900' }[toast.type || 'info'];

  return html`
    <div role="status" aria-live="polite" class="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60] toast">
      <div class=${`${colors} text-white px-5 py-3 rounded-full text-[13px] font-bold shadow-xl max-w-[92vw] text-center`}>
        ${toast.message}
      </div>
    </div>
  `;
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return html`
    <button aria-label="పైకి వెళ్లండి"
      onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      class="fixed right-4 bottom-20 md:right-6 md:bottom-6 z-40 w-11 h-11 rounded-full bg-[#1A1A1A] text-white grid place-items-center shadow-lg hover:bg-[#FF6B35] transition">↑</button>
  `;
};

const BlogCard = ({ blog, large = false, onOpen }) => {
  const handleError = (e) => { e.currentTarget.src = IMG.gutti; };
  return html`
    <article class=${`group bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-50 ${large ? 'md:flex' : ''}`}>
      <div class=${`${large ? 'md:w-[55%] h-[220px] md:h-auto' : 'h-[200px] sm:h-[220px]'} relative overflow-hidden bg-[#FFF0E6]`}>
        <img src=${blog.featuredImage || IMG.gutti} alt=${blog.altText || blog.title}
          loading="lazy" decoding="async"
          class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          onError=${handleError} />
        <span class="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-[#2D5016] border border-orange-100">
          ${blog.categoryName}
        </span>
      </div>
      <div class=${`p-5 flex flex-col ${large ? 'md:w-[45%] md:p-8 justify-center' : ''}`}>
        <div class="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
          <span>📅 ${formatTeluguDate(blog.publishDate)}</span>
          <span aria-hidden="true">•</span>
          <span>👁 ${Number(blog.views || 0).toLocaleString('en-IN')}</span>
        </div>
        <h3 class=${`${large ? 'text-[22px] md:text-[26px] leading-tight' : 'text-[17px] leading-snug'} font-extrabold text-[#2D2A26] mb-2 line-clamp-2`}>
          ${blog.title}
        </h3>
        <p class="text-[13.5px] leading-[1.6] text-stone-600 line-clamp-2 mb-4">${blog.shortDescription}</p>
        <button type="button" onClick=${() => onOpen(blog)}
          class="self-start text-[13px] font-bold text-[#FF6B35] hover:text-[#E05A2B] inline-flex items-center gap-1"
          aria-label=${`${blog.title} చదవండి`}>
          చదవండి <span class="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  `;
};

const EmptyState = ({ icon = '🍽', title, hint, action }) => html`
  <div class="bg-white border border-dashed border-orange-200 rounded-2xl p-10 text-center">
    <div class="text-[40px] mb-2" aria-hidden="true">${icon}</div>
    <p class="text-[15px] font-bold text-stone-700">${title}</p>
    ${hint && html`<p class="text-[13px] text-stone-500 mt-1">${hint}</p>`}
    ${action}
  </div>
`;

const LoadingState = ({ message = 'లోడ్ అవుతోంది…' }) => html`
  <div class="grid place-items-center py-20">
    <div class="flex flex-col items-center gap-3 text-stone-500">
      <div class="w-8 h-8 rounded-full border-2 border-orange-200 border-t-[#FF6B35] animate-spin"></div>
      <p class="text-[13px]">${message}</p>
    </div>
  </div>
`;

/* ============================================================
   HEADER
   ============================================================ */
const NAV_ITEMS = [
  { id:'home',    label:'🏠 హోమ్' },
  { id:'all',     label:'🍲 వంటకాలు' },
  { id:'daily',   label:'📅 రోజువారీ' },
  { id:'archive', label:'📚 ఆర్కైవ్' },
  { id:'about',   label:'ℹ మా గురించి' },
  { id:'contact', label:'📞 సంప్రదించండి' },
];

function Header({
  page, onNavigate, searchQuery, setSearchQuery, onSubmitSearch,
  menuOpen, setMenuOpen, isAdmin,
}) {
  const [mobileSearch, setMobileSearch] = useState(searchQuery);
  useEffect(() => { setMobileSearch(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen, setMenuOpen]);

  const go = (id) => { onNavigate(id); setMenuOpen(false); };

  return html`
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-orange-100">
      <div class="max-w-[1160px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-3">
        <button onClick=${() => go('home')} class="flex items-center gap-3" aria-label="హోమ్‌కు వెళ్లండి">
          <span class="w-9 h-9 rounded-full bg-[#FF6B35] grid place-items-center text-white font-black text-[16px]" aria-hidden="true">రు</span>
          <span class="text-left leading-none">
            <span class="block font-black text-[15px] tracking-tight">రుచులు</span>
            <span class="block text-[10px] font-bold tracking-[0.14em] text-stone-500">TELUGU వంటకాలు</span>
          </span>
        </button>

        <nav class="hidden lg:flex items-center gap-1 bg-stone-50 rounded-full p-1 border" aria-label="ప్రధాన నావిగేషన్">
          ${NAV_ITEMS.map(item => html`
            <button key=${item.id}
              onClick=${() => go(item.id)}
              aria-current=${page === item.id ? 'page' : undefined}
              class=${`px-4 py-2 rounded-full text-[12px] font-bold transition ${
                page === item.id ? 'bg-white shadow-sm text-[#FF6B35]' : 'text-stone-600 hover:text-stone-900'
              }`}>
              ${item.label}
            </button>
          `)}
        </nav>

        <div class="flex items-center gap-2">
          <form class="hidden md:flex items-center bg-white border rounded-full pl-3 pr-1 py-1 shadow-sm"
            onSubmit=${(e) => { e.preventDefault(); onSubmitSearch(searchQuery); }} role="search">
            <span class="text-stone-400" aria-hidden="true">🔍</span>
            <input value=${searchQuery} onChange=${(e) => setSearchQuery(e.target.value)}
              placeholder="వెతకండి..." aria-label="వంటకాలు వెతకండి"
              class="w-[140px] xl:w-[180px] bg-transparent outline-none text-[12px] px-2" type="search" />
            <button type="submit" class="bg-[#1A1A1A] text-white text-[11px] font-bold px-4 py-1.5 rounded-full">Go</button>
          </form>

          <button type="button" onClick=${() => setMenuOpen(!menuOpen)}
            class="lg:hidden w-10 h-10 rounded-full bg-stone-900 text-white grid place-items-center"
            aria-label=${menuOpen ? 'మెనూ మూసివేయండి' : 'మెనూ తెరవండి'}
            aria-expanded=${menuOpen} aria-controls="mobile-menu">
            ${menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      ${menuOpen && html`
        <div id="mobile-menu" class="lg:hidden border-t bg-white px-4 py-4 space-y-1 animate-slide-down">
          <form onSubmit=${(e) => { e.preventDefault(); setSearchQuery(mobileSearch); setMenuOpen(false); onSubmitSearch(mobileSearch); }}
            class="flex gap-2 mb-3" role="search">
            <input value=${mobileSearch} onChange=${(e) => setMobileSearch(e.target.value)}
              placeholder="బిర్యానీ వెతకండి..." aria-label="వంటకాలు వెతకండి"
              class="flex-1 border rounded-full px-4 py-2.5 text-[13px]" type="search" />
            <button type="submit" class="bg-[#FF6B35] text-white px-5 rounded-full text-[12px] font-bold">వెతకండి</button>
          </form>
          ${NAV_ITEMS.map(item => html`
            <button key=${item.id} onClick=${() => go(item.id)}
              aria-current=${page === item.id ? 'page' : undefined}
              class=${`w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold ${
                page === item.id ? 'bg-[#FFF0E6] text-[#FF6B35]' : 'hover:bg-stone-50'
              }`}>
              ${item.label}
            </button>
          `)}
          ${isAdmin && html`
            <button onClick=${() => go('admin-dashboard')}
              class="w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold hover:bg-stone-50">
              🛠 అడ్మిన్ డాష్‌బోర్డ్
            </button>
          `}
        </div>
      `}
    </header>
  `;
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ onNavigate, categories }) {
  return html`
    <footer class="mt-12 bg-[#1A1A1A] text-white">
      <div class="max-w-[1160px] mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div class="font-black text-[18px]">రుచులు</div>
          <p class="text-[12px] leading-[1.7] text-white/60 mt-3">
            ప్రతిరోజూ కొత్త తెలుగు వంటకం, అమ్మ చేతి రుచితో. సంప్రదాయం, ఆరోగ్యం, రుచి – మూడూ ఒకే చోట.
          </p>
        </div>
        <nav aria-label="ఫుటర్ నావిగేషన్">
          <div class="font-bold text-[12px] tracking-widest opacity-60 mb-3">నావిగేషన్</div>
          <div class="space-y-2 text-[13px] text-white/70">
            ${['home','all','daily','archive','about','contact'].map(id => html`
              <button key=${id} onClick=${() => onNavigate(id)} class="block hover:text-white">
                ${NAV_ITEMS.find(n => n.id === id)?.label || id}
              </button>
            `)}
          </div>
        </nav>
        <div>
          <div class="font-bold text-[12px] tracking-widest opacity-60 mb-3">వర్గాలు</div>
          <div class="space-y-2 text-[13px] text-white/70">
            ${categories.slice(0, 6).map(c => html`
              <button key=${c.id} onClick=${() => onNavigate('category', { categoryId: c.id })}
                class="block hover:text-white">${c.name}</button>
            `)}
          </div>
        </div>
        <div>
          <div class="font-bold text-[12px] tracking-widest opacity-60 mb-3">సంప్రదించండి</div>
          <p class="text-[13px] text-white/60">సలహాలు, కొత్త వంటకాల కోసం</p>
          <button onClick=${() => onNavigate('contact')}
            class="mt-3 bg-white text-black px-5 py-2 rounded-full text-[12px] font-bold">సంప్రదించండి</button>
          <button onClick=${() => onNavigate('admin-login')}
            class="mt-8 block text-[11px] text-white/40 hover:text-white/80 underline underline-offset-2">Admin Login</button>
        </div>
      </div>
      <div class="border-t border-white/10 py-4 text-center text-[11px] text-white/40 px-4">
        © ${new Date().getFullYear()} రుచులు • Data mode: ${DataService.mode} • Realtime ready
      </div>
    </footer>
  `;
}

/* ============================================================
   PAGES
   ============================================================ */
function HomePage({ blogs, categories, visitors, onOpenBlog, onNavigate, selectedDate, setSelectedDate }) {
  const todaysBlogs = useMemo(() => blogs.filter(b => b.publishDate === todayISO()), [blogs]);
  const dateBlogs   = useMemo(() => blogs.filter(b => b.publishDate === selectedDate), [blogs, selectedDate]);
  const hero        = blogs[0];

  return html`
    <div class="space-y-10 animate-fade-in">
      ${hero && html`
        <section class="relative rounded-[28px] overflow-hidden bg-[#FFF8F0] border border-orange-100">
          <div class="grid md:grid-cols-[1.2fr_1fr] min-h-[380px] md:min-h-[420px]">
            <div class="relative h-[240px] sm:h-[300px] md:h-auto">
              <img src=${hero.featuredImage} alt=${hero.altText || hero.title}
                class="w-full h-full object-cover" loading="eager" decoding="async" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 md:hidden"></div>
            </div>
            <div class="p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-[#FFF8F0] to-white">
              <span class="inline-flex items-center gap-2 bg-[#2D5016] text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                ఈరోజు స్పెషల్
              </span>
              <h1 class="text-[26px] sm:text-[28px] md:text-[34px] font-black leading-[1.15] text-[#1A1A1A] mb-3">
                ${hero.title}
              </h1>
              <p class="text-[14.5px] leading-[1.7] text-stone-600 mb-6">${hero.shortDescription}</p>
              <div class="flex flex-wrap items-center gap-3">
                <button onClick=${() => onOpenBlog(hero)}
                  class="bg-[#FF6B35] hover:bg-[#E85F2F] text-white font-bold text-[14px] px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(255,107,53,0.3)] transition">
                  పూర్తి రెసిపీ చదవండి →
                </button>
                <span class="text-[11px] text-stone-500">${formatTeluguDate(hero.publishDate)}</span>
              </div>
            </div>
          </div>
        </section>
      `}

      <section>
        <div class="flex items-center justify-between mb-5 gap-3">
          <h2 class="text-[20px] font-black text-[#1A1A1A]">ఈరోజు బ్లాగ్స్</h2>
          <span class="text-[12px] bg-orange-100 text-[#FF6B35] px-3 py-1 rounded-full font-bold">
            ${todaysBlogs.length} వంటకాలు
          </span>
        </div>
        ${todaysBlogs.length === 0
          ? html`<${EmptyState} icon="📭" title="ఈరోజు ఇంకా బ్లాగ్స్ ప్రచురించలేదు." hint="క్రింద తాజా వంటకాలు చూడండి." />`
          : html`
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              ${todaysBlogs.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
            </div>
          `}
      </section>

      <section class="bg-white rounded-[20px] border border-orange-100 p-6 md:p-8 shadow-sm">
        <h2 class="text-[18px] font-black mb-4 flex items-center gap-2">📅 తేదీ ద్వారా బ్లాగ్ చూడండి</h2>
        <div class="flex flex-col md:flex-row gap-4 md:items-center">
          <label class="flex items-center gap-3 text-[13px] font-bold text-stone-700">
            తేదీ ఎంచుకోండి:
            <input type="date" value=${selectedDate} max=${todayISO()}
              onChange=${(e) => setSelectedDate(e.target.value)}
              class="border border-stone-200 rounded-full px-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </label>
          <p class="text-[13px] text-stone-500">
            ఫలితం: <strong class="text-[#1A1A1A]">${formatTeluguDate(selectedDate)}</strong> నాటి బ్లాగ్స్
          </p>
        </div>
        <div class="mt-6">
          ${dateBlogs.length === 0
            ? html`<${EmptyState} icon="🗓" title="ఈ తేదీన ఇంకా ఎలాంటి బ్లాగ్స్ లేవు." />`
            : html`
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                ${dateBlogs.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
              </div>
            `}
        </div>
      </section>

      <section>
        <h2 class="text-[20px] font-black mb-5">తాజా బ్లాగ్స్</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${blogs.slice(0, 6).map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
        </div>
      </section>

      <section class="bg-[#2D5016] rounded-[24px] p-6 md:p-10 text-white">
        <h2 class="text-[20px] font-black mb-6">వంటకాల రకాలు</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          ${categories.map(c => {
            const count = blogs.filter(b => b.categoryId === c.id).length;
            return html`
              <button key=${c.id} onClick=${() => onNavigate('category', { categoryId: c.id })}
                class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 rounded-2xl p-4 text-left transition">
                <div class="text-[28px] mb-2" aria-hidden="true">${c.icon}</div>
                <div class="text-[13px] font-bold leading-tight">${c.name}</div>
                <div class="text-[11px] opacity-70 mt-1">${count} వంటకాలు</div>
              </button>
            `;
          })}
        </div>
      </section>

      <section class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-orange-100 p-6 text-center shadow-sm">
          <div class="text-[11px] font-bold tracking-widest text-stone-500 mb-1">ఈరోజు సందర్శకులు</div>
          <div class="text-[28px] font-black text-[#FF6B35]">${Number(visitors.today || 0).toLocaleString('en-IN')}</div>
        </div>
        <div class="bg-white rounded-2xl border border-orange-100 p-6 text-center shadow-sm">
          <div class="text-[11px] font-bold tracking-widest text-stone-500 mb-1">మొత్తం సందర్శనలు</div>
          <div class="text-[28px] font-black text-[#2D5016]">${Number(visitors.total || 0).toLocaleString('en-IN')}</div>
        </div>
      </section>
    </div>
  `;
}

function AllBlogsPage({ blogs, categories, selectedCategory, setSelectedCategory, onOpenBlog }) {
  const [pageNum, setPageNum] = useState(1);
  const filtered = useMemo(
    () => selectedCategory ? blogs.filter(b => b.categoryId === selectedCategory) : blogs,
    [blogs, selectedCategory]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const safePage = Math.min(pageNum, totalPages);
  const slice = filtered.slice((safePage - 1) * 6, safePage * 6);

  useEffect(() => { setPageNum(1); }, [selectedCategory]);

  return html`
    <div class="grid lg:grid-cols-[260px_1fr] gap-8 animate-fade-in">
      <aside class="bg-white rounded-2xl border p-5 h-fit lg:sticky lg:top-[90px]">
        <h3 class="font-black text-[15px] mb-4">వర్గాలు</h3>
        <div class="space-y-1">
          <button onClick=${() => setSelectedCategory('')}
            class=${`w-full text-left px-3 py-2 rounded-xl text-[13px] ${
              !selectedCategory ? 'bg-[#FFF0E6] text-[#FF6B35] font-bold' : 'hover:bg-stone-50'
            }`}>అన్నీ (${blogs.length})</button>
          ${categories.map(c => {
            const n = blogs.filter(b => b.categoryId === c.id).length;
            return html`
              <button key=${c.id} onClick=${() => setSelectedCategory(c.id)}
                class=${`w-full text-left px-3 py-2 rounded-xl text-[13px] flex justify-between ${
                  selectedCategory === c.id ? 'bg-[#FFF0E6] text-[#FF6B35] font-bold' : 'hover:bg-stone-50'
                }`}>
                <span>${c.icon} ${c.name}</span>
                <span class="opacity-60">${n}</span>
              </button>
            `;
          })}
        </div>
      </aside>
      <div>
        <h2 class="text-[22px] font-black mb-5">వంటకాలు</h2>
        ${slice.length === 0
          ? html`<${EmptyState} icon="🍽" title="ఇంకా బ్లాగ్స్ లేవు." />`
          : html`
            <div class="grid sm:grid-cols-2 gap-5">
              ${slice.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
            </div>
          `}
        ${totalPages > 1 && html`
          <nav class="flex gap-2 mt-8 justify-center flex-wrap" aria-label="పేజీ నావిగేషన్">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(n => html`
              <button key=${n} onClick=${() => setPageNum(n)}
                aria-current=${safePage === n ? 'page' : undefined}
                class=${`w-9 h-9 rounded-full text-[13px] font-bold ${
                  safePage === n ? 'bg-[#FF6B35] text-white' : 'bg-white border'
                }`}>${n}</button>
            `)}
          </nav>
        `}
      </div>
    </div>
  `;
}

function DailyPage({ blogs, selectedDate, setSelectedDate, onOpenBlog }) {
  const list = useMemo(() => blogs.filter(b => b.publishDate === selectedDate), [blogs, selectedDate]);
  return html`
    <div class="max-w-4xl mx-auto animate-fade-in">
      <div class="bg-white rounded-[20px] border p-6 md:p-10">
        <h2 class="text-[24px] font-black mb-2">📅 రోజువారీ బ్లాగ్స్</h2>
        <p class="text-[13px] text-stone-500 mb-6">తేదీ ఎంచుకుని ఆ రోజు ప్రచురించిన వంటకాలు చూడండి</p>
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center mb-8">
          <input type="date" value=${selectedDate} max=${todayISO()}
            onChange=${(e) => setSelectedDate(e.target.value)}
            class="border rounded-full px-5 py-3 text-[14px] w-full sm:w-auto" />
          <p class="text-[13px] text-stone-600">${formatTeluguDate(selectedDate)} – ${list.length} బ్లాగ్స్</p>
        </div>
        ${list.length === 0
          ? html`<${EmptyState} icon="🗓" title="ఈ తేదీన ఇంకా ఎలాంటి బ్లాగ్స్ లేవు." />`
          : html`
            <div class="grid md:grid-cols-2 gap-5">
              ${list.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
            </div>
          `}
      </div>
    </div>
  `;
}

function SearchPage({ query, setQuery, results, onOpenBlog }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const trimmed = query.trim();
  return html`
    <div class="max-w-4xl mx-auto animate-fade-in">
      <div class="bg-white rounded-2xl border p-6 mb-6">
        <h2 class="font-black text-[20px] mb-4">🔍 వంటకాలు వెతకండి</h2>
        <form onSubmit=${(e) => e.preventDefault()} class="flex gap-2" role="search">
          <input ref=${inputRef} value=${query} onChange=${(e) => setQuery(e.target.value)}
            placeholder="ఉదా: బిర్యానీ, గుత్తి వంకాయ..." aria-label="వెతకండి" type="search"
            class="flex-1 border rounded-full px-5 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-200" />
          ${trimmed && html`
            <button type="button" onClick=${() => setQuery('')}
              aria-label="వెతుకుడు క్లియర్ చేయండి"
              class="bg-stone-100 px-4 rounded-full font-bold text-[13px]">✕</button>
          `}
        </form>
      </div>
      ${!trimmed
        ? html`<p class="text-center text-stone-500 text-[13px]">వెతకడానికి పైన ఏదైనా టైప్ చేయండి</p>`
        : html`
          <div>
            <p class="text-[13px] text-stone-600 mb-4">"${trimmed}" కోసం ${results.length} ఫలితాలు</p>
            ${results.length === 0
              ? html`<${EmptyState} icon="🔎" title="మీరు వెతికిన బ్లాగ్ ఇంకా అందుబాటులో లేదు." hint="వేరే పదంతో ప్రయత్నించండి." />`
              : html`
                <div class="grid md:grid-cols-2 gap-5">
                  ${results.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
                </div>
              `}
          </div>
        `}
    </div>
  `;
}

function CategoryPage({ blogs, categories, categoryId, onOpenBlog }) {
  const cat = categories.find(c => c.id === categoryId);
  const list = useMemo(() => blogs.filter(b => b.categoryId === categoryId), [blogs, categoryId]);
  if (!cat) return html`<${EmptyState} icon="❓" title="ఈ వర్గం కనుగొనబడలేదు." />`;
  return html`
    <div class="animate-fade-in">
      <header class="flex items-center gap-3 mb-6">
        <span class="text-[36px]" aria-hidden="true">${cat.icon}</span>
        <div>
          <h2 class="text-[24px] font-black">${cat.name}</h2>
          <p class="text-[12px] text-stone-500">${list.length} వంటకాలు</p>
        </div>
      </header>
      ${list.length === 0
        ? html`<${EmptyState} icon="🍽" title="ఈ వర్గంలో ఇంకా బ్లాగ్స్ లేవు." />`
        : html`
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            ${list.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
          </div>
        `}
    </div>
  `;
}

function BlogDetailPage({ slug, blogs, onOpenBlog, onNavigate }) {
  const blog = blogs.find(b => b.slug === slug);
  useEffect(() => {
    if (!blog) return;
    document.title = `${blog.title} | రుచులు`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', blog.shortDescription || '');
  }, [blog]);

  if (!blog) {
    return html`
      <div class="max-w-2xl mx-auto">
        <${EmptyState} icon="🔍" title="క్షమించండి, ఈ బ్లాగ్ అందుబాటులో లేదు."
          hint="బహుశా తొలగించబడి ఉండవచ్చు."
          action=${html`
            <button onClick=${() => onNavigate('home')}
              class="mt-4 text-[#FF6B35] font-bold text-[13px]">హోమ్‌కి వెళ్లండి →</button>
          `} />
      </div>
    `;
  }

  const related = blogs.filter(b => b.categoryId === blog.categoryId && b.id !== blog.id).slice(0, 4);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: blog.title, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
    }
  };

  return html`
    <article class="max-w-[820px] mx-auto animate-fade-in">
      <div class="bg-white rounded-[24px] overflow-hidden border border-orange-100 shadow-sm">
        <div class="h-[260px] sm:h-[340px] md:h-[460px] relative">
          <img src=${blog.featuredImage || IMG.gutti} alt=${blog.altText || blog.title}
            class="w-full h-full object-cover"
            onError=${(e) => { e.currentTarget.src = IMG.gutti; }} />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div class="absolute bottom-0 p-5 md:p-8 text-white">
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold">${blog.categoryName}</span>
              <span class="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px]">📅 ${formatTeluguDate(blog.publishDate)}</span>
            </div>
            <h1 class="text-[24px] sm:text-[26px] md:text-[36px] font-black leading-[1.15]">${blog.title}</h1>
          </div>
        </div>
        <div class="p-5 md:p-10">
          <div class="flex flex-wrap gap-4 text-[12px] text-stone-500 mb-8 pb-6 border-b">
            <span>✍ ${blog.authorName || 'అడ్మిన్'}</span>
            <span>👁 ${Number(blog.views || 0).toLocaleString('en-IN')} వీక్షణలు</span>
            <span>📅 ${formatTeluguDate(blog.publishDate)}</span>
          </div>
          <p class="text-[16px] leading-[1.9] text-stone-800 mb-8 font-medium">${blog.content}</p>

          ${Array.isArray(blog.ingredients) && blog.ingredients.length > 0 && html`
            <section>
              <h2 class="text-[18px] font-black mt-10 mb-4 flex items-center gap-2">🛒 కావాల్సిన పదార్థాలు</h2>
              <ul class="space-y-2 mb-8 bg-[#FFF8F0] rounded-2xl p-6 border border-orange-100">
                ${blog.ingredients.map((ing, i) => html`
                  <li key=${i} class="text-[14px] flex gap-3">
                    <span class="text-[#FF6B35]" aria-hidden="true">•</span>${ing}
                  </li>
                `)}
              </ul>
            </section>
          `}

          ${Array.isArray(blog.preparationMethod) && blog.preparationMethod.length > 0 && html`
            <section>
              <h2 class="text-[18px] font-black mb-4">👩‍🍳 తయారీ విధానం</h2>
              <ol class="space-y-4 mb-8">
                ${blog.preparationMethod.map((step, i) => html`
                  <li key=${i} class="flex gap-4">
                    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[#2D5016] text-white text-[12px] font-bold grid place-items-center">${i + 1}</span>
                    <span class="text-[14.5px] leading-[1.7] text-stone-700 pt-1">${step}</span>
                  </li>
                `)}
              </ol>
            </section>
          `}

          ${blog.cookingTips && html`
            <aside class="bg-[#FFFBEB] border border-amber-200 rounded-2xl p-6 mb-8">
              <h3 class="font-black text-[14px] mb-2">💡 వంట చిట్కాలు</h3>
              <p class="text-[13.5px] leading-[1.7] text-stone-700">${blog.cookingTips}</p>
            </aside>
          `}

          <aside class="bg-[#F0FDF4] border border-green-100 rounded-2xl p-6">
            <h3 class="font-black text-[14px] mb-2">🎉 ఫలితం</h3>
            <p class="text-[13.5px] text-stone-700">
              ఘుమఘుమలాడే ${blog.title} సిద్ధం! వేడి అన్నంతో, చపాతీతో లేదా మీకు నచ్చిన విధంగా వడ్డించండి. కుటుంబంతో ఆస్వాదించండి!
            </p>
          </aside>

          <div class="mt-10 pt-6 border-t flex flex-wrap gap-2 items-center">
            <span class="text-[12px] font-bold mr-2">షేర్ చేయండి:</span>
            <a href=${`https://wa.me/?text=${encodeURIComponent(blog.title + ' – ' + url)}`}
              target="_blank" rel="noopener noreferrer"
              class="bg-[#25D366] text-white px-4 py-2 rounded-full text-[12px] font-bold">WhatsApp</a>
            <a href=${`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              class="bg-[#1877F2] text-white px-4 py-2 rounded-full text-[12px] font-bold">Facebook</a>
            <a href=${`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              class="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">X</a>
            <button type="button" onClick=${share}
              class="bg-stone-100 px-4 py-2 rounded-full text-[12px] font-bold">🔗 Share</button>
          </div>
        </div>
      </div>

      ${related.length > 0 && html`
        <section class="mt-10">
          <h2 class="text-[18px] font-black mb-4">ఇలాంటి మరిన్ని వంటకాలు</h2>
          <div class="grid md:grid-cols-2 gap-5">
            ${related.map(b => html`<${BlogCard} key=${b.id} blog=${b} onOpen=${onOpenBlog} />`)}
          </div>
        </section>
      `}
    </article>
  `;
}

function ArchivePage({ blogs, onOpenBlog }) {
  const grouped = useMemo(() => {
    const map = new Map();
    blogs.forEach(b => {
      const k = String(b.publishDate).slice(0, 7);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(b);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [blogs]);

  return html`
    <div class="max-w-3xl mx-auto bg-white rounded-2xl border p-6 md:p-10 animate-fade-in">
      <h1 class="text-[22px] font-black mb-6">📚 ఆర్కైవ్</h1>
      ${grouped.length === 0 && html`<${EmptyState} icon="📭" title="ఇంకా బ్లాగ్స్ లేవు." />`}
      ${grouped.map(([key, list]) => {
        const [y, m] = key.split('-');
        const label = `${y} ${TELUGU_MONTHS[parseInt(m, 10) - 1] || ''}`;
        return html`
          <section key=${key} class="mb-8">
            <h2 class="font-black text-[15px] mb-3 bg-[#FFF8F0] px-4 py-2 rounded-full w-fit">
              ${label} – ${list.length} బ్లాగ్స్
            </h2>
            <div class="space-y-2">
              ${[...list].sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate))).map(b => html`
                <button key=${b.id} onClick=${() => onOpenBlog(b)}
                  class="w-full text-left flex flex-wrap justify-between items-center gap-2 p-3 hover:bg-stone-50 rounded-xl border border-transparent hover:border-stone-100 transition">
                  <span class="text-[13px] font-bold">${b.title}</span>
                  <span class="text-[11px] text-stone-500">${formatTeluguDate(b.publishDate)}</span>
                </button>
              `)}
            </div>
          </section>
        `;
      })}
    </div>
  `;
}

function AboutPage() {
  return html`
    <div class="max-w-3xl mx-auto bg-white rounded-[24px] border p-6 md:p-12 animate-fade-in">
      <h1 class="text-[28px] font-black mb-6">మా గురించి</h1>
      <div class="space-y-5 text-[14.5px] leading-[1.9] text-stone-700">
        <p><strong>రుచులు – తెలుగు వంటకాలు</strong> అనేది తెలుగు సంప్రదాయ వంటకాలను ప్రపంచానికి పరిచయం చేసే ఒక ప్రయత్నం.</p>
        <p>మా లక్ష్యం: ప్రతిరోజూ ఒక కొత్త, సులభమైన, రుచికరమైన తెలుగు వంటకాన్ని మీ ఇంటికి చేర్చడం. అమ్మ వంట రుచిని, నానమ్మ చిట్కాలను, పండుగల స్పెషల్ వంటకాలను మళ్లీ గుర్తు చేయడం.</p>
        <h2 class="font-black text-[16px] mt-6">మేము ఏం చేస్తాం?</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>సంప్రదాయ తెలుగు వంటకాలు</li>
          <li>ఆరోగ్యకరమైన ఆహారం</li>
          <li>పండుగ స్పెషల్ స్వీట్స్</li>
          <li>సులభమైన రోజువారీ వంటకాలు</li>
          <li>వంట చిట్కాలు, నిల్వ పచ్చళ్లు</li>
        </ul>
        <p>ప్రతి వంటకం మా వంటగదిలో పరీక్షించి, ఫోటోలతో, స్పష్టమైన తెలుగులో మీకు అందిస్తున్నాం.</p>
      </div>
    </div>
  `;
}

/* ---------- Contact ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

function ContactPage({ showToast }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'కనీసం 2 అక్షరాల పేరు రాయండి';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'సరైన ఈమెయిల్ ఇవ్వండి';
    if (form.phone && !PHONE_RE.test(form.phone.trim())) e.phone = '10 అంకెల మొబైల్ నంబర్ ఇవ్వండి';
    if (!form.subject.trim()) e.subject = 'విషయం తప్పనిసరి';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'కనీసం 10 అక్షరాల సందేశం రాయండి';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { showToast('దయచేసి ఫారమ్‌లో లోపాలు సరిచేయండి', 'error'); return; }
    try {
      setStatus('submitting');
      // TODO: replace with your real endpoint (Cloud Function / Formspree / Resend / etc.)
      await new Promise(r => setTimeout(r, 900));
      setStatus('success');
      showToast('సందేశం పంపబడింది', 'success');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch {
      setStatus('error');
      showToast('పంపడంలో సమస్య. మళ్లీ ప్రయత్నించండి.', 'error');
    }
  };

  const Field = ({ id, label, type = 'text', required = false, rows, placeholder, value, onChange, error }) => html`
    <div>
      <label htmlFor=${id} class="text-[12px] font-bold">
        ${label} ${required && html`<span class="text-red-600" aria-hidden="true">*</span>`}
      </label>
      ${rows
        ? html`<textarea id=${id} rows=${rows} required=${required}
            value=${value} onChange=${onChange} placeholder=${placeholder}
            aria-invalid=${!!error} aria-describedby=${error ? id + '-err' : undefined}
            class=${`mt-1 w-full border rounded-xl px-4 py-3 text-[13px] ${error ? 'border-red-400' : ''}`}></textarea>`
        : html`<input id=${id} type=${type} required=${required}
            value=${value} onChange=${onChange} placeholder=${placeholder}
            aria-invalid=${!!error} aria-describedby=${error ? id + '-err' : undefined}
            class=${`mt-1 w-full border rounded-xl px-4 py-3 text-[13px] ${error ? 'border-red-400' : ''}`} />`}
      ${error && html`<p id=${id + '-err'} role="alert" class="text-[11px] text-red-600 mt-1">${error}</p>`}
    </div>
  `;

  return html`
    <div class="max-w-2xl mx-auto bg-white rounded-[24px] border p-6 md:p-10 animate-fade-in">
      <h1 class="text-[24px] font-black mb-2">సంప్రదించండి</h1>
      <p class="text-[13px] text-stone-500 mb-8">మీ సలహాలు, ప్రశ్నలకు మేము ఎదురుచూస్తున్నాం</p>

      ${status === 'success'
        ? html`
          <div class="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div class="text-[32px] mb-2" aria-hidden="true">✅</div>
            <p class="font-bold text-[14px]">మీ సందేశం విజయవంతంగా పంపబడింది!</p>
            <p class="text-[12px] text-stone-600 mt-1">త్వరలో మేము స్పందిస్తాం</p>
            <button type="button" onClick=${() => setStatus('idle')}
              class="mt-4 text-[#FF6B35] font-bold text-[12px]">మరో సందేశం పంపండి</button>
          </div>
        `
        : html`
          <form onSubmit=${onSubmit} class="space-y-5" noValidate>
            <${Field} id="name" label="పేరు" required
              value=${form.name} onChange=${(e) => setForm({ ...form, name: e.target.value })}
              placeholder="మీ పేరు" error=${errors.name} />
            <div class="grid sm:grid-cols-2 gap-5">
              <${Field} id="email" label="ఇమెయిల్" type="email" required
                value=${form.email} onChange=${(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" error=${errors.email} />
              <${Field} id="phone" label="ఫోన్ (ఐచ్ఛికం)" type="tel"
                value=${form.phone} onChange=${(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210" error=${errors.phone} />
            </div>
            <${Field} id="subject" label="విషయం" required
              value=${form.subject} onChange=${(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="ఉదా: ఒక కొత్త రెసిపీ సూచన" error=${errors.subject} />
            <${Field} id="message" label="సందేశం" required rows=${5}
              value=${form.message} onChange=${(e) => setForm({ ...form, message: e.target.value })}
              placeholder="మీ సందేశం..." error=${errors.message} />
            <div class="bg-[#FFF8F0] rounded-xl p-3 text-[11px] text-stone-600">
              🛡 ఈ ఫారమ్ మానవుల కోసమే. మీ సమాచారం సురక్షితంగా ఉంచబడుతుంది.
            </div>
            <button type="submit" disabled=${status === 'submitting'}
              class="w-full bg-[#2D5016] text-white font-bold py-3 rounded-full text-[14px] disabled:opacity-60">
              ${status === 'submitting' ? 'పంపుతోంది…' : 'పంపండి'}
            </button>
          </form>
        `}
    </div>
  `;
}

function NotFoundPage({ onNavigate }) {
  return html`
    <div class="max-w-xl mx-auto text-center py-16 animate-fade-in">
      <div class="text-[64px] mb-2" aria-hidden="true">🍽</div>
      <h1 class="text-[28px] font-black mb-2">404 – పేజీ కనుగొనబడలేదు</h1>
      <p class="text-[14px] text-stone-600 mb-6">మీరు వెతుకుతున్న పేజీ ఇక్కడ లేదు.</p>
      <button onClick=${() => onNavigate('home')}
        class="bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-full">హోమ్‌కి వెళ్లండి</button>
    </div>
  `;
}

/* ============================================================
   ADMIN
   ============================================================ */
function AdminLoginPage({ onLogin, errorMsg }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    await onLogin(creds);
    setBusy(false);
  };
  return html`
    <div class="max-w-[420px] mx-auto mt-10 bg-white rounded-[24px] border p-8 shadow-sm animate-fade-in">
      <h1 class="text-[20px] font-black mb-1">అడ్మిన్ లాగిన్</h1>
      <p class="text-[12px] text-stone-500 mb-6">సురక్షిత ప్రవేశం</p>
      <form onSubmit=${onSubmit} class="space-y-4">
        <div>
          <label htmlFor="a-email" class="text-[12px] font-bold">ఇమెయిల్</label>
          <input id="a-email" type="email" autoComplete="username"
            value=${creds.email} onChange=${(e) => setCreds({ ...creds, email: e.target.value })}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]" placeholder="admin@ruchulu.com" />
        </div>
        <div>
          <label htmlFor="a-pass" class="text-[12px] font-bold">పాస్‌వర్డ్</label>
          <input id="a-pass" type="password" autoComplete="current-password"
            value=${creds.password} onChange=${(e) => setCreds({ ...creds, password: e.target.value })}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]" placeholder="••••••••" />
        </div>
        ${errorMsg && html`<div role="alert" class="bg-red-50 text-red-600 text-[12px] p-3 rounded-xl">${errorMsg}</div>`}
        <button type="submit" disabled=${busy}
          class="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-full disabled:opacity-60">
          ${busy ? 'లాగిన్ అవుతోంది…' : 'లాగిన్'}
        </button>
        <p class="text-[11px] text-stone-400 text-center">
          ${DataService.mode === 'firebase'
            ? 'Firebase Auth ద్వారా లాగిన్ అవుతారు.'
            : 'Demo: admin@ruchulu.com / admin123'}
        </p>
      </form>
    </div>
  `;
}

function AdminDashboardPage({ blogs, categories, onNavigate, onLogout }) {
  const today = todayISO();
  const todayCount = blogs.filter(b => b.publishDate === today).length;
  const monthCount = blogs.filter(b => String(b.publishDate).slice(0, 7) === today.slice(0, 7)).length;

  const Stat = ({ label, value, accent }) => html`
    <div class="bg-white border rounded-2xl p-5">
      <div class="text-[11px] text-stone-500 font-bold tracking-widest">${label}</div>
      <div class=${`text-[28px] font-black mt-1 ${accent || ''}`}>${value}</div>
    </div>
  `;

  return html`
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-wrap justify-between items-center gap-3">
        <h1 class="text-[22px] font-black">డాష్‌బోర్డ్</h1>
        <div class="flex gap-2">
          <button onClick=${() => onNavigate('admin-create')}
            class="bg-[#FF6B35] text-white px-5 py-2.5 rounded-full text-[13px] font-bold">+ కొత్త బ్లాగ్</button>
          <button onClick=${onLogout}
            class="bg-stone-100 px-4 py-2.5 rounded-full text-[12px] font-bold">లాగ్‌అవుట్</button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <${Stat} label="TOTAL BLOGS" value=${blogs.length} />
        <${Stat} label="TODAY'S" value=${todayCount} accent="text-[#FF6B35]" />
        <${Stat} label="THIS MONTH" value=${monthCount} />
        <${Stat} label="CATEGORIES" value=${categories.length} />
      </div>

      <div class="grid md:grid-cols-3 gap-3">
        <button onClick=${() => onNavigate('admin-blogs')}
          class="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition">
          <div class="font-bold text-[14px]">📝 బ్లాగ్స్ నిర్వహించు</div>
          <div class="text-[11px] text-stone-500 mt-1">Edit / Delete / Status</div>
        </button>
        <button onClick=${() => onNavigate('admin-categories')}
          class="bg-white border rounded-2xl p-5 text-left hover:shadow-sm transition">
          <div class="font-bold text-[14px]">🏷 కేటగిరీలు</div>
          <div class="text-[11px] text-stone-500 mt-1">Add / Delete Categories</div>
        </button>
        <button onClick=${() => onNavigate('home')}
          class="bg-[#2D5016] text-white rounded-2xl p-5 text-left">
          <div class="font-bold text-[14px]">🌐 వెబ్‌సైట్ చూడండి</div>
          <div class="text-[11px] opacity-70 mt-1">User view auto-updates</div>
        </button>
      </div>

      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-5 font-black text-[14px] border-b">తాజా బ్లాగ్స్</div>
        <div class="divide-y">
          ${blogs.slice(0, 5).map(b => html`
            <div key=${b.id} class="p-4 flex flex-wrap justify-between items-center gap-2">
              <div class="min-w-0">
                <div class="font-bold text-[13px] truncate">${b.title}</div>
                <div class="text-[11px] text-stone-500">${b.categoryName} • ${b.status}</div>
              </div>
              <button onClick=${() => onNavigate('admin-edit', { blogId: b.id })}
                class="text-[11px] bg-stone-100 px-3 py-1 rounded-full font-bold">Edit</button>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

function AdminBlogFormPage({ editingId, blogs, categories, onSave, onCancel, showToast }) {
  const isEdit = !!editingId;
  const editing = blogs.find(b => b.id === editingId);
  const [form, setForm] = useState(() => ({
    title: editing?.title || '',
    slug: editing?.slug || '',
    shortDescription: editing?.shortDescription || '',
    content: editing?.content || '',
    ingredients: editing?.ingredients?.length ? editing.ingredients : [''],
    preparationMethod: editing?.preparationMethod?.length ? editing.preparationMethod : [''],
    cookingTips: editing?.cookingTips || '',
    featuredImage: editing?.featuredImage || '',
    categoryId: editing?.categoryId || (categories[0]?.id || ''),
    categoryName: editing?.categoryName || '',
    status: editing?.status || 'published',
    publishDate: editing?.publishDate || todayISO(),
    seoTitle: editing?.seoTitle || '',
    seoDesc: editing?.seoDesc || '',
    keywords: editing?.keywords || '',
    altText: editing?.altText || '',
  }));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const onTitleChange = (v) =>
    setForm(prev => ({ ...prev, title: v, slug: prev.slug && isEdit ? prev.slug : makeSlug(v) }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','image/jpg'].includes(file.type)) {
      showToast('JPG, PNG, WebP మాత్రమే అనుమతించబడతాయి', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
        setField('featuredImage', dataUrl);
      };
      img.src = ev.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const updateList = (key, idx, value) => {
    setForm(prev => {
      const list = [...prev[key]];
      list[idx] = value;
      return { ...prev, [key]: list };
    });
  };
  const addItem = (key) => setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  const removeItem = (key, idx) => setForm(prev => {
    const list = prev[key].filter((_, i) => i !== idx);
    return { ...prev, [key]: list.length ? list : [''] };
  });

  const submit = async (status) => {
    if (saving) return;
    const e = {};
    if (!form.title.trim()) e.title = 'టైటిల్ తప్పనిసరి';
    if (!form.shortDescription.trim()) e.shortDescription = 'చిన్న వివరణ తప్పనిసరి';
    if (!form.content.trim()) e.content = 'కంటెంట్ తప్పనిసరి';
    if (!form.categoryId) e.categoryId = 'వర్గం ఎంచుకోండి';
    setErrors(e);
    if (Object.keys(e).length) { showToast('కొన్ని ఫీల్డ్స్ తప్పనిసరి', 'error'); return; }

    setSaving(true);
    try {
      const cat = categories.find(c => c.id === form.categoryId) || categories[0];
      const payload = {
        id: editingId || 'b' + Date.now(),
        ...form,
        status,
        slug: form.slug || makeSlug(form.title),
        categoryName: cat?.name || '',
        ingredients: form.ingredients.map(s => s.trim()).filter(Boolean),
        preparationMethod: form.preparationMethod.map(s => s.trim()).filter(Boolean),
        featuredImage: form.featuredImage || IMG.gutti,
        authorName: editing?.authorName || 'అడ్మిన్',
        createdAt: editing?.createdAt || new Date().toISOString(),
        views: editing?.views || 0,
      };
      await onSave(payload);
      showToast(status === 'draft' ? 'డ్రాఫ్ట్ సేవ్ అయింది' : 'బ్లాగ్ ప్రచురించబడింది', 'success');
    } catch (err) {
      console.error('save failed', err);
      showToast('సేవ్ చేయడంలో సమస్య', 'error');
    } finally {
      setSaving(false);
    }
  };

  return html`
    <div class="max-w-4xl mx-auto bg-white rounded-[24px] border p-6 md:p-8 space-y-6 animate-fade-in">
      <div class="flex flex-wrap justify-between items-center gap-3">
        <h1 class="text-[20px] font-black">${isEdit ? 'బ్లాగ్ సవరించు' : 'కొత్త బ్లాగ్ రాయండి'}</h1>
        <button onClick=${onCancel} class="text-[12px] bg-stone-100 px-4 py-2 rounded-full font-bold">డాష్‌బోర్డ్‌కి</button>
      </div>

      <div class="grid md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label htmlFor="b-title" class="text-[12px] font-bold">బ్లాగ్ టైటిల్ *</label>
          <input id="b-title" value=${form.title} onChange=${(e) => onTitleChange(e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[14px]" placeholder="ఉదా: ఆంధ్ర స్టైల్ గుత్తి వంకాయ" />
          ${errors.title && html`<p class="text-[11px] text-red-600 mt-1">${errors.title}</p>`}
        </div>

        <div>
          <label htmlFor="b-slug" class="text-[12px] font-bold">Slug (URL)</label>
          <input id="b-slug" value=${form.slug} onChange=${(e) => setField('slug', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[12px] bg-stone-50" />
        </div>

        <div>
          <label htmlFor="b-date" class="text-[12px] font-bold">ప్రచురణ తేదీ</label>
          <input id="b-date" type="date" value=${form.publishDate}
            onChange=${(e) => setField('publishDate', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]" />
        </div>

        <div class="md:col-span-2">
          <label class="text-[12px] font-bold">Featured Image</label>
          <div class="mt-2 flex flex-wrap gap-3 items-start">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange=${onFile}
              class="flex-1 min-w-[200px] text-[12px] border rounded-xl px-3 py-2" />
            ${form.featuredImage && html`
              <img src=${form.featuredImage} alt="preview" class="w-24 h-24 object-cover rounded-xl border" />
            `}
          </div>
        </div>

        <div>
          <label htmlFor="b-cat" class="text-[12px] font-bold">వర్గం *</label>
          <select id="b-cat" value=${form.categoryId} onChange=${(e) => setField('categoryId', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]">
            <option value="">ఎంచుకోండి</option>
            ${categories.map(c => html`<option key=${c.id} value=${c.id}>${c.icon} ${c.name}</option>`)}
          </select>
          ${errors.categoryId && html`<p class="text-[11px] text-red-600 mt-1">${errors.categoryId}</p>`}
        </div>

        <div>
          <label htmlFor="b-status" class="text-[12px] font-bold">స్థితి</label>
          <select id="b-status" value=${form.status} onChange=${(e) => setField('status', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label htmlFor="b-short" class="text-[12px] font-bold">చిన్న వివరణ *</label>
          <textarea id="b-short" rows="2" value=${form.shortDescription}
            onChange=${(e) => setField('shortDescription', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]" placeholder="కార్డులో కనిపించే చిన్న వివరణ"></textarea>
        </div>

        <div class="md:col-span-2">
          <label htmlFor="b-content" class="text-[12px] font-bold">పూర్తి కంటెంట్ *</label>
          <textarea id="b-content" rows="6" value=${form.content}
            onChange=${(e) => setField('content', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px] leading-[1.7]" placeholder="బ్లాగ్ పూర్తి కథ..."></textarea>
        </div>

        <div class="md:col-span-2">
          <label class="text-[12px] font-bold">కావాల్సిన పదార్థాలు</label>
          ${form.ingredients.map((val, i) => html`
            <div key=${i} class="flex gap-2 mt-2">
              <input value=${val} onChange=${(e) => updateList('ingredients', i, e.target.value)}
                class="flex-1 border rounded-xl px-3 py-2 text-[13px]" placeholder=${`పదార్థం ${i + 1}`} />
              <button type="button" onClick=${() => removeItem('ingredients', i)}
                aria-label="తొలగించు" class="text-[13px] px-3 text-red-600">✕</button>
            </div>
          `)}
          <button type="button" onClick=${() => addItem('ingredients')}
            class="mt-2 text-[11px] bg-stone-100 px-3 py-1 rounded-full font-bold">+ పదార్థం జోడించు</button>
        </div>

        <div class="md:col-span-2">
          <label class="text-[12px] font-bold">తయారీ విధానం</label>
          ${form.preparationMethod.map((val, i) => html`
            <div key=${i} class="flex gap-2 mt-2 items-start">
              <span class="text-[11px] font-bold mt-2">${i + 1}.</span>
              <input value=${val} onChange=${(e) => updateList('preparationMethod', i, e.target.value)}
                class="flex-1 border rounded-xl px-3 py-2 text-[13px]" placeholder=${`స్టెప్ ${i + 1}`} />
              <button type="button" onClick=${() => removeItem('preparationMethod', i)}
                aria-label="తొలగించు" class="text-[13px] px-3 text-red-600">✕</button>
            </div>
          `)}
          <button type="button" onClick=${() => addItem('preparationMethod')}
            class="mt-2 text-[11px] bg-stone-100 px-3 py-1 rounded-full font-bold">+ స్టెప్ జోడించు</button>
        </div>

        <div class="md:col-span-2">
          <label htmlFor="b-tips" class="text-[12px] font-bold">వంట చిట్కాలు (ఐచ్ఛికం)</label>
          <textarea id="b-tips" rows="2" value=${form.cookingTips}
            onChange=${(e) => setField('cookingTips', e.target.value)}
            class="mt-1 w-full border rounded-xl px-4 py-3 text-[13px]"></textarea>
        </div>

        <div class="md:col-span-2 border-t pt-6">
          <h3 class="font-black text-[13px] mb-3">SEO ఫీల్డ్స్</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <input value=${form.seoTitle} onChange=${(e) => setField('seoTitle', e.target.value)}
              placeholder="SEO Title" class="border rounded-xl px-4 py-2.5 text-[12px]" />
            <input value=${form.keywords} onChange=${(e) => setField('keywords', e.target.value)}
              placeholder="Keywords (comma separated)" class="border rounded-xl px-4 py-2.5 text-[12px]" />
            <input value=${form.altText} onChange=${(e) => setField('altText', e.target.value)}
              placeholder="Image Alt Text (SEO)" class="border rounded-xl px-4 py-2.5 text-[12px] md:col-span-2" />
            <textarea value=${form.seoDesc} onChange=${(e) => setField('seoDesc', e.target.value)}
              placeholder="Meta Description" rows="2" class="border rounded-xl px-4 py-2.5 text-[12px] md:col-span-2"></textarea>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t">
        <button type="button" disabled=${saving} onClick=${() => submit('draft')}
          class="bg-stone-100 px-6 py-3 rounded-full text-[13px] font-bold disabled:opacity-60">
          ${saving ? 'సేవ్ అవుతోంది…' : 'Save Draft'}
        </button>
        <button type="button" disabled=${saving} onClick=${() => submit('published')}
          class="bg-[#FF6B35] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow disabled:opacity-60">
          ${saving ? 'సేవ్ అవుతోంది…' : 'Publish
