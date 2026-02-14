"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, Mail, Phone, MapPin, Camera, Save, Lock, 
  Award, TrendingUp, Gift, Share2, CreditCard, Star, ShoppingBag, ArrowRight,
  Plus, Edit2, Trash2, CheckCircle, AlertTriangle, X
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TIER_BENEFITS = {
  Bronze: "Earn 1 point per $1",
  Silver: "Earn 1.5 points per $1 + Free Shipping",
  Gold: "Earn 2 points per $1 + VIP Support"
};

const RECOMMENDED_PRODUCTS = [
  {
    id: 101,
    name: "Urban Hoodie",
    price: 49.99,
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/flex_white_djnry7.png",
    category: "Fashion",
  },
  {
    id: 102,
    name: "Smart Fitness Watch",
    price: 129.0,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60",
    category: "Electronics",
  },
  {
    id: 103,
    name: "Leather Crossbody Bag",
    price: 89.5,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60",
    category: "Accessories",
  },
];

const MOCK_ADDRESSES = [
  {
    id: 1,
    type: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    isDefault: true,
  },
  {
    id: 2,
    type: "Work",
    street: "456 Office Plaza",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    isDefault: false,
  }
];

export default function ProfilePage() {
  const { user, userData, updateUserProfile, deleteUserAccount } = useAuth();
  const [activeTab, setActiveTab] = useState("overview"); // overview, settings, preferences, addresses
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Address Management State
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // Track which address is being edited

  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false
  });

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const loyaltyPoints = userData?.loyaltyParams?.points || 1250;
  const currentTier = userData?.loyaltyParams?.tier || "Silver";
  const nextTierPoints = userData?.loyaltyParams?.nextTierPoints || 2500;
  const progress = (loyaltyPoints / nextTierPoints) * 100;
  const referralCode = userData?.referralCode || `FLEX-${user?.uid?.slice(0,6).toUpperCase()}`;

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || user?.displayName || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        bio: userData.bio || "",
      });
    }
  }, [userData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!user) throw new Error("No authenticated user found");
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
      });
      setIsLoading(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setIsLoading(false);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://flex-store.com/register?ref=${referralCode}`);
    toast.success("Referral link copied to clipboard!");
  };

  // Address Functions
  const handleAddOrUpdateAddress = (e) => {
    e.preventDefault();
    
    if (newAddress.isDefault) {
      // Unset previous default if new/updated one is default
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }

    if (editingAddressId) {
       // Update existing address
       setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...newAddress, id: editingAddressId } : a));
       toast.success("Address updated successfully!");
       setEditingAddressId(null);
    } else {
       // Add new address
       const addressWithId = { ...newAddress, id: Date.now() };
       setAddresses([...addresses, addressWithId]);
       toast.success("Address added successfully!");
    }

    setIsAddingAddress(false);
    setNewAddress({ type: "Home", street: "", city: "", state: "", zip: "", isDefault: false });
  };

  const startEditAddress = (address) => {
    setNewAddress(address);
    setEditingAddressId(address.id);
    setIsAddingAddress(true); // Re-use the add form
  };

  const cancelEdit = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setNewAddress({ type: "Home", street: "", city: "", state: "", zip: "", isDefault: false });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("Address removed.");
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    toast.success("Default address updated.");
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
        await deleteUserAccount();
        toast.success("Account deleted successfully.");
        router.push("/login");
    } catch (error) {
        console.error("Delete account error:", error);
        toast.error("Failed to delete account. Please re-login and try again.");
    } finally {
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
    }
  };

  if (!user) return <div className="p-8 text-white">Please log in to view your profile.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Profile Header */}
      <div className="relative bg-zinc-900/60 border border-white/5 rounded-3xl p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-secondary/20 via-purple-900/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-black shadow-2xl">
              <Image 
                src={user?.photoURL || "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770826040/transperent_logo_fskhub.png"} 
                alt="Profile" 
                width={128} 
                height={128}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1 mb-2">
            <h1 className="text-3xl font-bold text-white mb-1">{formData.displayName || "Flex Member"}</h1>
            <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
              {formData.email} • 
              <span className="text-secondary font-medium">Member since {new Date(user?.metadata?.creationTime).getFullYear()}</span>
            </p>
          </div>

          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Orders</p>
                <p className="text-xl font-bold text-white">24</p>
             </div>
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Reviews</p>
                <p className="text-xl font-bold text-white">8</p>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-1 overflow-x-auto">
        {["overview", "settings", "addresses", "preferences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold capitalize transition-all border-b-2 ${
              activeTab === tab 
                ? "text-white border-secondary" 
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Always Visible) - Gamification Card */}
        <div className="space-y-6">
           {/* Loyalty Card */}
           <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/30 transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
             
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-1">Current Tier</p>
                 <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                   {currentTier} <Award className="text-yellow-500" size={24} />
                 </h3>
               </div>
               <div className="text-right">
                 <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-1">Flex Points</p>
                 <p className="text-2xl font-bold text-secondary">{loyaltyPoints}</p>
               </div>
             </div>

             <div className="relative h-2 bg-zinc-800 rounded-full mb-2 overflow-hidden">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-purple-500 transition-all duration-1000" 
                 style={{ width: `${Math.min(progress, 100)}%` }}
               />
             </div>
             <p className="text-xs text-zinc-500 text-right mb-4">
               {nextTierPoints - loyaltyPoints} points to {currentTier === "Bronze" ? "Silver" : "Gold"}
             </p>

             <div className="bg-white/5 rounded-xl p-3 text-sm text-zinc-300 flex items-start gap-3">
               <Gift size={16} className="mt-0.5 text-secondary" />
               <p>{TIER_BENEFITS[currentTier]}</p>
             </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                 <Link href="/dashboard/payments">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                      <CreditCard size={18} /> Manage Payment Methods
                    </button>
                 </Link>
                 <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                   <Star size={18} /> My Reviews
                 </button>
                 <Link href="/dashboard/orders">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                      <TrendingUp size={18} /> Order History
                    </button>
                 </Link>
              </div>
           </div>
        </div>

        {/* Right Content Area (Dynamic based on Tab) */}
        <div className="lg:col-span-2">
          
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               {/* Referral Card */}
               <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="relative z-10 max-w-lg mx-auto">
                    <Share2 size={48} className="mx-auto text-white mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invite Friends & Earn $10</h2>
                    <p className="text-zinc-400 mb-6">Share your unique referral link with friends. They get $10 off their first order, and you get $10 credit!</p>
                    
                    <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl border border-white/10 max-w-sm mx-auto">
                       <code className="flex-1 font-mono text-secondary text-lg font-bold tracking-wide">{referralCode}</code>
                       <button 
                         onClick={copyReferral}
                         className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary hover:text-white transition-colors"
                       >
                         Copy
                       </button>
                    </div>
                  </div>
               </div>

               {/* Recommended For You */}
               <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white">Recommended For You</h3>
                     <Link href="/products" className="text-xs text-secondary hover:underline flex items-center gap-1">
                        View all <ArrowRight size={12} />
                     </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {RECOMMENDED_PRODUCTS.map((product) => (
                       <div key={product.id} className="bg-zinc-800/20 border border-white/5 rounded-xl overflow-hidden hover:border-secondary/50 transition-all group cursor-pointer">
                          <div className="aspect-[4/5] relative bg-black/50">
                             <Image 
                                src={product.image} 
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                             <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                {product.category}
                             </div>
                          </div>
                          <div className="p-3">
                             <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                             <div className="flex items-center justify-between mt-2">
                                <span className="text-secondary font-bold text-sm">${product.price}</span>
                                <span className="bg-white/10 p-1.5 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors">
                                   <ShoppingBag size={14} />
                                </span>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               {/* Personal Details Form */}
               <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Personal Details</h3>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2"><User size={14}/> Full Name</label>
                        <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2"><Mail size={14}/> Email</label>
                        <input type="email" value={formData.email} disabled className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2"><Phone size={14}/> Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2"><MapPin size={14}/> Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-zinc-400">Bio</label>
                       <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-secondary hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50">
                      {isLoading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                  </form>
               </div>
               
               {/* Danger Zone */}
               <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <AlertTriangle className="text-red-500" size={20} /> 
                     Danger Zone
                  </h3>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <p className="text-zinc-300 font-medium text-sm">Delete Account</p>
                        <p className="text-zinc-500 text-xs mt-1">Permanently delete your account and all data. This action cannot be undone.</p>
                     </div>
                     <button 
                       onClick={() => setShowDeleteConfirm(true)}
                       className="px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                     >
                        Delete Account
                     </button>
                  </div>

                  {/* Delete Confirmation Modal/Inline */}
                  {showDeleteConfirm && (
                     <div className="mt-6 p-4 rounded-xl bg-black/40 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-zinc-300 mb-4">Are you absolutely sure? This will permanently delete your account, order history, and saved preferences.</p>
                        <div className="flex gap-3">
                           <button 
                             onClick={() => setShowDeleteConfirm(false)}
                             className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold hover:bg-zinc-700"
                           >
                              Cancel
                           </button>
                           <button 
                             onClick={handleDeleteAccount}
                             disabled={deleteLoading}
                             className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-2"
                           >
                              {deleteLoading ? "Deleting..." : "Yes, Delete Everything"}
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === "addresses" && (
             <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                 <h3 className="text-lg font-bold text-white">Address Book</h3>
                 <button 
                   onClick={() => isAddingAddress ? cancelEdit() : setIsAddingAddress(true)}
                   className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-lg text-xs font-bold transition-all"
                 >
                   {isAddingAddress ? <X size={16} /> : <Plus size={16} />}
                   {isAddingAddress ? "Cancel" : "Add New"}
                 </button>
               </div>

               {isAddingAddress && (
                 <form onSubmit={handleAddOrUpdateAddress} className="bg-black/20 border border-white/10 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
                   <h4 className="font-bold text-white text-sm mb-4">{editingAddressId ? "Edit Address" : "New Address Details"}</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        placeholder="Label (e.g., Home, Work)" 
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none"
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                        required
                      />
                      <input 
                        placeholder="Street Address" 
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        required
                      />
                      <input 
                        placeholder="City" 
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        required
                      />
                      <div className="flex gap-2">
                        <input 
                          placeholder="State" 
                          className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none w-1/2"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          required
                        />
                        <input 
                          placeholder="ZIP" 
                          className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none w-1/2"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                          required
                        />
                      </div>
                   </div>
                   <div className="flex items-center gap-2 mb-4">
                      <input 
                        type="checkbox" 
                        id="isDefault" 
                        className="w-4 h-4 accent-secondary"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                       />
                      <label htmlFor="isDefault" className="text-sm text-zinc-400">Set as default address</label>
                   </div>
                   <button type="submit" className="w-full bg-secondary text-white font-bold py-2 rounded-lg text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all">
                     {editingAddressId ? "Update Address" : "Save Address"}
                   </button>
                 </form>
               )}

               <div className="space-y-4">
                 {addresses.map((addr) => (
                   <div key={addr.id} className="bg-zinc-800/20 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/10 transition-all">
                     <div className="flex items-start gap-4">
                       <div className={`p-2 rounded-full ${addr.isDefault ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-zinc-500'}`}>
                         <MapPin size={20} />
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-white text-sm">{addr.type}</h4>
                           {addr.isDefault && <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Default</span>}
                         </div>
                         <p className="text-zinc-400 text-sm">{addr.street}</p>
                         <p className="text-zinc-500 text-xs">{addr.city}, {addr.state} {addr.zip}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-2 sm:self-center self-end opacity-60 group-hover:opacity-100 transition-opacity">
                       {!addr.isDefault && (
                         <button 
                           onClick={() => setDefaultAddress(addr.id)}
                           className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"
                           title="Set as Default"
                         >
                           <CheckCircle size={16} />
                         </button>
                       )}
                       <button 
                        onClick={() => startEditAddress(addr)}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button 
                         onClick={() => deleteAddress(addr.id)}
                         className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === "preferences" && (
             <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-20">
                <Star size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Shopping Preferences</h3>
                <p className="text-zinc-400">Coming soon! Customize your feed with categories you love.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
