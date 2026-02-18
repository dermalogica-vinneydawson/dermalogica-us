/**
 * Product Database & Recommendation Logic
 * Generated from Routine Matrix CSV
 */

(function(window) {
  'use strict';

  // Product sizes with prices (default size is typically 5.1oz for cleansers/moisturizers, 1.0oz for serums)
  const PRODUCT_SIZES = {
    'Special Cleansing Gel': [
      { size: '1.7 oz', price: 32.00 },
      { size: '3.4 oz', price: 39.00 },
      { size: '5.1 oz', price: 46.00 }
    ],
    'Daily Microfoliant': [
      { size: '0.45 oz', price: 24.00 },
      { size: '2.6 oz', price: 67.00 }
    ],
    'Dynamic Skin Recovery SPF50 Moisturizer': [
      { size: '1.7 oz', price: 62.00 },
      { size: '3.4 oz', price: 75.00 },
      { size: '5.1 oz', price: 89.00 }
    ],
    'Skin Smoothing Cream': [
      { size: '1.7 oz', price: 45.00 },
      { size: '3.4 oz', price: 55.00 },
      { size: '5.1 oz', price: 65.00 }
    ],
    'Precleanse Cleansing Oil': [
      { size: '1.7 oz', price: 34.00 },
      { size: '5.1 oz', price: 49.00 }
    ],
    'Circular Hydration Serum': [
      { size: '0.5 oz', price: 38.00 },
      { size: '1.0 oz', price: 76.00 }
    ],
    'Multi-Active Toner': [
      { size: '3.4 oz', price: 30.00 },
      { size: '5.1 oz', price: 43.00 }
    ],
    'Stress Positive Eye Lift': [
      { size: '0.5 oz', price: 72.00 }
    ],
    'BioLumin-C Vitamin C Serum': [
      { size: '0.5 oz', price: 48.00 },
      { size: '1.0 oz', price: 96.00 }
    ],
    'BioLumin-C Heat Aging Protector SPF50': [
      { size: '1.7 oz', price: 59.00 },
      { size: '3.4 oz', price: 72.00 },
      { size: '5.1 oz', price: 85.00 }
    ],
    'BioLumin-C Vitamin C Gel Moisturizer': [
      { size: '1.7 oz', price: 47.00 },
      { size: '3.4 oz', price: 57.00 },
      { size: '5.1 oz', price: 68.00 }
    ],
    'Daily Glycolic Cleanser': [
      { size: '1.7 oz', price: 36.00 },
      { size: '5.1 oz', price: 52.00 }
    ],
    'BioLumin-C Night Restore': [
      { size: '1.0 oz', price: 92.00 }
    ],
    'Antioxidant HydraMist': [
      { size: '3.4 oz', price: 27.00 },
      { size: '5.1 oz', price: 38.00 }
    ],
    'BioLumin-C Vitamin C Eye Serum': [
      { size: '0.5 oz', price: 72.00 }
    ],
    'UltraCalming Cleanser': [
      { size: '1.7 oz', price: 33.00 },
      { size: '5.1 oz', price: 48.00 }
    ],
    'Daily Milkfoliant': [
      { size: '0.45 oz', price: 24.00 },
      { size: '2.6 oz', price: 67.00 }
    ],
    'Stabilizing Repair Cream': [
      { size: '1.7 oz', price: 47.00 },
      { size: '3.4 oz', price: 57.00 },
      { size: '5.1 oz', price: 68.00 }
    ],
    'UltraCalming Mist': [
      { size: '3.4 oz', price: 29.00 },
      { size: '5.1 oz', price: 42.00 }
    ],
    'Acne Clearing Skin Wash': [
      { size: '1.7 oz', price: 29.00 },
      { size: '5.1 oz', price: 42.00 }
    ],
    'Porescreen Mineral Sunscreen SPF40': [
      { size: '1.7 oz', price: 45.00 },
      { size: '3.4 oz', price: 55.00 },
      { size: '5.1 oz', price: 65.00 }
    ],
    'Acne Biotic Moisturizer': [
      { size: '1.7 oz', price: 40.00 },
      { size: '3.4 oz', price: 49.00 },
      { size: '5.1 oz', price: 58.00 }
    ],
    'Age Bright Clearing Serum': [
      { size: '0.5 oz', price: 39.00 },
      { size: '1.0 oz', price: 78.00 }
    ],
    'Skin Resurfacing Lactic Acid Cleanser': [
      { size: '1.7 oz', price: 36.00 },
      { size: '5.1 oz', price: 52.00 }
    ],
    'Daily Superfoliant': [
      { size: '0.45 oz', price: 26.00 },
      { size: '2.6 oz', price: 72.00 }
    ],
    'Dynamic Skin Sculptor': [
      { size: '1.7 oz', price: 62.00 },
      { size: '5.1 oz', price: 89.00 }
    ]
  };

  // Helper function to get sizes for a product
  function getProductSizes(productName) {
    if (PRODUCT_SIZES[productName]) {
      return PRODUCT_SIZES[productName];
    }
    // Fallback: create a default size from the product's base price
    const basePrice = PRODUCT_DETAILS[productName]?.price || 0;
    return [{ size: 'Standard', price: basePrice }];
  }

  // Helper function to get default size (usually the largest/most common)
  function getDefaultSize(productName) {
    const sizes = getProductSizes(productName);
    return sizes[sizes.length - 1]; // Return largest size as default
  }

  // Product details database (prices, images, descriptions)
  const PRODUCT_DETAILS = {
    'Special Cleansing Gel': {
      price: 46.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/special-cleansing-gel_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Soap-free foaming gel cleanser removes impurities without disturbing skin\'s natural moisture balance.',
      category: 'Cleanse'
    },
    'Daily Microfoliant': {
      price: 67.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/01_DailyMicCampaign_PDP_benefits_Tile01.jpg?v=1762197961&width=990',
      description: 'Rice-based enzyme powder micro-exfoliates dulling debris for brighter, smoother skin.',
      category: 'Exfoliate'
    },
    'Dynamic Skin Recovery SPF50 Moisturizer': {
      price: 89.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/dynamic-skin-recovery-spf50_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Firming, anti-aging moisturizer with broad-spectrum SPF 50 for medium-weight UV defense and treatment.',
      category: 'Protect'
    },
    'Skin Smoothing Cream': {
      price: 65.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/skin-smoothing-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Medium-weight moisturizer with Active HydraMesh Technology for 48-hour continuous hydration.',
      category: 'Moisturize'
    },
    'Precleanse Cleansing Oil': {
      price: 49.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/1506187898_PDP_precleanse_5.1zbottle_benefits.jpg?v=1756229449&width=990',
      description: 'Deep-cleaning oil melts away layers of excess sebum, sunscreen, and waterproof makeup.',
      category: 'Cleanse'
    },
    'Circular Hydration Serum': {
      price: 76.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/circular-hydration-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Revolutionary serum provides continuous hydration using intelligent bio-delivery technology.',
      category: 'Treat'
    },
    'Multi-Active Toner': {
      price: 43.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/multi-active-toner_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Lightweight misting toner refreshes, hydrates, and smooths skin while lightly firming.',
      category: 'Tone'
    },
    'Stress Positive Eye Lift': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/stress-positive-eye-lift_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Cooling eye treatment reduces puffiness and dark circles while firming the delicate eye area.',
      category: 'Eye Care'
    },
    'BioLumin-C Vitamin C Serum': {
      price: 96.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/biolumin-c-serum_main-with-benefits_1.0oz.jpg?v=1756229454&width=990',
      description: 'Highly bioavailable Vitamin C serum delivers dramatically brighter, firmer skin.',
      category: 'Treat'
    },
    'BioLumin-C Heat Aging Protector SPF50': {
      price: 85.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/BioLuminCHeatAgingProtector_Benefits_dbbb4d1b-f25e-4d3c-ad2a-079243540608.jpg?v=1756236655&width=990',
      description: 'Advanced SPF 50 protects against UV damage and heat-induced aging while brightening skin.',
      category: 'Protect'
    },
    'BioLumin-C Vitamin C Gel Moisturizer': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/biolumin-c-gel-moisturizer_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Lightweight gel moisturizer with Vitamin C hydrates while brightening and firming.',
      category: 'Moisturize'
    },
    'Daily Glycolic Cleanser': {
      price: 52.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/daily-glycolic-cleanser_5.1oz_main-with-benefits.jpg?v=1766583416&width=990',
      description: 'Exfoliating cleanser with glycolic acid renews dull, uneven skin tone.',
      category: 'Cleanse'
    },
    'BioLumin-C Night Restore': {
      price: 92.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/biolumin-c-night-restore_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Overnight treatment with Vitamin C and peptides brightens and firms while you sleep.',
      category: 'Treat'
    },
    'Antioxidant HydraMist': {
      price: 38.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/antioxidant-hydramist_5.1oz_main-with-benefits.jpg?v=1763688531&width=990',
      description: 'Hydrating facial spritz with antioxidants refreshes and protects skin.',
      category: 'Tone'
    },
    'BioLumin-C Vitamin C Eye Serum': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/biolumin-c-eye-serum_main-with-benefits.jpg?v=1765891969&width=990',
      description: 'Vitamin C eye serum targets dark circles, puffiness and fine lines around the delicate eye area.',
      category: 'Eye Care'
    },
    'UltraCalming Cleanser': {
      price: 48.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/ultracalming-cleanser_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'pH-balanced gel/cream cleanser soothes and calms sensitive, reactive skin.',
      category: 'Cleanse'
    },
    'Daily Milkfoliant': {
      price: 67.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/daily-milkfoliant_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Gentle exfoliating powder with oat and hyaluronic acid for sensitive skin.',
      category: 'Exfoliate'
    },
    'Stabilizing Repair Cream': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/stabilizing-repair-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Intensive moisturizer helps strengthen compromised skin barrier and calm stressed or reactive skin.',
      category: 'Moisturize'
    },
    'UltraCalming Mist': {
      price: 42.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/ultracalming-mist_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Calming facial mist soothes sensitivity and redness while hydrating.',
      category: 'Tone'
    },
    'Acne Clearing Skin Wash': {
      price: 42.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/acne-clearing-skin-wash_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Foaming wash with salicylic acid clears breakouts and helps prevent future breakouts.',
      category: 'Cleanse'
    },
    'Porescreen Mineral Sunscreen SPF40': {
      price: 65.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/porescreen-spf40_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Mineral sunscreen with SPF 40 won\'t clog pores while protecting against UV damage.',
      category: 'Protect'
    },
    'Acne Biotic Moisturizer': {
      price: 58.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/acne-biotic-moisturizer_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Lightweight moisturizer with prebiotics helps clear and prevent breakouts.',
      category: 'Moisturize'
    },
    'Age Bright Clearing Serum': {
      price: 78.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/age-bright-clearing-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Dual-action serum clears breakouts while addressing early signs of aging.',
      category: 'Treat'
    },
    'Skin Resurfacing Lactic Acid Cleanser': {
      price: 52.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/skin-resurfacing-cleanser_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Lactic acid cleanser resurfaces and renews aging skin.',
      category: 'Cleanse'
    },
    'Daily Superfoliant': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/daily-superfoliant_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Highly active resurfacing powder provides powerful exfoliation for aging skin.',
      category: 'Exfoliate'
    },
    'Super Rich Repair Moisturizer': {
      price: 78.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/super-rich-repair_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Ultra-rich moisturizer intensely hydrates and repairs aging, depleted skin.',
      category: 'Moisturize'
    },
    'Dynamic Skin Strengthening Serum': {
      price: 98.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/dynamic-skin-strengthening-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Peptide-powered serum strengthens and firms aging skin.',
      category: 'Treat'
    },
    'Dynamic Skin Retinol Serum': {
      price: 125.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/dynamic-skin-retinol-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'High-performance retinol serum targets deep wrinkles and loss of firmness.',
      category: 'Treat'
    },
    'Antioxidant Hydramist': {
      price: 38.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/antioxidant-hydramist_5.1oz_main-with-benefits.jpg?v=1763688531&width=990',
      description: 'Hydrating facial spritz with antioxidants refreshes and protects skin.',
      category: 'Tone'
    },
    'Age Reversal Eye Complex': {
      price: 92.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/age-reversal-eye-complex_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Peptide-rich eye treatment addresses multiple signs of eye aging.',
      category: 'Eye Care'
    },
    'PowerBright Dark Spot Serum': {
      price: 82.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/powerbright-dark-spot-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Targeted serum visibly reduces dark spots and evens skin tone.',
      category: 'Treat'
    },
    'PowerBright Moisturizer SPF50': {
      price: 78.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/powerbright-moisturizer-spf50_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Brightening moisturizer with SPF 50 protects while evening skin tone.',
      category: 'Protect'
    },
    'PowerBright Overnight Cream': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/powerbright-overnight-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Overnight treatment visibly brightens and evens skin tone while you sleep.',
      category: 'Moisturize'
    },
    'PowerBright Dark Spot Peel': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/powerbright-dark-spot-peel_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'At-home peel treatment accelerates brightening and targets dark spots.',
      category: 'Exfoliate'
    },
    'Phyto Nature Firming Serum': {
      price: 130.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/phyto-nature-firming-serum_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Plant-powered serum with natural retinol alternative firms, nourishes and evens skin tone.',
      category: 'Treat'
    },
    'Phyto Nature Oxygen Cream': {
      price: 115.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/phyto-nature-oxygen-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Luxurious cream delivers oxygen and phytoactives for visibly firmer, more radiant skin.',
      category: 'Moisturize'
    },
    'Phyto Nature E² Regenerating Daily Exosome Leave-On Treatment': {
      price: 165.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/phyto-nature-exosome-treatment_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Advanced exosome technology delivers deep regeneration for mature skin.',
      category: 'Exfoliate'
    },
    'Phyto Nature Lifting Eye Cream': {
      price: 95.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/phyto-nature-lifting-eye-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Firming eye cream targets sagging and loss of elasticity around the eye area.',
      category: 'Eye Care'
    },
    'Calm Water Gel': {
      price: 52.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/calm-water-gel_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Weightless gel moisturizer hydrates and calms sensitive, stressed skin.',
      category: 'Moisturize'
    },
    'Breakout Clearing Foaming Wash': {
      price: 35.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/breakout-clearing-foaming-wash_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Foaming wash for teen skin clears and prevents breakouts without over-drying.',
      category: 'Cleanse'
    },
    'Clearing Defense SPF30': {
      price: 45.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/clearing-defense-spf30_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'SPF 30 moisturizer clears and prevents breakouts while protecting against UV damage.',
      category: 'Protect'
    },
    'Skin Soothing Hydrating Lotion': {
      price: 38.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/skin-soothing-hydrating-lotion_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Lightweight lotion hydrates and calms breakout-prone teen skin.',
      category: 'Moisturize'
    },
    'Breakout Clearing Booster': {
      price: 42.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/breakout-clearing-booster_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Targeted treatment clears breakouts fast and helps prevent future breakouts.',
      category: 'Treat'
    },
    'Magnetic[+] Afterglow Cleanser': {
      price: 58.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/magnetic-afterglow-cleanser_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Magnetic cleanser lifts away impurities while delivering a radiant glow.',
      category: 'Cleanse'
    },
    'Multivitamin Thermafoliant': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/multivitamin-thermafoliant_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Heat-activated exfoliant with vitamins resurfaces stressed, environmentally-damaged skin.',
      category: 'Exfoliate'
    },
    'Multivitamin Power Recovery Cream': {
      price: 78.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/multivitamin-power-recovery-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Vitamin-rich moisturizer repairs environmental damage and strengthens skin.',
      category: 'Moisturize'
    },
    'Multivitamin Power Recovery Masque': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/multivitamin-power-recovery-masque_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Intensive overnight masque delivers potent vitamins to repair stressed skin.',
      category: 'Treat'
    },
    'Multivitamin Power Firm Eye Cream': {
      price: 72.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/multivitamin-power-firm-eye-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Vitamin-rich eye cream firms and strengthens the delicate eye area.',
      category: 'Eye Care'
    },
    'UltraCalming Serum Concentrate': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/ultracalming-serum-concentrate_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Concentrated serum rapidly calms sensitivity, redness and irritation.',
      category: 'Treat'
    },
    'Invisible Physical Defense SPF30': {
      price: 62.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/invisible-physical-defense-spf30_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Ultra-sheer physical sunscreen protects sensitive skin without white cast.',
      category: 'Protect'
    },
    'stabilizing repair cream': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/stabilizing-repair-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Intensive moisturizer helps strengthen compromised skin barrier and calm stressed or reactive skin.',
      category: 'Moisturize'
    },
    'Stabilizing Repair Cream': {
      price: 68.00,
      image: 'https://www.dermalogica.com/cdn/shop/files/stabilizing-repair-cream_main-with-benefits.jpg?v=1756229448&width=990',
      description: 'Intensive moisturizer helps strengthen compromised skin barrier and calm stressed or reactive skin.',
      category: 'Moisturize'
    }
  };

  // Routine Matrix from CSV
  const ROUTINE_MATRIX = [
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Skin Smoothing Cream",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Circular Hydration Serum",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "Circular Hydration Serum",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Skin Smoothing Cream",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Circular Hydration Serum",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "Circular Hydration Serum",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Daily Skin Health",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Skin Smoothing Cream",
    "ageRange": "All (fallback for any age)",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Porescreen Mineral Sunscreen SPF40",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Acne Biotic Moisturizer",
    "ageRange": "19\u201324",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Age Bright Clearing Serum",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Porescreen Mineral Sunscreen SPF40",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "Age Bright Clearing Serum",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Acne Biotic Moisturizer",
    "ageRange": "19\u201324",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Age Bright Clearing Serum",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Porescreen Mineral Sunscreen SPF40",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Acne Clearing Skin Wash",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "19\u201324",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "19\u201324",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "Age Bright Clearing Serum",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "19\u201324",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Active Clearing",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Acne Biotic Moisturizer",
    "ageRange": "19\u201324",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "BioLumin-C Heat Aging Protector SPF50",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "BioLumin-C Vitamin C Gel Moisturizer",
    "ageRange": "25\u201334",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Daily Glycolic Cleanser",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "BioLumin-C Vitamin C Serum",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "BioLumin-C Heat Aging Protector SPF50",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "BioLumin-C Night Restore",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "BioLumin-C Vitamin C Gel Moisturizer",
    "ageRange": "25\u201334",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Daily Glycolic Cleanser",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Antioxidant HydraMist",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "BioLumin-C Vitamin C Serum",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "BioLumin-C Vitamin C Eye Serum",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "BioLumin-C Heat Aging Protector SPF50",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201334",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Antioxidant HydraMist",
    "ageRange": "25\u201334",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "BioLumin-C Night Restore",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "BioLumin-C Vitamin C Eye Serum",
    "ageRange": "25\u201334",
    "sensitiveSwap": ""
  },
  {
    "franchise": "BioLumin-C",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "BioLumin-C Vitamin C Gel Moisturizer",
    "ageRange": "25\u201334",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Clearing Defense SPF30",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Skin Soothing Hydrating Lotion",
    "ageRange": "Under 18",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Breakout Clearing Booster",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Clearing Defense SPF30",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Skin Soothing Hydrating Lotion",
    "ageRange": "Under 18",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Breakout Clearing Booster",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Clearing Defense SPF30",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Breakout Clearing Foaming Wash",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "Under 18",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "Under 18",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "Under 18",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Clear Start",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Skin Soothing Hydrating Lotion",
    "ageRange": "Under 18",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Superfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Super Rich Repair Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Superfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Dynamic Skin Strengthening Serum",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Superfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "Dynamic Skin Retinol Serum",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Super Rich Repair Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Superfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Antioxidant Hydramist",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Dynamic Skin Strengthening Serum",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Age Reversal Eye Complex",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Skin Resurfacing Lactic Acid Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Superfoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Antioxidant Hydramist",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "Dynamic Skin Retinol Serum",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Age Reversal Eye Complex",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Dynamic Skin",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Super Rich Repair Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Multivitamin Power Recovery Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Multivitamin Power Recovery Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "Multivitamin Power Recovery Masque",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Multivitamin Power Recovery Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Antioxidant HydraMist",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Multivitamin Power Recovery Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Multivitamin Power Firm Eye Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Magnetic[+] Afterglow Cleanser",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Multivitamin Thermafoliant",
    "ageRange": "35\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Antioxidant Hydramist",
    "ageRange": "35\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "Multivitamin Power Recovery Masque",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Multivitamin Power Firm Eye Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "MultiVitamin Power",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Multivitamin Power Recovery Cream",
    "ageRange": "35\u201344",
    "sensitiveSwap": "stabilizing repair cream"
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "PowerBright Moisturizer SPF50",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "PowerBright Overnight Cream",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "PowerBright Dark Spot Peel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "PowerBright Moisturizer SPF50",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "PowerBright Dark Spot Peel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "PowerBright Overnight Cream",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Microfoliant",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Stress Positive Eye Lift",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "PowerBright Moisturizer SPF50",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "PowerBright Dark Spot Peel",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "25\u201344",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "PowerBright Dark Spot Serum",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "BioLumin-C Vitamin C Eye Serum",
    "ageRange": "25\u201344",
    "sensitiveSwap": ""
  },
  {
    "franchise": "PowerBright",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "PowerBright Overnight Cream",
    "ageRange": "25\u201344",
    "sensitiveSwap": "Stabilizing Repair Cream"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Phyto Nature Oxygen Cream",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "Phyto Nature Firming Serum",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "Phyto Nature Firming Serum",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Phyto Nature Oxygen Cream",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "Multi-Active Toner",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "Phyto Nature Firming Serum",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Phyto Nature Lifting Eye Cream",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Dynamic Skin Recovery SPF50 Moisturizer",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "Special Cleansing Gel",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Cleanser"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Phyto Nature E\u00b2 Regenerating Daily Exosome Leave-On Treatment",
    "ageRange": "45+",
    "sensitiveSwap": "Daily Milkfoliant"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "Antioxidant HydraMist",
    "ageRange": "45+",
    "sensitiveSwap": "UltraCalming Mist"
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "Phyto Nature Firming Serum",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Phyto Nature Lifting Eye Cream",
    "ageRange": "45+",
    "sensitiveSwap": ""
  },
  {
    "franchise": "Phyto-Nature",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Phyto Nature Oxygen Cream",
    "ageRange": "45+",
    "sensitiveSwap": "Calm Water Gel"
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "AM",
    "step": 1,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "AM",
    "step": 2,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "AM",
    "step": 3,
    "product": "Invisible Physical Defense SPF30",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "PM",
    "step": 1,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "PM",
    "step": 2,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Essential",
    "timing": "PM",
    "step": 3,
    "product": "Stabilizing Repair Cream",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 2,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 3,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 4,
    "product": "UltraCalming Serum Concentrate",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "AM",
    "step": 5,
    "product": "Invisible Physical Defense SPF30",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 2,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 3,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 4,
    "product": "UltraCalming Serum Concentrate",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Enhanced",
    "timing": "PM",
    "step": 5,
    "product": "Stabilizing Repair Cream",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 2,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 3,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 4,
    "product": "UltraCalming Mist",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 5,
    "product": "UltraCalming Serum Concentrate",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 6,
    "product": "Multivitamin Power Firm Eye Cream",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "AM",
    "step": 7,
    "product": "Invisible Physical Defense SPF30",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 1,
    "product": "Precleanse Cleansing Oil",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 2,
    "product": "UltraCalming Cleanser",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 3,
    "product": "Daily Milkfoliant",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 4,
    "product": "UltraCalming Mist",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 5,
    "product": "UltraCalming Serum Concentrate",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 6,
    "product": "Multivitamin Power Firm Eye Cream",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  },
  {
    "franchise": "UltraCalming",
    "tier": "Comprehensive",
    "timing": "PM",
    "step": 7,
    "product": "Stabilizing Repair Cream",
    "ageRange": "All (sensitivity-led)",
    "sensitiveSwap": ""
  }
];

  // Expose to window
  window.DermalogicaData = {
    products: PRODUCT_DETAILS,
    routineMatrix: ROUTINE_MATRIX,
    
    /**
     * Get routine recommendations based on quiz results
     */
    getRecommendations: function(quizResults) {
      const { age, concern, tier, timing, sensitive } = quizResults;
      
      // Determine franchise based on concern and age
      let franchise = this.selectFranchise(concern, age);
      
      // Filter routine matrix
      let recommendations = ROUTINE_MATRIX.filter(item => 
        item.franchise === franchise && 
        item.tier === tier
      );
      
      // Apply sensitive swaps if needed
      if (sensitive) {
        recommendations = recommendations.map(item => {
          if (item.sensitiveSwap) {
            return { ...item, product: item.sensitiveSwap };
          }
          return item;
        });
      }
      
      // Filter by timing
      if (timing === 'AM') {
        recommendations = recommendations.filter(item => item.timing === 'AM');
      } else if (timing === 'PM') {
        recommendations = recommendations.filter(item => item.timing === 'PM');
      }
      // If timing === 'Both', include both AM and PM (no filtering needed)
      
      // Enhance with product details
      return recommendations.map(item => ({
        ...item,
        details: PRODUCT_DETAILS[item.product] || {}
      }));
    },
    
    /**
     * Select franchise based on concern and age
     */
    selectFranchise: function(concern, age) {
      const ageNum = parseInt(age);
      
      if (concern === 'Breakouts / acne') {
        return ageNum < 24 ? 'Clear Start' : 'Active Clearing';
      }
      if (concern === 'Sensitivity / redness') return 'UltraCalming';
      if (concern === 'Dullness / uneven tone') return 'BioLumin-C';
      if (concern === 'Dark spots / hyperpigmentation') return 'PowerBright';
      if (concern === 'Fine lines / wrinkles') return 'Dynamic Skin';
      if (concern === 'Loss of firmness / elasticity') return 'Phyto-Nature';
      if (concern === 'Stressed skin / environmental damage') return 'MultiVitamin Power';
      
      return 'Daily Skin Health'; // Default
    },
    
    /**
     * Get available sizes for a product
     */
    getProductSizes: function(productName) {
      return getProductSizes(productName);
    },
    
    /**
     * Get default size for a product
     */
    getDefaultSize: function(productName) {
      return getDefaultSize(productName);
    },
    
    /**
     * Get price for a specific product and size
     */
    getProductPrice: function(productName, size) {
      const sizes = getProductSizes(productName);
      const sizeOption = sizes.find(s => s.size === size);
      return sizeOption ? sizeOption.price : (PRODUCT_DETAILS[productName]?.price || 0);
    }
  };

})(window);
