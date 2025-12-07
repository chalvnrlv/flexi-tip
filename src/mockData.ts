// Mock Data untuk FlexiTip - Demo Purposes Only
// Data dummy dengan locale Indonesia

import { User } from '../types';

// ============================================
// MOCK USERS (Customer & Jastiper)
// ============================================

export interface MockUser extends User {
  password: string; // For demo login only
}

export const MOCK_USERS: MockUser[] = [
  // Customers
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi@customer.com',
    password: 'password123',
    phone: '081234567890',
    role: 'customer',
    asalDaerah: 'Jakarta',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti@customer.com',
    password: 'password123',
    phone: '081234567891',
    role: 'customer',
    asalDaerah: 'Bandung',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    email: 'andi@customer.com',
    password: 'password123',
    phone: '081234567892',
    role: 'customer',
    asalDaerah: 'Surabaya',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    email: 'dewi@customer.com',
    password: 'password123',
    phone: '081234567893',
    role: 'customer',
    asalDaerah: 'Yogyakarta',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Rudi Hartono',
    email: 'rudi@customer.com',
    password: 'password123',
    phone: '081234567894',
    role: 'customer',
    asalDaerah: 'Medan',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },

  // Jastipers
  {
    id: '101',
    name: 'Sarah Jastip Jakarta',
    email: 'sarah@jastiper.com',
    password: 'password123',
    phone: '082134567890',
    role: 'jastiper',
    asalDaerah: 'Jakarta',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
  {
    id: '102',
    name: 'Toko Thailand Import',
    email: 'thailand@jastiper.com',
    password: 'password123',
    phone: '082134567891',
    role: 'jastiper',
    asalDaerah: 'Jakarta',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '103',
    name: 'Korea Shop Bandung',
    email: 'korea@jastiper.com',
    password: 'password123',
    phone: '082134567892',
    role: 'jastiper',
    asalDaerah: 'Bandung',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '104',
    name: 'Bali Souvenir Hub',
    email: 'bali@jastiper.com',
    password: 'password123',
    phone: '082134567893',
    role: 'jastiper',
    asalDaerah: 'Surabaya',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: '105',
    name: 'Singapore Mall',
    email: 'singapore@jastiper.com',
    password: 'password123',
    phone: '082134567894',
    role: 'jastiper',
    asalDaerah: 'Jakarta',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: '106',
    name: 'Japan Market Surabaya',
    email: 'japan@jastiper.com',
    password: 'password123',
    phone: '082134567895',
    role: 'jastiper',
    asalDaerah: 'Surabaya',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: '107',
    name: 'Jogja Batik Center',
    email: 'jogja@jastiper.com',
    password: 'password123',
    phone: '082134567896',
    role: 'jastiper',
    asalDaerah: 'Jakarta',
    isJastiper: true,
    avatar: 'https://i.pravatar.cc/150?img=16',
  },
];

// ============================================
// MOCK PRODUCTS
// ============================================

export interface MockProduct {
  id: string;
  jastiperId: string;
  jastiperName: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  asalProduk: string;
  tujuanProduk: string;
  images: string[];
  stock: number;
  estimatedWeight: number;
  status: 'available' | 'out_of_stock';
  type: 'local' | 'global';
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // Thailand Products
  {
    id: 'p1',
    jastiperId: '102',
    jastiperName: 'Toko Thailand Import',
    name: 'Srichand Translucent Powder',
    description: 'Bedak Thailand original yang terkenal halus dan tahan lama',
    category: 'Kosmetik',
    brand: 'Srichand',
    price: 85000,
    currency: 'IDR',
    asalProduk: 'Bangkok, Thailand',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/FFB6C1/FFF?text=Srichand+Powder'],
    stock: 25,
    estimatedWeight: 0.3,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p2',
    jastiperId: '102',
    jastiperName: 'Toko Thailand Import',
    name: 'Mistine 4D Mascara',
    description: 'Maskara waterproof terlaris dari Thailand',
    category: 'Kosmetik',
    brand: 'Mistine',
    price: 45000,
    currency: 'IDR',
    asalProduk: 'Bangkok, Thailand',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/87CEEB/FFF?text=Mistine+Mascara'],
    stock: 30,
    estimatedWeight: 0.1,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p3',
    jastiperId: '102',
    jastiperName: 'Toko Thailand Import',
    name: 'Thai Tea Number One Brand',
    description: 'Thai tea asli Thailand dengan rasa authentic',
    category: 'Makanan & Minuman',
    brand: 'Number One',
    price: 120000,
    currency: 'IDR',
    asalProduk: 'Bangkok, Thailand',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/FFD700/000?text=Thai+Tea'],
    stock: 15,
    estimatedWeight: 1.0,
    status: 'available',
    type: 'global',
  },

  // Korea Products
  {
    id: 'p4',
    jastiperId: '103',
    jastiperName: 'Korea Shop Bandung',
    name: 'Laneige Water Sleeping Mask',
    description: 'Masker tidur yang melembabkan kulit wajah',
    category: 'Skincare',
    brand: 'Laneige',
    price: 320000,
    currency: 'IDR',
    asalProduk: 'Seoul, Korea',
    tujuanProduk: 'Bandung',
    images: ['https://placehold.co/400x400/E6E6FA/000?text=Laneige+Mask'],
    stock: 20,
    estimatedWeight: 0.2,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p5',
    jastiperId: '103',
    jastiperName: 'Korea Shop Bandung',
    name: 'Innisfree Green Tea Serum',
    description: 'Serum wajah dengan ekstrak green tea dari Jeju',
    category: 'Skincare',
    brand: 'Innisfree',
    price: 280000,
    currency: 'IDR',
    asalProduk: 'Seoul, Korea',
    tujuanProduk: 'Bandung',
    images: ['https://placehold.co/400x400/90EE90/000?text=Innisfree+Serum'],
    stock: 18,
    estimatedWeight: 0.15,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p6',
    jastiperId: '103',
    jastiperName: 'Korea Shop Bandung',
    name: 'Samyang Buldak Ramen Hot Chicken',
    description: 'Mie instant pedas super populer dari Korea',
    category: 'Makanan & Minuman',
    brand: 'Samyang',
    price: 95000,
    currency: 'IDR',
    asalProduk: 'Seoul, Korea',
    tujuanProduk: 'Bandung',
    images: ['https://placehold.co/400x400/FF6347/FFF?text=Samyang+Ramen'],
    stock: 40,
    estimatedWeight: 0.7,
    status: 'available',
    type: 'global',
  },

  // Singapore Products
  {
    id: 'p7',
    jastiperId: '105',
    jastiperName: 'Singapore Mall',
    name: 'Tiger Balm Red',
    description: 'Balsem Tiger original dari Singapore',
    category: 'Kesehatan',
    brand: 'Tiger Balm',
    price: 65000,
    currency: 'IDR',
    asalProduk: 'Singapore',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/DC143C/FFF?text=Tiger+Balm'],
    stock: 35,
    estimatedWeight: 0.2,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p8',
    jastiperId: '105',
    jastiperName: 'Singapore Mall',
    name: 'Kaya Spread Ya Kun',
    description: 'Selai kaya khas Singapore untuk roti',
    category: 'Makanan & Minuman',
    brand: 'Ya Kun',
    price: 75000,
    currency: 'IDR',
    asalProduk: 'Singapore',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/8B4513/FFF?text=Kaya+Spread'],
    stock: 22,
    estimatedWeight: 0.4,
    status: 'available',
    type: 'global',
  },

  // Japan Products
  {
    id: 'p9',
    jastiperId: '106',
    jastiperName: 'Japan Market Surabaya',
    name: 'Shiseido Senka Perfect Whip',
    description: 'Sabun cuci muka Jepang dengan busa lembut',
    category: 'Skincare',
    brand: 'Shiseido',
    price: 135000,
    currency: 'IDR',
    asalProduk: 'Tokyo, Japan',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/FFB6C1/000?text=Shiseido+Whip'],
    stock: 28,
    estimatedWeight: 0.25,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p10',
    jastiperId: '106',
    jastiperName: 'Japan Market Surabaya',
    name: 'Pocky Chocolate Sticks',
    description: 'Snack cokelat stick favorit dari Jepang',
    category: 'Makanan & Minuman',
    brand: 'Glico',
    price: 45000,
    currency: 'IDR',
    asalProduk: 'Tokyo, Japan',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/8B4513/FFF?text=Pocky+Sticks'],
    stock: 50,
    estimatedWeight: 0.15,
    status: 'available',
    type: 'global',
  },
  {
    id: 'p11',
    jastiperId: '106',
    jastiperName: 'Japan Market Surabaya',
    name: 'Hatomugi Skin Conditioner',
    description: 'Toner Jepang dengan kandungan Hatomugi',
    category: 'Skincare',
    brand: 'Naturie',
    price: 165000,
    currency: 'IDR',
    asalProduk: 'Tokyo, Japan',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/ADD8E6/000?text=Hatomugi+Toner'],
    stock: 15,
    estimatedWeight: 0.5,
    status: 'available',
    type: 'global',
  },

  // Bali Products (Lokal)
  {
    id: 'p12',
    jastiperId: '104',
    jastiperName: 'Bali Souvenir Hub',
    name: 'Pie Susu Dhian',
    description: 'Pie susu asli Bali yang legendaris',
    category: 'Makanan & Minuman',
    brand: 'Dhian',
    price: 85000,
    currency: 'IDR',
    asalProduk: 'Denpasar, Bali',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/FFE4B5/000?text=Pie+Susu+Bali'],
    stock: 12,
    estimatedWeight: 0.6,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p13',
    jastiperId: '104',
    jastiperName: 'Bali Souvenir Hub',
    name: 'Kopi Bali Kintamani',
    description: 'Kopi arabika premium dari pegunungan Kintamani',
    category: 'Makanan & Minuman',
    brand: 'Kintamani',
    price: 125000,
    currency: 'IDR',
    asalProduk: 'Kintamani, Bali',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/8B4513/FFF?text=Kopi+Kintamani'],
    stock: 20,
    estimatedWeight: 0.5,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p14',
    jastiperId: '104',
    jastiperName: 'Bali Souvenir Hub',
    name: 'Brem Bali Manis',
    description: 'Makanan tradisional Bali dari beras ketan',
    category: 'Makanan & Minuman',
    brand: 'Brem Bali',
    price: 55000,
    currency: 'IDR',
    asalProduk: 'Gianyar, Bali',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/F0E68C/000?text=Brem+Bali'],
    stock: 18,
    estimatedWeight: 0.3,
    status: 'available',
    type: 'local',
  },

  // Yogyakarta Products (Lokal)
  {
    id: 'p15',
    jastiperId: '107',
    jastiperName: 'Jogja Batik Center',
    name: 'Batik Tulis Jogja Premium',
    description: 'Kain batik tulis asli Yogyakarta motif parang',
    category: 'Fashion',
    brand: 'Batik Jogja',
    price: 450000,
    currency: 'IDR',
    asalProduk: 'Yogyakarta',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/8B4513/FFD700?text=Batik+Tulis'],
    stock: 8,
    estimatedWeight: 0.4,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p16',
    jastiperId: '107',
    jastiperName: 'Jogja Batik Center',
    name: 'Bakpia Pathok 25',
    description: 'Oleh-oleh legendaris Yogyakarta isi kacang hijau',
    category: 'Makanan & Minuman',
    brand: 'Pathok 25',
    price: 75000,
    currency: 'IDR',
    asalProduk: 'Yogyakarta',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/D2691E/FFF?text=Bakpia+Pathok'],
    stock: 30,
    estimatedWeight: 0.5,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p17',
    jastiperId: '107',
    jastiperName: 'Jogja Batik Center',
    name: 'Gudeg Kaleng Bu Tjitro',
    description: 'Gudeg khas Jogja dalam kemasan kaleng tahan lama',
    category: 'Makanan & Minuman',
    brand: 'Bu Tjitro',
    price: 65000,
    currency: 'IDR',
    asalProduk: 'Yogyakarta',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/8B4513/FFD700?text=Gudeg+Kaleng'],
    stock: 20,
    estimatedWeight: 0.6,
    status: 'available',
    type: 'local',
  },

  // Bandung Products (Lokal)
  {
    id: 'p18',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Brownies Kartika Sari',
    description: 'Brownies kukus terkenal dari Bandung',
    category: 'Makanan & Minuman',
    brand: 'Kartika Sari',
    price: 95000,
    currency: 'IDR',
    asalProduk: 'Bandung',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/8B4513/FFF?text=Brownies+KS'],
    stock: 15,
    estimatedWeight: 0.7,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p19',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Batagor Kingsley',
    description: 'Batagor frozen siap goreng khas Bandung',
    category: 'Makanan & Minuman',
    brand: 'Kingsley',
    price: 85000,
    currency: 'IDR',
    asalProduk: 'Bandung',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/FF8C00/FFF?text=Batagor+Kingsley'],
    stock: 25,
    estimatedWeight: 0.8,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p20',
    jastiperId: '103',
    jastiperName: 'Korea Shop Bandung',
    name: 'Pisang Bolen Kartika Sari',
    description: 'Bolen pisang cokelat keju premium',
    category: 'Makanan & Minuman',
    brand: 'Kartika Sari',
    price: 125000,
    currency: 'IDR',
    asalProduk: 'Bandung',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/FFD700/000?text=Bolen+Pisang'],
    stock: 18,
    estimatedWeight: 0.6,
    status: 'available',
    type: 'local',
  },

  // Surabaya Products (Lokal)
  {
    id: 'p21',
    jastiperId: '106',
    jastiperName: 'Japan Market Surabaya',
    name: 'Spikoe Resep Kuno',
    description: 'Kue lapis khas Surabaya dengan resep turun temurun',
    category: 'Makanan & Minuman',
    brand: 'Spikoe Surabaya',
    price: 110000,
    currency: 'IDR',
    asalProduk: 'Surabaya',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/FFE4B5/8B4513?text=Spikoe+Surabaya'],
    stock: 12,
    estimatedWeight: 0.6,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p22',
    jastiperId: '104',
    jastiperName: 'Bali Souvenir Hub',
    name: 'Sambal Bu Rudy',
    description: 'Sambal petis khas Surabaya level pedas',
    category: 'Makanan & Minuman',
    brand: 'Bu Rudy',
    price: 45000,
    currency: 'IDR',
    asalProduk: 'Surabaya',
    tujuanProduk: 'Denpasar, Bali',
    images: ['https://placehold.co/400x400/DC143C/FFF?text=Sambal+Bu+Rudy'],
    stock: 35,
    estimatedWeight: 0.3,
    status: 'available',
    type: 'local',
  },

  // Medan Products (Lokal)
  {
    id: 'p23',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Bika Ambon Zulaikha',
    description: 'Bika Ambon asli Medan dengan aroma pandan',
    category: 'Makanan & Minuman',
    brand: 'Zulaikha',
    price: 95000,
    currency: 'IDR',
    asalProduk: 'Medan',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/90EE90/000?text=Bika+Ambon'],
    stock: 20,
    estimatedWeight: 0.7,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p24',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Lapis Legit Medan',
    description: 'Kue lapis legit premium khas Medan',
    category: 'Makanan & Minuman',
    brand: 'Lapis Medan',
    price: 175000,
    currency: 'IDR',
    asalProduk: 'Medan',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/8B4513/FFD700?text=Lapis+Legit'],
    stock: 10,
    estimatedWeight: 0.8,
    status: 'available',
    type: 'local',
  },

  // Makassar Products (Lokal)
  {
    id: 'p25',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Kue Cucur Makassar',
    description: 'Kue tradisional Makassar rasa manis gurih',
    category: 'Makanan & Minuman',
    brand: 'Cucur Makassar',
    price: 55000,
    currency: 'IDR',
    asalProduk: 'Makassar',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/D2691E/FFF?text=Cucur+Makassar'],
    stock: 25,
    estimatedWeight: 0.4,
    status: 'available',
    type: 'local',
  },

  // Semarang Products (Lokal)
  {
    id: 'p26',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Lumpia Gang Lombok',
    description: 'Lumpia rebung asli Semarang',
    category: 'Makanan & Minuman',
    brand: 'Gang Lombok',
    price: 85000,
    currency: 'IDR',
    asalProduk: 'Semarang',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/FFE4B5/8B4513?text=Lumpia+Semarang'],
    stock: 20,
    estimatedWeight: 0.5,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p27',
    jastiperId: '101',
    jastiperName: 'Sarah Jastip Jakarta',
    name: 'Wingko Babat Semarang',
    description: 'Kue kelapa khas Semarang yang legendaris',
    category: 'Makanan & Minuman',
    brand: 'Wingko Babat',
    price: 65000,
    currency: 'IDR',
    asalProduk: 'Semarang',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/F5DEB3/8B4513?text=Wingko+Babat'],
    stock: 30,
    estimatedWeight: 0.4,
    status: 'available',
    type: 'local',
  },

  // Solo Products (Lokal)
  {
    id: 'p28',
    jastiperId: '107',
    jastiperName: 'Jogja Batik Center',
    name: 'Serundeng Solo Original',
    description: 'Serundeng kelapa khas Solo untuk nasi liwet',
    category: 'Makanan & Minuman',
    brand: 'Serundeng Solo',
    price: 55000,
    currency: 'IDR',
    asalProduk: 'Solo',
    tujuanProduk: 'Jakarta',
    images: ['https://placehold.co/400x400/D2691E/FFF?text=Serundeng+Solo'],
    stock: 40,
    estimatedWeight: 0.3,
    status: 'available',
    type: 'local',
  },

  // Malang Products (Lokal)
  {
    id: 'p29',
    jastiperId: '104',
    jastiperName: 'Bali Souvenir Hub',
    name: 'Apel Malang Premium',
    description: 'Apel segar pilihan dari Kota Malang',
    category: 'Makanan & Minuman',
    brand: 'Apel Malang',
    price: 75000,
    currency: 'IDR',
    asalProduk: 'Malang',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/DC143C/FFF?text=Apel+Malang'],
    stock: 15,
    estimatedWeight: 1.5,
    status: 'available',
    type: 'local',
  },
  {
    id: 'p30',
    jastiperId: '106',
    jastiperName: 'Japan Market Surabaya',
    name: 'Keripik Tempe Malang',
    description: 'Keripik tempe renyah khas Malang berbagai rasa',
    category: 'Makanan & Minuman',
    brand: 'Keripik Malang',
    price: 45000,
    currency: 'IDR',
    asalProduk: 'Malang',
    tujuanProduk: 'Surabaya',
    images: ['https://placehold.co/400x400/FFD700/8B4513?text=Keripik+Tempe'],
    stock: 35,
    estimatedWeight: 0.3,
    status: 'available',
    type: 'local',
  },
];

// ============================================
// DAERAH INDONESIA
// ============================================

export const INDONESIA_PROVINCES = [
  'Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'DI Yogyakarta',
  'Banten',
  'Bali',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Riau',
  'Kalimantan Timur',
  'Kalimantan Selatan',
  'Sulawesi Selatan',
  'Sulawesi Utara',
  'Papua',
];

export const INDONESIA_CITIES = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Medan',
  'Semarang',
  'Yogyakarta',
  'Denpasar',
  'Makassar',
  'Palembang',
  'Tangerang',
  'Bekasi',
  'Depok',
  'Bogor',
  'Malang',
  'Solo',
  'Balikpapan',
  'Manado',
  'Pontianak',
  'Banjarmasin',
  'Samarinda',
];

export const GLOBAL_LOCATIONS = [
  'Bangkok, Thailand',
  'Seoul, Korea',
  'Tokyo, Japan',
  'Singapore',
  'Kuala Lumpur, Malaysia',
  'Hong Kong',
  'Shanghai, China',
  'Taipei, Taiwan',
  'Manila, Philippines',
  'Ho Chi Minh, Vietnam',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getUserByEmail = (email: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserById = (id: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.id === id);
};

export const getProductById = (id: string): MockProduct | undefined => {
  return MOCK_PRODUCTS.find(product => product.id === id);
};

export const getProductsByJastiper = (jastiperId: string): MockProduct[] => {
  return MOCK_PRODUCTS.filter(product => product.jastiperId === jastiperId);
};

export const filterProducts = (filters: {
  type?: 'local' | 'global';
  asalProduk?: string;
  tujuanProduk?: string;
  search?: string;
}): MockProduct[] => {
  let filtered = [...MOCK_PRODUCTS];

  if (filters.type) {
    filtered = filtered.filter(p => p.type === filters.type);
  }

  if (filters.asalProduk) {
    filtered = filtered.filter(p => 
      p.asalProduk.toLowerCase().includes(filters.asalProduk!.toLowerCase())
    );
  }

  if (filters.tujuanProduk) {
    filtered = filtered.filter(p => 
      p.tujuanProduk.toLowerCase().includes(filters.tujuanProduk!.toLowerCase())
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// ============================================
// MOCK ORDERS
// ============================================

export interface MockOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  jastiperId: string;
  jastiperName: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: 'transfer' | 'ewallet' | 'cod';
  paymentStatus: 'pending' | 'paid';
  status: 'pending' | 'processing' | 'shipping' | 'delivered';
  notes?: string;
  createdAt: string;
}

export const MOCK_ORDERS: MockOrder[] = [];

// Save orders to localStorage
export const saveOrder = (orderData: {
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  shippingAddress: string;
  paymentMethod: 'transfer' | 'ewallet' | 'cod';
  notes?: string;
}): MockOrder => {
  const product = getProductById(orderData.productId);
  if (!product) throw new Error('Product not found');

  const user = getUserById(orderData.userId);
  if (!user) throw new Error('User not found');

  const orderNumber = 'ORD-' + Date.now();
  const totalPrice = orderData.productPrice * orderData.quantity + 15000 * 0.5 * orderData.quantity + 5000;

  const newOrder: MockOrder = {
    id: 'order-' + Date.now(),
    orderNumber,
    customerId: orderData.userId,
    customerName: user.name,
    jastiperId: product.jastiperId,
    jastiperName: product.jastiperName,
    productId: orderData.productId,
    productName: orderData.productName,
    productPrice: orderData.productPrice,
    quantity: orderData.quantity,
    totalPrice,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: 'pending',
    status: 'pending',
    notes: orderData.notes,
    createdAt: new Date().toISOString(),
  };

  MOCK_ORDERS.push(newOrder);
  
  // Save to localStorage
  const existing = localStorage.getItem('flexitip_orders');
  const allOrders = existing ? JSON.parse(existing) : [];
  allOrders.push(newOrder);
  localStorage.setItem('flexitip_orders', JSON.stringify(allOrders));

  return newOrder;
};

export const getOrdersByCustomer = (customerId: string): MockOrder[] => {
  const savedOrders = localStorage.getItem('flexitip_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
  return orders.filter((order: MockOrder) => order.customerId === customerId);
};

export const getOrdersByJastiper = (jastiperId: string): MockOrder[] => {
  const savedOrders = localStorage.getItem('flexitip_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
  return orders.filter((order: MockOrder) => order.jastiperId === jastiperId);
};
