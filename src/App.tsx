/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Zap, 
  Flame, 
  Timer, 
  CheckCircle2, 
  Globe, 
  Plus, 
  Minus,
  Trophy,
  RotateCcw,
  Search,
  ArrowRight,
  Clock,
  MapPin,
  ChevronDown,
  Info,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Language = 'en' | 'es';

interface MenuItem {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  price: number;
  category: 'empanadas' | 'pastelitos' | 'tequeños' | 'pasapalos';
  image: string;
  tag?: { en: string; es: string };
}

interface CartItem extends MenuItem {
  quantity: number;
}

type OrderStatus = 'received' | 'preparing' | 'ready';

// --- Mock Data ---
const MENU_ITEMS: MenuItem[] = [
  // Empanadas
  {
    id: 'e1',
    name: { en: 'Pabellón Empanada', es: 'Empanada de Pabellón' },
    description: { en: 'Black beans, plantain and shredded beef.', es: 'Caraotas negras, tajadas y carne mechada.' },
    price: 4.75,
    category: 'empanadas',
    image: 'https://images.unsplash.com/photo-1644704170910-a0cdf183649b?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Feature', es: 'Especial' }
  },
  {
    id: 'e2',
    name: { en: 'Shredded Beef Empanada', es: 'Empanada de Carne Mechada' },
    description: { en: 'Traditional crispy corn dough with shredded beef.', es: 'Masa de maíz crujiente con carne mechada.' },
    price: 3.75,
    category: 'empanadas',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Classic', es: 'Clásico' }
  },
  {
    id: 'e3',
    name: { en: 'Cheese Empanada', es: 'Empanada de Queso' },
    description: { en: 'Crispy corn dough filled with white cheese.', es: 'Masa de maíz rellena de queso blanco.' },
    price: 3.75,
    category: 'empanadas',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
  },
  // Pastelitos
  {
    id: 'p1',
    name: { en: 'Pizza Pastelito', es: 'Pastelito de Pizza' },
    description: { en: 'Flaky pastry filled with pizza sauce and cheese.', es: 'Masa hojaldrada rellena de salsa de pizza y queso.' },
    price: 2.75,
    category: 'pastelitos',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    name: { en: 'Chicken Pastelito', es: 'Pastelito de Pollo' },
    description: { en: 'Flaky pastry filled with seasoned chicken.', es: 'Masa hojaldrada rellena de pollo sazonado.' },
    price: 2.75,
    category: 'pastelitos',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  // Tequeños
  {
    id: 't1',
    name: { en: 'Tequeños (5 pcs)', es: 'Servicio de 5 Tequeños' },
    description: { en: 'Traditional Venezuelan cheese sticks.', es: 'Palitos de queso tradicionales venezolanos.' },
    price: 7.00,
    category: 'tequeños',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Classic', es: 'Clásico' }
  },
  {
    id: 't2',
    name: { en: 'Tequeyoyo', es: 'Tequeyoyo' },
    description: { en: 'White cheese, cheddar cheese, ham and plantain.', es: 'Queso blanco, queso cheddar, jamón y plátano.' },
    price: 4.25,
    category: 'tequeños',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Feature', es: 'Especial' }
  },
  {
    id: 't3',
    name: { en: 'Tequeñongo', es: 'Tequeñongo' },
    description: { en: 'Plantain, white cheese, cheddar, ham and shredded beef.', es: 'Plátano, queso blanco, cheddar, jamón y carne mechada.' },
    price: 4.75,
    category: 'tequeños',
    image: 'https://images.unsplash.com/photo-1514516369414-78177d7e9990?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm1',
    name: { en: 'Mandocas', es: 'Mandocas' },
    description: { en: 'Corn flour, cheese, plantain and brown sugar.', es: 'Harina de maíz, queso, plátano y papelón.' },
    price: 3.50,
    category: 'tequeños',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'y1',
    name: { en: 'Yucca Papitas', es: 'Papitas de Yuca' },
    description: { en: 'Yucca balls filled with cheese.', es: 'Bolitas de yuca rellenas de queso.' },
    price: 4.50,
    category: 'tequeños',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80'
  },
  // Pasapalos
  {
    id: 'pa1',
    name: { en: 'Combo Fiestero 1', es: 'Combo Fiestero 1' },
    description: { en: '20 tequeños and 30 pastelitos (assorted).', es: '20 tequeños y 30 pastelitos (surtidos).' },
    price: 50.00,
    category: 'pasapalos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tag: { en: 'Party Size', es: 'Tamaño Fiesta' }
  },
  {
    id: 'pa2',
    name: { en: '50 Tequeños', es: '50 Tequeños' },
    description: { en: 'Bulk order of 50 traditional tequeños.', es: 'Pedido de 50 tequeños tradicionales.' },
    price: 55.00,
    category: 'pasapalos',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80'
  }
];

const CATEGORIES = [
  { id: 'empanadas', name: { en: 'Empanadas', es: 'Empanadas' }, icon: '🥟' },
  { id: 'pastelitos', name: { en: 'Pastelitos', es: 'Pastelitos' }, icon: '🥐' },
  { id: 'tequeños', name: { en: 'Tequeños', es: 'Tequeños' }, icon: '🧀' },
  { id: 'pasapalos', name: { en: 'Pasapalos', es: 'Pasapalos' }, icon: '📦' }
];

const TRANSLATIONS = {
  en: {
    location: 'Austin, TX',
    search: 'Search for empanadas, pastelitos...',
    loyalty: '2 more orders until your free Tequeño!',
    spinCTA: 'Spin the Wheel',
    viewCart: 'View Cart',
    add: 'Add',
    orderStatus: {
      received: 'Received',
      preparing: 'Being Prepared',
      ready: 'Ready at Counter'
    },
    cartSummary: 'Cart Summary',
    checkout: 'Order Now & Skip the Counter Line',
    googleStars: '4.7 Stars on Google',
    orderPlaced: 'Order Placed!',
    preparingMessage: 'Please wait while your food is being prepared. You will get a notification when it\'s ready.'
  },
  es: {
    location: 'Austin, TX',
    search: 'Busca empanadas, pastelitos...',
    loyalty: '¡2 pedidos más para tu Tequeño gratis!',
    spinCTA: 'Gira la Rueda',
    viewCart: 'Ver Carrito',
    add: 'Agregar',
    orderStatus: {
      received: 'Recibido',
      preparing: 'En Preparación',
      ready: 'Listo en Mostrador'
    },
    cartSummary: 'Resumen del Carrito',
    checkout: 'Ordena Ahora y Salta la Fila',
    googleStars: '4.7 Estrellas en Google',
    orderPlaced: '¡Pedido Realizado!',
    preparingMessage: 'Por favor espera mientras se prepara tu comida. Recibirás una notificación cuando esté lista.'
  }
};

const ChefAnimation = () => (
  <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="z-10 text-brand-red"
    >
      <Utensils className="w-24 h-24" />
    </motion.div>
    <motion.div
      animate={{ 
        y: [0, -30, -40],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0.8]
      }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      className="absolute top-4 text-orange-400"
    >
      <Flame className="w-12 h-12" />
    </motion.div>
    <motion.div
      animate={{ 
        y: [0, -25, -35],
        opacity: [0, 0.4, 0],
        scale: [0.4, 1, 0.6]
      }}
      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
      className="absolute top-6 right-12 text-orange-300"
    >
      <Flame className="w-8 h-8" />
    </motion.div>
    <div className="absolute bottom-10 w-32 h-2 bg-gray-200 rounded-full blur-md opacity-50" />
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [showPreparingScreen, setShowPreparingScreen] = useState(false);

  const t = TRANSLATIONS[lang];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQuantity = (item: MenuItem, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
      }
      if (delta > 0) return [...prev, { ...item, quantity: 1 }];
      return prev;
    });
  };

  const handlePlaceOrder = () => {
    setIsCartOpen(false);
    setShowOrderPlaced(true);
    setCart([]);
    
    setTimeout(() => {
      setShowOrderPlaced(false);
      setShowPreparingScreen(true);
      setOrderStatus('preparing');
    }, 2500);

    setTimeout(() => {
      setOrderStatus('ready');
    }, 15000);
  };

  const spinWheel = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setWheelResult(lang === 'en' ? 'Free Drink!' : '¡Bebida Gratis!');
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* --- Header --- */}
      <header className="bg-white px-4 pt-4 pb-2 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-red" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm">{t.location}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Tierra Zuliana</p>
            </div>
          </div>
          <button 
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100"
          >
            <Globe className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder={t.search}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-red/20"
          />
        </div>

        {/* Loyalty Progress */}
        <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-brand-red">{t.loyalty}</span>
              <Trophy className="w-3 h-3 text-brand-red" />
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-red w-[60%]" />
            </div>
          </div>
          <button 
            onClick={() => setShowWheel(true)}
            className="ml-4 px-3 py-1.5 bg-brand-red text-white text-[10px] font-bold rounded-lg uppercase tracking-wider"
          >
            {t.spinCTA}
          </button>
        </div>
      </header>

      {/* --- Category Scroll --- */}
      <section className="bg-white py-6 px-4 overflow-x-auto no-scrollbar flex gap-6">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="category-circle">
            <div className="category-img-container flex items-center justify-center text-3xl">
              {cat.icon}
            </div>
            <span className="text-[11px] font-bold text-gray-600">{cat.name[lang]}</span>
          </div>
        ))}
      </section>

      {/* --- Live Status --- */}
      {orderStatus && (
        <section className="px-4 py-4">
          <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-brand-green animate-pulse-status" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-brand-green uppercase tracking-widest mb-1">Live Kitchen Tracking</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-brand-charcoal">
                  {t.orderStatus[orderStatus]}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Menu List --- */}
      <main className="px-4 py-4">
        {MENU_ITEMS.map(item => {
          const cartItem = cart.find(i => i.id === item.id);
          return (
            <div key={item.id} className="product-card">
              <div className="relative aspect-[16/9]">
                <img 
                  src={item.image} 
                  alt={item.name[lang]} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {item.tag && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                    <span className="text-[10px] font-black text-brand-red uppercase tracking-wider">
                      {item.tag[lang]}
                    </span>
                  </div>
                )}
                
                {/* Zomato Add Button */}
                <div className="add-button-container">
                  {!cartItem ? (
                    <button 
                      onClick={() => updateQuantity(item, 1)}
                      className="w-full h-full flex items-center justify-center gap-1 px-4 text-brand-red font-black text-sm uppercase tracking-tighter"
                    >
                      <Plus className="w-4 h-4" />
                      {t.add}
                    </button>
                  ) : (
                    <div className="w-full h-full flex items-center justify-between px-2 bg-brand-red text-white">
                      <button onClick={() => updateQuantity(item, -1)} className="p-1"><Minus className="w-4 h-4" /></button>
                      <span className="font-black text-sm">{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 pt-6">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-black text-lg leading-tight">{item.name[lang]}</h3>
                  <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <span>4.5</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {item.description[lang]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base">${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* --- Sticky Checkout Bar --- */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-[60]"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-brand-red text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{cartCount} Item{cartCount > 1 ? 's' : ''}</p>
                  <p className="text-lg font-black">${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-black uppercase tracking-tighter">
                {t.viewCart}
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-[32px] z-[80] p-6 pb-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">{t.cartSummary}</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400"><Plus className="w-6 h-6 rotate-45" /></button>
              </div>

              <div className="space-y-6 mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{item.name[lang]}</h4>
                        <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item, -1)} className="p-1 text-brand-red"><Minus className="w-4 h-4" /></button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="p-1 text-brand-red"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Taxes</span>
                  <span>${(cartTotal * 0.0825).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${(cartTotal * 1.0825).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-brand-red text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-red/20 active:scale-95 transition-transform"
              >
                {t.checkout}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Order Placed Screen --- */}
      <AnimatePresence>
        {showOrderPlaced && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-red flex flex-col items-center justify-center p-8 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="bg-white/20 p-8 rounded-full mb-8"
            >
              <CheckCircle2 className="w-24 h-24" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black mb-4"
            >
              {t.orderPlaced}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Preparing Screen --- */}
      <AnimatePresence>
        {showPreparingScreen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <button 
              onClick={() => setShowPreparingScreen(false)}
              className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-400"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>

            <ChefAnimation />
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black mb-6 text-gray-900"
            >
              {t.orderStatus.preparing}
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 max-w-xs leading-relaxed"
            >
              {t.preparingMessage}
            </motion.p>

            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="w-full max-w-xs h-2 bg-brand-red rounded-full mt-12 origin-left"
            />
            
            <button 
              onClick={() => setShowPreparingScreen(false)}
              className="mt-12 text-brand-red font-bold text-sm uppercase tracking-widest"
            >
              Back to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Spin Wheel Modal --- */}
      <AnimatePresence>
        {showWheel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWheel(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[40px] p-8 w-full max-w-sm text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-red" />
              <h3 className="text-2xl font-black mb-2">Loyalty Spin</h3>
              <p className="text-sm text-gray-500 mb-8">Win a special treat for your next visit!</p>

              <div className="relative mb-8 flex justify-center">
                <motion.div 
                  animate={isSpinning ? { rotate: 360 * 6 } : { rotate: 0 }}
                  transition={{ duration: 3, ease: "circOut" }}
                  className="w-48 h-48 rounded-full border-8 border-gray-100 relative shadow-inner flex items-center justify-center bg-gray-50"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                      <div key={deg} className="absolute w-1 h-full bg-gray-200" style={{ transform: `rotate(${deg}deg)` }} />
                    ))}
                  </div>
                  <div className="z-10 bg-white p-4 rounded-full shadow-lg">
                    <RotateCcw className={`w-8 h-8 text-brand-red ${isSpinning ? 'animate-spin' : ''}`} />
                  </div>
                </motion.div>
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-6 h-8 bg-brand-red clip-path-triangle z-20 shadow-md" />
              </div>

              {wheelResult ? (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <div className="text-3xl font-black text-brand-red mb-6">{wheelResult}</div>
                  <button 
                    onClick={() => setShowWheel(false)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold"
                  >
                    Awesome!
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="w-full bg-brand-red text-white py-4 rounded-2xl font-black shadow-lg shadow-brand-red/20 disabled:opacity-50"
                >
                  {isSpinning ? 'Spinning...' : 'Spin Now'}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
