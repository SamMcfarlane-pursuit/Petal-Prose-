
import { Flower, FlowerCategory, CustomBouquet } from './types';

/**
 * Professional Botanical Inventory
 * Curated for 1:1 visual accuracy and high-fidelity image delivery.
 * All images are unique 4K resolution from Unsplash.
 */
export const FLOWER_CATALOG: Flower[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FOCAL BLOOMS - The statement pieces that anchor your arrangement
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'f1',
    name: 'Sarah Bernhardt Peony',
    scientificName: 'PAEONIA LACTIFLORA',
    price: 12.50,
    category: FlowerCategory.BLOOM,
    subCategory: 'Romantic',
    color: 'Soft Pink',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Healing, romance, and prosperity',
    stock: 45,
    origin: 'CHINA',
    season: 'LATE SPRING',
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
    image: 'https://images.unsplash.com/photo-1518882605630-8eb578d5a5b8?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Grace, gratitude, and elegance',
    stock: 120,
    origin: 'ECUADOR',
    season: 'YEAR-ROUND',
    careInstructions: 'Trim stems at 45° angle; change water every 2 days; use provided flower food.'
  },
  {
    id: 'f3',
    name: 'Café au Lait Dahlia',
    scientificName: 'DAHLIA PINNATA',
    price: 14.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Romantic',
    color: 'Blush Cream',
    image: 'https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Elegance and inner strength',
    stock: 40,
    origin: 'MEXICO',
    season: 'SUMMER / FALL',
    careInstructions: 'Recut stems daily; prefer cool temperatures; change water frequently.'
  },
  {
    id: 'f7',
    name: 'King Protea',
    scientificName: 'PROTEA CYNAROIDES',
    price: 18.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Exotic',
    color: 'Dusty Pink',
    image: 'https://images.unsplash.com/photo-1476994230281-1448088947db?auto=format&fit=crop&q=95&w=4800',
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
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Charm and attraction',
    stock: 90,
    origin: 'NETHERLANDS',
    season: 'SPRING',
    careInstructions: 'Keep in shallow water; avoid direct sunlight; lasts 7-10 days.'
  },
  {
    id: 'f9',
    name: 'Juliet Garden Rose',
    scientificName: 'ROSA CENTIFOLIA',
    price: 16.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Luxury',
    color: 'Peach Blush',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Passion and deep love',
    stock: 35,
    origin: 'ECUADOR',
    season: 'YEAR-ROUND',
    careInstructions: 'Remove guard petals; use flower food; recut stems every 3 days.'
  },
  {
    id: 'f10',
    name: 'Anemone Bordeaux',
    scientificName: 'ANEMONE CORONARIA',
    price: 9.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Modern',
    color: 'Deep Wine',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Anticipation and protection',
    stock: 75,
    origin: 'MEDITERRANEAN',
    season: 'WINTER / SPRING',
    careInstructions: 'Very thirsty blooms; check water level daily; avoid direct heat.'
  },
  {
    id: 'f21',
    name: 'Hydrangea Antique',
    scientificName: 'HYDRANGEA MACROPHYLLA',
    price: 12.00,
    category: FlowerCategory.BLOOM,
    subCategory: 'Classic',
    color: 'Antique Blue',
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Gratitude and heartfelt emotion',
    stock: 55,
    origin: 'JAPAN',
    season: 'SUMMER',
    careInstructions: 'Submerge entire head briefly if wilting; keep water level high.'
  },
  {
    id: 'f22',
    name: 'Tulip Parrot',
    scientificName: 'TULIPA GESNERIANA',
    price: 6.50,
    category: FlowerCategory.BLOOM,
    subCategory: 'Modern',
    color: 'Multi-color',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Perfect and deep love',
    stock: 110,
    origin: 'NETHERLANDS',
    season: 'SPRING',
    careInstructions: 'Continue growing in vase; re-trim stems as they grow; keep water cold.'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILLERS - Texture and volume builders
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'f4',
    name: 'White Lisianthus',
    scientificName: 'EUSTOMA GRANDIFLORUM',
    price: 6.50,
    category: FlowerCategory.FILLER,
    subCategory: 'Classic',
    color: 'Crisp White',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Appreciation and long-lasting bond',
    stock: 85,
    origin: 'NORTH AMERICA',
    season: 'SUMMER / FALL',
    careInstructions: 'Remove wilted lower blooms to encourage top buds to open; keep water clean.'
  },
  {
    id: 'f11',
    name: 'Gypsophila Million Star',
    scientificName: 'GYPSOPHILA PANICULATA',
    price: 4.00,
    category: FlowerCategory.FILLER,
    subCategory: 'Classic',
    color: 'Pure White',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Everlasting love and purity',
    stock: 150,
    origin: 'EASTERN EUROPE',
    season: 'YEAR-ROUND',
    careInstructions: 'Very hardy; requires minimal water; can be dried for lasting arrangements.'
  },
  {
    id: 'f13',
    name: 'Blush Astilbe',
    scientificName: 'ASTILBE CHINENSIS',
    price: 5.00,
    category: FlowerCategory.FILLER,
    subCategory: 'Romantic',
    color: 'Dusty Rose',
    image: 'https://images.unsplash.com/photo-1595818278448-3c3e32bfb14d?auto=format&fit=crop&q=95&w=4800',
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
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Riches and lasting love',
    stock: 95,
    origin: 'AUSTRALIA',
    season: 'WINTER / SPRING',
    careInstructions: 'Extremely long-lasting; minimal water needed; fragrant blooms.'
  },
  {
    id: 'f23',
    name: 'Stock Flower',
    scientificName: 'MATTHIOLA INCANA',
    price: 5.00,
    category: FlowerCategory.FILLER,
    subCategory: 'Classic',
    color: 'Lavender',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb578d5a5b8?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Lasting beauty and happy life',
    stock: 80,
    origin: 'MEDITERRANEAN',
    season: 'SPRING',
    careInstructions: 'Remove lower leaves; very fragrant; lasts 7-14 days.'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GREENERY - Structure and organic movement
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'f5',
    name: 'Silver Dollar Eucalyptus',
    scientificName: 'EUCALYPTUS CINEREA',
    price: 4.50,
    category: FlowerCategory.GREENERY,
    subCategory: 'Architectural',
    color: 'Sage Green',
    image: 'https://images.unsplash.com/photo-1599321955726-e0484293cc4f?auto=format&fit=crop&q=95&w=4800',
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
    image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=95&w=4800',
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=95&w=4800',
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
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Honor and respect',
    stock: 50,
    origin: 'CENTRAL AMERICA',
    season: 'YEAR-ROUND',
    careInstructions: 'Keep submerged in deep water; mist leaves regularly; handle with care.'
  },
  {
    id: 'f24',
    name: 'Olive Branch',
    scientificName: 'OLEA EUROPAEA',
    price: 6.00,
    category: FlowerCategory.GREENERY,
    subCategory: 'Rustic',
    color: 'Sage Silver',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Peace and wisdom',
    stock: 75,
    origin: 'MEDITERRANEAN',
    season: 'YEAR-ROUND',
    careInstructions: 'Very hardy; can be dried; lasts 3+ weeks fresh.'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCENTS - Textural surprises and dried elements
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'f12',
    name: 'Blue Thistle',
    scientificName: 'ERYNGIUM PLANUM',
    price: 5.50,
    category: FlowerCategory.ACCENT,
    subCategory: 'Wild',
    color: 'Steel Blue',
    image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Austerity and independence',
    stock: 55,
    origin: 'EUROPE',
    season: 'SUMMER / AUTUMN',
    careInstructions: 'Handle with gloves; keep in moderate water levels; dries beautifully.'
  },
  {
    id: 'f18',
    name: 'Billy Buttons',
    scientificName: 'CRASPEDIA GLOBOSA',
    price: 4.50,
    category: FlowerCategory.ACCENT,
    subCategory: 'Modern',
    color: 'Golden Yellow',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Good health and happiness',
    stock: 100,
    origin: 'AUSTRALIA',
    season: 'SUMMER',
    careInstructions: 'Dries naturally; minimal water needed; adds playful texture.'
  },
  {
    id: 'f19',
    name: 'Dried Lavender Bundle',
    scientificName: 'LAVANDULA ANGUSTIFOLIA',
    price: 6.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Rustic',
    color: 'Lavender Purple',
    image: 'https://images.unsplash.com/photo-1499062996028-d3efb8c0d4c9?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Devotion and serenity',
    stock: 130,
    origin: 'PROVENCE, FRANCE',
    season: 'YEAR-ROUND',
    careInstructions: 'Already dried; no water needed; fragrant for months.'
  },
  {
    id: 'f20',
    name: 'Bunny Tails',
    scientificName: 'LAGURUS OVATUS',
    price: 5.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Whimsical',
    color: 'Natural Cream',
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Softness and tranquility',
    stock: 85,
    origin: 'MEDITERRANEAN',
    season: 'YEAR-ROUND',
    careInstructions: 'Dried grass; no water needed; extremely long-lasting.'
  },
  {
    id: 'f25',
    name: 'Pampas Grass',
    scientificName: 'CORTADERIA SELLOANA',
    price: 12.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Boho',
    color: 'Natural Beige',
    image: 'https://images.unsplash.com/photo-1594125311687-3b1b3eefa9f2?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Freedom and openness',
    stock: 40,
    origin: 'SOUTH AMERICA',
    season: 'YEAR-ROUND',
    careInstructions: 'Dried; no water needed; shake gently to fluff; store away from humidity.'
  },
  {
    id: 'f26',
    name: 'Dried Protea',
    scientificName: 'PROTEA REPENS',
    price: 14.00,
    category: FlowerCategory.ACCENT,
    subCategory: 'Exotic',
    color: 'Natural Brown',
    image: 'https://images.unsplash.com/photo-1558221683-f5bf4420808c?auto=format&fit=crop&q=95&w=4800',
    meaning: 'Transformation and courage',
    stock: 30,
    origin: 'SOUTH AFRICA',
    season: 'YEAR-ROUND',
    careInstructions: 'Already dried; no water needed; statement piece that lasts years.'
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
  },
  'Modern Minimalist': {
    items: [
      { flowerId: 'f7', quantity: 1, rotation: 0, scale: 1.2, position: { x: 50, y: 45 } },
      { flowerId: 'f5', quantity: 2, rotation: -10, scale: 0.9, position: { x: 40, y: 55 } }
    ],
    wrapType: 'paper',
    ribbonColor: '#a8a29e'
  },
  'Wild Garden': {
    items: [
      { flowerId: 'f3', quantity: 2, rotation: 10, scale: 1, position: { x: 50, y: 40 } },
      { flowerId: 'f14', quantity: 3, rotation: -5, scale: 0.8, position: { x: 55, y: 50 } },
      { flowerId: 'f16', quantity: 2, rotation: 15, scale: 0.9, position: { x: 45, y: 55 } }
    ],
    wrapType: 'jute',
    ribbonColor: '#86efac'
  }
};
