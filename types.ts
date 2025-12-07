
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isJastiper?: boolean;
  role?: 'customer' | 'jastiper' | 'admin';
  asalDaerah?: string;
  phone?: string;
}

export interface ServiceItem {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  origin: string;
  destination: string;
  date: string;
  type: 'local' | 'global';
  capacityKg: number;
  rating: number;
  imageUrl: string;
  pricePerKg?: string;
  description: string;
  productName?: string;
  productPrice?: number;
  productVariant?: string;
}

export enum Page {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardView {
  HOME = 'HOME',
  SELECT_LOCATION = 'SELECT_LOCATION',
  CHAT_NEGOTIATION = 'CHAT_NEGOTIATION',
  PAYMENT = 'PAYMENT'
}
