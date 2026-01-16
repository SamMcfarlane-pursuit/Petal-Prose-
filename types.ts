
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
  color: string;
  image: string;
  meaning: string;
  stock: number;
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
    scale: number;
    position: { x: number; y: number };
  }[];
  wrapType: 'paper' | 'burlap' | 'silk' | 'jute' | 'organza' | 'none';
  ribbonColor: string;
  customTexture?: string; // Base64 data for the AI-generated texture
  textureIntensity?: number; // Opacity value from 0 to 1
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'ready-made' | 'custom';
  image: string;
}
