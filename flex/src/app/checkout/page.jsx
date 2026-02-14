"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CreditCard, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Mock Cart Data (In a real app, this comes from Context/Redux)
const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    color: "Midnight Black"
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 159.50,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60",
    color: "Slate Grey"
  }
];

// Payment Methods Configuration
const PAYMENT_METHODS = [
  {
    id: "bkash",
    name: "bKash",
    color: "bg-[#e2136e]",
    logo: "https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png",
    instruction: "Send money to 01700000000 (Personal)",
  },
  {
    id: "nagad",
    name: "Nagad",
    color: "bg-[#ec1d24]",
    logo: "https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg",
    instruction: "Send money to 01800000000 (Merchant)",
  },
  {
    id: "rocket",
    name: "Rocket",
    color: "bg-[#8c3494]",
    logo: "https://static.vecteezy.com/system/resources/previews/068/706/013/non_2x/rocket-color-logo-mobile-banking-icon-free-png.png",
    instruction: "Send money to 01900000000-7",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    color: "bg-zinc-700",
    icon: CreditCard,
    instruction: "Transfer to City Bank Ltd. Account: 11223344",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    trxId: "",
    senderPhone: "",
    bankAccountName: "",
    bankAccountNumber: "",
  });

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 60; // Fixed shipping for BD context usually
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!checkoutData.fullName || !checkoutData.phone || !checkoutData.address) {
      toast.error("Please fill in all shipping details.");
      setLoading(false);
      return;
    }

    if (selectedMethod !== 'bank' && (!checkoutData.senderPhone || !checkoutData.trxId)) {
       toast.error("Please provide payment details.");
       setLoading(false);
       return;
    }

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      toast.success("Order placed successfully! Check your email for confirmation.");
      router.push("/dashboard/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
          
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/cart" className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Shipping Information */}
          <section className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="text-secondary" /> Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-zinc-600" size={18} />
                  <input 
                    name="fullName"
                    value={checkoutData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-zinc-600" size={18} />
                  <input 
                    name="phone"
                    value={checkoutData.phone}
                    onChange={handleInputChange}
                    placeholder="017xxxxxxxx" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-400">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-zinc-600" size={18} />
                  <input 
                    name="address"
                    value={checkoutData.address}
                    onChange={handleInputChange}
                    placeholder="House 12, Road 5, Block B..." 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">City</label>
                <input 
                  name="city"
                  value={checkoutData.city}
                  onChange={handleInputChange}
                  placeholder="Dhaka" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-secondary" /> Payment Method
            </h2>

            {/* Method Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden group ${
                    selectedMethod === method.id 
                    ? "border-secondary bg-secondary/10 shadow-[0_0_20px_rgba(255,11,85,0.2)]" 
                    : "border-white/10 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-white/20"
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="absolute top-2 right-2 text-secondary">
                      <CheckCircle size={16} fill="currentColor" className="text-secondary" />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === method.id ? "scale-110" : "grayscale group-hover:grayscale-0"} transition-all duration-300`}>
                    {method.logo ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-white p-1">
                         <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-full ${method.color} flex items-center justify-center`}>
                        <method.icon size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${selectedMethod === method.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic Payment Details Form */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-300">
               {selectedMethod !== 'bank' ? (
                 <div className="space-y-4">
                   <div className="flex items-start gap-3 bg-secondary/10 border border-secondary/20 p-4 rounded-xl">
                      <AlertCircle className="text-secondary shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-bold text-white mb-1">Payment Instructions</p>
                        <p className="text-xs text-zinc-300">
                          1. Go to your {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name} App.<br/>
                          2. {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.instruction}.<br/>
                          3. Enter the Reference: <span className="text-white font-mono font-bold">ORDER123</span>.<br/>
                          4. Use your <span className="font-bold text-white">Counter No: 1</span> (if applicable).
                        </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Your {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name} Number</label>
                        <input 
                          name="senderPhone"
                          value={checkoutData.senderPhone}
                          onChange={handleInputChange}
                          placeholder="017xxxxxxxx" 
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Transaction ID (TrxID)</label>
                        <input 
                          name="trxId"
                          value={checkoutData.trxId}
                          onChange={handleInputChange}
                          placeholder="8J9SD89S7D" 
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary focus:outline-none transition-all font-mono uppercase"
                        />
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <p className="text-sm text-zinc-400 mb-2">Please make a deposit to the following account:</p>
                    <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 font-mono text-sm space-y-1 mb-4 select-all">
                      <p><span className="text-zinc-500">Bank:</span> City Bank Ltd.</p>
                      <p><span className="text-zinc-500">Account Name:</span> Flex Store Inc.</p>
                      <p><span className="text-zinc-500">Account No:</span> 112233445566</p>
                      <p><span className="text-zinc-500">Branch:</span> Gulshan-1</p>
                    </div>

                     <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-zinc-400">Your Account Name</label>
                           <input 
                              name="bankAccountName"
                              value={checkoutData.bankAccountName}
                              onChange={handleInputChange}
                              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary focus:outline-none transition-all"
                            />
                        </div>
                        {/* More bank fields if needed */}
                     </div>
                 </div>
               )}
            </div>

          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-black rounded-lg relative overflow-hidden shrink-0 border border-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.color} x {item.quantity}</p>
                      <p className="text-sm font-bold text-secondary mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-secondary text-white mt-6 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,11,85,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span> 
                ) : (
                  <>Place Order <Truck size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600">
                <CheckCircle size={12} />
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
