
import { Flower, FlowerCategory, CustomBouquet } from './types';

export const FLOWER_CATALOG: Flower[] = [
  // --- BLOOMS (Thrillers) ---
  {
    id: 'f1',
    name: 'Red Velvet Rose',
    scientificName: 'Rosa damascena',
    price: 4.50,
    category: FlowerCategory.BLOOM,
    color: 'Crimson Red',
    image: 'https://images.unsplash.com/photo-1548610762-65603720792a?q=80&w=600&h=600&fit=crop',
    meaning: 'Deep love and passion',
    stock: 50
  },
  {
    id: 'f2',
    name: 'White Lily',
    scientificName: 'Lilium candidum',
    price: 6.00,
    category: FlowerCategory.BLOOM,
    color: 'Pure White',
    image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?q=80&w=600&h=600&fit=crop',
    meaning: 'Purity and virtue',
    stock: 30
  },
  {
    id: 'f8',
    name: 'Pink Peony',
    scientificName: 'Paeonia lactiflora',
    price: 9.00,
    category: FlowerCategory.BLOOM,
    color: 'Soft Pink',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=600&h=600&fit=crop',
    meaning: 'Good fortune and honor',
    stock: 0 // Out of Stock
  },
  {
    id: 'f9',
    name: 'King Protea',
    scientificName: 'Protea cynaroides',
    price: 15.00,
    category: FlowerCategory.BLOOM,
    color: 'Dusty Pink',
    image: 'https://images.unsplash.com/photo-1558221683-f5bf4420808c?q=80&w=600&h=600&fit=crop',
    meaning: 'Diversity and courage',
    stock: 10
  },
  {
    id: 'f10',
    name: 'Cymbidium Orchid',
    scientificName: 'Cymbidium',
    price: 12.00,
    category: FlowerCategory.BLOOM,
    color: 'Chartreuse',
    image: 'https://images.unsplash.com/photo-1525310238806-f1941e263832?q=80&w=600&h=600&fit=crop',
    meaning: 'Luxury and strength',
    stock: 12
  },
  {
    id: 'f13',
    name: 'Black Bat Flower',
    scientificName: 'Tacca chantrieri',
    price: 18.50,
    category: FlowerCategory.BLOOM,
    color: 'Ebony',
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?q=80&w=600&h=600&fit=crop',
    meaning: 'The exotic and unknown',
    stock: 5
  },

  // --- FILLERS ---
  {
    id: 'f3',
    name: 'Blue Hydrangea',
    scientificName: 'Hydrangea macrophylla',
    price: 8.50,
    category: FlowerCategory.FILLER,
    color: 'Azure Blue',
    image: 'https://images.unsplash.com/photo-1507020995383-75bf6423b03a?q=80&w=600&h=600&fit=crop',
    meaning: 'Heartfelt emotion',
    stock: 20
  },
  {
    id: 'f4',
    name: 'Baby\'s Breath',
    scientificName: 'Gypsophila paniculata',
    price: 2.00,
    category: FlowerCategory.FILLER,
    color: 'Snow White',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&h=600&fit=crop',
    meaning: 'Everlasting love',
    stock: 100
  },
  {
    id: 'f14',
    name: 'Purple Statice',
    scientificName: 'Limonium sinuatum',
    price: 3.00,
    category: FlowerCategory.FILLER,
    color: 'Deep Purple',
    image: 'https://images.unsplash.com/photo-1523450001312-faa4e2e31f0f?q=80&w=600&h=600&fit=crop',
    meaning: 'Remembrance',
    stock: 0 // Out of Stock
  },

  // --- GREENERY ---
  {
    id: 'f5',
    name: 'Silver Eucalyptus',
    scientificName: 'Eucalyptus cinerea',
    price: 3.50,
    category: FlowerCategory.GREENERY,
    color: 'Silver Green',
    image: 'https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=600&h=600&fit=crop',
    meaning: 'Protection and abundance',
    stock: 45
  },
  {
    id: 'f11',
    name: 'Monstera Leaf',
    scientificName: 'Monstera deliciosa',
    price: 4.00,
    category: FlowerCategory.GREENERY,
    color: 'Deep Green',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&h=600&fit=crop',
    meaning: 'Long life and honor',
    stock: 25
  },
  {
    id: 'f15',
    name: 'Italian Ruscus',
    scientificName: 'Ruscus hypoglossum',
    price: 3.25,
    category: FlowerCategory.GREENERY,
    color: 'Forest Green',
    image: 'https://images.unsplash.com/photo-1622320641570-369403d8b37c?q=80&w=600&h=600&fit=crop',
    meaning: 'Thoughtfulness',
    stock: 40
  },

  // --- ACCENTS ---
  {
    id: 'f7',
    name: 'Lavender Stem',
    scientificName: 'Lavandula angustifolia',
    price: 2.50,
    category: FlowerCategory.ACCENT,
    color: 'Pale Purple',
    image: 'https://images.unsplash.com/photo-1512413911193-3d37433c018b?q=80&w=600&h=600&fit=crop',
    meaning: 'Serenity and grace',
    stock: 60
  },
  {
    id: 'f16',
    name: 'Dried Bunny Tails',
    scientificName: 'Lagurus ovatus',
    price: 1.50,
    category: FlowerCategory.ACCENT,
    color: 'Cream',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&h=600&fit=crop',
    meaning: 'Softness and whimsy',
    stock: 80
  },
  {
    id: 'f17',
    name: 'Globe Thistle',
    scientificName: 'Echinops',
    price: 4.75,
    category: FlowerCategory.ACCENT,
    color: 'Steel Blue',
    image: 'https://images.unsplash.com/photo-1601344440058-294711a4739d?q=80&w=600&h=600&fit=crop',
    meaning: 'Independence',
    stock: 15
  }
];

export const WRAP_STYLES = [
  { id: 'paper', name: 'Rustic Kraft Paper', price: 2.00 },
  { id: 'silk', name: 'Elegant Silk Wrap', price: 10.00 },
  { id: 'burlap', name: 'Vintage Burlap', price: 5.00 },
  { id: 'jute', name: 'Natural Jute', price: 4.00 },
  { id: 'organza', name: 'Sheer Organza', price: 12.00 },
  { id: 'none', name: 'No Wrap (Stems only)', price: 0 }
];

export const PRESET_BOUQUETS: Record<string, CustomBouquet> = {
  Romantic: {
    items: [
      { flowerId: 'f1', quantity: 2, rotation: -10, scale: 1.1, position: { x: 42, y: 38 } },
      { flowerId: 'f1', quantity: 1, rotation: 15, scale: 1.0, position: { x: 58, y: 42 } },
      { flowerId: 'f10', quantity: 2, rotation: 0, scale: 1.2, position: { x: 50, y: 32 } },
      { flowerId: 'f4', quantity: 4, rotation: 45, scale: 0.9, position: { x: 35, y: 45 } },
      { flowerId: 'f4', quantity: 4, rotation: -30, scale: 0.8, position: { x: 65, y: 35 } }
    ],
    wrapType: 'silk',
    ribbonColor: '#f472b6'
  },
  Modern: {
    items: [
      { flowerId: 'f10', quantity: 1, rotation: 0, scale: 1.3, position: { x: 50, y: 35 } },
      { flowerId: 'f2', quantity: 2, rotation: -20, scale: 1.1, position: { x: 40, y: 45 } },
      { flowerId: 'f2', quantity: 2, rotation: 20, scale: 1.1, position: { x: 60, y: 45 } },
      { flowerId: 'f11', quantity: 2, rotation: 10, scale: 1.2, position: { x: 52, y: 25 } }
    ],
    wrapType: 'organza',
    ribbonColor: '#ffffff'
  },
  Rustic: {
    items: [
      { flowerId: 'f9', quantity: 2, rotation: 5, scale: 1.2, position: { x: 45, y: 35 } },
      { flowerId: 'f16', quantity: 1, rotation: -15, scale: 1.1, position: { x: 58, y: 40 } },
      { flowerId: 'f7', quantity: 5, rotation: 0, scale: 1.0, position: { x: 35, y: 40 } },
      { flowerId: 'f7', quantity: 5, rotation: 10, scale: 1.0, position: { x: 65, y: 40 } },
      { flowerId: 'f5', quantity: 3, rotation: -10, scale: 1.1, position: { x: 50, y: 28 } }
    ],
    wrapType: 'burlap',
    ribbonColor: '#8b7355'
  }
};
