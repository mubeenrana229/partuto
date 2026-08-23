/**
 * FILE: lib/store.ts
 * Global app state (Zustand + localStorage persistence). Single source of truth for cart, wishlist, vehicles, addresses, orders, bookings, notifications, wallet, reviews, returns, chat threads, and auth user. Almost every screen reads/writes through useStore() from here — read the type defs below before adding new state.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "./mock";
import { vehicles as seedVehicles, products as seedProducts } from "./mock";
import { notifyLocal } from "./notify";

export type CartItem = { product: Product; qty: number };

export type Vehicle = {
  id: string;
  name: string;
  year: number;
  engine: string;
  plate: string;
  primary?: boolean;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  primary?: boolean;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  /** Coupon discount applied at the time the order was placed (AED). Added so the
   *  order/receipt total always matches subtotal + delivery - discount. */
  discount: number;
  total: number;
  address: Address;
  payment: string;
  status: "placed" | "packed" | "shipping" | "delivered";
  createdAt: number;
  type: "product" | "service";
  eta: string;
};

/**
 * BUGFIX: this used to be duplicated as local component state inside CartClient
 * AND CheckoutClient, so a coupon applied on the Cart screen silently disappeared
 * the moment the user moved to Checkout (the discount was never charged/credited).
 * It now lives in one place (the global store) and is recomputed from the live
 * cart subtotal every time, so it also stays correct if quantities change after
 * the coupon was applied instead of freezing the discount amount at apply-time.
 */
export function computeCouponDiscount(code: string, subtotal: number, delivery: number): number {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return 0;
  if (normalized === "AUTOHUB10") return Math.round(subtotal * 0.1);
  // BUGFIX: FREESHIP used to always knock a flat AED 25 off the total, even when
  // delivery was already free (subtotal > 500) — that gave a free AED 25 discount
  // that was never actually being charged. It's now capped to the real delivery fee.
  if (normalized === "FREESHIP") return Math.min(delivery, 25);
  return 0;
}

export type Booking = {
  id: string;
  serviceName: string;
  techName: string;
  price: number;
  slot: string;
  status: "upcoming" | "done";
  createdAt: number;
};

export type Review = {
  id: string;
  productId: string;
  user: string;
  rating: number;
  title?: string;
  text: string;
  at: number;
  verified?: boolean;
};

export type AuthUser = { id: string; name: string; email: string; phone?: string; verified?: boolean };
export type WalletTransaction = { id: string; type: "credit"|"debit"|"refund"; amount: number; title: string; at: number; reference?: string };

export type ReturnRequest = {
  id: string;
  orderId: string;
  reason: string;
  details: string;
  refundMethod: "wallet" | "original" | "exchange";
  status: "requested" | "approved" | "picked-up" | "refunded";
  createdAt: number;
  refundAmount: number;
};

export type ChatMsg = {
  id?: string;
  from: "me" | "v";
  text: string;
  time: number;
  kind?: "text" | "image" | "voice";
  duration?: number;
  /** object URL / data url preview for image or voice attachments */
  url?: string;
  status?: "sending" | "sent" | "failed";
};

export type ThreadMeta = {
  id: string;
  kind: "shop" | "order" | "support" | "tech";
  refId: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  unread: number;
  lastText?: string;
  lastAt?: number;
};

type State = {
  cart: CartItem[];
  wishlist: string[]; // product ids
  vehicles: Vehicle[];
  primaryVehicleId: string;
  addresses: Address[];
  primaryAddressId: string;
  orders: Order[];
  bookings: Booking[];
  notifications: { id: string; title: string; body: string; at: number; read: boolean; href?: string }[];
  city: string;
  /** Coupon code currently applied to the cart (shared between /cart and /checkout — see computeCouponDiscount). */
  couponCode: string;
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  user: AuthUser | null;
  language: "en" | "ar" | "ur";
  reviews: Review[];
  returns: ReturnRequest[];
  follows: string[]; // shop ids
  threads: Record<string, ChatMsg[]>; // by threadId (e.g. order:AH-1234 or shop:s1)
  threadMeta: Record<string, ThreadMeta>;

  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  toggleWishlist: (id: string) => void;

  addVehicle: (v: Omit<Vehicle, "id">) => void;
  removeVehicle: (id: string) => void;
  setPrimaryVehicle: (id: string) => void;

  addAddress: (a: Omit<Address, "id">) => void;
  setPrimaryAddress: (id: string) => void;

  setCoupon: (code: string) => void;
  placeOrder: (opts: { delivery: number; payment: string }) => Order;
  bookService: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;

  markNotificationsRead: () => void;
  pushNotification: (title: string, body: string, href?: string) => void;
  setCity: (city: string) => void;
  setUser: (user: AuthUser | null) => void;
  setLanguage: (language: "en" | "ar" | "ur") => void;
  creditWallet: (amount: number, title: string, reference?: string) => void;
  debitWallet: (amount: number, title: string, reference?: string) => boolean;
  processWalletRefund: (returnId: string) => void;

  addReview: (r: Omit<Review, "id" | "at" | "verified">) => Review;
  requestReturn: (r: Omit<ReturnRequest, "id" | "createdAt" | "status">) => ReturnRequest;
  toggleFollow: (shopId: string) => void;
  sendMessage: (threadId: string, text: string, opts?: { kind?: "text" | "image" | "voice"; duration?: number; url?: string; status?: "sending" | "sent" | "failed"; autoReply?: boolean }) => string;
  setMessageStatus: (threadId: string, msgId: string, status: "sending" | "sent" | "failed") => void;
  removeMessage: (threadId: string, msgId: string) => void;
  ensureThread: (meta: ThreadMeta) => void;
  markThreadRead: (threadId: string) => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // ---- Initial/seed state -------------------------------------------------
      // Everything below (until the action functions) is DEMO seed data so the app
      // isn't empty on first load. It's persisted to localStorage after that, so
      // editing these values only changes what a brand-new user/browser sees.
      cart: [{ product: seedProducts[0], qty: 1 }, { product: seedProducts[1], qty: 1 }],
      wishlist: [seedProducts[2].id],
      vehicles: seedVehicles,
      primaryVehicleId: seedVehicles[0].id,
      addresses: [
        { id: "a1", label: "Home", line1: "Tower 5, Apt 1804, Marina Promenade", city: "Dubai", primary: true },
        { id: "a2", label: "Office", line1: "DIFC Gate Village 4, Level 12", city: "Dubai" },
      ],
      primaryAddressId: "a1",
      orders: [],
      bookings: [],
      notifications: [
        { id: "n1", title: "New message from Brembo Brake Centre", body: "Want me to reserve a pair?", at: Date.now() - 1000 * 60 * 22, read: false, href: "/chat?id=shop:s1" },
        { id: "n2", title: "Tyre Plus Workshop sent 2 messages", body: "Free installation slot at 4 PM?", at: Date.now() - 1000 * 60 * 90, read: false, href: "/chat?id=shop:s2" },
        { id: "n3", title: "Rashid (Recovery) is on the way", body: "ETA 12 min. Tap to chat.", at: Date.now() - 1000 * 60 * 5, read: false, href: "/chat?id=tech:t1" },
        { id: "n4", title: "Welcome to AutoHub", body: "Your garage is ready. Start shopping parts that fit.", at: Date.now() - 1000 * 60 * 60 * 6, read: true },
      ],
      city: "Dubai Marina",
      couponCode: "",
      walletBalance: 240,
      walletTransactions: [{ id:"wt1", type:"credit", amount:240, title:"Welcome wallet credit", at:Date.now()-86400000 }],
      user: null,
      language: "en",
      reviews: [
        { id: "r1", productId: "p1", user: "Mohammed S.", rating: 5, title: "Perfect fit", text: "Installed on my 2022 Land Cruiser in 30 min, no issues. Brakes feel super solid.", at: Date.now() - 86400000 * 3, verified: true },
        { id: "r2", productId: "p1", user: "Ayesha K.", rating: 4, text: "Good quality but delivery was 1 day late. Otherwise great product.", at: Date.now() - 86400000 * 8, verified: true },
        { id: "r3", productId: "p2", user: "Hamza R.", rating: 5, title: "Grip is unreal", text: "Best tyres I've ever owned in Dubai heat. Highly recommend.", at: Date.now() - 86400000 * 2, verified: true },
        { id: "r4", productId: "p3", user: "Khalid B.", rating: 5, text: "Started my Patrol first try after a year of trouble. Excellent battery.", at: Date.now() - 86400000 * 12, verified: true },
        { id: "r5", productId: "p4", user: "Fatima A.", rating: 5, text: "Engine sounds smoother. Will repurchase.", at: Date.now() - 86400000 * 5, verified: true },
      ],
      returns: [],
      follows: ["s1"],
      threads: {
        "shop:s1": [
          { from: "v", text: "Hi Ahmed 👋 the Brembo discs for your Land Cruiser are in stock. Want me to reserve a pair?", time: Date.now() - 1000 * 60 * 22 },
        ],
        "shop:s2": [
          { from: "v", text: "Your Michelin 245/40 R19 tyres arrived today. Free installation slot at 4 PM?", time: Date.now() - 1000 * 60 * 90 },
        ],
        "tech:t1": [
          { from: "v", text: "On my way — ETA 12 min. Sending live location shortly.", time: Date.now() - 1000 * 60 * 5 },
        ],
        "support:sup1": [
          { from: "v", text: "Hi! I'm Sara from AutoHub Support. How can I help you today?", time: Date.now() - 1000 * 60 * 60 * 3 },
        ],
      },
      threadMeta: {
        "shop:s1": { id: "shop:s1", kind: "shop", refId: "s1", title: "Brembo Brake Centre", subtitle: "Active now · ★ 4.9", unread: 1, lastText: "Want me to reserve a pair?", lastAt: Date.now() - 1000 * 60 * 22 },
        "shop:s2": { id: "shop:s2", kind: "shop", refId: "s2", title: "Tyre Plus Workshop", subtitle: "Replies in ~5 min · ★ 4.8", unread: 2, lastText: "Free installation slot at 4 PM?", lastAt: Date.now() - 1000 * 60 * 90 },
        "tech:t1": { id: "tech:t1", kind: "tech", refId: "t1", title: "Rashid · Recovery Tech", subtitle: "On active job · Van #A-42", unread: 1, lastText: "On my way — ETA 12 min.", lastAt: Date.now() - 1000 * 60 * 5 },
        "support:sup1": { id: "support:sup1", kind: "support", refId: "sup1", title: "AutoHub Support", subtitle: "24/7 · Avg reply 2 min", unread: 0, lastText: "How can I help you today?", lastAt: Date.now() - 1000 * 60 * 60 * 3 },
      },

      // ---- Actions --------------------------------------------------------------
      // Everything from here down mutates state via Zustand's `set`. Add new
      // fields to the `State` type above AND initialize them in the seed block
      // above, or persisted users from before your change will have `undefined`.

      addToCart: (p, qty = 1) =>
        set((s) => {
          const ex = s.cart.find((i) => i.product.id === p.id);
          if (ex) return { cart: s.cart.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i) };
          return { cart: [...s.cart, { product: p, qty }] };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: qty <= 0
            ? s.cart.filter((i) => i.product.id !== id)
            : s.cart.map((i) => i.product.id === id ? { ...i, qty } : i),
        })),
      clearCart: () => set({ cart: [] }),

      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),

      addVehicle: (v) =>
        set((s) => {
          const id = "v" + Date.now();
          const list = [...s.vehicles, { ...v, id }];
          return { vehicles: list, primaryVehicleId: s.primaryVehicleId || id };
        }),
      removeVehicle: (id) =>
        set((s) => {
          const list = s.vehicles.filter((v) => v.id !== id);
          return {
            vehicles: list,
            primaryVehicleId: s.primaryVehicleId === id ? list[0]?.id ?? "" : s.primaryVehicleId,
          };
        }),
      setPrimaryVehicle: (id) => set({ primaryVehicleId: id }),

      addAddress: (a) =>
        set((s) => {
          const id = "a" + Date.now();
          return { addresses: [...s.addresses, { ...a, id }] };
        }),
      setPrimaryAddress: (id) => set({ primaryAddressId: id }),

      placeOrder: ({ delivery, payment }) => {
        const s = get();
        const subtotal = s.cart.reduce((t, i) => t + i.product.price * i.qty, 0);
        // BUGFIX: the coupon discount is now computed here from the shared couponCode
        // (instead of being trapped in Cart-page-only local state), so a coupon the
        // user applied is actually reflected in what gets charged/recorded.
        const discount = computeCouponDiscount(s.couponCode, subtotal, delivery);
        const order: Order = {
          id: "AH-" + Math.floor(10000 + Math.random() * 89999),
          items: s.cart,
          subtotal,
          delivery,
          discount,
          total: Math.max(0, subtotal + delivery - discount),
          address: s.addresses.find((a) => a.id === s.primaryAddressId) ?? s.addresses[0],
          payment,
          status: "shipping",
          createdAt: Date.now(),
          type: "product",
          eta: "~32 min",
        };
        set({
          orders: [order, ...s.orders],
          cart: [],
          couponCode: "", // coupon is single-use per order
          notifications: [
            { id: "n" + Date.now(), title: "Order placed", body: `${order.id} · AED ${order.total}`, at: Date.now(), read: false },
            ...s.notifications,
          ],
        });
        return order;
      },

      bookService: (b) => {
        const id = "BK-" + Math.floor(1000 + Math.random() * 8999);
        const booking: Booking = { ...b, id, createdAt: Date.now(), status: "upcoming" };
        set((s) => ({
          bookings: [booking, ...s.bookings],
          notifications: [
            { id: "n" + Date.now(), title: "Booking confirmed", body: `${b.serviceName} · ${b.slot}`, at: Date.now(), read: false },
            ...s.notifications,
          ],
        }));
        return booking;
      },

      markNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      pushNotification: (title, body, href) =>
        set((s) => ({ notifications: [{ id: "n" + Date.now(), title, body, href, at: Date.now(), read: false }, ...s.notifications] })),
      setCity: (city) => set({ city }),
      setCoupon: (code) => set({ couponCode: code }),
      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      creditWallet: (amount, title, reference) => set((s) => ({
        walletBalance: s.walletBalance + Math.max(0, amount),
        walletTransactions: [{ id:"wt"+Date.now(), type:"credit", amount, title, reference, at:Date.now() }, ...s.walletTransactions],
      })),
      debitWallet: (amount, title, reference) => {
        const s = get();
        if (amount <= 0 || s.walletBalance < amount) return false;
        set({ walletBalance: s.walletBalance - amount, walletTransactions: [{ id:"wt"+Date.now(), type:"debit", amount, title, reference, at:Date.now() }, ...s.walletTransactions] });
        return true;
      },
      processWalletRefund: (returnId) => set((s) => {
        const req = s.returns.find(r => r.id === returnId);
        if (!req || req.status === "refunded") return {};
        return {
          walletBalance: s.walletBalance + req.refundAmount,
          walletTransactions: [{ id:"wt"+Date.now(), type:"refund", amount:req.refundAmount, title:"Refund credited", reference:req.id, at:Date.now() }, ...s.walletTransactions],
          returns: s.returns.map(r => r.id === returnId ? { ...r, status:"refunded" as const } : r),
          notifications: [{ id:"n"+Date.now(), title:"Refund credited to wallet", body:`AED ${req.refundAmount} · ${req.id}`, at:Date.now(), read:false }, ...s.notifications],
        };
      }),

      addReview: (r) => {
        const review: Review = { ...r, id: "r" + Date.now(), at: Date.now(), verified: true };
        set((s) => ({ reviews: [review, ...s.reviews] }));
        return review;
      },
      requestReturn: (r) => {
        const req: ReturnRequest = { ...r, id: "RT-" + Math.floor(1000 + Math.random() * 8999), createdAt: Date.now(), status: "requested" };
        set((s) => ({
          returns: [req, ...s.returns],
          notifications: [
            { id: "n" + Date.now(), title: "Return requested", body: `${req.id} · Order ${req.orderId} · Refund AED ${req.refundAmount}`, href: `/returns/${req.orderId}`, at: Date.now(), read: false },
            ...s.notifications,
          ],
        }));
        return req;
      },
      toggleFollow: (shopId) =>
        set((s) => ({ follows: s.follows.includes(shopId) ? s.follows.filter((x) => x !== shopId) : [...s.follows, shopId] })),
      sendMessage: (threadId, text, opts) => {
        const msgId = "m" + Date.now() + Math.random().toString(36).slice(2, 7);
        const now = Date.now();
        const mine: ChatMsg = {
          id: msgId,
          from: "me",
          text,
          time: now,
          kind: opts?.kind ?? "text",
          duration: opts?.duration,
          url: opts?.url,
          status: opts?.status ?? "sent",
        };
        const preview = opts?.kind === "image" ? "📷 Photo" : opts?.kind === "voice" ? `🎤 Voice ${opts?.duration ?? 3}s` : text;
        set((s) => {
          const t = s.threads[threadId] ?? [];
          const existingMeta = s.threadMeta[threadId];
          const meta: ThreadMeta = existingMeta
            ? { ...existingMeta, lastText: preview, lastAt: now }
            : { id: threadId, kind: "shop", refId: threadId.split(":")[1] ?? threadId, title: threadId, unread: 0, lastText: preview, lastAt: now };
          return { threads: { ...s.threads, [threadId]: t.concat(mine) }, threadMeta: { ...s.threadMeta, [threadId]: meta } };
        });

        if (opts?.autoReply !== false && opts?.status !== "sending") {
          const replies = ["Got it — checking now.", "Yes, available!", "Will dispatch today.", "Sure, I'll add 5% off."];
          const body = replies[Math.floor(Math.random() * replies.length)];
          setTimeout(() => {
            const rId = "m" + Date.now() + Math.random().toString(36).slice(2, 7);
            const rTime = Date.now();
            set((s) => {
              const t = s.threads[threadId] ?? [];
              const m = s.threadMeta[threadId];
              const reply: ChatMsg = { id: rId, from: "v", text: body, time: rTime, kind: "text", status: "sent" };
              return {
                threads: { ...s.threads, [threadId]: t.concat(reply) },
                threadMeta: m ? { ...s.threadMeta, [threadId]: { ...m, unread: m.unread + 1, lastText: body, lastAt: rTime } } : s.threadMeta,
              };
            });
            const meta = get().threadMeta[threadId];
            notifyLocal(meta?.title ?? "New message", body, `/chat?id=${encodeURIComponent(threadId)}`);
          }, 1400);
        }
        return msgId;
      },
      setMessageStatus: (threadId, msgId, status) =>
        set((s) => ({
          threads: { ...s.threads, [threadId]: (s.threads[threadId] ?? []).map((m) => (m.id === msgId ? { ...m, status } : m)) },
        })),
      removeMessage: (threadId, msgId) =>
        set((s) => ({
          threads: { ...s.threads, [threadId]: (s.threads[threadId] ?? []).filter((m) => m.id !== msgId) },
        })),
      ensureThread: (meta) =>
        set((s) => ({
          threadMeta: s.threadMeta[meta.id] ? s.threadMeta : { ...s.threadMeta, [meta.id]: meta },
          threads: s.threads[meta.id] ? s.threads : { ...s.threads, [meta.id]: [] },
        })),
      markThreadRead: (threadId) =>
        set((s) => {
          const m = s.threadMeta[threadId];
          if (!m || m.unread === 0) return {} as any;
          return { threadMeta: { ...s.threadMeta, [threadId]: { ...m, unread: 0 } } };
        }),
    }),
    {
      // localStorage key. If you make a breaking change to the State shape
      // (rename/remove a field in a way old persisted data can't satisfy),
      // bump this to e.g. "autohub-store-v5" so old browsers don't load stale/
      // incompatible data — otherwise `merge` below just spreads it in as-is.
      name: "autohub-store-v4",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => ({ ...current, ...(persisted as object) }),
    },
  ),
);

// Shared cart math (subtotal + item count) so every screen that shows a cart
// total (Cart, Checkout, Profile badge, etc.) computes it the same way.
export const cartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((t, i) => t + i.product.price * i.qty, 0);
  const count = cart.reduce((t, i) => t + i.qty, 0);
  return { subtotal, count };
};
