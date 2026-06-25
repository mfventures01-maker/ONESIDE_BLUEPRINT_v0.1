/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Calendar,
  Sparkles,
  Phone,
  CheckCircle,
  Clock,
  Search,
  Check,
  ChevronRight,
  Shield,
  CreditCard,
  Settings,
  Tv,
  Users,
  Info,
  Gift,
  HelpCircle,
  Copy,
  FolderLock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CARSS_Revenue_Server, EXPERIMENTAL_THEMES } from "../services/revenueService";
import { MenuItem, MenuCategory, InventoryItem, Promotion, ThemeType, Reservation, PaymentIntention } from "../types";
import { useRoleStore } from "../state/Contexts";

export default function CustomerHomepage() {
  const navigate = useNavigate();
  const { addSystemLog } = useRoleStore();

  // --- Theme State ---
  const [activeTheme, setActiveTheme] = useState<ThemeType>("midnight_gold");
  const theme = EXPERIMENTAL_THEMES[activeTheme];

  // --- DB / Service State ---
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Interaction State ---
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ item: MenuItem; count: number }[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(5); // Default 5% off active promotion
  const [viewingSQLBlueprint, setViewingSQLBlueprint] = useState(false);

  // --- Reservation Form State ---
  const [bookingType, setBookingType] = useState<"table" | "snooker" | "vip" | "event">("table");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [peopleCount, setPeopleCount] = useState(2);

  // --- Payment Method State ---
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "pos">("transfer");

  // --- Created Action States ---
  const [activeReceipt, setActiveReceipt] = useState<{
    reservation: Reservation;
    payment?: PaymentIntention;
  } | null>(null);

  const [notification, setNotification] = useState("");

  // Load constitutional data bounds
  useEffect(() => {
    async function loadConstitutionalData() {
      setIsLoading(true);
      try {
        const saved = await CARSS_Revenue_Server.getSavedTheme();
        setActiveTheme(saved);

        const cats = await CARSS_Revenue_Server.getCategories();
        setCategories(cats);

        const items = await CARSS_Revenue_Server.getMenuItems();
        setMenuItems(items);

        const inv = await CARSS_Revenue_Server.getInventory();
        setInventory(inv);

        const promos = await CARSS_Revenue_Server.getPromotions();
        setPromotions(promos);
      } catch (err) {
        console.error("Constitutional load failure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConstitutionalData();
  }, []);

  const handleThemeSwitch = async (themeKey: ThemeType) => {
    setActiveTheme(themeKey);
    await CARSS_Revenue_Server.saveTheme(themeKey);
    addSystemLog(`Customer runtime requested theme overhaul: ${themeKey.toUpperCase()}`);
    showToast(`Atmospheric matrix changed to: ${themeKey.replace("_", " ").toUpperCase()}`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // Helper to determine real-time inventory status
  const getItemStockInfo = (itemId: string) => {
    const inv = inventory.find((i) => i.menu_item_id === itemId);
    if (!inv) return { label: "OUT OF STOCK", color: "bg-red-500/20 text-red-400", quantity: 0, allowsPurchase: false };
    if (inv.quantity === 0) {
      return { label: "OUT OF STOCK", color: "bg-red-950/40 border border-red-500/10 text-red-400 font-mono text-[10px]", quantity: 0, allowsPurchase: false };
    }
    if (inv.quantity <= inv.min_alert_threshold) {
      return { label: `LIMITED AVAILABILITY [${inv.quantity} LEFT]`, color: "bg-amber-950/40 border border-amber-500/15 text-amber-400 font-mono text-[10px] animate-pulse", quantity: inv.quantity, allowsPurchase: true };
    }
    return { label: "AVAILABLE", color: "bg-emerald-950/40 border border-emerald-500/10 text-emerald-400 font-mono text-[10px]", quantity: inv.quantity, allowsPurchase: true };
  };

  // Add item to cart pre-order basket
  const addToCart = (item: MenuItem) => {
    const info = getItemStockInfo(item.id);
    if (!info.allowsPurchase) {
      showToast("Cannot pre-order out of stock element");
      return;
    }

    const currentQtyInCart = cart.find(c => c.item.id === item.id)?.count || 0;
    if (currentQtyInCart >= info.quantity) {
      showToast(`Cannot pre-order more than active inventory level (${info.quantity})`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, count: i.count + 1 } : i));
      }
      return [...prev, { item, count: 1 }];
    });
    showToast(`Added "${item.name}" to pre-order basket.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateCartCount = (itemId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const nextCount = i.count + change;
            const stockInfo = getItemStockInfo(itemId);
            if (nextCount > stockInfo.quantity) {
              showToast(`Limited by current inventory stocks (${stockInfo.quantity})`);
              return i;
            }
            return { ...i, count: nextCount };
          }
          return i;
        })
        .filter((i) => i.count > 0)
    );
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.count, 0);
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const cartTotal = cartSubtotal - discountAmount;

  // Render Category List
  const filteredMenuItems = menuItems.filter((item) => {
    const catMatch = selectedCategory === "all" || item.category_id === selectedCategory;
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return catMatch && searchMatch;
  });

  // Handle placing Reservation and Payment Intention
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !bookingDate || !bookingTime) {
      showToast("Please fill out Name, Phone, Date and Time to book.");
      return;
    }

    // Process file inventory update for all pre-ordered items
    for (const c of cart) {
      await CARSS_Revenue_Server.updateItemInventory(c.item.id, c.count);
    }

    // Place reservation record
    const descriptionPreorders = cart
      .map((c) => `${c.count}x ${c.item.name}`)
      .join(", ");
    const specialRequestsSummary = [
      specialRequests,
      descriptionPreorders ? `PREORDER BASKET: [${descriptionPreorders}]` : ""
    ]
      .filter(Boolean)
      .join(" - ");

    const reservationInput = {
      customer_name: customerName,
      customer_email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      customer_phone: customerPhone,
      reservation_type: bookingType,
      quantity_people: peopleCount,
      booking_date: bookingDate,
      booking_time: bookingTime,
      special_requests: specialRequestsSummary
    };

    const reservationResult = await CARSS_Revenue_Server.placeReservation(reservationInput);

    // Save payment intention record
    let paymentIntentionResult = undefined;
    if (cartTotal > 0 || bookingType === "vip" || bookingType === "snooker") {
      // Calculate total amount (VIP Lounge reservation slot cost, e.g. 15,000 NGN, Table/Snooker base cost, + Pre-order totals)
      const baseFee = bookingType === "vip" ? 15000 : bookingType === "snooker" ? 8000 : 0;
      const finalPayable = cartTotal + baseFee;

      const paymentInput = {
        reservation_id: reservationResult.id,
        amount: finalPayable,
        payment_method: paymentMethod,
        shift_id: "SHIFT-REV-ACTIVE-02"
      };

      paymentIntentionResult = await CARSS_Revenue_Server.generatePaymentIntention(paymentInput);
    }

    // Set interactive ticket
    setActiveReceipt({
      reservation: reservationResult,
      payment: paymentIntentionResult
    });

    addSystemLog(`Revenue engine confirmation ticket generated: ${reservationResult.ticket_code}`);
    showToast("REVENUE SECURED: Reservation & Preorder registered!");

    // Clear basket and details
    setCart([]);
  };

  // Generate WhatsApp formatted message
  const getWhatsAppLink = () => {
    if (!activeReceipt) return "#";
    const res = activeReceipt.reservation;
    const pay = activeReceipt.payment;

    const baseFee = res.reservation_type === "vip" ? 15050 : res.reservation_type === "snooker" ? 8000 : 0;
    const preorderDetails = res.special_requests || "None";

    const text = `*ONESIDE ENTERTAINMENT CENTER - REVENUE DECK*
----------------------------------------
*BOOKING TYPE:* ${res.reservation_type.toUpperCase()}
*TICKET CODE:* ${res.ticket_code}
*CUSTOMER:* ${res.customer_name}
*PHONE:* ${res.customer_phone}
*DATE:* ${res.booking_date}
*TIME:* ${res.booking_time}
*GUESTS:* ${res.quantity_people}

*OFFER DETAIL & PRE-ORDERS:*
${preorderDetails}

${
  pay
    ? `*PAYMENT METHOD:* ${pay.payment_method.toUpperCase()}
*AMOUNT DUE:* ₦${(pay.amount).toLocaleString()} NGN
*PAYMENT REF:* ${pay.payment_reference}
*STATUS:* PENDING STAFF RECONCILIATION`
    : `*PAYMENT:* NO BALANCE DUE`
}

Please verify my reservation and prepare my table bounds!
----------------------------------------
_System Audit secured by CARSS Constitutional Engine_`;

    return `https://api.whatsapp.com/send?phone=+2349045672310&text=${encodeURIComponent(text)}`;
  };

  const copyBlueprintToClipboard = () => {
    const blueprintSql = CARSS_Revenue_Server.getBootstrapSQL();
    navigator.clipboard.writeText(blueprintSql);
    showToast("Supabase SQL Bootstrap Schema copied to clipboard!");
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.fontBody} flex flex-col justify-between transition-all duration-300 relative overflow-x-hidden p-4 md:p-8`}>
      {/* Dynamic atmospheric motion background accents */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 -z-20 pointer-events-none" />
      
      {/* Floating alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-55 px-5 py-3 border border-amber-500/30 bg-zinc-950/95 text-stone-100 rounded-2xl shadow-2xl text-[11px] font-mono tracking-wider flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto w-full border-b border-zinc-900 pb-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-black ${theme.fontTitle} tracking-wider`}>
              Oneside Entertainment
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Constitutional Wave 2 Rev Platform
            </p>
          </div>
        </div>

        {/* Theme Engine Selector Drawer */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/45 p-1.5 border border-zinc-850/60 rounded-2xl">
          <span className="text-[9px] font-mono text-zinc-500 px-2 uppercase tracking-tight hidden lg:block">Atmosphere:</span>
          {(Object.keys(EXPERIMENTAL_THEMES) as ThemeType[]).map((key) => {
            const isSel = activeTheme === key;
            return (
              <button
                key={key}
                onClick={() => handleThemeSwitch(key)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? "bg-zinc-950 border border-zinc-800 text-amber-400 shadow font-bold"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/40"
                }`}
              >
                {key.replace("_", " ")}
              </button>
            );
          })}
        </div>

        {/* Executive Quick portal */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/auth/staff")}
            className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition text-zinc-400 hover:text-zinc-100 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            title="Access Compliance Gateways & Log Monitoring"
          >
            <FolderLock className="w-3 h-3 text-amber-500" />
            <span>Staff Portal</span>
          </button>
        </div>
      </header>

      {/* Main Campaign and Discovery Grid */}
      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-35 relative">
        
        {/* LEFT COLUMN: HERO, FEATURED, MENU DISCOVERY (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Hero discovery banner */}
          <section className={`rounded-3xl border ${theme.cardBg} ${theme.glow} p-6 md:p-8 relative overflow-hidden backdrop-blur-md flex flex-col justify-between`}>
            {/* Ambient gold glow circles */}
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-[100px] pointer-events-none`} />
            
            <div className="max-w-xl space-y-4">
              <span className="px-3 py-1 bg-zinc-950/80 border border-zinc-850 rounded-full inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                Theme Mode Activated: {theme.name}
              </span>
              <h2 className={`text-3xl md:text-5xl font-black ${theme.fontTitle} leading-none tracking-tight`}>
                The Ultimate <br />
                <span className="text-amber-500">Lounge &amp; Snooker</span> <br />
                Storefront
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {theme.tone} Dive into the finest African-hospitality curated dishes, premium coffees, wood-fired pizzas, and reserving your custom snooker match schedules seamlessly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-6">
              <a
                href="#menu-section"
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-mono uppercase tracking-wider font-extrabold shadow-md transition-all duration-200 flex items-center gap-2 ${theme.buttonClass}`}
              >
                <span>Browse Interactive Storefront</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setViewingSQLBlueprint(!viewingSQLBlueprint)}
                className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-2xl text-[10px] font-mono text-zinc-300 hover:text-white uppercase transition flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-500" />
                <span>Show Supabase SQL Schema Blueprint</span>
              </button>
            </div>
          </section>

          {/* Interactive SQL Schema display */}
          {viewingSQLBlueprint && (
            <section className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 space-y-4 animate-fade-in font-mono">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase">CARSS SQL Schema Bootstrap</span>
                </div>
                <button
                  onClick={copyBlueprintToClipboard}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy SQL Code</span>
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Execute this SQL blueprint in your Supabase admin panel to provision and auto-seed variables directly. All inputs dynamically sync.
              </p>
              <pre className="text-[10px] bg-zinc-900/80 p-4 rounded-xl max-h-60 overflow-y-auto text-zinc-300 whitespace-pre border border-zinc-900">
                {CARSS_Revenue_Server.getBootstrapSQL()}
              </pre>
            </section>
          )}

          {/* Featured experiences Carousel highlights */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-2xl p-5 space-y-4 hover:border-zinc-850 transition">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-amber-500">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wide">Snooker Tables</h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">
                  Championship-standard felt snooker matrices with custom cues and premium beverage sideboards.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-2xl p-5 space-y-4 hover:border-zinc-850 transition">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-emerald-500">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wide">VIP Lounge Booking</h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">
                  Private soundproof booth seating with dedicated staff members, executive privacy, and direct POS.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-2xl p-5 space-y-4 hover:border-zinc-850 transition">
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-pink-500">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wide">Shift-Linked Promos</h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">
                  Order any pre-packaged sourdough pizza with rich Arabica coffee to receive immediate 5% loyalty discounts.
                </p>
              </div>
            </div>
          </section>

          {/* INTERACTIVE STOREFRONT MENU SECTION */}
          <section id="menu-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
              <div>
                <h3 className={`text-xl font-bold ${theme.fontTitle}`}>
                  Digital Menu Storefront
                </h3>
                <p className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase mt-1">
                  PREMIUM REALTIME INVENTORY AWARE STORE FRONT
                </p>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chicken, burger, coffee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 PL-10 text-[11px] font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition w-full sm:w-60"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition ${
                  selectedCategory === "all"
                    ? "bg-amber-600 text-zinc-950 font-bold"
                    : "bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-white"
                }`}
              >
                All Varieties
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition ${
                    selectedCategory === cat.id
                      ? "bg-amber-600 text-zinc-950 font-bold"
                      : "bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredMenuItems.map((item) => {
                const stock = getItemStockInfo(item.id);
                // Check if popular or featured
                const isPromo = item.is_popular || item.is_featured;

                return (
                  <div
                    key={item.id}
                    className={`${theme.cardClass} group`}
                  >
                    {/* Item Image */}
                    <div className="h-44 rounded-xl overflow-hidden relative mb-4 border border-zinc-900">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          // fallback
                          e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                        }}
                      />
                      {/* Popular / Promo Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {item.is_popular && (
                          <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-mono text-[8px] uppercase tracking-wider font-extrabold rounded-md shadow-lg">
                            POPULAR DEMAND
                          </span>
                        )}
                        {item.is_featured && (
                          <span className="px-2.5 py-0.5 bg-amber-500 text-zinc-950 font-mono text-[8px] uppercase tracking-wider font-extrabold rounded-md shadow-lg">
                            CHEF FEATURE
                          </span>
                        )}
                      </div>

                      {/* Availability banner */}
                      <div className="absolute bottom-3 right-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider uppercase border shadow ${stock.color}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-md font-bold tracking-tight ${theme.fontTitle}`}>
                          {item.name}
                        </h4>
                        <span className="font-mono text-sm text-amber-500 font-extrabold bg-zinc-950/70 border border-zinc-850 px-2 py-0.5 rounded-lg shrink-0">
                          ₦{(item.price).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans min-h-8">
                        {item.description}
                      </p>

                      {/* Display recommendation tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-zinc-950 border border-zinc-900 text-[8px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Constitutional Recommendations / Upsells */}
                      {item.recommend_message && (
                        <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/10 rounded-xl font-sans text-[10px] text-indigo-300 flex gap-2">
                          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{item.recommend_message}</span>
                        </div>
                      )}
                      
                      {item.upsell_message && (
                        <div className="p-2.5 bg-amber-950/20 border border-amber-900/10 rounded-xl font-sans text-[10px] text-amber-300 flex gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{item.upsell_message}</span>
                        </div>
                      )}

                      {/* CTA Add action item */}
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!stock.allowsPurchase}
                        className={`w-full py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition ${
                          stock.allowsPurchase
                            ? `bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 cursor-pointer`
                            : `bg-zinc-950 text-zinc-700 border border-zinc-925 cursor-not-allowed`
                        }`}
                      >
                        {stock.allowsPurchase ? "Add to Reservation Pre-Order" : "Item Unavailable"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: BOOKINGS, BASKET, PAYMENT INTENTION (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section: Pre-order basket */}
          <section className="bg-zinc-900 border border-zinc-850 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-black uppercase text-white tracking-widest border-b border-zinc-850 pb-3 flex items-center justify-between">
              <span>Your Pre-Order Basket</span>
              <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-amber-400 text-[10px] rounded">
                {cart.length} items
              </span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-zinc-700" />
                <p className="text-[10px] font-mono uppercase tracking-wide">Basket is Empty</p>
                <p className="text-[9px] font-sans">
                  Browse the menu left and add items to customize your reservation session.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((c) => (
                    <div
                      key={c.item.id}
                      className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between gap-2 shadow-inner"
                    >
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono text-white truncate uppercase">
                          {c.item.name}
                        </span>
                        <span className="block text-[9px] font-mono text-zinc-500">
                          ₦{c.item.price.toLocaleString()} x {c.count}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartCount(c.item.id, -1)}
                          className="w-5 h-5 bg-zinc-900 hover:bg-zinc-850 rounded flex items-center justify-center text-xs text-zinc-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-mono text-[10px] font-bold text-white w-3 text-center">{c.count}</span>
                        <button
                          onClick={() => updateCartCount(c.item.id, 1)}
                          className="w-5 h-5 bg-zinc-900 hover:bg-zinc-850 rounded flex items-center justify-center text-xs text-zinc-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing rules, promotion breakdown */}
                <div className="border-t border-zinc-850 pt-3 space-y-1.5 font-mono text-[9px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Pre-Order Subtotal:</span>
                    <span>₦{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Shift Loyalty Discount ({discountPercent}%):</span>
                    <span>- ₦{discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-[11px] border-t border-zinc-850 pt-2">
                    <span>Gourmet Total:</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section: Reservation Engine Form */}
          <section className="bg-zinc-900 border border-zinc-850 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-black uppercase text-white tracking-widest border-b border-zinc-850 pb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Table &amp; Arena Reservation</span>
            </h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Target booking type */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                  Select Reserved Experience
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                  <button
                    type="button"
                    onClick={() => setBookingType("table")}
                    className={`py-1.5 text-[8px] font-mono uppercase tracking-wider rounded-lg text-center ${
                      bookingType === "table" ? "bg-zinc-900 text-white font-black" : "text-zinc-500"
                    }`}
                  >
                    Standard Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("snooker")}
                    className={`py-1.5 text-[8px] font-mono uppercase tracking-wider rounded-lg text-center ${
                      bookingType === "snooker" ? "bg-zinc-900 text-white font-black" : "text-zinc-500"
                    }`}
                  >
                    Snooker (₦8k)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("vip")}
                    className={`py-1.5 text-[8px] font-mono uppercase tracking-wider rounded-lg text-center ${
                      bookingType === "vip" ? "bg-zinc-900 text-white font-black" : "text-zinc-500"
                    }`}
                  >
                    VIP Lounge (₦15k)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("event")}
                    className={`py-1.5 text-[8px] font-mono uppercase tracking-wider rounded-lg text-center ${
                      bookingType === "event" ? "bg-zinc-900 text-white font-black" : "text-zinc-500"
                    }`}
                  >
                    Community Night
                  </button>
                </div>
              </div>

              {/* Dynamic instruction about booking fee */}
              {bookingType === "vip" && (
                <div className="p-2.5 bg-amber-950/20 border border-amber-500/10 rounded-xl font-sans text-[10px] text-amber-300">
                  VIP Lounge booth booking includes executive sound system partition. A reservation fee of ₦15,000 applies.
                </div>
              )}
              {bookingType === "snooker" && (
                <div className="p-2.5 bg-indigo-950/20 border border-indigo-500/10 rounded-xl font-sans text-[10px] text-indigo-300">
                  Pre-booking Snooker arena reserves table + premium cue sticks. A standard reservation slot of ₦8,000 applies.
                </div>
              )}

              {/* Form Input elements */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Lounge Arrival Time
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Quantity of Guests
                    </label>
                    <select
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 8, 10, 15].map((n) => (
                        <option key={n} value={n}>
                          {n} Person{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Payment Intention Method */}
                  <div>
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                      Payment Intention Type
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="transfer">Bank Transfer</option>
                      <option value="pos">Lounge POS Terminal</option>
                      <option value="cash">Cash/Register</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-1">
                    Special Inquiries &amp; Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specific requests, allergy notices, birthday cake bookings..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Booking Button CTA */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl text-[11px] font-mono uppercase tracking-widest font-black shadow-lg transition flex items-center justify-center gap-2 ${theme.buttonClass}`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm Reservation &amp; Intent</span>
              </button>
            </form>
          </section>

          {/* Section: ACTIVE BOOKING TICKET GENERATOR */}
          {activeReceipt && (
            <motion.section
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-950 border border-amber-500/25 rounded-3xl p-6 space-y-4 relative overflow-hidden shadow-2xl"
            >
              {/* Gold gradient top layer */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-pulse" />

              <div className="text-center pb-2 border-b border-zinc-900">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-[11px] font-mono uppercase font-extrabold text-white">REVENUE RESERVATION TICKET</h4>
                <p className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">ONESIDE ENTERTAINMENT CENTER</p>
              </div>

              <div className="space-y-2.5 font-mono text-[10px] leading-relaxed">
                <div className="flex justify-between border-b border-zinc-925 pb-1">
                  <span className="text-zinc-500">TICKET PASS:</span>
                  <span className="text-amber-400 font-black">{activeReceipt.reservation.ticket_code}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-925 pb-1">
                  <span className="text-zinc-500">EXPERIENCE:</span>
                  <span className="text-white uppercase font-bold">{activeReceipt.reservation.reservation_type}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-925 pb-1">
                  <span className="text-zinc-500">CUSTOMER:</span>
                  <span className="text-white uppercase">{activeReceipt.reservation.customer_name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-925 pb-1">
                  <span className="text-zinc-500">TIMING:</span>
                  <span className="text-zinc-300">{activeReceipt.reservation.booking_date} @ {activeReceipt.reservation.booking_time}</span>
                </div>

                {activeReceipt.payment && (
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between border-b border-zinc-925 pb-1 font-bold">
                      <span className="text-zinc-500">TOTAL DUE:</span>
                      <span className="text-emerald-400">₦{(activeReceipt.payment.amount).toLocaleString()} NGN</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-925 pb-1 text-[9px]">
                      <span className="text-zinc-500">INTENT METHOD:</span>
                      <span className="text-zinc-300 uppercase">{activeReceipt.payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-500">PAYMENT REF:</span>
                      <span className="text-zinc-400 select-all">{activeReceipt.payment.payment_reference}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* WHATSAPP CTA FLOW */}
              <div className="pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-black text-center block transition shadow-lg shadow-emerald-500/10"
                >
                  <Phone className="w-3.5 h-3.5 inline-block mr-2" />
                  <span>Send Ticket on WhatsApp</span>
                </a>
                <p className="text-[8px] text-zinc-500 text-center uppercase tracking-wide mt-2">
                  Send details directly to dispatch booking managers to fast-track reconciliation.
                </p>
              </div>
            </motion.section>
          )}

        </div>
      </main>

      {/* Footer credits and diagnostic */}
      <footer className="max-w-7xl mx-auto w-full border-t border-zinc-900 pt-6 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
        <span>© 2026 ONESIDE ENTERTAINMENT GROUP. ALL CONSTITUTIONAL CONTROL CORES SECURED.</span>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${CARSS_Revenue_Server.isOnline() ? "bg-emerald-500" : "bg-amber-500"}`} />
            {CARSS_Revenue_Server.isOnline() ? "Supabase live bounds connected" : "Supabase Offline - local memory safety active"}
          </span>
          <span>Station: 0xEE4B</span>
        </div>
      </footer>
    </div>
  );
}
