
import { Flower, FlowerCategory, CustomBouquet } from './types';

/**
 * Professional Botanical Inventory
 * Curated for 1:1 visual accuracy and high-fidelity image delivery.
 */
export const FLOWER_CATALOG: Flower[] = [
  // --- BLOOMS ---
  {
    id: 'f1',
    name: 'Sarah Bernhardt Peony',
    scientificName: 'PAEONIA LACTIFLORA',
    price: 12.50,
    category: FlowerCategory.BLOOM,
    subCategory: 'Romantic',
    color: 'Soft Pink',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0fab?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Healing, romance, and prosperity',
    stock: 45,
    origin: 'SOUTH AFRICA',
    season: 'WINTER / SPRING',
    careInstructions: 'Keep in cool water; prune leaves below waterline; highly sensitive to heat.'
  },
  {
    id: 'f2',
    name: 'Quicksand Rose',
    scientificName: 'ROSA X HYBRIDA',
    price: 8.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Modern',
    color: 'Champagne',
    image: 'https://images.unsplash.com/photo-1548610762-65603720792a?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Grace, gratitude, and elegance',
    stock: 120,
    origin: 'JAPAN',
    season: 'SUMMER',
    careInstructions: 'Trim stems at 45° angle; change water every 2 days; use provided flower food.'
  },
  {
    id: 'f7',
    name: 'King Protea',
    scientificName: 'PROTEA CYNAROIDES',
    price: 15.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Exotic',
    color: 'Dusty Pink',
    image: 'https://images.unsplash.com/photo-1558221683-f5bf4420808c?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Diversity and courage',
    stock: 25,
    origin: 'SOUTH AFRICA',
    season: 'WINTER / SPRING',
    careInstructions: 'High water consumption; maintain deep reservoir; keep in bright, airy spaces.'
  },

  // --- FILLERS ---
  {
    id: 'f4',
    name: 'White Lisianthus',
    scientificName: 'EUSTOMA GRANDIFLORUM',
    price: 6.50,
    category: FlowerCategory.FILLER,
    subCategory: 'Classic',
    color: 'Crisp White',
    image: 'https://images.unsplash.com/photo-1594801127027-2c9748b89410?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Appreciation and long-lasting bond',
    stock: 85,
    origin: 'NORTH AMERICA',
    season: 'SUMMER / FALL',
    careInstructions: 'Remove wilted lower blooms to encourage top buds to open; keep water clean.'
  },

  // --- GREENERY ---
  {
    id: 'f5',
    name: 'Silver Dollar Eucalyptus',
    scientificName: 'EUCALYPTUS CINEREA',
    price: 4.50,
    category: FlowerCategory.GREENERY,
    subCategory: 'Architectural',
    color: 'Sage Green',
    image: 'https://images.unsplash.com/photo-1599321955726-e0484293cc4f?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Protection and rejuvenation',
    stock: 200,
    origin: 'AUSTRALIA',
    season: 'YEAR-ROUND',
    careInstructions: 'Extremely long-lasting; change water weekly; can be dried for perpetual use.'
  },

  // --- ACCENT ---
  {
    id: 'f12',
    name: 'Thistle Eryngium',
    scientificName: 'ERYNGIUM PLANUM',
    price: 5.50,
    category: FlowerCategory.ACCENT,
    subCategory: 'Wild',
    color: 'Blue Steel',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=1200',
    meaning: 'Austerity and independence',
    stock: 55,
    origin: 'EUROPE',
    season: 'SUMMER / AUTUMN',
    careInstructions: 'Handle with gloves; keep in moderate water levels; avoids high humidity.'
  }
];

export const WRAP_STYLES = [
  { id: 'paper', name: 'Kraft Paper', price: 2.00 },
  { id: 'burlap', name: 'Rustic Burlap', price: 4.50 },
  { id: 'silk', name: 'Italian Silk', price: 15.00 },
  { id: 'jute', name: 'Eco Jute', price: 3.00 },
  { id: 'organza', name: 'Sheer Organza', price: 6.00 },
  { id: 'none', name: 'Hand-Tied', price: 0.00 }
];

export const PRESET_BOUQUETS: Record<string, CustomBouquet> = {
  'Romantic': {
    items: [
      { flowerId: 'f1', quantity: 3, rotation: 15, scale: 1.1, position: { x: 50, y: 40 } },
      { flowerId: 'f2', quantity: 2, rotation: 5, scale: 1, position: { x: 60, y: 50 } }
    ],
    wrapType: 'silk',
    ribbonColor: '#f472b6'
  }
};
