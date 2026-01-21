
export enum FlowerCategory {
  BLOOM = 'Bloom',
  FILLER = 'Filler',
  GREENERY = 'Greenery',
  ACCENT = 'Accent'
}

export interface Flower {
  id: string;
  name: string;
  scientificName?: string;
  price: number;
  category: FlowerCategory;
  subCategory?: string;
  color: string;
  image: string;
  meaning: string;
  stock: number;
  origin: string;       // New factual field
  season: string;       // New factual field
  careInstructions: string; // New factual field
}

export interface WholesaleTier {
  id: string;
  minQuantity: number;
  discountPercentage: number;
}

export interface CustomerMultiplier {
  id: string;
  type: string;
  multiplier: number;
}

export interface WholesaleConfig {
  enabled: boolean;
  tiers: WholesaleTier[];
  customerMultipliers: CustomerMultiplier[];
  activeCustomerTypeId: string | null;
  simulatedQuantity: number;
}

export interface CustomBouquet {
  items: {
    flowerId: string;
    quantity: number;
    rotation: number;
    localRotation3D?: { x: number; y: number };
    scale: number;
    position: { x: number; y: number };
  }[];
  wrapType: 'paper' | 'burlap' | 'silk' | 'jute' | 'organza' | 'none';
  ribbonColor: string;
  customTexture?: string;
  textureIntensity?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'ready-made' | 'custom' | 'single stem';
  image: string;
}
