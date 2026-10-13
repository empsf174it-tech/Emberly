/**
 * Emberly Specialty Coffee Gear Store - Shared Data Layer
 * Contains seed catalog, initial orders, reviews, grind guides, and subscription plans.
 * All prices, specs, stock, reviews, and sourcing claims are placeholder demo data.
 */

const CURRENCY = '$';
const TAX_RATE = 0.0825; // 8.25% demo sales tax
const SHIPPING_FLAT = 12.00;
const FREE_SHIPPING_THRESHOLD = 75.00;

// Curated Unsplash images (High-res, unique URLs across all products)
const PRODUCTS = [
  {
    id: 'aethel-64-grinder',
    name: 'Aethel 64 Precision Flat Burr Grinder',
    tagline: '64mm Diamond-Like Carbon Burrs with Sub-Micron Stepless Micrometer Dial',
    category: 'grinders',
    brewMethods: ['espresso', 'pour-over', 'aeropress'],
    price: 585.00,
    rating: 4.9,
    reviewCount: 128,
    stock: 8,
    badge: 'Staff Pick',
    featured: true,
    has360: true,
    image: 'https://images.unsplash.com/photo-1573066588560-174aba0712c6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573066588560-174aba0712c6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548270311-3a9e56a480ff?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Engineered in our Seattle bench-lab for uncompromising grind uniformity. The Aethel 64 utilizes custom CNC-machined 64mm DLC (Diamond-Like Carbon) flat burrs with zero-retention bellows, magnetic catch cup, and an anti-static plasma generator.',
    specs: {
      'Burr Type': '64mm Custom DLC Flat Burrs',
      'Adjustment': 'Stepless Micrometric (5 microns per tick)',
      'Motor': '250W Brushless DC (800–1400 RPM variable)',
      'Retention': '< 0.1g with bellow cycle',
      'Hopper Capacity': '40g Single-Dose Hopper with Bellows',
      'Weight': '6.8 kg (15 lbs)',
      'Dimensions': '130 × 220 × 330 mm',
      'Warranty': '3-Year Manufacturer Warranty'
    },
    reviews: [
      { id: 1, author: 'Marcus V.', rating: 5, date: 'October 4, 2026', verified: true, title: 'Flawless clarity on light roasts', comment: 'The unimodal particle distribution completely opened up my washed Ethiopian coffees. Clean acidity, zero fines migration, and practically silent motor.' },
      { id: 2, author: 'Elena Rostova', rating: 5, date: 'September 22, 2026', verified: true, title: 'True zero retention achieved', comment: 'Measured 18.0g in, 18.0g out consistently without even tapping the chute. The magnetic portafilter cradle is a lovely tactile touch.' },
      { id: 3, author: 'Liam Chen', rating: 4.8, date: 'August 14, 2026', verified: true, title: 'Outstanding bench companion', comment: 'Built like a commercial tank. Takes about 2kg of seasoning beans to reach peak sweetness, but out of the box it crushes anything in this tier.' }
    ]
  },
  {
    id: 'kallio-thermal-profiler',
    name: 'Kallio Artisanal Thermal Profiler',
    tagline: 'Dual Stainless Steel Boilers with Saturated Group & Flow Profiling Paddle',
    category: 'espresso-machines',
    brewMethods: ['espresso'],
    price: 1650.00,
    rating: 4.9,
    reviewCount: 64,
    stock: 4,
    badge: 'Flagship',
    featured: true,
    has360: true,
    image: 'https://images.unsplash.com/photo-1548270311-3a9e56a480ff?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548270311-3a9e56a480ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579533555864-545dcdff5a43?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1461988366670-48e401bafb0a?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The Kallio Thermal Profiler marries Scandinavian walnut craftsmanship with laboratory-grade PID temperature stability (±0.2°C). Features a manual needle-valve mechanical paddle for variable pre-infusion pressure profiling from 1 to 9 bars.',
    specs: {
      'Boiler System': 'Dual 316L Stainless (0.8L Brew / 1.8L Steam)',
      'Pressure Control': 'Rotary Vane Pump + Manual Flow Profiler',
      'Temperature Control': 'Independent Dual PID Controller',
      'Group Head': 'Saturated 58.5mm Heated Group Head',
      'Water Supply': '2.5L Internal Tank or Direct Waterline Plumb',
      'Weight': '28.5 kg (62.8 lbs)',
      'Dimensions': '320 × 440 × 390 mm',
      'Warranty': '2-Year Commercial & Home Warranty'
    },
    reviews: [
      { id: 1, author: 'Julian Keller', rating: 5, date: 'September 29, 2026', verified: true, title: 'Pressure profiling transformed my extractions', comment: 'Being able to hold 3 bars for a 12-second blooming pre-infusion, ramp to 8 bars, and decline to 5 bars produces the silkiest shots imaginable.' },
      { id: 2, author: 'Sora Tanaka', rating: 5, date: 'August 18, 2026', verified: true, title: 'Incredible dry microfoam steam power', comment: 'Steams 200ml of cold oat milk in under 11 seconds. The cool-touch wand is easy to wipe clean after back-to-back drinks.' }
    ]
  },
  {
    id: 'vapour-precision-kettle',
    name: 'Vapour Precision Variable Temperature Kettle',
    tagline: 'Gooseneck Spout with Counterbalanced Walnut Handle & Strix PID Base',
    category: 'kettles',
    brewMethods: ['pour-over', 'french-press', 'aeropress'],
    price: 165.00,
    rating: 4.9,
    reviewCount: 95,
    stock: 14,
    badge: 'Popular',
    featured: true,
    has360: true,
    image: 'https://images.unsplash.com/photo-1561336739-ad95e6db39e5?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561336739-ad95e6db39e5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517269145736-a6e1ff92c2fe?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Designed for fluid dynamics mastery. The fluted gooseneck spout provides an uninterrupted laminar stream at flow rates from 2g/s to 12g/s. Built-in digital stopwatch, Celsius/Fahrenheit toggle, and a 60-minute active temperature hold.',
    specs: {
      'Capacity': '800ml (0.8 Liters)',
      'Power': '1200W Rapid Boil Element',
      'Temperature Range': '40°C – 100°C (±0.5°C accuracy)',
      'Material': '304 Stainless Steel & American Walnut',
      'Safety': 'Auto-Shutoff & Boil-Dry Protection',
      'Weight': '1.25 kg',
      'Cord Length': '0.9m Base Management Wrap',
      'Warranty': '2-Year Replacement Warranty'
    },
    reviews: [
      { id: 1, author: 'Chloe Dupont', rating: 5, date: 'October 1, 2026', verified: true, title: 'Ergonomics are second to none', comment: 'The counterbalanced handle eliminates wrist fatigue during gentle spiral pours. Flow rate control is surgical.' }
    ]
  },
  {
    id: 'nordic-wave-dripper',
    name: 'Nordic Wave Dripper Mk.II',
    tagline: 'Double-Walled Borosilicate Glass with 20-Flute Thermal Geometry',
    category: 'pour-over',
    brewMethods: ['pour-over'],
    price: 48.00,
    rating: 4.8,
    reviewCount: 210,
    stock: 24,
    badge: 'Bestseller',
    featured: true,
    has360: false,
    image: 'https://images.unsplash.com/photo-1757688341742-ce7978cdb186?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1757688341742-ce7978cdb186?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517269145736-a6e1ff92c2fe?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Flat-bottom dripper engineered to eliminate bypass channels. The double-walled borosilicate retains slurry temperature 3.2°C higher than ceramic alternatives through the entire 3-minute drawdown.',
    specs: {
      'Material': 'Laboratory Borosilicate & Turned Sandalwood Base',
      'Capacity': '1–4 Cups (up to 600ml brew)',
      'Filter Compatibility': 'Kalita 185 / Wave style filters',
      'Dishwasher Safe': 'Glass cone yes; remove wooden base collar',
      'Origin': 'Hand-blown in Copenhagen Studio',
      'Warranty': '1-Year Thermal Shock Guarantee'
    },
    reviews: [
      { id: 1, author: 'Henrik Larsson', rating: 5, date: 'September 15, 2026', verified: true, title: 'Consistent sweet extractions', comment: 'Even flow rate across the entire bed. No stalling even with fines-heavy natural process lots.' }
    ]
  },
  {
    id: 'flux-ultralight-scale',
    name: 'Flux Ultralight Sub-Milligram Scale',
    tagline: '0.05g Resolution with Real-Time Flow-Rate Speedometer & Auto-Tare',
    category: 'scales',
    brewMethods: ['espresso', 'pour-over', 'french-press', 'aeropress'],
    price: 115.00,
    rating: 4.8,
    reviewCount: 182,
    stock: 19,
    badge: 'Essential',
    featured: true,
    has360: false,
    image: 'https://images.unsplash.com/photo-1716453429618-d8c1826acd19?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1716453429618-d8c1826acd19?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522273777983-a0d924529b83?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Slimline 14mm aluminum chassis fits directly onto espresso drip trays or pour-over stands. Features ultra-responsive dual microprocessors delivering instant flow-rate feedback (g/s) with zero latency lag.',
    specs: {
      'Accuracy': '0.05g (from 0.1g up to 2000g)',
      'Display': 'High-Contrast OLED with Flow-Rate Graph',
      'Modes': 'Espresso Auto-Timer, Pour-Over Flow, Manual Tare',
      'Battery': '1200mAh Lithium USB-C (approx. 40 hours continuous)',
      'Water Resistance': 'IPX5 Sealed Gasket Housing',
      'Dimensions': '105 × 105 × 14 mm',
      'Warranty': '2-Year Limited Warranty'
    },
    reviews: [
      { id: 1, author: 'Dr. Aris Vance', rating: 5, date: 'October 8, 2026', verified: true, title: 'The flow rate meter changes your pouring technique', comment: 'Instantaneous response with no lag. Fits cleanly between the E61 group head and drip tray.' }
    ]
  },
  {
    id: 'sylvan-hand-grinder',
    name: 'Sylvan Heptagonal Hand Grinder Pro',
    tagline: '48mm High-Nitrogen Steel Heptagonal Burrs with 10-Micron External Adjustment',
    category: 'grinders',
    brewMethods: ['pour-over', 'aeropress', 'french-press'],
    price: 195.00,
    rating: 4.9,
    reviewCount: 142,
    stock: 11,
    badge: 'Top Rated',
    featured: true,
    has360: false,
    image: 'https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1573066588560-174aba0712c6?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Machined from a single billet of aeronautical alloy with dual ceramic ball bearings. Effortless grinding at 1.1 grams per second. External adjustment dial with 60 distinct steps per rotation allows rapid adjustments.',
    specs: {
      'Burrs': '48mm 420 High-Nitrogen Stainless Steel',
      'Bearings': 'Dual High-Tolerance Ceramic Ball Bearings',
      'Catch Capacity': '35–40g Whole Bean Volume',
      'Body Material': 'Anodized 6061 Aluminum with Silicone Grip Ring',
      'Weight': '680g',
      'Warranty': 'Lifetime Mechanical Burr Guarantee'
    },
    reviews: [
      { id: 1, author: 'Talia Brooks', rating: 5, date: 'September 11, 2026', verified: true, title: 'Smoothest hand grinder I have ever spun', comment: 'Effortless to crank through even the densest high-altitude washed Kenyas. The external dial is a masterclass in UX.' }
    ]
  },
  {
    id: 'strata-calibrated-tamper',
    name: 'Strata 58.5mm Calibrated Constant-Force Tamper',
    tagline: '30lb Precision Internal Spring with Self-Leveling Collar & Titanium Base',
    category: 'accessories',
    brewMethods: ['espresso'],
    price: 68.00,
    rating: 4.9,
    reviewCount: 119,
    stock: 16,
    badge: 'Barista Lab',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1777148562234-903e3ab1ceac?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1777148562234-903e3ab1ceac?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Guarantees flat, level puck compaction every time. Self-leveling outer collar rests on the rim of precision baskets, while the calibrated internal spring activates at exactly 30 lbs of downward force to avoid channeling.',
    specs: {
      'Diameter': '58.50mm (+0.00 / -0.02mm tolerance)',
      'Base Type': 'Flat Titanium-PVD Coated 316 Stainless',
      'Force Calibration': '30 lbs Factory Calibrated (includes 25 lb optional spring)',
      'Handle': 'Ergonomic Anodized Matte Charcoal',
      'Weight': '420g',
      'Warranty': '3-Year Spring Elasticity Guarantee'
    },
    reviews: [
      { id: 1, author: 'Mateo Morales', rating: 5, date: 'September 5, 2026', verified: true, title: 'Banished side-channeling forever', comment: 'Takes human inconsistency completely out of the puck prep equation.' }
    ]
  },
  {
    id: 'monolith-blind-shaker',
    name: 'Monolith Zero-Retention Blind Shaker & Funnel',
    tagline: 'Aerospace Grade Aluminum with Anti-Static Ionized Coating',
    category: 'accessories',
    brewMethods: ['espresso'],
    price: 36.00,
    rating: 4.7,
    reviewCount: 77,
    stock: 32,
    badge: 'Popular',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Homogenizes ground coffee clumps in 3 seconds before dosing. Plugs into 58mm portafilter baskets with magnetic alignment. Center pull-plug drops evenly distributed grounds into the basket with zero mess.',
    specs: {
      'Fit': 'Standard 58mm & 58.5mm Commercial Baskets',
      'Material': 'Billet CNC Aluminum with Hard Anodizing',
      'Magnetics': 'Neodymium Rim Retention Ring',
      'Weight': '180g',
      'Warranty': 'Lifetime Guarantee'
    },
    reviews: [
      { id: 1, author: 'Samira Khan', rating: 5, date: 'October 2, 2026', verified: true, title: 'Better extraction yield than WDT needles alone', comment: 'Reduces fines clump clustering. Noticeable increase in brew clarity.' }
    ]
  },
  {
    id: 'cinder-immersion-dripper',
    name: 'Cinder Variable Immersion Dripper',
    tagline: 'Hybrid Immersion and Percolation Brewer with Matte Slate Ceramic',
    category: 'pour-over',
    brewMethods: ['pour-over', 'french-press'],
    price: 54.00,
    rating: 4.8,
    reviewCount: 88,
    stock: 6,
    badge: 'Craft Series',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Combines the sweetness and body of full immersion with the crisp clarity of paper filtration. Patented silicone ball-valve base lets you steep for 3 minutes before flipping the lever for a quick percolation drawdown.',
    specs: {
      'Capacity': '500ml Maximum Liquid Volume',
      'Material': 'High-Fire Stoneware Ceramic & Medical Silicone',
      'Valve': 'Ball-Bearing Mechanical Lever',
      'Filters': 'Standard Trapezoid or Conical #02 Filters',
      'Warranty': '2-Year Craft Guarantee'
    },
    reviews: [
      { id: 1, author: 'Liam O’Connor', rating: 5, date: 'September 19, 2026', verified: true, title: 'The sweet spot between V60 and French Press', comment: 'Extremely forgiving for dark roasts and medium origins. Heavy body with none of the muddy sediment.' }
    ]
  },
  {
    id: 'aerocraft-travel-press',
    name: 'AeroCraft Travel Extraction Press Kit',
    tagline: 'Shatterproof Tritan Cylinder with Ultra-Fine Laser-Etched Steel Filter',
    category: 'pour-over',
    brewMethods: ['aeropress'],
    price: 42.00,
    rating: 4.7,
    reviewCount: 156,
    stock: 22,
    badge: 'Travel Gear',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The ultimate backcountry and hotel room companion. Packs down into its own silicone-sleeved travel cup. Includes both paper filter cap and reusable 35-micron etched stainless mesh for richer crema.',
    specs: {
      'Volume': '260ml Brew Chamber',
      'Material': 'BPA/BPS-Free Tritan Polymer & Food-Grade Silicone',
      'Filters Included': '350 Paper Discs + 1 Laser-Etched Metal Mesh Disc',
      'Travel Weight': '245g Total Kit Weight',
      'Warranty': '2-Year Shatterproof Guarantee'
    },
    reviews: [
      { id: 1, author: 'David S.', rating: 5, date: 'September 28, 2026', verified: true, title: 'Unbeatable road companion', comment: 'I pack this and the Sylvan grinder everywhere I fly. Reliable café quality in any hotel room.' }
    ]
  },
  {
    id: 'ultrasonic-descaling-solution',
    name: 'Barista Lab Bio-Enzymatic Descaling Solution (1000ml)',
    tagline: 'Biodegradable Organic Acid Formula for Boilers & Thermoblocks',
    category: 'accessories',
    brewMethods: ['espresso', 'kettles'],
    price: 22.00,
    rating: 4.8,
    reviewCount: 63,
    stock: 45,
    badge: 'Maintenance',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1461988366670-48e401bafb0a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1461988366670-48e401bafb0a?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Formulated with organic malic and citric acids to dissolve calcium scale and magnesium salts without pitting copper or brass boiler fittings. Odorless and leaves zero chemical residue after two flushes.',
    specs: {
      'Volume': '1000ml (Approx. 8 Full Maintenance Cycles)',
      'Active Ingredients': 'Food-Grade Citric Acid, Malic Acid, Sulfamic Inhibitor',
      'Safety': 'Safe for Stainless Steel, Brass, Copper & E61 Groups',
      'Origin': 'Compounded in Oregon, USA'
    },
    reviews: [
      { id: 1, author: 'Gary Lin', rating: 5, date: 'August 30, 2026', verified: true, title: 'Brought my flow rate back to factory spec', comment: 'Ran this through my dual boiler after 18 months of hard Seattle water. Cleared scale instantly without irritating odors.' }
    ]
  },
  {
    id: 'titanium-ssp-burrs',
    name: 'Titanium-Coated 64mm Unimodal Replacement Burrs',
    tagline: 'Red Speed Coating with 5,000kg Lifespan for Maximum Extraction Clarity',
    category: 'accessories',
    brewMethods: ['espresso', 'pour-over'],
    price: 185.00,
    rating: 4.9,
    reviewCount: 41,
    stock: 0, // SOLD OUT DEMO PRODUCT
    badge: 'Sold Out',
    featured: false,
    has360: false,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Custom geometry engineered for ultra-high extraction yields on light roast single origins. Titanium aluminum carbon-nitride coating reduces friction and maintains razor sharpness through 5 metric tons of coffee.',
    specs: {
      'Diameter': '64mm Standard Fit (Aethel 64, Mazzer Super Jolly, DF64)',
      'Geometry': 'Multi-Purpose Unimodal Particle Cut',
      'Coating': 'TiAlCN Red Speed Coating',
      'Hardness': 'HV 3,200 Vickers',
      'Warranty': '5-Year Wear Guarantee'
    },
    reviews: [
      { id: 1, author: 'Patrick Noel', rating: 5, date: 'July 14, 2026', verified: true, title: 'The holy grail for modern light roast espresso', comment: 'Sweetness and separation of flavor notes like I have never tasted before. Patiently waiting for the restock!' }
    ]
  }
];

// Brew-Method Finder Seed Matrix
const BREW_GUIDES = {
  espresso: {
    title: 'Espresso (9-Bar High Pressure)',
    desc: 'Dense, concentrated 1:2 extraction with rich crema, intense aromatics, and tactile velvety mouthfeel.',
    ratio: '1:2 brew ratio',
    dose: '18.0g coffee',
    yield: '36.0g espresso',
    temp: '93.5°C (200.3°F)',
    time: '26–30 seconds',
    grindName: 'Fine (Espresso)',
    gearIds: ['aethel-64-grinder', 'kallio-thermal-profiler', 'strata-calibrated-tamper', 'flux-ultralight-scale'],
    why: 'Requires rigid sub-micron particle consistency, 30lb level tamping, and rock-solid PID boiler pressure to prevent micro-channeling.'
  },
  'pour-over': {
    title: 'Pour-Over (V60 & Wave Percolation)',
    desc: 'Surgical flavor separation, delicate floral top notes, crisp acidity, and clean tea-like translucence.',
    ratio: '1:16.6 brew ratio',
    dose: '15.0g coffee',
    yield: '250g water',
    temp: '94.0°C (201.2°F)',
    time: '3m 15s total drawdown',
    grindName: 'Medium (Kosher Salt)',
    gearIds: ['nordic-wave-dripper', 'vapour-precision-kettle', 'sylvan-hand-grinder', 'flux-ultralight-scale'],
    why: 'Controlled laminar water pouring from a counterbalanced kettle combined with unimodal hand-ground particles unlocks delicate floral aromatics.'
  },
  'french-press': {
    title: 'French Press & Immersion',
    desc: 'Full-bodied, tactile, and round cup with natural coffee oils, heavy chocolate sweetness, and low perceived acidity.',
    ratio: '1:16 brew ratio',
    dose: '30.0g coffee',
    yield: '480g water',
    temp: '95.0°C (203.0°F)',
    time: '4m 00s steep + 4m crust settle',
    grindName: 'Coarse (Rock Salt)',
    gearIds: ['cinder-immersion-dripper', 'vapour-precision-kettle', 'aethel-64-grinder', 'flux-ultralight-scale'],
    why: 'Full prolonged immersion requires even coarse granules without fine dust to prevent muddy over-extracted astringency.'
  },
  aeropress: {
    title: 'AeroPress Extraction',
    desc: 'Versatile, hyper-sweet cup combining gentle immersion with pneumatic piston filtration for travel or daily lab brewing.',
    ratio: '1:13.7 brew ratio',
    dose: '16.0g coffee',
    yield: '220g water',
    temp: '88.0°C (190.4°F)',
    time: '2m 00s total press',
    grindName: 'Medium-Fine (Table Salt)',
    gearIds: ['aerocraft-travel-press', 'sylvan-hand-grinder', 'vapour-precision-kettle', 'flux-ultralight-scale'],
    why: 'Compact, shatterproof setup that rewards experimental brew ratios and rapid pneumatic plunging at home or on mountain summits.'
  }
};

// Grind-Size Guide Steps (8 calibrated stages)
const GRIND_LEVELS = [
  {
    step: 0,
    name: 'Extra-Fine',
    label: 'Turkish / Ibrik',
    microns: '100 – 150 μm',
    textureDesc: 'Flour-like powder, zero detectable grit to the touch.',
    methods: 'Turkish Cezve, Greek Ibrik',
    time: '1m 30s – 2m 00s (simmer)',
    troubleshoot: 'If bitter or sandy, boil more gently. Never plunge in filter baskets.',
    particleSvg: 'extra-fine',
    matchedGrinders: ['aethel-64-grinder']
  },
  {
    step: 1,
    name: 'Fine',
    label: 'Modern Espresso',
    microns: '200 – 300 μm',
    textureDesc: 'Powdered sugar texture with tiny micro-grain feel between fingertips.',
    methods: 'Commercial & Home 9-Bar Espresso, Nanopresso',
    time: '25 – 30 seconds',
    troubleshoot: 'Too sour / watery? Grind finer. Choking machine or bitter? Grind coarser.',
    particleSvg: 'fine',
    matchedGrinders: ['aethel-64-grinder', 'sylvan-hand-grinder']
  },
  {
    step: 2,
    name: 'Medium-Fine',
    label: 'Moka Pot & AeroPress',
    microns: '350 – 500 μm',
    textureDesc: 'Fine table salt, slight sand-like resistance.',
    methods: 'Bialetti Moka Pot, AeroPress Standard, Siphon Vac Pot',
    time: '1m 30s – 2m 30s',
    troubleshoot: 'Sour or hollow cup? Move 2 clicks finer. Muddy bed or metallic bite? Move 2 clicks coarser.',
    particleSvg: 'medium-fine',
    matchedGrinders: ['sylvan-hand-grinder', 'aethel-64-grinder']
  },
  {
    step: 3,
    name: 'Medium',
    label: 'Standard Pour-Over (V60 / Wave)',
    microns: '550 – 750 μm',
    textureDesc: 'Granulated sugar or standard beach sand consistency.',
    methods: 'Nordic Wave, Hario V60, Origami, April Dripper',
    time: '2m 45s – 3m 30s',
    troubleshoot: 'Water stalling in paper filter? Fines are choking bed; grind coarser. Water draining under 2 mins? Grind finer.',
    particleSvg: 'medium',
    matchedGrinders: ['sylvan-hand-grinder', 'aethel-64-grinder']
  },
  {
    step: 4,
    name: 'Medium-Coarse',
    label: 'Chemex & Clever Dripper',
    microns: '800 – 950 μm',
    textureDesc: 'Kosher salt crystals, distinct granular separation.',
    methods: 'Thick Paper Chemex, Cinder Immersion Brewer, Clever Dripper',
    time: '3m 45s – 4m 30s',
    troubleshoot: 'Heavy thick paper needs coarser particles to maintain steady flow without pooling.',
    particleSvg: 'medium-coarse',
    matchedGrinders: ['aethel-64-grinder', 'sylvan-hand-grinder']
  },
  {
    step: 5,
    name: 'Coarse',
    label: 'French Press & Cupping',
    microns: '1000 – 1200 μm',
    textureDesc: 'Cracked peppercorns or coarse rock salt crystals.',
    methods: 'French Press, SCA Cupping Bowls, Soft Brew',
    time: '4m 00s – 8m 00s',
    troubleshoot: 'Murky cup or sediment in teeth? Grind coarser to allow natural gravity sedimentation.',
    particleSvg: 'coarse',
    matchedGrinders: ['sylvan-hand-grinder', 'aethel-64-grinder']
  },
  {
    step: 6,
    name: 'Extra-Coarse',
    label: 'Cold Brew Immersion',
    microns: '1300 – 1600 μm',
    textureDesc: 'Coarse crushed sea gravel, large distinct chunks.',
    methods: 'Cold Brew Toddy, Slow Drip Dutch Towers',
    time: '16 – 24 hours (cold extraction)',
    troubleshoot: 'Prolonged cold contact requires large granules to avoid bitter oxidation and cloudy sludge.',
    particleSvg: 'extra-coarse',
    matchedGrinders: ['aethel-64-grinder']
  }
];

// Seeded Initial Orders for Demo Session
const INITIAL_DEMO_ORDERS = [
  {
    id: 'EMB-90412',
    date: 'October 3, 2026',
    status: 'Delivered',
    total: 213.00,
    items: [
      { id: 'vapour-precision-kettle', name: 'Vapour Precision Variable Temperature Kettle', price: 165.00, qty: 1, image: 'https://images.unsplash.com/photo-1561336739-ad95e6db39e5?auto=format&fit=crop&w=900&q=80' },
      { id: 'nordic-wave-dripper', name: 'Nordic Wave Dripper Mk.II', price: 48.00, qty: 1, image: 'https://images.unsplash.com/photo-1757688341742-ce7978cdb186?auto=format&fit=crop&w=900&q=80' }
    ]
  },
  {
    id: 'EMB-87190',
    date: 'September 18, 2026',
    status: 'Delivered',
    total: 115.00,
    items: [
      { id: 'flux-ultralight-scale', name: 'Flux Ultralight Sub-Milligram Scale', price: 115.00, qty: 1, image: 'https://images.unsplash.com/photo-1716453429618-d8c1826acd19?auto=format&fit=crop&w=900&q=80' }
    ]
  }
];

// Seeded Initial Active Subscription
const INITIAL_DEMO_SUBSCRIPTION = {
  id: 'SUB-SINGLE-ORIGIN-01',
  name: 'Micro-Lot Single Origin Roaster Select',
  frequency: 'Every 2 Weeks',
  price: 38.00,
  nextRoast: 'October 24, 2026',
  quantity: '2 × 250g Whole Bean Bags',
  originPreview: 'Ethiopia Yirgacheffe Anaerobic + Colombia Pink Bourbon',
  status: 'Active'
};

// Seeded Curated Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'plan-single-origin',
    name: 'Micro-Lot Single Origin Select',
    tagline: 'Curated competition-grade washed and anaerobic lots freshly roasted every cycle.',
    priceMonthly: 38.00,
    frequencyOptions: ['Weekly', 'Bi-Weekly', 'Monthly'],
    features: [
      '2 × 250g Whole Bean bags per shipment',
      'Detailed harvest sheets & cupping notes (87+ Q score)',
      'Complimentary seasonal brew recipe cards',
      'Free priority climate-controlled shipping'
    ]
  },
  {
    id: 'plan-espresso-craft',
    name: 'Espresso Enthusiast Pair',
    tagline: 'Engineered for dense crema, balance, and sweetness with milk or straight shots.',
    priceMonthly: 44.00,
    frequencyOptions: ['Bi-Weekly', 'Monthly'],
    features: [
      '2 × 340g bags of our signature roast profiles',
      'Optimized degassing schedule (rested 7 days pre-delivery)',
      'Free pack of 100 barista filter papers every 2 months',
      'Direct line to our head roaster dial-in support'
    ]
  },
  {
    id: 'plan-filters-consumables',
    name: 'Precision Filters & Lab Maintenance',
    tagline: 'Never run out of oxygen-bleached filter papers, water mineral packets, or descaler.',
    priceMonthly: 24.00,
    frequencyOptions: ['Monthly', 'Every 2 Months'],
    features: [
      '200 × Japanese oxygen-bleached Wave/Cone filters',
      '1 × 1000ml Bio-Enzymatic Descaling Solution',
      '6 × Lotus mineral formulation water conditioning packets',
      'Free shipping included'
    ]
  }
];

// Seeded Servicing Packages
const SERVICING_PACKAGES = [
  {
    id: 'service-burr-alignment',
    name: 'Grinder Burr Alignment & Micrometric Tuning',
    tagline: 'Precision dial-indicator alignment to within 2.5 microns across all 360 degrees.',
    price: 95.00,
    turnaround: '48 Hours Lab Time',
    features: [
      'Disassembly & ultrasonic burr chamber scrub',
      'Dial indicator runout measurement (radial & axial)',
      'Brass foil shim realignment under carrier mount',
      'Zero-point calibration & test grind laser analysis'
    ]
  },
  {
    id: 'service-boiler-overhaul',
    name: 'Comprehensive Dual-Boiler Descaling & Overhaul',
    tagline: 'Complete teardown, food-grade acid bath, replacement gaskets, and 48hr pressure testing.',
    price: 260.00,
    turnaround: '3–5 Business Days',
    features: [
      'Group head rebuild with silicone E61 gaskets',
      'Vacuum breaker & safety relief valve replacement',
      'Ultrasonic boiler & heat exchanger chemical flush',
      'PID thermostat bench-test & thermal trace log'
    ]
  },
  {
    id: 'service-preventative-refresh',
    name: 'Annual Precision Barista Refresh',
    tagline: 'Routine health check for home baristas and commercial pop-ups before peak season.',
    price: 135.00,
    turnaround: '24 Hours Lab Time',
    features: [
      'Shower screen, portafilter basket, & seal replacement',
      'Flow rate rate sensor & pump bar calibration',
      'Water TDS hardness analysis & filtration consult',
      'Full equipment certificate of performance'
    ]
  }
];
