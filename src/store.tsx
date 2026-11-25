import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { PROS, Pro, ME_PRO_ID, SEED_REPLIES, REVIEWS } from './data';
import { addDaysIso, fromIso, hoursUntil, startOf, toIso, todayIso, hourLabel, hourOf } from './lib';

export type Role = 'customer' | 'pro';
export type Status = 'confirmed' | 'awaiting' | 'completed' | 'cancelled' | 'unpaid';

export type Booking = {
  id: string;
  proId: string;
  date: string;
  time: string;
  where: string;
  price: number;
  status: Status;
  paid: boolean;
  kind: 'single' | 'pack' | 'series';
  seriesId?: string;
  cancelledBy?: string;
  refund?: string;
  payoutDate?: string;
  customer: string;
  notes?: string;
  packId?: string;
  packNo?: number;
};
// Prepaid sessions: paid up front, booked one at a time with the same professional.
export type Pack = { id: string; proId: string; total: number; used: number; unit: number; discountPct: number; boughtOn: string };
export type PayCard = { id: string; type: 'credit' | 'debit'; brand: string; last4: string; holder: string; exp: string; isDefault: boolean };
export type Account = { first: string; last: string; gender: string; email: string; iso: string; phone: string; emailVerified: boolean; phoneVerified: boolean };
export type Series = { id: string; proId: string; slots: { dow: number; time: string }[]; where: string; price: number; status: 'active' | 'stopped'; stoppedBy?: string };
export type Link = { to: 'booking' | 'chat' | 'credits' | 'series' | 'earnings' | 'community' | 'docs' | 'reviews' | 'prepaid' | 'post'; id?: string };
export type Notif = { id: string; icon: string; title: string; sub: string; vars?: Record<string, string | number>; when: string; unread: boolean; link?: Link; cat?: string };
export type Msg = { from: Role; text: string; at: string };
export type Addr = { id: string; label: string; line: string; notes: string; isDefault: boolean };
export type Credit = { id: string; amount: number; expires: string; source: string };
export type Avail = { on: boolean; start: number; end: number };
export type Post = { id: string; official: boolean; who: string; title: string; body: string; meta: string; event: boolean; date?: string; status: 'published' | 'review'; mine?: boolean; category?: string };
export type Comment = { id: string; who: string; text: string; mine?: boolean };
export type Review = { id: string; proId: string; bookingId?: string; who: string; rating: number; text: string; date: string; tags?: string[] };
export type DocItem = { key: string; label: string; required: boolean; status: 'verified' | 'review' | 'missing'; file?: string; expires?: string; pending?: { file: string; expires?: string } };
export type Media = { id: string; kind: 'photo' | 'video'; uri?: string; art?: { emoji: string; bg: string }; caption?: string };
export type Photo = { kind: 'uri'; uri: string } | { kind: 'preset'; icon: string; bg: string } | null;
export type Filters = { cat: string; gender: string; minYears: number; certs: string[]; langs: string[]; locs: string[]; maxPrice: number; maxDist: number };

export const DEFAULT_FILTERS: Filters = { cat: 'All', gender: 'Any', minYears: 0, certs: [], langs: [], locs: [], maxPrice: 600, maxDist: 30 };

export type State = {
  customerName: string;
  bookings: Booking[];
  series: Series[];
  credits: Credit[];
  notifs: Record<Role, Notif[]>;
  chats: Record<string, Msg[]>;
  addresses: Record<Role, Addr[]>;
  going: string[];
  posts: Post[];
  filters: Filters;
  proProfile: { about: string; price: number; d4: boolean; d8: boolean; weekly: boolean; specialties: string[]; radius: number; offers: string[] };
  avail: Avail[];
  blocks: { id: string; date: string; from: number; to: number }[];
  favorites: string[];
  reports: { id: string; bookingId: string; by: Role; category: string; details: string }[];
  packs: Pack[];
  cards: PayCard[];
  account: Record<Role, Account>;
  replies: Record<string, string>;
  reviews: Review[];
  notifPrefs: Record<Role, Record<string, boolean>>;
  docs: DocItem[];
  chatRead: Record<Role, Record<string, number>>;
  likes: string[];
  comments: Record<string, Comment[]>;
  photos: Record<Role, Photo>;
  media: Media[];
};

export const nextDow = (from: string, dow: number) => {
  let d = from;
  for (let i = 0; i < 8; i++) {
    if (fromIso(d).getDay() === dow) return d;
    d = addDaysIso(d, 1);
  }
  return d;
};

function seed(): State {
  const T = todayIso();
  const d1 = addDaysIso(T, 3);
  const d2 = addDaysIso(T, 6);
  const dow1 = fromIso(d1).getDay();
  const dow2 = fromIso(d2).getDay();
  const mk = (id: string, date: string, status: Status, paid: boolean, kind: Booking['kind'], seriesId?: string, extra?: Partial<Booking>): Booking => ({
    id, proId: ME_PRO_ID, date, time: '5:00 PM', where: 'Street, Al Olaya, Riyadh', price: 250, status, paid, kind, seriesId, customer: 'Customer', ...extra,
  });
  const bookings: Booking[] = [
    mk('b1', addDaysIso(T, -5), 'completed', true, 'single', undefined, { payoutDate: addDaysIso(T, -3) }),
    mk('b2', addDaysIso(T, 2), 'confirmed', true, 'pack', undefined, { price: 238, packId: 'pk1', packNo: 1, notes: 'Villa 12, Gate 2' }),
    mk('b3', d1, 'confirmed', true, 'series', 's1'),
    mk('b4', d2, 'confirmed', true, 'series', 's1'),
    mk('b5', addDaysIso(d1, 7), 'unpaid', false, 'series', 's1'),
    mk('b6', addDaysIso(d2, 7), 'unpaid', false, 'series', 's1'),
    mk('b7', addDaysIso(d1, 14), 'unpaid', false, 'series', 's1'),
    mk('b8', addDaysIso(d2, 14), 'unpaid', false, 'series', 's1'),
  ];
  const e = (id: string, icon: string, title: string, sub: string, when: string, unread = false, vars?: Record<string, string | number>, link?: Link, cat?: string): Notif => ({ id, icon, title, sub, when, unread, vars, link, cat });
  const avail: Avail[] = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ on: d <= 4, start: 9, end: d === 4 ? 13 : 18 }));
  return {
    customerName: 'Customer Name',
    bookings,
    series: [{ id: 's1', proId: ME_PRO_ID, slots: [{ dow: dow1, time: '5:00 PM' }, { dow: dow2, time: '5:00 PM' }], where: 'Street, Al Olaya, Riyadh', price: 250, status: 'active' }],
    credits: [{ id: 'c1', amount: 25, expires: addDaysIso(T, 60), source: 'Referral' }],
    notifs: {
      customer: [
        e('n1', 'calendar', 'Booking confirmed', 'Your session is booked', '2h', true, undefined, { to: 'booking', id: 'b2' }),
        e('n2', 'message-circle', 'New message', '{p} sent you a message', '3h', true, { p: 'Sample Name A' }, { to: 'chat', id: 'b2' }, 'messages'),
        e('n3', 'gift', 'Credit added', 'SAR {a} referral credit, valid {d} days', '2d', false, { a: 25, d: 60 }, { to: 'credits' }),
      ],
      pro: [
        e('n4', 'calendar', 'New booking', '{c} booked a session with you', '1h', true, { c: 'Customer' }, { to: 'booking', id: 'b2' }),
        e('n5', 'message-circle', 'New message', '{c} sent you a message', '2h', true, { c: 'Customer' }, { to: 'chat', id: 'b2' }, 'messages'),
        e('n6', 'check-circle', 'Credentials approved', 'You are live in Discover', '5d', false, undefined, { to: 'docs' }),
        e('n7', 'star', 'New review', '{c} left you a 5-star review', '3d', false, { c: 'Customer A' }, { to: 'reviews' }, 'reviews'),
      ],
    },
    chats: {
      b2: [{ from: 'customer', text: 'Hi, I will be there at 5. Which gate should I use?', at: '4:10 PM' }, { from: 'pro', text: 'Hello! Gate 2, the building is on the left.', at: '4:12 PM' }, { from: 'pro', text: 'See you then.', at: '4:13 PM' }],
      b1: [{ from: 'pro', text: 'Thank you for today. Remember the stretches we practised.', at: '7:02 PM' }, { from: 'customer', text: 'Will do, thank you!', at: '7:30 PM' }],
    },
    addresses: {
      customer: [
        { id: 'a1', label: 'Home', line: 'Street, Al Olaya, Riyadh', notes: 'Villa 12, Gate 2', isDefault: true },
        { id: 'a2', label: 'Gym', line: 'Gym name, Al Malqa, Riyadh', notes: '', isDefault: false },
      ],
      pro: [{ id: 'a3', label: 'My clinic', line: 'Street, Al Olaya, Riyadh', notes: '', isDefault: true }],
    },
    going: ['c1'],
    posts: [
      { id: 'c1', official: true, who: 'Organised by Pulsae', title: 'Sunrise run and coffee', category: 'Events', body: 'An easy-pace group run that ends at a coffee shop. All levels welcome.', meta: '6:00 AM · Meeting point shared before the event', event: true, date: addDaysIso(T, 10), status: 'published' },
      { id: 'c2', official: true, who: 'Organised by Pulsae', title: 'Community workout', category: 'Events', body: 'A free outdoor group workout led by a Pulsae professional.', meta: '5:00 PM · Park, Riyadh', event: true, date: addDaysIso(T, 11), status: 'published' },
      { id: 'c3', official: false, who: 'Sample Name B', title: 'Three habits that keep your back healthy', category: 'Tips', body: 'Short post from a professional appears here.', meta: '', event: false, status: 'published' },
      { id: 'm2', official: false, who: 'Sample Name A', title: 'Earlier post headline', category: 'Recovery', body: 'Your earlier post text appears here.', meta: '', event: false, status: 'published', mine: true },
    ],
    filters: DEFAULT_FILTERS,
    proProfile: { about: '', price: 250, d4: true, d8: true, weekly: true, specialties: ['Sports injuries', 'Rehab'], radius: 10, offers: ['Home', 'Their place'] },
    avail,
    blocks: [{ id: 'k1', date: addDaysIso(T, 4), from: 11, to: 12 }],
    favorites: [],
    reports: [],
    packs: [{ id: 'pk1', proId: ME_PRO_ID, total: 4, used: 1, unit: 238, discountPct: 5, boughtOn: addDaysIso(T, -1) }],
    cards: [{ id: 'cd1', type: 'credit', brand: 'Visa', last4: '4242', holder: 'Customer Name', exp: '12/28', isDefault: true }],
    account: {
      customer: { first: 'Customer', last: 'Name', gender: 'Female', email: 'customer@example.com', iso: 'SA', phone: '501234567', emailVerified: true, phoneVerified: true },
      pro: { first: 'Sample', last: 'Name A', gender: 'Female', email: 'professional@example.com', iso: 'SA', phone: '507654321', emailVerified: true, phoneVerified: true },
    },
    replies: { ...SEED_REPLIES },
    reviews: REVIEWS.map((r) => ({ ...r, proId: ME_PRO_ID })),
    notifPrefs: {
      customer: { messages: true, offers: false, community: true, push: true, email: true },
      pro: { messages: true, reviews: true, community: true, news: false, push: true, email: true },
    },
    docs: [
      { key: 'licence', label: 'Professional licence (SCFHS or MoS)', required: true, status: 'verified', file: 'licence.pdf', expires: addDaysIso(T, 45) },
      { key: 'id', label: 'National ID or Iqama', required: true, status: 'verified', file: 'id.pdf', expires: addDaysIso(T, 700) },
      { key: 'certs', label: 'Certificates and courses', required: false, status: 'verified', file: 'certificates.pdf' },
      { key: 'photo', label: 'Profile photo', required: false, status: 'missing' },
    ],
    chatRead: { customer: { b2: 2, b1: 2 }, pro: { b2: 3, b1: 1 } },
    likes: [],
    comments: { c3: [{ id: 'cm1', who: 'Sample Name B', text: 'Great reminder, thank you.' }] },
    photos: { customer: null, pro: null },
    media: [
      { id: 'md1', kind: 'photo', art: { emoji: '🏃‍♀️', bg: '#FFE3D8' }, caption: 'Rehab session in the clinic' },
      { id: 'md2', kind: 'video', art: { emoji: '🧘', bg: '#DCEEFB' }, caption: 'Three mobility moves for desk workers' },
      { id: 'md3', kind: 'photo', art: { emoji: '💪', bg: '#FFF1CC' }, caption: 'Strength block with a client' },
    ],
  };
}

export type BookParams = {
  proId: string;
  mode: 'single' | 'pack' | 'weekly';
  date: string;
  time: string;
  where: string;
  count: number;
  slots: { dow: number; time: string }[];
  unit: number;
  creditUsed: number;
  notes?: string;
};

export function weekStart(iso: string) {
  return addDaysIso(iso, -fromIso(iso).getDay());
}

// What the customer will be charged next for a weekly series: sessions of the next unpaid week,
// charged 48 hours before the first of them.
export function nextCharge(state: State, seriesId: string) {
  const unpaid = state.bookings
    .filter((b) => b.seriesId === seriesId && b.status === 'unpaid')
    .sort((a, b) => startOf(a.date, a.time).getTime() - startOf(b.date, b.time).getTime());
  if (unpaid.length === 0) return null;
  const wk = weekStart(unpaid[0].date);
  const wkItems = unpaid.filter((b) => weekStart(b.date) === wk);
  return {
    date: addDaysIso(unpaid[0].date, -2),
    time: unpaid[0].time,
    amount: wkItems.reduce((s, b) => s + b.price, 0),
    items: wkItems,
  };
}

type Api = ReturnType<typeof makeApi>;

function makeApi(get: () => State, update: (fn: (s: State) => State) => State, ids: () => string) {
  const pushNotif = (s: State, role: Role, n: { icon: string; title: string; sub: string; vars?: Record<string, string | number>; link?: Link; cat?: string }): State => {
    if (n.cat && s.notifPrefs[role][n.cat] === false) return s; // switched off in Notification settings
    return { ...s, notifs: { ...s.notifs, [role]: [{ ...n, id: ids(), when: 'now', unread: true }, ...s.notifs[role]] } };
  };
  const proName = (id: string) => PROS.find((p) => p.id === id)?.name ?? 'Professional';

  return {
    proName,
    book(p: BookParams) {
      const created: string[] = [];
      let seriesId: string | undefined;
      let packId: string | undefined;
      update((s) => {
        let next = { ...s };
        const list: Booking[] = [];
        const base = { proId: p.proId, where: p.where, price: p.unit, customer: s.customerName.split(' ')[0], notes: p.notes };
        if (p.mode === 'single') {
          list.push({ id: ids(), ...base, date: p.date, time: p.time, status: 'confirmed', paid: true, kind: 'single' });
        } else if (p.mode === 'pack') {
          // Prepaid pack: all sessions are paid now, only the first one is booked. The rest are booked later.
          packId = ids();
          const pct = p.count === 8 ? 10 : p.count === 4 ? 5 : 0;
          next.packs = [...s.packs, { id: packId, proId: p.proId, total: p.count, used: 1, unit: p.unit, discountPct: pct, boughtOn: todayIso() }];
          list.push({ id: ids(), ...base, date: p.date, time: p.time, status: 'confirmed', paid: true, kind: 'pack', packId, packNo: 1 });
        } else {
          seriesId = ids();
          next.series = [...s.series, { id: seriesId, proId: p.proId, slots: p.slots, where: p.where, price: p.unit, status: 'active' }];
          const start = p.date;
          for (let w = 0; w < 4; w++) {
            p.slots.forEach((sl) => {
              list.push({ id: ids(), ...base, date: addDaysIso(nextDow(start, sl.dow), 7 * w), time: sl.time, status: w === 0 ? 'confirmed' : 'unpaid', paid: w === 0, kind: 'series', seriesId });
            });
          }
        }
        list.forEach((b) => created.push(b.id));
        next.bookings = [...s.bookings, ...list];
        // use credits, oldest first
        let left = p.creditUsed;
        next.credits = s.credits
          .map((c) => {
            if (left <= 0) return c;
            const take = Math.min(c.amount, left);
            left -= take;
            return { ...c, amount: c.amount - take };
          })
          .filter((c) => c.amount > 0);
        const first = list[0] ? list[0].id : undefined;
        next = pushNotif(next, 'customer', { icon: 'calendar', title: 'Booking confirmed', sub: proName(p.proId), link: { to: 'booking', id: first } });
        next = pushNotif(next, 'pro', { icon: 'calendar', title: 'New booking', sub: p.mode === 'weekly' ? '{c} booked a weekly series' : p.mode === 'pack' ? '{c} prepaid {n} sessions and booked the first one' : '{c} booked a session', vars: { c: s.customerName.split(' ')[0], n: p.count }, link: { to: 'booking', id: first } });
        return next;
      });
      return { ids: created, seriesId, packId };
    },
    cancelBooking(id: string, by: Role) {
      let out: { type: 'credit' | 'charged' | 'refund' | 'pack' | 'none'; amount: number } = { type: 'none', amount: 0 };
      update((s) => {
        const b = s.bookings.find((x) => x.id === id);
        if (!b) return s;
        let next = { ...s, bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: 'cancelled' as Status, cancelledBy: by } : x)) };
        if (by === 'customer') {
          if (!b.paid) {
            out = { type: 'none', amount: 0 };
          } else if (b.packId && hoursUntil(b.date, b.time) > 24) {
            // Prepaid session: it goes back to the customer's balance.
            out = { type: 'pack', amount: 1 };
            next.packs = next.packs.map((x) => (x.id === b.packId ? { ...x, used: Math.max(0, x.used - 1) } : x));
            next = pushNotif(next, 'customer', { icon: 'gift', title: 'Prepaid session returned', sub: 'The session went back to your prepaid balance', link: { to: 'prepaid' } });
          } else if (hoursUntil(b.date, b.time) > 24) {
            out = { type: 'credit', amount: b.price };
            next.credits = [...next.credits, { id: ids(), amount: b.price, expires: addDaysIso(todayIso(), 30), source: 'Rebooking credit' }];
            next = pushNotif(next, 'customer', { icon: 'gift', title: 'Rebooking credit added', sub: 'SAR {a} credit, valid {d} days', vars: { a: b.price, d: 30 }, link: { to: 'credits' } });
          } else {
            out = { type: 'charged', amount: b.price };
          }
          next = pushNotif(next, 'pro', { icon: 'x-circle', title: 'Booking cancelled', sub: '{c} cancelled a session', vars: { c: s.customerName.split(' ')[0] }, link: { to: 'booking', id } });
        } else {
          out = { type: 'refund', amount: b.price };
          next.bookings = next.bookings.map((x) => (x.id === id ? { ...x, refund: b.packId ? 'Session returned to your prepaid balance' : 'Full refund' } : x));
          if (b.packId) next.packs = next.packs.map((x) => (x.id === b.packId ? { ...x, used: Math.max(0, x.used - 1) } : x));
          next = pushNotif(next, 'customer', { icon: 'x-circle', title: 'Session cancelled by the professional', sub: 'You will receive a full refund', link: { to: 'booking', id } });
        }
        return next;
      });
      return out;
    },
    // Book one of the remaining prepaid sessions with the same professional.
    bookFromPack(packId: string, date: string, time: string, where: string, notes?: string) {
      let created = '';
      update((s) => {
        const pk = s.packs.find((x) => x.id === packId);
        if (!pk || pk.used >= pk.total) return s;
        created = ids();
        const b: Booking = { id: created, proId: pk.proId, date, time, where, price: pk.unit, status: 'confirmed', paid: true, kind: 'pack', packId, packNo: pk.used + 1, customer: s.customerName.split(' ')[0], notes };
        let next = { ...s, bookings: [...s.bookings, b], packs: s.packs.map((x) => (x.id === packId ? { ...x, used: x.used + 1 } : x)) };
        next = pushNotif(next, 'customer', { icon: 'calendar', title: 'Booking confirmed', sub: proName(pk.proId), link: { to: 'booking', id: created } });
        next = pushNotif(next, 'pro', { icon: 'calendar', title: 'New booking', sub: '{c} booked a prepaid session ({n} of {t})', vars: { c: s.customerName.split(' ')[0], n: pk.used + 1, t: pk.total }, link: { to: 'booking', id: created } });
        return next;
      });
      return created;
    },
    addCard(c: Omit<PayCard, 'id' | 'isDefault'>) {
      update((s) => ({ ...s, cards: [...s.cards, { ...c, id: ids(), isDefault: s.cards.length === 0 }] }));
    },
    removeCard(id: string) {
      update((s) => {
        const left = s.cards.filter((c) => c.id !== id);
        if (left.length && !left.some((c) => c.isDefault)) left[0] = { ...left[0], isDefault: true };
        return { ...s, cards: left };
      });
    },
    setDefaultCard(id: string) {
      update((s) => ({ ...s, cards: s.cards.map((c) => ({ ...c, isDefault: c.id === id })) }));
    },
    updateAccount(role: Role, patch: Partial<Account>) {
      update((s) => {
        const acc = { ...s.account[role], ...patch };
        let next = { ...s, account: { ...s.account, [role]: acc } };
        if (role === 'customer') next.customerName = (acc.first + ' ' + acc.last).trim();
        return next;
      });
    },
    replyToReview(reviewId: string, text: string) {
      update((s) => ({ ...s, replies: { ...s.replies, [reviewId]: text } }));
    },
    reschedule(id: string, date: string, time: string) {
      const b = get().bookings.find((x) => x.id === id);
      if (!b || hoursUntil(b.date, b.time) <= 24) return false;
      update((s) => {
        let next = { ...s, bookings: s.bookings.map((x) => (x.id === id ? { ...x, date, time } : x)) };
        next = pushNotif(next, 'pro', { icon: 'calendar', title: 'Booking moved', sub: '{c} moved a session', vars: { c: s.customerName.split(' ')[0] }, link: { to: 'booking', id } });
        return next;
      });
      return true;
    },
    stopSeries(id: string, by: Role) {
      update((s) => {
        const ser = s.series.find((x) => x.id === id);
        if (!ser || ser.status === 'stopped') return s;
        let next = {
          ...s,
          series: s.series.map((x) => (x.id === id ? { ...x, status: 'stopped' as const, stoppedBy: by } : x)),
          bookings: s.bookings.map((b) => (b.seriesId === id && b.status === 'unpaid' ? { ...b, status: 'cancelled' as Status, cancelledBy: 'series' } : b)),
        };
        if (by === 'pro') next = pushNotif(next, 'customer', { icon: 'repeat', title: 'Weekly series stopped', sub: '{p} turned off weekly repeats. Unpaid sessions were cancelled.', vars: { p: proName(ser.proId) }, link: { to: 'series', id } });
        else next = pushNotif(next, 'pro', { icon: 'repeat', title: 'Weekly series stopped', sub: '{c} stopped a weekly series', vars: { c: s.customerName.split(' ')[0] } });
        return next;
      });
    },
    // Demo helper: runs the next weekly charge now.
    runWeeklyCharge(seriesId: string) {
      update((s) => {
        const nc = nextCharge(s, seriesId);
        if (!nc) return s;
        const idsSet = nc.items.map((b) => b.id);
        let next = { ...s, bookings: s.bookings.map((b) => (idsSet.includes(b.id) ? { ...b, status: 'confirmed' as Status, paid: true } : b)) };
        next = pushNotif(next, 'customer', { icon: 'credit-card', title: 'Weekly charge', sub: 'SAR {a} charged for next week', vars: { a: nc.amount }, link: { to: 'series', id: seriesId } });
        return next;
      });
    },
    setWeekly(on: boolean) {
      update((s) => ({ ...s, proProfile: { ...s.proProfile, weekly: on } }));
      if (!on) {
        get().series.filter((x) => x.proId === ME_PRO_ID && x.status === 'active').forEach((x) => this.stopSeries(x.id, 'pro'));
      }
    },
    markComplete(id: string) {
      update((s) => {
        let next = { ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'awaiting' as Status } : b)) };
        next = pushNotif(next, 'customer', { icon: 'check-circle', title: 'Please confirm your session', sub: 'Confirm within 24 hours so the professional is paid', link: { to: 'booking', id } });
        return next;
      });
    },
    confirmSession(id: string) {
      update((s) => {
        const payout = addDaysIso(todayIso(), 2);
        let next = { ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'completed' as Status, payoutDate: payout } : b)) };
        next = pushNotif(next, 'pro', { icon: 'credit-card', title: 'Session confirmed', sub: 'Payout scheduled 48 hours after confirmation', link: { to: 'earnings' } });
        return next;
      });
    },
    report(bookingId: string, by: Role, category: string, details: string) {
      update((s) => {
        let next = { ...s, reports: [...s.reports, { id: ids(), bookingId, by, category, details }] };
        next = pushNotif(next, by, { icon: 'flag', title: 'Report received', sub: 'Our team will review it and update you' });
        return next;
      });
    },
    send(bookingId: string, from: Role, text: string) {
      update((s) => {
        const now = new Date();
        const at = hourLabel(now.getHours()).replace(':00', ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
        const other: Role = from === 'customer' ? 'pro' : 'customer';
        let next = { ...s, chats: { ...s.chats, [bookingId]: [...(s.chats[bookingId] || []), { from, text, at }] } };
        next = pushNotif(next, other, { icon: 'message-circle', title: 'New message', sub: text.slice(0, 60), link: { to: 'chat', id: bookingId }, cat: 'messages' });
        next.chatRead = { ...next.chatRead, [from]: { ...next.chatRead[from], [bookingId]: next.chats[bookingId].length } };
        return next;
      });
    },
    markAllRead(role: Role) {
      update((s) => ({ ...s, notifs: { ...s.notifs, [role]: s.notifs[role].map((n) => ({ ...n, unread: false })) } }));
    },
    addAddress(role: Role, a: Omit<Addr, 'id'>) {
      update((s) => {
        const list = a.isDefault ? s.addresses[role].map((x) => ({ ...x, isDefault: false })) : s.addresses[role];
        const first = list.length === 0;
        return { ...s, addresses: { ...s.addresses, [role]: [...list, { ...a, id: ids(), isDefault: a.isDefault || first }] } };
      });
    },
    updateAddress(role: Role, id: string, patch: Partial<Omit<Addr, 'id'>>) {
      update((s) => {
        const base = patch.isDefault ? s.addresses[role].map((x) => ({ ...x, isDefault: false })) : s.addresses[role];
        return { ...s, addresses: { ...s.addresses, [role]: base.map((x) => (x.id === id ? { ...x, ...patch } : x)) } };
      });
    },
    removeAddress(role: Role, id: string) {
      update((s) => {
        let list = s.addresses[role].filter((x) => x.id !== id);
        // If the default one was removed, the first remaining address becomes the default.
        if (list.length && !list.some((x) => x.isDefault)) list = list.map((x, i) => (i === 0 ? { ...x, isDefault: true } : x));
        return { ...s, addresses: { ...s.addresses, [role]: list } };
      });
    },
    toggleGoing(id: string) {
      update((s) => ({ ...s, going: s.going.includes(id) ? s.going.filter((x) => x !== id) : [...s.going, id] }));
    },
    submitPost(title: string, body: string, category = 'Tips') {
      update((s) => ({ ...s, posts: [{ id: ids(), official: false, who: s.account.pro.first + ' ' + s.account.pro.last, title, body, meta: '', event: false, status: 'review', mine: true, category }, ...s.posts] }));
    },
    deletePost(id: string) {
      update((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) }));
    },
    toggleLike(id: string) {
      update((s) => ({ ...s, likes: s.likes.includes(id) ? s.likes.filter((x) => x !== id) : [...s.likes, id] }));
    },
    addComment(postId: string, role: Role, text: string) {
      update((s) => {
        const who = s.account[role].first + ' ' + s.account[role].last.charAt(0) + '.';
        return { ...s, comments: { ...s.comments, [postId]: [...(s.comments[postId] || []), { id: ids(), who, text, mine: true }] } };
      });
    },
    approvePost(id: string) {
      update((s) => {
        let next = { ...s, posts: s.posts.map((p) => (p.id === id ? { ...p, status: 'published' as const } : p)) };
        next = pushNotif(next, 'pro', { icon: 'check-circle', title: 'Post approved', sub: 'Your post is now live in Community', link: { to: 'post', id }, cat: 'community' });
        return next;
      });
    },
    setFilters(f: Filters) {
      update((s) => ({ ...s, filters: f }));
    },
    toggleFavorite(id: string) {
      update((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] }));
    },
    setAvail(dow: number, a: Partial<Avail>) {
      update((s) => ({ ...s, avail: s.avail.map((x, i) => (i === dow ? { ...x, ...a } : x)) }));
    },
    addBlock(date: string, from: number, to: number) {
      update((s) => ({ ...s, blocks: [...s.blocks, { id: ids(), date, from, to }] }));
    },
    removeBlock(id: string) {
      update((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
    },
    setProProfile(p: Partial<State['proProfile']>) {
      update((s) => ({ ...s, proProfile: { ...s.proProfile, ...p } }));
    },
    setCustomerName(n: string) {
      update((s) => {
        const parts = n.trim().split(' ');
        const acc = { ...s.account.customer, first: parts[0] || '', last: parts.slice(1).join(' ') };
        return { ...s, customerName: n, account: { ...s.account, customer: acc } };
      });
    },
    markRead(role: Role, id: string) {
      update((s) => ({ ...s, notifs: { ...s.notifs, [role]: s.notifs[role].map((n) => (n.id === id ? { ...n, unread: false } : n)) } }));
    },
    setNotifPref(role: Role, key: string, on: boolean) {
      update((s) => ({ ...s, notifPrefs: { ...s.notifPrefs, [role]: { ...s.notifPrefs[role], [key]: on } } }));
    },
    markChatRead(role: Role, bookingId: string) {
      update((s) => {
        const n = (s.chats[bookingId] || []).length;
        if ((s.chatRead[role][bookingId] || 0) === n) return s;
        return { ...s, chatRead: { ...s.chatRead, [role]: { ...s.chatRead[role], [bookingId]: n } } };
      });
    },
    // Customer review after a completed session.
    addReview(bookingId: string, rating: number, text: string, tags: string[]) {
      update((s) => {
        const b = s.bookings.find((x) => x.id === bookingId);
        if (!b || s.reviews.some((r) => r.bookingId === bookingId)) return s;
        const who = s.account.customer.first + ' ' + s.account.customer.last.charAt(0) + '.';
        const r: Review = { id: ids(), proId: b.proId, bookingId, who, rating, text, date: todayIso(), tags };
        let next = { ...s, reviews: [r, ...s.reviews] };
        next = pushNotif(next, 'pro', { icon: 'star', title: 'New review', sub: '{c} left you a {n}-star review', vars: { c: who, n: rating }, link: { to: 'reviews' }, cat: 'reviews' });
        return next;
      });
    },
    // Professional documents: a new file goes to review; the current one stays valid meanwhile.
    submitDoc(key: string, file: string, expires?: string) {
      update((s) => {
        let next = { ...s, docs: s.docs.map((d) => (d.key === key ? (d.status === 'verified' ? { ...d, pending: { file, expires } } : { ...d, status: 'review' as const, file, expires }) : d)) };
        next = pushNotif(next, 'pro', { icon: 'file-text', title: 'Document received', sub: 'We are reviewing your document', link: { to: 'docs' } });
        return next;
      });
    },
    approveDoc(key: string) {
      update((s) => {
        let next = { ...s, docs: s.docs.map((d) => (d.key === key ? { ...d, status: 'verified' as const, file: d.pending ? d.pending.file : d.file, expires: d.pending ? d.pending.expires : d.expires, pending: undefined } : d)) };
        next = pushNotif(next, 'pro', { icon: 'check-circle', title: 'Document approved', sub: 'Your document is verified', link: { to: 'docs' } });
        return next;
      });
    },
    addMedia(m: Omit<Media, 'id'>) {
      update((s) => ({ ...s, media: [...s.media, { ...m, id: ids() }] }));
    },
    removeMedia(id: string) {
      update((s) => ({ ...s, media: s.media.filter((x) => x.id !== id) }));
    },
    setPhoto(role: Role, photo: Photo) {
      update((s) => ({ ...s, photos: { ...s.photos, [role]: photo } }));
    },
    resetDemo() {
      update(() => seed());
    },
  };
}

// Messages from the other person that this role has not opened yet.
export function unreadChat(state: State, role: Role, bookingId: string): number {
  const msgs = state.chats[bookingId] || [];
  const seen = state.chatRead[role][bookingId] || 0;
  return msgs.slice(seen).filter((m) => m.from !== role).length;
}
export function unreadChats(state: State, role: Role): number {
  return Object.keys(state.chats).filter((id) => unreadChat(state, role, id) > 0).length;
}

// Free hourly slots for a professional on a date.
export function slotsFor(s: State, proId: string, date: string): string[] {
  const dow = fromIso(date).getDay();
  const a = s.avail[dow];
  if (!a.on) return [];
  const out: string[] = [];
  for (let h = a.start; h < a.end; h++) {
    const label = hourLabel(h);
    if (startOf(date, label).getTime() < Date.now() + 2 * 3600000) continue;
    if (s.blocks.some((b) => b.date === date && h >= b.from && h < b.to)) continue;
    if (s.bookings.some((b) => b.proId === proId && b.date === date && hourOf(b.time) === h && b.status !== 'cancelled')) continue;
    out.push(label);
  }
  return out;
}

export function nextSlot(s: State, proId: string): { date: string; time: string } | null {
  let d = todayIso();
  for (let i = 0; i < 14; i++) {
    const sl = slotsFor(s, proId, d);
    if (sl.length) return { date: d, time: sl[0] };
    d = addDaysIso(d, 1);
  }
  return null;
}

type StoreCtx = { s: State; api: Api };
const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(seed);
  const ref = useRef<State>(s);
  const counter = useRef(100);
  ref.current = s;
  const api = useMemo(
    () =>
      makeApi(
        () => ref.current,
        (fn) => {
          const next = fn(ref.current);
          ref.current = next;
          setS(next);
          return next;
        },
        () => 'x' + counter.current++
      ),
    []
  );
  return <Ctx.Provider value={{ s, api }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

// The professionals as customers see them. The signed-in professional's own price comes from their profile.
export const pricedPros = (s: State): Pro[] => PROS.map((p) => (p.id === ME_PRO_ID ? { ...p, price: s.proProfile.price } : p));
