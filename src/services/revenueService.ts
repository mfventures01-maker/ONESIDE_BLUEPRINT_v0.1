/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CARSS_Operations_Server } from "./operationService";
import { ConstitutionalAuditService } from "./auditService";
import { MenuRepository } from "../repositories/MenuRepository";
import { InventoryRepository } from "../repositories/InventoryRepository";
import { BookingRepository } from "../repositories/BookingRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { toUUID } from "../lib/supabaseClient";
import {
  MenuCategory,
  MenuItem,
  InventoryItem,
  PricingRule,
  Promotion,
  Reservation,
  PaymentIntention,
  PaymentDispute,
  PaymentAudit,
  ThemeType,
  ThemeConfig
} from "../types";

// --- PRE-DETERMINED CONSTITUTIONAL THEME CONFIGURATIONS ---
export const EXPERIMENTAL_THEMES: Record<ThemeType, ThemeConfig> = {
  midnight_gold: {
    id: "midnight_gold",
    name: "Midnight Gold",
    bg: "bg-zinc-950",
    cardBg: "bg-zinc-900/80 border-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-50",
    textMuted: "text-amber-200/50",
    primary: "from-amber-600 to-yellow-500",
    accent: "text-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.08)]",
    fontTitle: "font-serif tracking-normal uppercase",
    fontBody: "font-sans",
    buttonClass: "bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold",
    cardClass: "backdrop-blur-md rounded-2xl p-5 border shadow-xl relative transition-all duration-300 hover:border-amber-400/40",
    animationClass: "animate-fade-in",
    tone: "Good evening, honored guest. We present our curated menu of fine refreshments and lounge pastimes. Select your luxury preference."
  },
  executive_black: {
    id: "executive_black",
    name: "Executive Black",
    bg: "bg-neutral-950",
    cardBg: "bg-neutral-900 border-neutral-800",
    border: "border-neutral-800",
    text: "text-white",
    textMuted: "text-neutral-500",
    primary: "from-neutral-100 to-neutral-300",
    accent: "text-white",
    glow: "",
    fontTitle: "font-mono tracking-wider uppercase font-black",
    fontBody: "font-mono text-xs",
    buttonClass: "bg-white hover:bg-neutral-200 text-black font-semibold uppercase",
    cardClass: "rounded-none p-5 border-2 relative transition-all duration-300 hover:border-white",
    animationClass: "transition-transform hover:scale-[1.01]",
    tone: "STATUS: SECURE CONSOLE LOGGED. VERIFIED PORTFOLIO ACTIVE. ACCESS DENIED TO INACTIVE DEPARTMENTS. ALL CREDENTIALS BIND TO RUNTIME ACTIONS."
  },
  afro_luxe: {
    id: "afro_luxe",
    name: "Afro Luxe",
    bg: "bg-stone-950",
    cardBg: "bg-stone-900/90 border-emerald-950",
    border: "border-emerald-900/30",
    text: "text-stone-100",
    textMuted: "text-stone-400",
    primary: "from-emerald-700 to-amber-600",
    accent: "text-amber-500",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    fontTitle: "font-sans tracking-wide uppercase font-black",
    fontBody: "font-sans",
    buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold",
    cardClass: "rounded-3xl p-6 border shadow-2xl relative transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/20",
    animationClass: "duration-300 transition-all",
    tone: "Welcome to ONESIDE. Taste the heat and luxury of our homeland rhythms, crafted fresh by the finest culinary elders. Every bite is legendary."
  },
  sports_arena: {
    id: "sports_arena",
    name: "Sports Arena",
    bg: "bg-slate-950",
    cardBg: "bg-slate-900/60 border-indigo-950",
    border: "border-indigo-500/20",
    text: "text-white",
    textMuted: "text-indigo-200/50",
    primary: "from-indigo-600 to-cyan-500",
    accent: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    fontTitle: "font-sans tracking-tighter uppercase font-black italic",
    fontBody: "font-sans",
    buttonClass: "bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold uppercase italic",
    cardClass: "rounded-xl p-5 border relative transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400 shadow-cyan-900/10",
    animationClass: "transition-transform",
    tone: "GAME ON! Dive into the prime sports action at ONESIDE. Cold drinks, juicy burgers, crisp television, and snooker tables lined for the shot of the century."
  },
  resort_classic: {
    id: "resort_classic",
    name: "Resort Classic",
    bg: "bg-zinc-950",
    cardBg: "bg-zinc-900/40 border-teal-950",
    border: "border-teal-500/15",
    text: "text-teal-50",
    textMuted: "text-teal-300/40",
    primary: "from-teal-600 to-emerald-500",
    accent: "text-teal-400",
    glow: "shadow-2xl shadow-teal-950/20",
    fontTitle: "font-sans tracking-normal uppercase font-semibold",
    fontBody: "font-sans",
    buttonClass: "bg-teal-600 hover:bg-teal-500 text-zinc-950 font-medium tracking-wide",
    cardClass: "rounded-2xl p-6 border backdrop-blur-sm relative transition-all duration-300 hover:shadow-teal-950",
    animationClass: "transition-opacity",
    tone: "Exhale deeply. You are in safe harbor. Refresh with our beachside mocktails and organic garden offerings. Serenity is our rule."
  },
  vip_platinum: {
    id: "vip_platinum",
    name: "VIP Platinum",
    bg: "bg-slate-950",
    cardBg: "bg-slate-900/80 border-slate-700/20",
    border: "border-slate-700/30",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    primary: "from-slate-400 to-slate-200",
    accent: "text-slate-300",
    glow: "shadow-[0_0_25px_rgba(255,255,255,0.05)]",
    fontTitle: "font-sans tracking-widest uppercase font-light",
    fontBody: "font-sans",
    buttonClass: "bg-slate-200 hover:bg-slate-100 text-slate-950 font-semibold tracking-widest",
    cardClass: "rounded-3xl p-6 border backdrop-blur-md relative transition-all duration-500 hover:border-slate-400",
    animationClass: "ease-in-out transition-all",
    tone: "Exclusive Platinum clearance granted. Indulge in premier spirits and unhurried high-class leisure. The peak of entertainment."
  },
  urban_nightlife: {
    id: "urban_nightlife",
    name: "Urban Nightlife",
    bg: "bg-zinc-950",
    cardBg: "bg-zinc-900/70 border-pink-500/15",
    border: "border-pink-500/20",
    text: "text-pink-50",
    textMuted: "text-pink-400/40",
    primary: "from-pink-600 via-fuchsia-600 to-violet-600",
    accent: "text-pink-400",
    glow: "shadow-[0_0_20px_rgba(219,39,119,0.15)]",
    fontTitle: "font-mono tracking-wide uppercase font-bold",
    fontBody: "font-mono text-xs",
    buttonClass: "bg-pink-600 hover:bg-pink-500 text-white font-black uppercase pulse-glow",
    cardClass: "rounded-2xl p-5 border relative transition-all duration-300 hover:shadow-pink-500/10 hover:border-pink-400 shadow-md",
    animationClass: "transition-all duration-200",
    tone: "The night is young and so are we. Pump up the volume with custom neon blends, premium lounge bites, and midnight beats. Energy unlocked."
  }
};

// --- INITIAL ONESIDE DATA SEED (CONSTITUTIONAL CONTENT) ---
const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: "cat-entrees", name: "Gourmet Entrees", description: "Savory slow-cooked mains and chicken specialties", sort_order: 1 },
  { id: "cat-burgers", name: "Burgers & Sandwiches", description: "Succulent gourmet stacks, fresh toppings and house fries", sort_order: 2 },
  { id: "cat-pastapizza", name: "Pizza & Sourdough Pasta", description: "Flown-in pizza and freshly-tossed rigatoni", sort_order: 3 },
  { id: "cat-coffee", name: "Coffee Series", description: "Freshly-pressed single origin Arabica beans", sort_order: 4 },
  { id: "cat-noncoffee", name: "Non-Coffee Brews", description: "Creamy iced blends, matcha lattes, and exotic shakes", sort_order: 5 }
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Gourmet Entrees
  {
    id: "menu-grilled-chicken",
    category_id: "cat-entrees",
    name: "Grilled Chicken",
    description: "Moist, slow-roasted chicken quarter glazed with home-grown spices, served with local pepper sauce.",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b98c6?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["High Protein", "Chef Specialty"],
    status: "active",
    is_popular: true,
    is_featured: false,
    upsell_item_id: "menu-coffee-area",
    upsell_message: "Accompany your delicious chicken with our chilling signature Ice Coffee Area!"
  },
  {
    id: "menu-fried-chicken",
    category_id: "cat-entrees",
    name: "Fried Chicken",
    description: "Deep fried crispy golden coat chicken breast seasoned heavily with constitutional spice blends.",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Crispy", "Popular"],
    status: "active"
  },
  {
    id: "menu-chicken-chips",
    category_id: "cat-entrees",
    name: "Chicken & Chips",
    description: "Rich portion of crispy tavern style French fries paired beautifully with a fried whole chicken piece.",
    price: 7000,
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Bestseller", "Highly Recommended"],
    status: "active",
    is_featured: true,
    recommend_message: "Our customers rate this item 5/5 for game night snacking."
  },

  // Burgers
  {
    id: "menu-cheese-burger",
    category_id: "cat-burgers",
    name: "Cheese Burger",
    description: "Flame-grilled succulent beef patty with melted signature cheddar, local pickles, and master spread on brioche buns.",
    price: 5050,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Classic", "Flavour Bomb"],
    status: "active",
    is_popular: true
  },
  {
    id: "menu-chicken-burger",
    category_id: "cat-burgers",
    name: "Chicken Burger",
    description: "Crispy golden fried chicken breast fillet layered with organic shred butter lettuce and executive garlic sauce.",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Spicy Option"],
    status: "active"
  },
  {
    id: "menu-beef-burger",
    category_id: "cat-burgers",
    name: "Beef Burger",
    description: "Premium double-patty brisket beef blend with fresh romaine lettuce, tomato slice, and rich signature dark glaze.",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Double Meat"],
    status: "active"
  },

  // Pasta / Pizza
  {
    id: "menu-spicy-pasta",
    category_id: "cat-pastapizza",
    name: "Spicy Pasta",
    description: "Rigatoni tossed expertly in a zesty, fiery native chili cayenne tomato reduction and fresh coriander greens.",
    price: 7000,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Fiery", "Local Spices"],
    status: "active",
    is_popular: true
  },
  {
    id: "menu-special-pasta",
    category_id: "cat-pastapizza",
    name: "Special Pasta",
    description: "Penne tossed with slow-cooked aromatic herbs, light whole cream dressing, and succulent grilled chicken strips.",
    price: 6000,
    image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Mild Creamy"],
    status: "active"
  },
  {
    id: "menu-big-pasta",
    category_id: "cat-pastapizza",
    name: "Big Pasta",
    description: "Grand shareable platter of premium spaghetti, rich baseline-infused marinara, and mixed farm-protein chunks.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Shareable Platter", "Epic Edition"],
    status: "active"
  },
  {
    id: "menu-special-pizza",
    category_id: "cat-pastapizza",
    name: "Special Pizza",
    description: "Wood-fired active sourdough crust topped with signature local sausage, minced visual basil and double cheese.",
    price: 7020,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Fresh Sourdough"],
    status: "active",
    is_popular: true
  },
  {
    id: "menu-small-pizza",
    category_id: "cat-pastapizza",
    name: "Small Pizza",
    description: "Cozy personal sized crust loaded with molten premium mozzarella, mountain herbs, and classic beef pepperoni.",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Quick Bite"],
    status: "active"
  },
  {
    id: "menu-big-pizza",
    category_id: "cat-pastapizza",
    name: "Big Pizza",
    description: "Constitutional shareable size dual-layered cheese, shredded smoked farm pork, mushrooms, and sweet olives.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Party Size"],
    status: "active"
  },

  // Coffee
  {
    id: "menu-coffee-area",
    category_id: "cat-coffee",
    name: "Ice Coffee Area",
    description: "Signature cold brewed espresso with velvety heavy sweet milk foam and organic sugar reduction.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Area Favorite", "Sweet Creamy"],
    status: "active",
    is_popular: true,
    is_featured: true,
    recommend_message: "Pair with Big Pizza for the ultimate lounge session refreshment."
  },
  {
    id: "menu-coffee-vanilla",
    category_id: "cat-coffee",
    name: "Ice Coffee Vanilla",
    description: "Double robust espresso shot blended with pasteurized raw milk and exquisite Madagascar vanilla pod juice.",
    price: 17005,
    image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Classic Sweet"],
    status: "active"
  },
  {
    id: "menu-coffee-brown-sugar",
    category_id: "cat-coffee",
    name: "Ice Coffee Brown Sugar",
    description: "Bold dark espresso dripping over slow-caramelized brown sugar cane crystals and whole ice blocks.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Caramelized"],
    status: "active"
  },
  {
    id: "menu-coffee-avocado",
    category_id: "cat-coffee",
    name: "Ice Coffee Avocado",
    description: "Exotic and rich mash of organic buttery Hass avocado, double espresso, and cold sugar milk cloud.",
    price: 17000,
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Exotic Blend", "Creamy Health"],
    status: "active"
  },
  {
    id: "menu-coffee-caramel",
    category_id: "cat-coffee",
    name: "Ice Coffee Caramel",
    description: "Iced double espresso drizzled with homemade roasted salted butterscotch caramel paste.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Sweet Drizzle"],
    status: "active"
  },
  {
    id: "menu-coffee-hot",
    category_id: "cat-coffee",
    name: "Hot Black Coffee",
    description: "Steaming aromatic single-origin organic Arabica, handpressed and served black with a golden crema.",
    price: 12000,
    image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Zero Sugar", "Intense"],
    status: "active"
  },

  // Non-coffee
  {
    id: "menu-red-velvet",
    category_id: "cat-noncoffee",
    name: "Ice Red Velvet",
    description: "Chilled premium dark cocoa cream with dynamic vanilla accents and sweet red-crust cookie crumbles.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1586944210601-3f113f7f985b?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Dessert Brew", "Non-Caffeine"],
    status: "active"
  },
  {
    id: "menu-salted-caramel",
    category_id: "cat-noncoffee",
    name: "Ice Salted Caramel",
    description: "Thick sweet salted butterscotch paste whipped with whole organic milk and poured over shaved crystal ice.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Mineral Sweet"],
    status: "active"
  },
  {
    id: "menu-greentea-latte",
    category_id: "cat-noncoffee",
    name: "Ice Green Tea Latte",
    description: "Ceremonial Uji matcha tea leaves whisked into chilled organic oat milk and raw maple droplets.",
    price: 17000,
    image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Japanese Matcha", "Superfood"],
    status: "active",
    is_popular: true
  },
  {
    id: "menu-strawberry",
    category_id: "cat-noncoffee",
    name: "Ice Strawberry Milk",
    description: "Luscious hand-muddled fresh strawberry syrup layered over frothy cream and raw honey swirl.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Fruit Delight"],
    status: "active"
  },
  {
    id: "menu-chocolate-almond",
    category_id: "cat-noncoffee",
    name: "Ice Chocolate Almond",
    description: "Indulgent cocoa melted with toasted organic almond milk, topped with rich chocolate shavings.",
    price: 17000,
    image_url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Nutty Chocolate"],
    status: "active"
  },
  {
    id: "menu-vanilla-latte",
    category_id: "cat-noncoffee",
    name: "Ice Vanilla Milk",
    description: "Iced pasteurized sweet milk infused with natural pod vanilla extract and a light dash of whipped cream.",
    price: 17000,
    image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400",
    is_available: true,
    tags: ["Velvety Sweet"],
    status: "active"
  }
];

// --- INITIAL INVENTORY STOCK (Dynamic inventory-awareness testing) ---
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv-1", menu_item_id: "menu-grilled-chicken", quantity: 15, min_alert_threshold: 4, location: "Main Cold Deck" },
  { id: "inv-2", menu_item_id: "menu-fried-chicken", quantity: 3, min_alert_threshold: 4, location: "Main Cold Deck" }, // Low availability
  { id: "inv-3", menu_item_id: "menu-chicken-chips", quantity: 0, min_alert_threshold: 5, location: "Hot Pantry B" }, // Out of stock
  { id: "inv-4", menu_item_id: "menu-cheese-burger", quantity: 24, min_alert_threshold: 6, location: "Bakery Deck" },
  { id: "inv-5", menu_item_id: "menu-chicken-burger", quantity: 18, min_alert_threshold: 4, location: "Meat Preparation Deck" },
  { id: "inv-6", menu_item_id: "menu-beef-burger", quantity: 35, min_alert_threshold: 5, location: "Bakery Deck" },
  { id: "inv-7", menu_item_id: "menu-spicy-pasta", quantity: 2, min_alert_threshold: 5, location: "Pasta Pantry" }, // Low
  { id: "inv-8", menu_item_id: "menu-special-pasta", quantity: 12, min_alert_threshold: 5, location: "Pasta Pantry" },
  { id: "inv-9", menu_item_id: "menu-big-pasta", quantity: 11, min_alert_threshold: 3, location: "Pasta Pantry" },
  { id: "inv-10", menu_item_id: "menu-special-pizza", quantity: 8, min_alert_threshold: 3, location: "Pizza Oven Counter" },
  { id: "inv-11", menu_item_id: "menu-small-pizza", quantity: 0, min_alert_threshold: 3, location: "Pizza Oven Counter" }, // Out of stock
  { id: "inv-12", menu_item_id: "menu-big-pizza", quantity: 14, min_alert_threshold: 5, location: "Pizza Oven Counter" },
  { id: "inv-13", menu_item_id: "menu-coffee-area", quantity: 50, min_alert_threshold: 10, location: "Barista Counter A" },
  { id: "inv-14", menu_item_id: "menu-coffee-vanilla", quantity: 22, min_alert_threshold: 5, location: "Barista Counter A" },
  { id: "inv-15", menu_item_id: "menu-coffee-brown-sugar", quantity: 45, min_alert_threshold: 8, location: "Barista Counter A" },
  { id: "inv-16", menu_item_id: "menu-coffee-avocado", quantity: 2, min_alert_threshold: 3, location: "Fruit Cooler" }, // Low
  { id: "inv-17", menu_item_id: "menu-coffee-caramel", quantity: 30, min_alert_threshold: 5, location: "Barista Counter A" },
  { id: "inv-18", menu_item_id: "menu-coffee-hot", quantity: 100, min_alert_threshold: 10, location: "Barista Counter A" },
  { id: "inv-19", menu_item_id: "menu-red-velvet", quantity: 40, min_alert_threshold: 5, location: "Dry Pastry Cooler" },
  { id: "inv-20", menu_item_id: "menu-salted-caramel", quantity: 38, min_alert_threshold: 5, location: "Barista Counter A" },
  { id: "inv-21", menu_item_id: "menu-greentea-latte", quantity: 25, min_alert_threshold: 5, location: "Dry Pastry Cooler" },
  { id: "inv-22", menu_item_id: "menu-strawberry", quantity: 1, min_alert_threshold: 5, location: "Fruit Cooler" }, // Low
  { id: "inv-23", menu_item_id: "menu-chocolate-almond", quantity: 8, min_alert_threshold: 4, location: "Barista Counter A" },
  { id: "inv-24", menu_item_id: "menu-vanilla-latte", quantity: 14, min_alert_threshold: 4, location: "Barista Counter A" }
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-all-5",
    title: "Sourdough & Coffee Combo Offer",
    description: "Get 5% off automatically calculated on all cart additions during current shift.",
    badge_text: "5% Off All Orders",
    is_active: true
  },
  {
    id: "promo-snooker-vip",
    title: "Constitutional VIP Pass",
    description: "Pre-book Snooker table with VIP lounge access to claim 1 free Ice Coffee Area.",
    badge_text: "Happy hour promo",
    is_active: true,
    target_menu_item_id: "menu-coffee-area"
  }
];

// LocalStorage helpers to simulate database operations on the client
const getLocalStorageData = <T>(key: string, initialData: T): T => {
  const file = localStorage.getItem(key);
  if (!file) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(file);
  } catch (e) {
    return initialData;
  }
};

const setLocalStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Unified Database Service Object
export const CARSS_Revenue_Server = {
  // State detection
  isOnline: (): boolean => {
    return MenuRepository.isOnline();
  },

  // 1. Theme Configuration Storage
  async getSavedTheme(): Promise<ThemeType> {
    const res = await MenuRepository.getSavedTheme();
    return res.success && res.data ? res.data : "midnight_gold";
  },

  async saveTheme(theme: ThemeType): Promise<void> {
    await MenuRepository.saveTheme(theme);
    setLocalStorageData("carss_active_theme", theme);
  },

  // 2. categories fetching
  async getCategories(): Promise<MenuCategory[]> {
    const res = await MenuRepository.getCategories();
    return res.success && res.data ? res.data : INITIAL_CATEGORIES;
  },

  // 3. menu items fetching with inventory attachment
  async getMenuItems(): Promise<MenuItem[]> {
    const res = await MenuRepository.getMenuItems();
    return res.success && res.data ? res.data : INITIAL_MENU_ITEMS;
  },

  // 4. inventory retrieval
  async getInventory(): Promise<InventoryItem[]> {
    const res = await InventoryRepository.getInventory();
    return res.success && res.data ? res.data : [];
  },

  // 5. Deduct inventory item upon cart purchase/reservation creation
  async updateItemInventory(menuItemId: string, amountToDeduct: number): Promise<void> {
    const res = await InventoryRepository.deductInventory(menuItemId, amountToDeduct);
    if (res.success) {
      // Invoke Wave-3 Compliance operational inventory engine & audit trail
      const invData = await this.getInventory();
      const item = invData.find((i) => i.menu_item_id === menuItemId);
      if (item) {
        CARSS_Operations_Server.addInventoryMovement(
          item.id,
          -amountToDeduct,
          "consumption",
          `Automated reservation checkout deduction`,
          "customer-guest",
          "customer"
        );
        CARSS_Operations_Server.emitAudit({
          operator_id: "customer-guest",
          role: "customer",
          action: "automatic_inventory_consumption",
          resource: `inventory_item:${item.id}`
        });
      }
    }
  },

  // Restock item
  async restockItemInventory(menuItemId: string, amountToAdd: number): Promise<void> {
    const res = await InventoryRepository.restockInventory(menuItemId, amountToAdd);
    if (res.success) {
      const invData = await this.getInventory();
      const item = invData.find((i) => i.menu_item_id === menuItemId);
      if (item) {
        CARSS_Operations_Server.addInventoryMovement(
          item.id,
          amountToAdd,
          "stock_in",
          `Staff replenishment of menu item`,
          "active-staff-member",
          "staff"
        );
        CARSS_Operations_Server.emitAudit({
          operator_id: "active-staff-member",
          role: "staff",
          action: "inventory_restock",
          resource: `inventory_item:${item.id}`
        });
      }
    }
  },

  // Record inventory movement log
  async logMovement(invItemId: string, change: number, type: "sale" | "restock" | "waste" | "reconciliation", notes: string): Promise<void> {
    await InventoryRepository.recordMovement(invItemId, change, type, notes);
  },

  // 6. Promotions fetching
  async getPromotions(): Promise<Promotion[]> {
    const res = await MenuRepository.getPromotions();
    return res.success && res.data ? res.data : [];
  },

  // 7. Booking / Reservation placing
  async getReservations(): Promise<Reservation[]> {
    const res = await BookingRepository.getBookings();
    return res.success && res.data ? res.data : [];
  },

  async placeReservation(res: Omit<Reservation, "id" | "ticket_code" | "status" | "created_at">): Promise<Reservation> {
    const nextId = `res-${Date.now()}`;
    const code = `ONS-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullReservation: Reservation = {
      ...res,
      id: nextId,
      status: "confirmed", // Automatically auto-approve reservations for high friction conversion
      ticket_code: code,
      created_at: new Date().toISOString()
    };

    // Delegate creation entirely to the constitutional BookingRepository
    const saveRes = await BookingRepository.createBooking(fullReservation);
    const savedReservation = saveRes.success && saveRes.data ? saveRes.data : fullReservation;

    await ConstitutionalAuditService.emitEvent({
      event_type: "place_reservation",
      event_category: "Reservations",
      actor_id: "customer-guest",
      actor_role: "staff",
      resource_type: "reservation",
      resource_id: savedReservation.id,
      resource_name: `Reservation Voucher for [${savedReservation.customer_name}]`,
      before_state: "{}",
      after_state: JSON.stringify(savedReservation),
      notes: `Guest logged reservation of type ${savedReservation.reservation_type} for ${savedReservation.quantity_people} people. Confirmed Code: ${savedReservation.ticket_code}`,
      source_module: "revenue",
      session_id: `session-rev-${Date.now()}`,
      shift_id: ""
    });

    return savedReservation;
  },

  async updateReservationStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<void> {
    // Delegate state transition and write entirely to constitutional BookingRepository
    await BookingRepository.updateBookingStatus(id, status);
  },

  // 8. Payment Intercepts / Intention Loggers
  async getPaymentIntentions(): Promise<PaymentIntention[]> {
    const res = await PaymentRepository.getPaymentIntents();
    return res.success && res.data ? res.data : [];
  },

  async generatePaymentIntention(intent: Omit<PaymentIntention, "id" | "payment_reference" | "status" | "created_at">): Promise<PaymentIntention> {
    const nextId = `pay-${Date.now()}`;
    const ref = `TX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const fullIntention: PaymentIntention = {
      ...intent,
      id: nextId,
      payment_reference: ref,
      status: "pending",
      created_at: new Date().toISOString()
    };

    await PaymentRepository.createPaymentIntent(fullIntention);

    await ConstitutionalAuditService.emitEvent({
      event_type: "generate_payment_intent",
      event_category: "Payments",
      actor_id: "customer-guest",
      actor_role: "staff",
      resource_type: "payment",
      resource_id: fullIntention.id,
      resource_name: `Payment Intent [${fullIntention.payment_reference}]`,
      before_state: "{}",
      after_state: JSON.stringify(fullIntention),
      notes: `Initiated reservation checkout invoice payment intentions of ₦${fullIntention.amount.toLocaleString()} via ${fullIntention.payment_method.toUpperCase()}`,
      source_module: "revenue",
      session_id: `session-rev-${Date.now()}`,
      shift_id: fullIntention.shift_id || ""
    });

    return fullIntention;
  },

  async reconcilePaymentIntention(id: string, notes: string): Promise<void> {
    const listRes = await this.getPaymentIntentions();
    const oldIntention = listRes.find((item) => item.id === id);

    await PaymentRepository.updatePaymentIntentStatus(id, {
      status: "reconciled",
      reconciliation_notes: notes
    });

    if (oldIntention) {
      const act: PaymentIntention = oldIntention;
      const paymentId = `payment-${id}`;
      
      await PaymentRepository.recordPayment({
        id: toUUID(paymentId),
        business_id: toUUID("biz-1"),
        customer_id: toUUID("customer-dummy"),
        amount_ngn: Math.floor(act.amount),
        amount: act.amount,
        method: act.payment_method,
        status: "verified",
        reference: act.payment_reference,
        note: notes,
        created_by: toUUID("customer-dummy"),
        verified_by: toUUID("active-manager-sim"),
        verified_at: new Date().toISOString(),
        branch_id: toUUID("branch-1"),
        org_id: toUUID("org-1"),
        order_id: act.reservation_id ? toUUID(act.reservation_id) : toUUID("reservation-dummy"),
        booking_id: act.reservation_id ? toUUID(act.reservation_id) : toUUID("reservation-dummy"),
        created_at: act.created_at,
        updated_at: new Date().toISOString()
      });

      // All audit events must terminate in payment_audit
      await PaymentRepository.recordPaymentAudit({
        id: toUUID(`audit-payment-${id}`),
        business_id: toUUID("biz-1"),
        payment_id: toUUID(paymentId),
        branch_id: toUUID("branch-1"),
        action: "reconcile",
        actor_user_id: toUUID("active-manager-sim"),
        note: notes,
        meta: { payment_reference: act.payment_reference, amount: act.amount, reconciled_at: new Date().toISOString() }
      });

      await ConstitutionalAuditService.emitEvent({
        event_type: "reconcile_payment_intent",
        event_category: "Payments",
        actor_id: "active-manager-sim",
        actor_role: "manager",
        resource_type: "payment",
        resource_id: id,
        resource_name: `Payment Intent [${act.payment_reference}]`,
        before_state: JSON.stringify(act),
        after_state: JSON.stringify({ ...act, status: "reconciled" }),
        notes: `Reconciled booking checkout payment voucher manually. Reconciliation Memo: "${notes}"`,
        source_module: "revenue",
        session_id: `session-ops-${Date.now()}`,
        shift_id: act.shift_id || ""
      });
    }
  },

  async getPaymentDisputes(): Promise<PaymentDispute[]> {
    const res = await PaymentRepository.getPaymentDisputes();
    return res.success && res.data ? res.data : [];
  },

  async createPaymentDispute(paymentId: string, reason: string): Promise<void> {
    const id = `disp-${Date.now()}`;
    const dispute: PaymentDispute = {
      id: id,
      business_id: "biz-1",
      branch_id: "branch-1",
      payment_id: paymentId,
      dispute_reason: reason,
      status: "open",
      opened_by: "active-manager-sim",
      created_at: new Date().toISOString()
    };

    await PaymentRepository.createPaymentDispute(dispute);

    await ConstitutionalAuditService.emitEvent({
      event_type: "create_payment_dispute",
      event_category: "Payments",
      actor_id: "active-manager-sim",
      actor_role: "manager",
      resource_type: "payment",
      resource_id: paymentId,
      resource_name: `Payment Dispute [${id}]`,
      before_state: "{}",
      after_state: JSON.stringify(dispute),
      notes: `Opened dispute for payment ID ${paymentId}. Reason: "${reason}"`,
      source_module: "revenue",
      session_id: `session-ops-${Date.now()}`,
      shift_id: ""
    });
  },

  async resolvePaymentDispute(id: string, notes: string): Promise<void> {
    const currentDisputes = await this.getPaymentDisputes();
    const oldDispute = currentDisputes.find((item) => item.id === id);

    await PaymentRepository.resolvePaymentDispute(id, notes);

    if (oldDispute) {
      const activeDisp: PaymentDispute = oldDispute;
      await ConstitutionalAuditService.emitEvent({
        event_type: "resolve_payment_dispute",
        event_category: "Payments",
        actor_id: "active-manager-sim",
        actor_role: "manager",
        resource_type: "payment",
        resource_id: id,
        resource_name: `Payment Dispute [${id}]`,
        before_state: JSON.stringify(activeDisp),
        after_state: JSON.stringify({ ...activeDisp, status: "resolved", resolution_note: notes }),
        notes: `Resolved payment dispute manually. Resolution Note: "${notes}"`,
        source_module: "revenue",
        session_id: `session-ops-${Date.now()}`,
        shift_id: ""
      });
    }
  },

  // Generate a complete instruction SQL file script that the user can run in Supabase directly
  getBootstrapSQL(): string {
    return `-- CARSS REVENUE TERRITORY CONSTITUTIONAL SQL BLUEPRINT
-- Copy and execute this code in your Supabase SQL Editor (https://supabase.com)

-- Create Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 1
);

-- Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  status TEXT DEFAULT 'active',
  is_popular BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  upsell_item_id TEXT,
  upsell_message TEXT,
  recommend_message TEXT
);

-- Create Constitutional Inventory Table (Certified Table under Wave 5 Constitution)
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  business_id TEXT,
  branch_id TEXT,
  department_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  current_stock INT NOT NULL DEFAULT 0,
  unit TEXT,
  category TEXT,
  cost_price NUMERIC,
  min_stock INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Inventory Movements log Table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  movement_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  badge_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  target_menu_item_id TEXT
);

-- Create Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  reservation_type TEXT NOT NULL,
  quantity_people INT NOT NULL,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  ticket_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payment Intents Table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY,
  order_id UUID,
  org_id UUID,
  branch_id UUID,
  staff_id UUID,
  shift_id UUID,
  expected_amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  external_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejected_by UUID,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  approval_status TEXT DEFAULT 'pending'
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount_ngn BIGINT,
  amount NUMERIC,
  method TEXT,
  status TEXT,
  reference TEXT UNIQUE,
  evidence_url TEXT,
  note TEXT,
  created_by UUID,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  reversed_by UUID,
  reversed_at TIMESTAMPTZ,
  reversal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  org_id UUID,
  order_id UUID,
  booking_id UUID,
  provider TEXT
);

-- Create Payment Audit Table
CREATE TABLE IF NOT EXISTS payment_audit (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_user_id UUID,
  note TEXT,
  meta JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Payment Disputes Table
CREATE TABLE IF NOT EXISTS payment_disputes (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  opened_by UUID,
  resolved_by UUID,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Create Theme Settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed Initial Categories
INSERT INTO menu_categories (id, name, description, sort_order) VALUES
('cat-entrees', 'Gourmet Entrees', 'Savory slow-cooked mains and chicken specialties', 1),
('cat-burgers', 'Burgers & Sandwiches', 'Succulent gourmet stacks, fresh toppings and house fries', 2),
('cat-pastapizza', 'Pizza & Sourdough Pasta', 'Flown-in pizza and freshly-tossed rigatoni', 3),
('cat-coffee', 'Coffee Series', 'Freshly-pressed single origin Arabica beans', 4),
('cat-noncoffee', 'Non-Coffee Brews', 'Creamy iced blends, matcha lattes, and exotic shakes', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, tags, status, is_popular, is_featured, upsell_item_id, upsell_message) VALUES
('menu-grilled-chicken', 'cat-entrees', 'Grilled Chicken', 'Moist, slow-roasted chicken quarter glazed with home-grown spices, served with local pepper sauce.', 5000, 'https://images.unsplash.com/photo-1598103442097-8b74394b98c6?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['High Protein', 'Chef Specialty'], 'active', TRUE, FALSE, 'menu-coffee-area', 'Accompany your delicious chicken with our chilling signature Ice Coffee Area!'),
('menu-chicken-chips', 'cat-entrees', 'Chicken & Chips', 'Rich portion of crispy tavern style French fries paired beautifully with a fried whole chicken piece.', 7000, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['Bestseller', 'Highly Recommended'], 'active', FALSE, TRUE, NULL, NULL),
('menu-coffee-area', 'cat-coffee', 'Ice Coffee Area', 'Signature cold brewed espresso with velvety heavy sweet milk foam and organic sugar reduction.', 15000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400', TRUE, ARRAY['Area Favorite', 'Sweet Creamy'], 'active', TRUE, TRUE, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Inventory for items
INSERT INTO inventory (id, name, description, sku, current_stock, min_stock, category, unit) VALUES
('inv-1', 'Grilled Chicken Stock', 'Main Cold Deck', 'menu-grilled-chicken', 15, 4, 'Entree', 'pcs'),
('inv-3', 'Chicken & Chips Stock', 'Hot Pantry B', 'menu-chicken-chips', 0, 5, 'Entree', 'pcs'),
('inv-13', 'Ice Coffee Area Stock', 'Barista Counter A', 'menu-coffee-area', 50, 10, 'Beverage', 'pcs')
ON CONFLICT (id) DO NOTHING;

-- Seed Theme Settings
INSERT INTO theme_settings (key, value) VALUES
('active_theme', 'midnight_gold')
ON CONFLICT (key) DO NOTHING;
`;
  }
};
