
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
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0fab?auto=format&fit=crop&q=80&w=2400',
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
    image: 'https://images.unsplash.com/photo-1548610762-65603720792a?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Grace, gratitude, and elegance',
    stock: 120,
    origin: 'JAPAN',
    season: 'SUMMER',
    careInstructions: 'Trim stems at 45° angle; change water every 2 days; use provided flower food.'
  },
  {
    id: 'f3',
    name: 'Blush Dahlia',
    scientificName: 'DAHLIA PINNATA',
    price: 11.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Romantic',
    color: 'Blush Pink',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Elegance and inner strength',
    stock: 60,
    origin: 'MEXICO',
    season: 'SUMMER / FALL',
    careInstructions: 'Recut stems daily; prefer cool temperatures; change water frequently.'
  },
  {
    id: 'f7',
    name: 'King Protea',
    scientificName: 'PROTEA CYNAROIDES',
    price: 15.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Exotic',
    color: 'Dusty Pink',
    image: 'https://images.unsplash.com/photo-1558221683-f5bf4420808c?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Diversity and courage',
    stock: 25,
    origin: 'SOUTH AFRICA',
    season: 'WINTER / SPRING',
    careInstructions: 'High water consumption; maintain deep reservoir; keep in bright, airy spaces.'
  },
  {
    id: 'f8',
    name: 'White Ranunculus',
    scientificName: 'RANUNCULUS ASIATICUS',
    price: 7.50,
    category: FlowerCategory.BLOOM,
    subCategory: 'Classic',
    color: 'Pure White',
    image: 'https://images.unsplash.com/photo-1525310238806-f1941e263832?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Charm and attraction',
    stock: 90,
    origin: 'NETHERLANDS',
    season: 'SPRING',
    careInstructions: 'Keep in shallow water; avoid direct sunlight; lasts 7-10 days.'
  },
  {
    id: 'f9',
    name: 'Garden Rose',
    scientificName: 'ROSA CENTIFOLIA',
    price: 14.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Luxury',
    color: 'Deep Burgundy',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Passion and deep love',
    stock: 35,
    origin: 'ECUADOR',
    season: 'YEAR-ROUND',
    careInstructions: 'Remove guard petals; use flower food; recut stems every 3 days.'
  },
  {
    id: 'f10',
    name: 'Anemone Coronaria',
    scientificName: 'ANEMONE CORONARIA',
    price: 9.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Modern',
    color: 'Deep Purple',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Anticipation and protection',
    stock: 75,
    origin: 'MEDITERRANEAN',
    season: 'WINTER / SPRING',
    careInstructions: 'Very thirsty blooms; check water level daily; avoid direct heat.'
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
    image: 'https://images.unsplash.com/photo-1594801127027-2c9748b89410?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Appreciation and long-lasting bond',
    stock: 85,
    origin: 'NORTH AMERICA',
    season: 'SUMMER / FALL',
    careInstructions: 'Remove wilted lower blooms to encourage top buds to open; keep water clean.'
  },
  {
    id: 'f11',
    name: 'Gypsophila',
    scientificName: 'GYPSOPHILA PANICULATA',
    price: 4.00,
    category: FlowerCategory.FILLER,
    subCategory: 'Classic',
    color: 'White',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Everlasting love and purity',
    stock: 150,
    origin: 'EASTERN EUROPE',
    season: 'YEAR-ROUND',
    careInstructions: 'Very hardy; requires minimal water; can be dried for lasting arrangements.'
  },
  {
    id: 'f13',
    name: 'Astilbe',
    scientificName: 'ASTILBE CHINENSIS',
    price: 5.00,
    category: FlowerCategory.FILLER,
    subCategory: 'Romantic',
    color: 'Dusty Rose',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Patience and dedication',
    stock: 70,
    origin: 'ASIA',
    season: 'SUMMER',
    careInstructions: 'Keep stems in deep water; avoid high temperatures; mist daily.'
  },
  {
    id: 'f14',
    name: 'Wax Flower',
    scientificName: 'CHAMELAUCIUM UNCINATUM',
    price: 5.50,
    category: FlowerCategory.FILLER,
    subCategory: 'Wild',
    color: 'Pale Pink',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Riches and lasting love',
    stock: 95,
    origin: 'AUSTRALIA',
    season: 'WINTER / SPRING',
    careInstructions: 'Extremely long-lasting; minimal water needed; fragrant blooms.'
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
    image: 'https://images.unsplash.com/photo-1599321955726-e0484293cc4f?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Protection and rejuvenation',
    stock: 200,
    origin: 'AUSTRALIA',
    season: 'YEAR-ROUND',
    careInstructions: 'Extremely long-lasting; change water weekly; can be dried for perpetual use.'
  },
  {
    id: 'f15',
    name: 'Italian Ruscus',
    scientificName: 'RUSCUS HYPOGLOSSUM',
    price: 3.50,
    category: FlowerCategory.GREENERY,
    subCategory: 'Classic',
    color: 'Deep Green',
    image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Endurance and strength',
    stock: 180,
    origin: 'MEDITERRANEAN',
    season: 'YEAR-ROUND',
    careInstructions: 'Extremely hardy; lasts 2-3 weeks; minimal maintenance required.'
  },
  {
    id: 'f16',
    name: 'Seeded Eucalyptus',
    scientificName: 'EUCALYPTUS POLYANTHEMOS',
    price: 5.00,
    category: FlowerCategory.GREENERY,
    subCategory: 'Wild',
    color: 'Silver Green',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb578d5a5b8?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Healing and new beginnings',
    stock: 120,
    origin: 'AUSTRALIA',
    season: 'YEAR-ROUND',
    careInstructions: 'Can be used fresh or dried; aromatic foliage; long-lasting.'
  },
  {
    id: 'f17',
    name: 'Monstera Leaf',
    scientificName: 'MONSTERA DELICIOSA',
    price: 8.00,
    category: FlowerCategory.GREENERY,
    subCategory: 'Tropical',
    color: 'Vibrant Green',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Honor and respect',
    stock: 50,
    origin: 'CENTRAL AMERICA',
    season: 'YEAR-ROUND',
    careInstructions: 'Keep submerged in deep water; mist leaves regularly; handle with care.'
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
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Austerity and independence',
    stock: 55,
    origin: 'EUROPE',
    season: 'SUMMER / AUTUMN',
    careInstructions: 'Handle with gloves; keep in moderate water levels; avoids high humidity.'
  },
  {
    id: 'f18',
    name: 'Craspedia',
    scientificName: 'CRASPEDIA GLOBOSA',
    price: 4.50,
    category: FlowerCategory.ACCENT,
    subCategory: 'Modern',
    color: 'Golden Yellow',
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Good health and happiness',
    stock: 100,
    origin: 'AUSTRALIA',
    season: 'SUMMER',
    careInstructions: 'Dries naturally; minimal water needed; adds playful texture.'
  },
  {
    id: 'f19',
    name: 'Dried Lavender',
    scientificName: 'LAVANDULA ANGUSTIFOLIA',
    price: 6.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Rustic',
    color: 'Lavender Purple',
    image: 'https://images.unsplash.com/photo-1499062996028-d3efb8c0d4c9?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Devotion and serenity',
    stock: 130,
    origin: 'PROVENCE, FRANCE',
    season: 'SUMMER',
    careInstructions: 'Already dried; no water needed; fragrant for months.'
  },
  {
    id: 'f20',
    name: 'Dried Bunny Tails',
    scientificName: 'LAGURUS OVATUS',
    price: 5.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Whimsical',
    color: 'Natural Cream',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=2400',
    meaning: 'Softness and tranquility',
    stock: 85,
    origin: 'MEDITERRANEAN',
    season: 'YEAR-ROUND',
    careInstructions: 'Dried grass; no water needed; extremely long-lasting.'
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
