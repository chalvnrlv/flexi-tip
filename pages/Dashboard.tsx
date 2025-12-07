
import React, { useState } from 'react';
import {
  MapPin, Globe, Search, ArrowLeft, MoreVertical,
  Paperclip, Send, ArrowRight, MessageCircle
} from 'lucide-react';
import { DashboardView, ServiceItem } from '../types';
import AIChat from '../components/AIChat';
import MainLayout from '../components/layout/MainLayout';
import { useAuthStore } from '../store/authStore';

// Images
import avatar1 from '../images/avatar1.png';
import avatar2 from '../images/avatar2.png';
import produk1 from '../images/produk1.png';
import specialOffer1 from '../images/specialoffer1.png';

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    travelerName: '@tokojauh',
    travelerAvatar: avatar1,
    origin: 'Thailand',
    destination: 'Indonesia',
    date: '1-15 Sep 2024',
    type: 'global',
    capacityKg: 15,
    rating: 4.9,
    pricePerKg: 'Rp 25.000',
    description: 'Open Jastip Bangkok Premium.',
    imageUrl: produk1,
    productName: 'Kosmetik Thailand',
    productPrice: 45000,
    productVariant: 'Kuning'
  },
  {
    id: '2',
    travelerName: '@jasabali',
    travelerAvatar: avatar2,
    origin: 'Bali',
    destination: 'Jakarta',
    date: '20-25 Sep 2024',
    type: 'local',
    capacityKg: 10,
    rating: 4.8,
    pricePerKg: 'Rp 20.000',
    description: 'Jastip Pie Susu & Oleh-oleh Bali.',
    imageUrl: produk1, // Reusing product image for demo
  }
];

interface DashboardProps {
  onLogout?: () => void; // Optional now as Navbar handles it
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [view, setView] = useState<DashboardView>(DashboardView.HOME);
  const [jastipType, setJastipType] = useState<'local' | 'global'>('global');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDest, setSelectedDest] = useState<string>('');
  const [chatInput, setChatInput] = useState('');

  // --- VIEW: HOME ---
  const renderHome = () => (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-b from-[#4AB265] to-[#1F605C] pb-24 lg:bg-white lg:pb-0">

      {/* Main Content Container */}
      <div className="flex flex-col px-6 pt-24 max-w-sm mx-auto lg:max-w-7xl lg:pt-8">

        {/* Search Bar Visual - Mobile Only */}
        <div className="mb-6 flex items-center rounded-full bg-white px-5 py-4 shadow-lg lg:hidden">
          <Search className="mr-3 h-5 w-5 text-gray-400" />
          <span className="text-sm font-light text-gray-400">mau shopping dari mana?</span>
        </div>

        {/* Desktop: Hero Banner */}
        <div className="hidden lg:block mb-8 h-80 w-full overflow-hidden rounded-[20px] bg-gradient-to-r from-[#4AB265] to-[#1F605C] p-12 relative shadow-lg">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-5xl font-bold text-white leading-tight mb-4">
              Belanja dari Mana Saja
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Titip beli barang dari seluruh Indonesia dan dunia dengan mudah dan aman
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setJastipType('local'); setView(DashboardView.SELECT_LOCATION); }}
                className="bg-white text-[#1F605C] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Jastip Lokal
              </button>
              <button
                onClick={() => { setJastipType('global'); setView(DashboardView.SELECT_LOCATION); }}
                className="bg-[#063B2D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#074a38] transition-all"
              >
                Jastip Global
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-96 w-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Toggles - Mobile Only */}
        <div className="mb-8 space-y-5 lg:hidden">
          <button
            onClick={() => { setJastipType('local'); setView(DashboardView.SELECT_LOCATION); }}
            className="group relative h-24 w-full overflow-hidden rounded-[25px] bg-white shadow-xl transition-transform active:scale-95 text-left"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4AB265]/10">
                <MapPin className="h-7 w-7 text-[#159946]" />
              </div>
              <span className="text-3xl font-medium text-[#1C5754]">Lokal</span>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#4AB265]/20 blur-sm"></div>
          </button>

          <button
            onClick={() => { setJastipType('global'); setView(DashboardView.SELECT_LOCATION); }}
            className="group relative h-24 w-full overflow-hidden rounded-[25px] bg-white shadow-xl transition-transform active:scale-95 text-left"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F605C]/10">
                <Globe className="h-7 w-7 text-[#1F605C]" />
              </div>
              <span className="text-3xl font-medium text-[#1C5754]">Global</span>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#1F605C]/20 blur-sm"></div>
          </button>
        </div>

        {/* Assistant CTA - Mobile Only */}
        <div className="mb-10 flex items-center justify-end gap-4 lg:hidden">
          <div className="text-right">
            <p className="text-[#06373B] font-bold text-lg">Perlu</p>
            <h3 className="text-[#06373B] font-light text-lg -mt-1">asisten?</h3>
          </div>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex h-12 items-center justify-center rounded-[50px] bg-[#063B2D] px-8 text-white shadow-[10px_10px_4px_rgba(0,0,0,0.25)_inset] active:scale-95 transition-transform hover:bg-[#074a38]"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Jastiper Action Button (Only for Jastipers) */}
        {useAuthStore.getState().user?.isJastiper && (
          <div className="fixed bottom-24 right-6 z-40 lg:hidden">
            <button
              onClick={() => alert('Fitur Buka Jastip akan segera hadir!')}
              className="flex items-center gap-2 bg-[#FAFF09] text-[#06373B] px-6 py-3 rounded-full font-bold shadow-lg shadow-black/20 hover:scale-105 transition-transform"
            >
              <span>+ Buka Jastip</span>
            </button>
          </div>
        )}
        {useAuthStore.getState().user?.isJastiper && (
          <div className="hidden lg:block fixed bottom-10 right-10 z-40">
            <button
              onClick={() => alert('Fitur Buka Jastip akan segera hadir!')}
              className="flex items-center gap-2 bg-[#FAFF09] text-[#06373B] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              <span>+ Buka Jastip</span>
            </button>
          </div>
        )}

        {/* Most Popular (Horizontal Scroll) */}
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-semibold text-[#061A23] lg:text-2xl lg:text-gray-800">Most Popular</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:grid lg:grid-cols-4 lg:mx-0 lg:px-0 lg:overflow-visible lg:gap-6">
            {MOCK_SERVICES.map((item) => (
              <div key={item.id} className="h-44 w-64 shrink-0 overflow-hidden rounded-[20px] bg-white p-2 shadow-lg lg:w-full lg:hover:shadow-xl lg:transition-shadow">
                <div className="h-full w-full rounded-[15px] bg-gray-100 relative overflow-hidden">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="Product" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                    <p className="text-white text-sm font-bold">{item.origin} Special</p>
                    <p className="text-white/80 text-[10px]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-2 lg:hidden"></div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-semibold text-[#061A23] lg:text-2xl lg:text-gray-800">Special offer</h3>
          <div className="h-auto w-full overflow-hidden rounded-[20px] bg-[#06373B] p-5 lg:p-8 relative shadow-lg">
            <div className="absolute inset-0 opacity-20">
              <img src={specialOffer1} alt="Offer Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 pr-8">
              <p className="text-xl lg:text-3xl font-bold text-[#FAFF09] leading-tight">Belanja <span className="text-[#159946]">aman, mudah dan nyaman</span></p>
              <p className="text-xs lg:text-sm text-white font-light italic mt-2">Rasakan sensasi beda setiap klik!</p>
              <button className="mt-4 rounded-full bg-[#063B2D] px-8 py-2 text-sm lg:text-base font-bold text-white shadow-[4px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#074a38] transition-colors border border-white/20">
                Cari
              </button>
            </div>
            {/* Abstract shapes */}
            {/* <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/5 rounded-full blur-xl"></div> */}
          </div>
        </div>

      </div>
    </div>
  );

  // --- VIEW: LOCATION SELECTION ---
  const renderLocationSelection = () => {
    const locations = jastipType === 'global'
      ? ['Thailand', 'Jepang', 'Korea', 'Singapura', 'Malaysia', 'China', 'USA', 'Australia']
      : ['Jabodetabek', 'DI Yogyakarta', 'Kalimantan Selatan', 'Jawa Barat', 'Kepulauan Riau', 'Lampung', 'Bali', 'Jawa Timur'];

    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* Header */}
        <div className="relative h-[200px] w-full overflow-hidden rounded-b-[50px] bg-gradient-to-t from-[#159946] to-[#1E5F5B] shadow-lg shrink-0 lg:h-[120px] lg:rounded-none">
          <button onClick={() => setView(DashboardView.HOME)} className="absolute left-6 top-8 text-white p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="absolute bottom-16 lg:bottom-8 left-0 right-0 text-center lg:left-20 lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-medium text-white capitalize">{jastipType}</h2>
          </div>
        </div>

        {/* Toggle From/To */}
        <div className="px-6 lg:px-12 -mt-6 z-10 shrink-0 max-w-sm mx-auto w-full lg:max-w-2xl">
          <div className="flex items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1 h-10 lg:h-12 bg-white rounded-[25px] shadow-md flex items-center justify-center text-[#06373B] text-sm lg:text-base font-medium">
              {selectedOrigin || 'Dari'}
            </div>
            <div className="text-white lg:text-[#06373B] font-light text-2xl">//</div>
            <div className="flex-1 h-10 lg:h-12 bg-white rounded-[25px] shadow-md flex items-center justify-center text-[#06373B] text-sm lg:text-base font-medium">
              {selectedDest || 'Ke'}
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 px-6 lg:px-12 mt-8 overflow-y-auto pb-24 max-w-sm mx-auto w-full lg:max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm lg:text-base font-medium text-white bg-[#1C5754] px-4 py-1 rounded-full">Provinsi / Negara</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 lg:gap-6">
            {locations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!selectedOrigin) setSelectedOrigin(loc);
                  else setSelectedDest(loc);
                }}
                className={`h-[35px] lg:h-[45px] rounded-[10px] text-center text-sm lg:text-base font-medium transition-all flex items-center justify-center ${selectedOrigin === loc || selectedDest === loc
                  ? 'bg-[#06373B] text-white shadow-md'
                  : 'bg-gray-100 text-[#1C5754] hover:bg-gray-200 border border-gray-200'
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Search Action */}
        <div className="fixed bottom-0 left-0 w-full p-6 bg-transparent pointer-events-none flex justify-center">
          <button
            onClick={() => setView(DashboardView.CHAT_NEGOTIATION)}
            disabled={!selectedOrigin}
            className="pointer-events-auto w-40 lg:w-48 h-10 lg:h-12 rounded-[50px] bg-[#063B2D] shadow-[10px_10px_4px_rgba(0,0,0,0.25)_inset] flex items-center justify-center gap-2 text-white font-bold text-sm lg:text-base disabled:opacity-50 disabled:shadow-none hover:bg-[#074a38] transition-colors"
          >
            Cari
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: CHAT NEGOTIATION ---
  const renderChat = () => (
    <div className="flex min-h-screen w-full flex-col bg-[#EFEBEB]">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#9BD7B1] px-6 lg:px-12 py-6 pb-12 rounded-b-[30px] shadow-md z-10 lg:max-w-4xl lg:mx-auto lg:w-full">
        <div className="relative">
          <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
            <img src={MOCK_SERVICES[0].travelerAvatar} className="h-full w-full object-cover" alt="Jastiper" />
          </div>
        </div>
        <div className="flex-1 text-[#06373B]">
          <h3 className="font-bold text-xl lg:text-2xl">{MOCK_SERVICES[0].travelerName}</h3>
          <p className="text-xs lg:text-sm opacity-60">{MOCK_SERVICES[0].origin}</p>
          <p className="text-xs lg:text-sm font-medium mt-1">Sedang aktif</p>
        </div>
        <button onClick={() => setView(DashboardView.SELECT_LOCATION)} className="p-2 text-[#06373B] hover:bg-white/20 rounded-full transition-colors">
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:px-12 pb-32 -mt-6 pt-10 max-w-sm mx-auto w-full lg:max-w-4xl">
        {/* Product Card */}
        <div className="mb-6 bg-[#9BD7B1] p-3 rounded-lg shadow-sm max-w-[85%] lg:max-w-md">
          <div className="bg-white rounded-[2px] overflow-hidden shadow-sm">
            <img src={MOCK_SERVICES[0].imageUrl} className="w-full h-32 lg:h-40 object-cover" alt="Product" />
            <div className="p-3">
              <h4 className="text-[#153d40] font-medium text-sm lg:text-base">{MOCK_SERVICES[0].productName}</h4>
              <p className="text-xs lg:text-sm text-[#345659] mt-1">Variasi: {MOCK_SERVICES[0].productVariant}</p>
              <p className="text-sm lg:text-base font-bold text-[#345659] mt-2">{MOCK_SERVICES[0].pricePerKg}</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setView(DashboardView.PAYMENT)}
              className="bg-[#063B2D] text-white text-xs lg:text-sm font-bold px-6 py-2 rounded-full shadow-md active:scale-95 hover:bg-[#074a38] transition-all"
            >
              Beli
            </button>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-white text-[#000001] text-sm lg:text-base py-3 px-4 rounded-l-[15px] rounded-tr-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] max-w-[80%]">
              Hai, silakan tanya saja
            </div>
            <span className="text-[10px] text-black/30 self-end ml-1 mb-1">12:27</span>
          </div>

          <div className="flex justify-start">
            <div className="bg-white text-[#000001] text-sm lg:text-base py-3 px-4 rounded-r-[15px] rounded-tl-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] max-w-[80%]">
              Apakah produk ini tersedia?
            </div>
            <span className="text-[10px] text-black/30 self-end ml-1 mb-1">12:28</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-[#9BD7B1] h-36 rounded-t-[20px] px-6 lg:px-12 pt-6">
        <div className="flex items-center gap-3 bg-white rounded-[25px] px-2 py-2 shadow-md max-w-sm mx-auto lg:max-w-4xl">
          <button className="p-2 text-[#06373B] hover:bg-gray-100 rounded-full transition-colors"><Paperclip className="h-5 w-5" /></button>
          <input
            type="text"
            placeholder="Tulis Pesan...."
            className="flex-1 bg-transparent text-sm lg:text-base outline-none text-gray-600 placeholder-gray-400"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button className="p-2 text-[#06373B] hover:bg-gray-100 rounded-full transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // --- VIEW: PAYMENT ---
  const renderPayment = () => (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 lg:px-12 pt-8 pb-4 lg:max-w-4xl lg:mx-auto lg:w-full">
        <div className="flex items-center gap-2">
          <button onClick={() => setView(DashboardView.CHAT_NEGOTIATION)} className="hover:bg-gray-100 rounded-full p-1 transition-colors">
            <ArrowLeft className="h-6 w-6 text-[#06373B]" />
          </button>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#06373B]">Pembayaran</h2>
        </div>
        <div className="h-4 w-4 rounded-full bg-[#063B2D]"></div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-between px-12 lg:px-24 mb-6 text-[10px] lg:text-xs text-black/20 font-medium lg:max-w-4xl lg:mx-auto lg:w-full">
        <span>Keranjang</span>
        <span>Pengiriman</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-4 lg:px-12 space-y-4 max-w-sm mx-auto w-full lg:max-w-4xl">
        {/* Address Card */}
        <div className="bg-[#9BD7B1] rounded-[10px] p-4 lg:p-5 relative overflow-hidden">
          <h3 className="font-medium text-lg lg:text-xl text-[#06373B] mb-2">Alamat</h3>
          <p className="text-sm lg:text-base text-[#06373B] leading-relaxed">
            Jou | (+62)812-3456-7890<br />
            Kost rumah bakung, jalan kintamani<br />
            SUKOLILO, KOTA SURABAYA, JAWA TIMUR, ID 60199
          </p>
          {/* Green Line Decor */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#06373B] rounded-full mx-2 mb-2"></div>
        </div>

        {/* Shop Item */}
        <div className="flex flex-col gap-1 px-2">
          <h3 className="text-lg lg:text-xl font-medium text-[#06373B]">{MOCK_SERVICES[0].travelerName}</h3>
          <div className="bg-[#159946] p-3 lg:p-4 rounded-lg flex gap-3 items-center">
            <img src={MOCK_SERVICES[0].imageUrl} className="h-24 w-20 lg:h-32 lg:w-28 object-cover rounded-sm bg-white" alt="Item" />
            <div className="flex-1">
              <h4 className="text-[#061A23] font-medium text-sm lg:text-base bg-white/80 px-2 py-1 rounded w-fit">{MOCK_SERVICES[0].productName}</h4>
              <p className="text-xs lg:text-sm text-white mt-1">Variasi: {MOCK_SERVICES[0].productVariant}</p>
              <p className="text-lg lg:text-xl font-bold text-white mt-2">{MOCK_SERVICES[0].pricePerKg}</p>
            </div>
          </div>
        </div>

        {/* Shipping Option */}
        <div className="bg-[#9BD7B1] p-4 lg:p-5 rounded-[5px]">
          <div className="flex justify-between items-center text-[#06373B]">
            <span className="font-light text-sm lg:text-base">Opsi Pengiriman</span>
            <span className="font-medium text-sm lg:text-base">Rp 25.000</span>
          </div>
          <div className="mt-2">
            <p className="font-medium text-[#06373B] lg:text-lg">Darat(Reguler)</p>
            <p className="text-[10px] lg:text-xs text-[#06373B]/70">Estimasi sampai: 1-15 Sep 2024</p>
          </div>
          <div className="w-full h-1 bg-[#06373B] rounded-full mt-3 opacity-50"></div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-[#9BD7B1] p-4 lg:p-5 rounded-[10px] rounded-t-none -mt-2">
          <div className="flex justify-between items-center mb-4">
            <span className="font-light text-sm lg:text-base text-[#06373B]">Metode Pembayaran</span>
            <ArrowRight className="h-5 w-5 text-[#06373B]" />
          </div>

          <div className="space-y-2 text-sm lg:text-base text-[#06373B] border-t border-white/20 pt-4">
            <div className="flex justify-between"><span>Pajak</span><span>Rp 25.000</span></div>
            <div className="flex justify-between"><span>Jumlah</span><span>Rp 45.000</span></div>
            <div className="flex justify-between"><span>Total Pesanan</span><span>Rp 45.000</span></div>
            <div className="flex justify-between"><span>Biaya admin</span><span>Rp 5.000</span></div>
            <div className="flex justify-between"><span>Promo</span><span>-</span></div>
            <div className="flex justify-between font-bold text-lg lg:text-xl mt-4 pt-2 border-t border-white/20">
              <span>Total Pembayaran</span>
              <span>Rp 75.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-6 left-0 w-full px-12 flex justify-center">
        <button
          onClick={() => {
            alert("Pesanan Berhasil!");
            setView(DashboardView.HOME);
          }}
          className="w-full max-w-sm lg:max-w-md h-14 lg:h-16 rounded-[25px] bg-[#06373B] shadow-[10px_10px_20px_#627C7E_inset] flex items-center justify-center text-white font-extrabold text-2xl lg:text-3xl hover:scale-105 transition-transform"
        >
          Pesan
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout showBottomNav={view === DashboardView.HOME}>
      {view === DashboardView.HOME && renderHome()}
      {view === DashboardView.SELECT_LOCATION && renderLocationSelection()}
      {view === DashboardView.CHAT_NEGOTIATION && renderChat()}
      {view === DashboardView.PAYMENT && renderPayment()}

      {/* Independent Global Assistant Modal */}
      <AIChat
        context={jastipType}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </MainLayout>
  );
};

export default Dashboard;
