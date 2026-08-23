/**
 * FILE: lib/mock.ts
 * Static/seed demo data (products, vehicles, shops, categories, etc.) used in place of a real backend. Edit this file to change what products/shops/content show up in the app.
 */
// Local image assets (bundled with the app, referenced via require so Metro
// packages them). `Product.image` etc. are typed as ImageSourcePropType-
// compatible numbers returned by require(), consumed directly by <Image source={...}>.
/* eslint-disable @typescript-eslint/no-var-requires */
const brake = require("../assets/images/part-brake.jpg");
const tyre = require("../assets/images/part-tyre.jpg");
const battery = require("../assets/images/part-battery.jpg");
const oil = require("../assets/images/part-oil.jpg");

export type Product = {
  id: string;
  name: string;
  image: any; // require() asset
  price: number;
  oldPrice?: number;
  condition: "New" | "Used" | "OEM" | "Aftermarket";
  fitment: string;
  rating: number;
  reviews: number;
  vendor: string;
  delivery: string;
  grade?: "A" | "B" | "C";
  prime?: boolean;
  sold?: number;
  badge?: string;
};

export const products: Product[] = [
  { id: "p1", name: "Brembo Front Brake Disc Set — Ventilated", image: brake, price: 849, oldPrice: 1050, condition: "OEM", fitment: "Toyota Land Cruiser 2018-2024", rating: 4.8, reviews: 1284, vendor: "Brembo Official Store", delivery: "Tomorrow", prime: true, sold: 1200, badge: "Best Seller" },
  { id: "p2", name: "Michelin Pilot Sport 4 — 245/40 R19 Tyre", image: tyre, price: 1290, condition: "New", fitment: "BMW 5 Series 2019-2024", rating: 4.9, reviews: 2310, vendor: "Tyre Plus Dubai", delivery: "2-4 hours", prime: true, sold: 3400, badge: "Choice" },
  { id: "p3", name: "ACDelco AGM Battery 80Ah Maintenance-Free", image: battery, price: 520, oldPrice: 640, condition: "New", fitment: "Nissan Patrol 2017-2024", rating: 4.7, reviews: 642, vendor: "BatteryHub UAE", delivery: "Today", prime: true, sold: 890, badge: "Deal" },
  { id: "p4", name: "Mobil 1 Full Synthetic 5W-30 Engine Oil (5L)", image: oil, price: 189, condition: "New", fitment: "Most modern sedans", rating: 4.9, reviews: 4011, vendor: "ENOC Auto", delivery: "Tomorrow", prime: true, sold: 6500 },
  { id: "p5", name: "Used OEM Alternator — Grade A Tested", image: brake, price: 320, oldPrice: 780, condition: "Used", fitment: "Toyota Land Cruiser 2018-2024", rating: 4.4, reviews: 87, vendor: "Sharjah Used Parts", delivery: "3 days", grade: "A", sold: 120 },
  { id: "p6", name: "Bridgestone Turanza T005 — 225/55 R17", image: tyre, price: 720, condition: "Aftermarket", fitment: "Toyota Camry 2018-2024", rating: 4.6, reviews: 942, vendor: "Tyre Plus Dubai", delivery: "Tomorrow", prime: true, sold: 540 },
  { id: "p7", name: "Bosch Iridium Spark Plugs — Set of 6", image: oil, price: 145, oldPrice: 210, condition: "OEM", fitment: "Nissan Patrol 2017-2024", rating: 4.8, reviews: 512, vendor: "Bosch Auto Hub", delivery: "Tomorrow", prime: true, sold: 230, badge: "New" },
  { id: "p8", name: "K&N High-Flow Air Filter — Performance", image: oil, price: 260, condition: "Aftermarket", fitment: "Ford Mustang 2015-2023", rating: 4.7, reviews: 188, vendor: "Performance UAE", delivery: "2 days", prime: true, sold: 95, badge: "New" },
  { id: "p9", name: "Denso Iridium Long-Life Spark Plug", image: battery, price: 38, condition: "OEM", fitment: "Toyota Camry 2018-2024", rating: 4.9, reviews: 8120, vendor: "Denso Official", delivery: "Today", prime: true, sold: 12400, badge: "#1 Best Seller" },
  { id: "p10", name: "Castrol EDGE 0W-40 Full Synthetic (4L)", image: oil, price: 215, oldPrice: 280, condition: "New", fitment: "All petrol engines", rating: 4.8, reviews: 5230, vendor: "Castrol Store", delivery: "Tomorrow", prime: true, sold: 9800, badge: "Trending" },
  { id: "p11", name: "Pirelli P Zero — 255/35 R20 Performance Tyre", image: tyre, price: 1650, condition: "New", fitment: "Mercedes E-Class 2020-2024", rating: 4.9, reviews: 1102, vendor: "Pirelli Dubai", delivery: "Tomorrow", prime: true, sold: 420, badge: "Trending" },
  { id: "p12", name: "Philips X-tremeUltinon LED Headlight H7", image: battery, price: 480, oldPrice: 620, condition: "Aftermarket", fitment: "Universal", rating: 4.6, reviews: 2840, vendor: "Philips Auto", delivery: "Tomorrow", prime: true, sold: 3200, badge: "Trending" },
];

export type Shop = {
  id: string;
  name: string;
  logo: any; // require() asset
  rating: number;
  reviews: number;
  products: number;
  location: string;
  badge?: string;
  tint: string;
  distanceKm?: number;
  hours?: { day: string; open: string; close: string; closed?: boolean }[];
  /** IDs referencing entries in `services` or `premiumFeatures` — used to link
   *  the shop profile to bookable services on /features. */
  serviceIds?: string[];
  deliveryRadiusKm?: number;
  deliveryFee?: string;
  ratingBreakdown?: { 5: number; 4: number; 3: number; 2: number; 1: number };
};


const stdHours = [
  { day: "Mon", open: "08:00", close: "22:00" },
  { day: "Tue", open: "08:00", close: "22:00" },
  { day: "Wed", open: "08:00", close: "22:00" },
  { day: "Thu", open: "08:00", close: "22:00" },
  { day: "Fri", open: "14:00", close: "22:00" },
  { day: "Sat", open: "08:00", close: "22:00" },
  { day: "Sun", open: "09:00", close: "20:00" },
];

export const bestShops: Shop[] = [
  { id: "s1", name: "Brembo Brake Centre", logo: brake, rating: 4.9, reviews: 12450, products: 320, location: "Dubai", badge: "Top Rated", tint: "from-deal/90 to-accent/80", distanceKm: 3.2,
    hours: stdHours, serviceIds: ["brake", "inspect", "recovery"], deliveryRadiusKm: 40, deliveryFee: "Free over AED 200",
    ratingBreakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 } },
  { id: "s2", name: "Tyre Plus Workshop", logo: tyre, rating: 4.8, reviews: 9820, products: 540, location: "Al Quoz", badge: "Premium", tint: "from-primary to-primary/80", distanceKm: 5.8,
    hours: stdHours, serviceIds: ["tyres", "wash", "inspect"], deliveryRadiusKm: 30, deliveryFee: "Free within 15km",
    ratingBreakdown: { 5: 78, 4: 15, 3: 5, 2: 1, 1: 1 } },
  { id: "s3", name: "BatteryHub Service", logo: battery, rating: 4.7, reviews: 6210, products: 180, location: "Sharjah", tint: "from-success/90 to-brand/80", distanceKm: 18.4,
    hours: stdHours, serviceIds: ["battery", "recovery", "inspect"], deliveryRadiusKm: 25, deliveryFee: "AED 20 flat",
    ratingBreakdown: { 5: 74, 4: 18, 3: 5, 2: 2, 1: 1 } },
  { id: "s4", name: "ENOC Auto Care", logo: oil, rating: 4.9, reviews: 18230, products: 1200, location: "UAE wide", badge: "Verified", tint: "from-accent/90 to-warning/80", distanceKm: 2.1,
    hours: [...stdHours.slice(0,6), { day: "Sun", open: "00:00", close: "23:59" }], serviceIds: ["oil", "wash", "ac", "inspect", "recovery"], deliveryRadiusKm: 60, deliveryFee: "Free UAE-wide",
    ratingBreakdown: { 5: 86, 4: 10, 3: 3, 2: 1, 1: 0 } },
  { id: "s5", name: "Bosch Diagnostics Hub", logo: oil, rating: 4.8, reviews: 7540, products: 460, location: "Dubai", tint: "from-brand/90 to-primary/80", distanceKm: 7.6,
    hours: stdHours, serviceIds: ["inspect", "ac", "brake"], deliveryRadiusKm: 35, deliveryFee: "Free over AED 150",
    ratingBreakdown: { 5: 80, 4: 13, 3: 4, 2: 2, 1: 1 } },
  { id: "s6", name: "Denso AC & Detailing", logo: battery, rating: 4.9, reviews: 15300, products: 280, location: "Abu Dhabi", badge: "OEM", tint: "from-deal/90 to-primary/80", distanceKm: 42.5,
    hours: stdHours, serviceIds: ["ac", "detail", "wash"], deliveryRadiusKm: 50, deliveryFee: "Free over AED 300",
    ratingBreakdown: { 5: 85, 4: 11, 3: 3, 2: 1, 1: 0 } },
];

/** Resolve a service ID to a display record from either `services` or `premiumFeatures`. */
export function getServiceById(id: string): { id: string; name: string; from?: number; eta?: string; icon?: string } | undefined {
  const s = services.find((x) => x.id === id);
  if (s) return s;
  const p = premiumFeatures.find((x) => x.id === id);
  if (p) return { id: p.id, name: p.name, from: p.from, eta: p.eta, icon: p.icon };
  return undefined;
}

export function getShopServices(shop: Pick<Shop, "serviceIds">) {
  return (shop.serviceIds ?? []).map((id) => getServiceById(id)).filter(Boolean) as Array<{ id: string; name: string; from?: number; eta?: string; icon?: string }>;
}




export type Category = {
  id: string;
  name: string;
  icon: string;
  image: any; // require() asset
  tint: string;
  subcategories: { id: string; name: string; icon: string }[];
};

// Full 19-category taxonomy
export const categories: Category[] = [
  {
    id: "engine", name: "Engine Parts", icon: "Cog", image: oil, tint: "bg-brand-soft text-brand",
    subcategories: [
      { id: "oil-filter", name: "Oil Filters", icon: "Filter" },
      { id: "air-filter", name: "Air Filters", icon: "Wind" },
      { id: "fuel-filter", name: "Fuel Filters", icon: "Fuel" },
      { id: "cabin-filter", name: "Cabin Filters", icon: "Filter" },
      { id: "spark", name: "Spark Plugs", icon: "Zap" },
      { id: "coils", name: "Ignition Coils", icon: "Zap" },
      { id: "gaskets", name: "Gaskets", icon: "Square" },
      { id: "pistons", name: "Pistons", icon: "Circle" },
      { id: "crankshaft", name: "Crankshaft", icon: "RotateCw" },
      { id: "camshaft", name: "Camshaft", icon: "RotateCw" },
      { id: "timing-belt", name: "Timing Belt", icon: "Cable" },
      { id: "timing-chain", name: "Timing Chain", icon: "Link" },
      { id: "turbo", name: "Turbocharger", icon: "Wind" },
      { id: "mounts", name: "Engine Mounts", icon: "Anchor" },
      { id: "water-pump", name: "Water Pump", icon: "Droplets" },
      { id: "radiator", name: "Radiator", icon: "Grid3x3" },
      { id: "thermostat", name: "Thermostat", icon: "Thermometer" },
      { id: "hoses", name: "Cooling Hoses", icon: "Cable" },
    ],
  },
  {
    id: "brakes", name: "Brake System", icon: "Disc3", image: brake, tint: "bg-deal-soft text-deal",
    subcategories: [
      { id: "pads", name: "Brake Pads", icon: "Disc3" },
      { id: "rotors", name: "Brake Discs / Rotors", icon: "Circle" },
      { id: "shoes", name: "Brake Shoes", icon: "Footprints" },
      { id: "calipers", name: "Brake Calipers", icon: "Grip" },
      { id: "master-cyl", name: "Master Cylinder", icon: "Cylinder" },
      { id: "fluid", name: "Brake Fluid", icon: "Droplets" },
      { id: "abs", name: "ABS Sensors", icon: "Activity" },
      { id: "lines", name: "Brake Lines", icon: "Cable" },
    ],
  },
  {
    id: "suspension", name: "Suspension & Steering", icon: "Activity", image: brake, tint: "bg-secondary text-primary",
    subcategories: [
      { id: "shocks", name: "Shock Absorbers", icon: "Activity" },
      { id: "struts", name: "Struts", icon: "Minus" },
      { id: "springs", name: "Coil Springs", icon: "Waves" },
      { id: "control-arms", name: "Control Arms", icon: "Move" },
      { id: "ball-joints", name: "Ball Joints", icon: "Circle" },
      { id: "tie-rods", name: "Tie Rod Ends", icon: "Link" },
      { id: "rack", name: "Steering Rack", icon: "Grip" },
      { id: "bushings", name: "Bushings", icon: "CircleDot" },
      { id: "stab-links", name: "Stabilizer Links", icon: "Link2" },
    ],
  },
  {
    id: "transmission", name: "Transmission", icon: "Settings", image: oil, tint: "bg-accent-soft text-accent",
    subcategories: [
      { id: "clutch", name: "Clutch Kit", icon: "Disc3" },
      { id: "flywheel", name: "Flywheel", icon: "Circle" },
      { id: "gearbox", name: "Gearbox Parts", icon: "Settings" },
      { id: "cv", name: "CV Joints", icon: "Link" },
      { id: "drive-shaft", name: "Drive Shafts", icon: "Minus" },
      { id: "diff", name: "Differential Parts", icon: "GitFork" },
      { id: "trans-mounts", name: "Transmission Mounts", icon: "Anchor" },
      { id: "atf", name: "ATF Oil", icon: "Container" },
    ],
  },
  {
    id: "electrical", name: "Electrical", icon: "Zap", image: battery, tint: "bg-success-soft text-success",
    subcategories: [
      { id: "batt", name: "Batteries", icon: "BatteryCharging" },
      { id: "alt", name: "Alternators", icon: "Zap" },
      { id: "starter", name: "Starter Motors", icon: "Power" },
      { id: "relays", name: "Relays", icon: "ToggleRight" },
      { id: "fuses", name: "Fuses", icon: "Plug" },
      { id: "sensors", name: "Sensors", icon: "Radar" },
      { id: "harness", name: "Wiring Harness", icon: "Cable" },
      { id: "ecu", name: "ECU", icon: "Cpu" },
    ],
  },
  {
    id: "lighting", name: "Lighting", icon: "Lightbulb", image: battery, tint: "bg-gold-soft text-gold",
    subcategories: [
      { id: "head", name: "Headlights", icon: "Sun" },
      { id: "tail", name: "Tail Lights", icon: "Lightbulb" },
      { id: "fog", name: "Fog Lamps", icon: "Cloud" },
      { id: "led", name: "LED Bulbs", icon: "Lightbulb" },
      { id: "indicators", name: "Indicators", icon: "ArrowRight" },
      { id: "interior", name: "Interior Lights", icon: "Sun" },
      { id: "drl", name: "DRL Kits", icon: "Sparkles" },
    ],
  },
  {
    id: "ac", name: "AC Parts", icon: "Snowflake", image: oil, tint: "bg-brand-soft text-brand",
    subcategories: [
      { id: "compressor", name: "AC Compressor", icon: "Cog" },
      { id: "condenser", name: "Condenser", icon: "Grid3x3" },
      { id: "evap", name: "Evaporator", icon: "Snowflake" },
      { id: "blower", name: "Blower Motor", icon: "Fan" },
      { id: "gas", name: "AC Gas", icon: "Container" },
      { id: "cabin", name: "Cabin Filter", icon: "Filter" },
      { id: "ac-sensors", name: "AC Sensors", icon: "Radar" },
    ],
  },
  {
    id: "body", name: "Body Parts", icon: "CarFront", image: brake, tint: "bg-deal-soft text-deal",
    subcategories: [
      { id: "bumper", name: "Bumpers", icon: "Minus" },
      { id: "hood", name: "Bonnet / Hood", icon: "Square" },
      { id: "fender", name: "Fender", icon: "Shield" },
      { id: "doors", name: "Doors", icon: "DoorOpen" },
      { id: "mirrors", name: "Side Mirrors", icon: "Square" },
      { id: "grille", name: "Grille", icon: "Grid3x3" },
      { id: "roof", name: "Roof Parts", icon: "Triangle" },
      { id: "trunk", name: "Trunk Parts", icon: "Package" },
    ],
  },
  {
    id: "interior", name: "Interior Parts", icon: "Armchair", image: oil, tint: "bg-gold-soft text-gold",
    subcategories: [
      { id: "dash", name: "Dashboard", icon: "LayoutDashboard" },
      { id: "steering", name: "Steering Wheel", icon: "CircleDot" },
      { id: "seats", name: "Seat Covers", icon: "Armchair" },
      { id: "mats", name: "Floor Mats", icon: "Square" },
      { id: "knob", name: "Gear Knobs", icon: "Circle" },
      { id: "switches", name: "Switches", icon: "ToggleRight" },
      { id: "handles", name: "Door Handles", icon: "Grip" },
    ],
  },
  {
    id: "wheels", name: "Wheels & Tires", icon: "CircleDot", image: tyre, tint: "bg-secondary text-primary",
    subcategories: [
      { id: "tires", name: "Tires", icon: "CircleDot" },
      { id: "alloy", name: "Alloy Wheels", icon: "Disc3" },
      { id: "nuts", name: "Wheel Nuts", icon: "Hexagon" },
      { id: "bearings", name: "Wheel Bearings", icon: "Circle" },
      { id: "accessories", name: "Tire Accessories", icon: "Wrench" },
    ],
  },
  {
    id: "fluids", name: "Oils & Fluids", icon: "Container", image: oil, tint: "bg-success-soft text-success",
    subcategories: [
      { id: "engine-oil", name: "Engine Oil", icon: "Container" },
      { id: "trans-oil", name: "Transmission Oil", icon: "Container" },
      { id: "coolant", name: "Coolant", icon: "Droplets" },
      { id: "brake-fluid", name: "Brake Fluid", icon: "Droplets" },
      { id: "ps-fluid", name: "Power Steering Fluid", icon: "Droplets" },
      { id: "additives", name: "Additives", icon: "FlaskConical" },
    ],
  },
  {
    id: "exhaust", name: "Exhaust System", icon: "Wind", image: brake, tint: "bg-accent-soft text-accent",
    subcategories: [
      { id: "muffler", name: "Mufflers", icon: "Volume2" },
      { id: "cat", name: "Catalytic Converter", icon: "Cylinder" },
      { id: "pipes", name: "Exhaust Pipes", icon: "Minus" },
      { id: "o2", name: "Oxygen Sensors", icon: "Radar" },
    ],
  },
  {
    id: "performance", name: "Performance Parts", icon: "Flame", image: brake, tint: "bg-deal-soft text-deal",
    subcategories: [
      { id: "turbo-kit", name: "Turbo Kits", icon: "Wind" },
      { id: "intake", name: "Air Intake Systems", icon: "Wind" },
      { id: "perf-exhaust", name: "Performance Exhaust", icon: "Volume2" },
      { id: "coilovers", name: "Coilovers", icon: "Activity" },
      { id: "tuning", name: "ECU Tuning Parts", icon: "Cpu" },
    ],
  },
  {
    id: "accessories", name: "Accessories", icon: "Sparkles", image: battery, tint: "bg-brand-soft text-brand",
    subcategories: [
      { id: "holder", name: "Mobile Holders", icon: "Smartphone" },
      { id: "dashcam", name: "Dash Cameras", icon: "Camera" },
      { id: "rear-cam", name: "Reverse Cameras", icon: "Camera" },
      { id: "park-sens", name: "Parking Sensors", icon: "Radar" },
      { id: "cover", name: "Car Covers", icon: "Shield" },
      { id: "rack", name: "Roof Racks", icon: "PackageOpen" },
      { id: "audio", name: "Car Audio", icon: "Music" },
    ],
  },
  {
    id: "tools", name: "Tools & Garage", icon: "Wrench", image: oil, tint: "bg-accent-soft text-accent",
    subcategories: [
      { id: "diag", name: "Diagnostic Scanners", icon: "Cpu" },
      { id: "jack", name: "Jack Stands", icon: "ArrowUp" },
      { id: "compressor", name: "Air Compressors", icon: "Gauge" },
      { id: "hand", name: "Hand Tools", icon: "Wrench" },
      { id: "charger", name: "Battery Chargers", icon: "BatteryCharging" },
    ],
  },
  {
    id: "carcare", name: "Car Care & Detailing", icon: "Sparkles", image: oil, tint: "bg-gold-soft text-gold",
    subcategories: [
      { id: "shampoo", name: "Car Shampoo", icon: "Droplets" },
      { id: "polish", name: "Polish", icon: "Sparkles" },
      { id: "wax", name: "Wax", icon: "Sparkles" },
      { id: "ceramic", name: "Ceramic Coating", icon: "Shield" },
      { id: "microfiber", name: "Microfiber Towels", icon: "Square" },
      { id: "interior-cln", name: "Interior Cleaner", icon: "SprayCan" },
    ],
  },
  {
    id: "used", name: "Used Spare Parts", icon: "Recycle", image: battery, tint: "bg-warning-soft text-warning",
    subcategories: [
      { id: "used-engine", name: "Used Engine", icon: "Cog" },
      { id: "used-gear", name: "Used Gearbox", icon: "Settings" },
      { id: "used-lights", name: "Used Lights", icon: "Lightbulb" },
      { id: "used-doors", name: "Used Doors", icon: "DoorOpen" },
      { id: "used-susp", name: "Used Suspension", icon: "Activity" },
    ],
  },
  {
    id: "oem", name: "OEM Genuine Parts", icon: "ShieldCheck", image: brake, tint: "bg-success-soft text-success",
    subcategories: [
      { id: "toyota", name: "Toyota Genuine", icon: "ShieldCheck" },
      { id: "nissan", name: "Nissan Genuine", icon: "ShieldCheck" },
      { id: "hyundai", name: "Hyundai Genuine", icon: "ShieldCheck" },
      { id: "kia", name: "Kia Genuine", icon: "ShieldCheck" },
      { id: "honda", name: "Honda Genuine", icon: "ShieldCheck" },
      { id: "lexus", name: "Lexus Genuine", icon: "ShieldCheck" },
    ],
  },
  {
    id: "aftermarket", name: "Aftermarket Parts", icon: "Tag", image: tyre, tint: "bg-brand-soft text-brand",
    subcategories: [
      { id: "premium", name: "Premium Aftermarket", icon: "Crown" },
      { id: "economy", name: "Economy Aftermarket", icon: "Tag" },
      { id: "perf-after", name: "Performance Aftermarket", icon: "Flame" },
    ],
  },
];

// Homepage shows only these 12 — rest behind "View All"
export const homeCategoryIds = [
  "engine", "brakes", "suspension", "electrical", "ac", "body",
  "lighting", "transmission", "wheels", "fluids", "accessories", "used",
];

export const homeCategories = homeCategoryIds
  .map(id => categories.find(c => c.id === id)!)
  .filter(Boolean);

// Vehicle brand → models (customer selects first)
export type VehicleBrand = { id: string; name: string; models: string[] };

export const vehicleBrands: VehicleBrand[] = [
  { id: "toyota", name: "Toyota", models: ["Corolla", "Camry", "Yaris", "Prado", "Land Cruiser", "Hilux", "Fortuner", "RAV4"] },
  { id: "nissan", name: "Nissan", models: ["Sunny", "Patrol", "Altima", "X-Trail", "Sentra", "Kicks"] },
  { id: "hyundai", name: "Hyundai", models: ["Elantra", "Accent", "Tucson", "Sonata", "Santa Fe", "Creta"] },
  { id: "kia", name: "Kia", models: ["Sportage", "Cerato", "Picanto", "Sorento", "Rio"] },
  { id: "honda", name: "Honda", models: ["Civic", "Accord", "CR-V", "City", "HR-V"] },
  { id: "mitsubishi", name: "Mitsubishi", models: ["Pajero", "L200", "Lancer", "ASX", "Outlander"] },
  { id: "ford", name: "Ford", models: ["Mustang", "Explorer", "Edge", "F-150", "Ranger"] },
  { id: "chevrolet", name: "Chevrolet", models: ["Tahoe", "Suburban", "Malibu", "Captiva", "Silverado"] },
  { id: "lexus", name: "Lexus", models: ["LX 570", "RX 350", "ES", "GX", "NX"] },
  { id: "bmw", name: "BMW", models: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7"] },
  { id: "mercedes", name: "Mercedes-Benz", models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "G-Class"] },
  { id: "audi", name: "Audi", models: ["A4", "A6", "Q5", "Q7", "Q8"] },
];

// Advanced search filter definitions
export type FilterDef = { id: string; label: string; type: "select" | "range" | "text" | "chips"; options?: string[] };

export const advancedFilters: FilterDef[] = [
  { id: "make", label: "Vehicle Make", type: "select", options: vehicleBrands.map(b => b.name) },
  { id: "model", label: "Model", type: "select" },
  { id: "year", label: "Year", type: "select", options: Array.from({ length: 26 }, (_, i) => String(2025 - i)) },
  { id: "engine", label: "Engine", type: "text" },
  { id: "vin", label: "VIN Number", type: "text" },
  { id: "oem", label: "OEM Number", type: "text" },
  { id: "part", label: "Part Number", type: "text" },
  { id: "brand", label: "Brand", type: "chips", options: ["Brembo", "Bosch", "Michelin", "Bridgestone", "ACDelco", "Mobil 1", "Denso", "NGK"] },
  { id: "type", label: "Genuine / OEM / Aftermarket", type: "chips", options: ["Genuine", "OEM", "Aftermarket"] },
  { id: "condition", label: "New / Used", type: "chips", options: ["New", "Used Grade A", "Used Grade B"] },
  { id: "price", label: "Price Range (AED)", type: "range" },
  { id: "stock", label: "UAE Stock", type: "chips", options: ["In UAE", "Imported"] },
  { id: "seller", label: "Seller Rating", type: "chips", options: ["4★ & up", "4.5★ & up", "Top Rated"] },
  { id: "delivery", label: "Delivery Time", type: "chips", options: ["Same day", "Next day", "Within 3 days"] },
];

export const services = [
  { id: "wash", name: "Car Wash", from: 35, eta: "30 min", icon: "Droplets" },
  { id: "oil", name: "Oil Change", from: 120, eta: "45 min", icon: "Container" },
  { id: "tyres", name: "Tyre Fit", from: 60, eta: "1 hr", icon: "CircleDot" },
  { id: "battery", name: "Battery", from: 80, eta: "30 min", icon: "BatteryCharging" },
  { id: "ac", name: "AC Repair", from: 250, eta: "2 hr", icon: "Snowflake" },
  { id: "brake", name: "Brakes", from: 180, eta: "1.5 hr", icon: "Disc3" },
  { id: "recovery", name: "Recovery", from: 150, eta: "ASAP", icon: "Truck" },
  { id: "detail", name: "Detailing", from: 450, eta: "3 hr", icon: "Sparkles" },
];

export type PremiumFeature = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  badge?: string;
  eta?: string;
  from?: number;
};

export const premiumFeatures: PremiumFeature[] = [
  { id: "sos", name: "Roadside SOS", tagline: "24/7 emergency rescue in under 30 min", icon: "LifeBuoy", badge: "Live", eta: "~22 min" },
  { id: "concierge", name: "Personal Concierge", tagline: "Dedicated advisor for every request", icon: "Headphones", badge: "Member" },
  { id: "insurance", name: "Smart Insurance", tagline: "Compare 14 providers in seconds", icon: "ShieldCheck", from: 1200 },
  { id: "tradein", name: "AI Trade-In", tagline: "Instant valuation with photo scan", icon: "Repeat", badge: "AI" },
  { id: "ev", name: "EV Charging", tagline: "Find & reserve nearby DC fast chargers", icon: "Zap" },
  { id: "chauffeur", name: "Chauffeur", tagline: "On-demand drivers — by the hour", icon: "Car", from: 90 },
  { id: "detail", name: "VIP Detailing", tagline: "Ceramic & PPF by certified studios", icon: "Sparkles", from: 1500 },
  { id: "inspect", name: "Pre-Purchase Inspection", tagline: "150-point check before you buy used", icon: "ClipboardCheck", from: 350 },
];

export const vehicles = [
  { id: "v1", name: "Toyota Land Cruiser", year: 2022, engine: "4.0L V6", plate: "DXB A 12345", primary: true },
  { id: "v2", name: "BMW 530i", year: 2020, engine: "2.0L Turbo", plate: "AUH 88421" },
];

export const deals = [
  { id: "d1", title: "Mega Auto Sale", subtitle: "Up to 60% OFF tyres & batteries", cta: "Shop Deals", tint: "gradient-deal" },
  { id: "d2", title: "Free Express Delivery", subtitle: "On orders over AED 200 — today only", cta: "Shop Now", tint: "gradient-brand" },
  { id: "d3", title: "OEM Genuine Parts", subtitle: "Direct from authorized dealers", cta: "Explore", tint: "gradient-accent" },
];

// ============= New vs Used variants =============
export type Variant = {
  kind: "New" | "Used";
  price: number;
  oldPrice?: number;
  stock: number;
  delivery: string;
  warranty: string;
  grade?: "A" | "B" | "C";
  vendor: string;
  note: string;
};

// Deterministic pseudo-stock so SSR/CSR match
function hashStock(id: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 18;
}

export function getVariants(p: Product): { new: Variant | null; used: Variant | null } {
  const isUsed = p.condition === "Used";
  const basePrice = isUsed ? (p.oldPrice ?? Math.round(p.price * 2.4)) : p.price;
  const newStock = isUsed ? hashStock(p.id, 7) : Math.max(3, hashStock(p.id, 11) + 4);
  const usedPrice = Math.round(basePrice * 0.42);
  const usedStock = isUsed ? Math.max(1, hashStock(p.id, 3)) : Math.max(0, hashStock(p.id, 5) - 3);

  const newV: Variant = {
    kind: "New",
    price: basePrice,
    oldPrice: !isUsed ? p.oldPrice : undefined,
    stock: newStock,
    delivery: isUsed ? "Tomorrow" : p.delivery,
    warranty: "2-year manufacturer warranty",
    vendor: isUsed ? p.vendor.replace(/Used.*/i, "Authorised Store") : p.vendor,
    note: "Brand new, sealed packaging, OEM-grade fitment.",
  };
  const usedV: Variant = {
    kind: "Used",
    price: isUsed ? p.price : usedPrice,
    oldPrice: basePrice,
    stock: usedStock,
    delivery: "2-3 days",
    warranty: "30-day return guarantee",
    grade: isUsed ? (p.grade ?? "A") : "A",
    vendor: isUsed ? p.vendor : "Sharjah Used Parts",
    note: "Inspected & tested by AutoHub technicians. Grade A — minimal wear.",
  };

  return {
    new: newV.stock > 0 ? newV : null,
    used: usedV.stock > 0 ? usedV : null,
  };
}

// ============= Size & Compatibility (mock, name-derived) =============
export function getSizeOptions(p: Product): { label: string; options: string[] } | null {
  const n = p.name.toLowerCase();
  if (n.includes("tyre") || n.includes("tire") || /\d{3}\/\d{2}\s*r\d{2}/i.test(n)) {
    const m = p.name.match(/(\d{3}\/\d{2}\s*R\d{2})/i);
    const base = m ? m[1].toUpperCase().replace(/\s+/g, "") : "225/55R17";
    const set = Array.from(new Set([base, "225/45R18", "245/40R19", "255/35R20", "265/50R20"]));
    return { label: "Tyre Size", options: set };
  }
  if (n.includes("oil") || n.includes("coolant") || n.includes("fluid")) {
    return { label: "Volume", options: ["1 L", "4 L", "5 L", "20 L"] };
  }
  if (n.includes("battery")) return { label: "Capacity", options: ["60 Ah", "70 Ah", "80 Ah", "100 Ah"] };
  if (n.includes("disc") || n.includes("rotor")) return { label: "Disc Size", options: ["296 mm", "320 mm", "340 mm", "360 mm"] };
  if (n.includes("brake pad")) return { label: "Set", options: ["Front Set", "Rear Set", "Full Kit"] };
  if (n.includes("spark plug")) return { label: "Pack", options: ["Set of 4", "Set of 6", "Set of 8"] };
  if (n.includes("filter")) return { label: "Type", options: ["Standard", "High-Flow"] };
  if (n.includes("headlight") || n.includes("led") || n.includes("bulb")) {
    return { label: "Bulb Fitting", options: ["H4", "H7", "H11", "9005"] };
  }
  return null;
}

export function getCompatibility(p: Product): string[] {
  const extras = [
    "Toyota Camry 2018-2024",
    "Nissan Patrol 2017-2024",
    "BMW 5 Series 2019-2024",
    "Mercedes E-Class 2020-2024",
    "Ford Mustang 2015-2023",
    "Toyota Land Cruiser 2018-2024",
  ];
  return [p.fitment, ...extras.filter((e) => e !== p.fitment)].slice(0, 5);
}

// ============= Product-selling stores (e-commerce shops) =============
// These are DIFFERENT from `bestShops` (which are service garages).
// A ProductShop sells parts/accessories only — no workshop booking.
export type ProductShop = {
  id: string;
  name: string;
  logo: any; // require() asset
  banner: any; // require() asset
  tint: string;
  rating: number;
  reviews: number;
  followers: number;
  productsCount: number;
  location: string;
  established: number;
  responseRate: number; // %
  shipping: string;
  returnPolicy: string;
  badge?: string;
  verified?: boolean;
  official?: boolean;
  categories: string[]; // display chips
  productIds: string[]; // links to `products`
  promo?: { title: string; sub: string };
};

export const productShops: ProductShop[] = [
  {
    id: "ps1", name: "Brembo Official Store", logo: brake, banner: brake,
    tint: "from-deal/90 to-accent/80",
    rating: 4.9, reviews: 12450, followers: 84200, productsCount: 320,
    location: "Dubai · Ships UAE-wide", established: 2011, responseRate: 98,
    shipping: "Free over AED 200", returnPolicy: "15-day easy return",
    badge: "Official", verified: true, official: true,
    categories: ["Brake Discs", "Brake Pads", "Calipers", "Brake Fluid"],
    productIds: ["p1", "p5", "p7", "p9"],
    promo: { title: "Brembo Track Days", sub: "Up to 25% OFF performance kits" },
  },
  {
    id: "ps2", name: "Tyre Plus Megastore", logo: tyre, banner: tyre,
    tint: "from-primary to-primary/80",
    rating: 4.8, reviews: 9820, followers: 62300, productsCount: 540,
    location: "Al Quoz · Same-day Dubai", established: 2008, responseRate: 96,
    shipping: "Free fitting on all tyres", returnPolicy: "7-day exchange",
    badge: "Top Seller", verified: true,
    categories: ["Summer Tyres", "SUV Tyres", "Performance", "Run-flat"],
    productIds: ["p2", "p6", "p11"],
    promo: { title: "Mega Tyre Sale", sub: "Buy 3 get 1 free — this week" },
  },
  {
    id: "ps3", name: "BatteryHub UAE", logo: battery, banner: battery,
    tint: "from-success/90 to-brand/80",
    rating: 4.7, reviews: 6210, followers: 21800, productsCount: 180,
    location: "Sharjah · UAE-wide", established: 2014, responseRate: 94,
    shipping: "Free install within 25km", returnPolicy: "24-month warranty",
    verified: true,
    categories: ["AGM", "Lead-Acid", "Lithium", "Chargers"],
    productIds: ["p3", "p12"],
    promo: { title: "Summer Ready", sub: "AED 50 off all AGM batteries" },
  },
  {
    id: "ps4", name: "ENOC Auto Shop", logo: oil, banner: oil,
    tint: "from-accent/90 to-warning/80",
    rating: 4.9, reviews: 18230, followers: 121000, productsCount: 1200,
    location: "UAE-wide · 180+ outlets", established: 1993, responseRate: 99,
    shipping: "Free same-day in Dubai/AUH", returnPolicy: "30-day return",
    badge: "Verified", verified: true, official: true,
    categories: ["Engine Oil", "Filters", "Additives", "Coolant"],
    productIds: ["p4", "p10", "p8"],
    promo: { title: "Mobil 1 Bundle", sub: "Oil + Filter combo from AED 199" },
  },
  {
    id: "ps5", name: "Bosch Auto Hub", logo: oil, banner: oil,
    tint: "from-brand/90 to-primary/80",
    rating: 4.8, reviews: 7540, followers: 45600, productsCount: 460,
    location: "Dubai · UAE-wide", established: 2005, responseRate: 97,
    shipping: "Free over AED 150", returnPolicy: "14-day return",
    verified: true, official: true,
    categories: ["Spark Plugs", "Wipers", "Ignition", "Sensors"],
    productIds: ["p7", "p9", "p8"],
    promo: { title: "Genuine Bosch", sub: "Extra 10% off ignition parts" },
  },
  {
    id: "ps6", name: "Denso Official", logo: battery, banner: battery,
    tint: "from-deal/90 to-primary/80",
    rating: 4.9, reviews: 15300, followers: 73400, productsCount: 280,
    location: "Abu Dhabi · UAE-wide", established: 2001, responseRate: 98,
    shipping: "Free over AED 250", returnPolicy: "30-day return",
    badge: "OEM", verified: true, official: true,
    categories: ["Spark Plugs", "AC Compressors", "Alternators", "Fuel Pumps"],
    productIds: ["p9", "p12", "p3"],
    promo: { title: "OEM Weeks", sub: "Genuine Denso parts up to 30% OFF" },
  },
];

