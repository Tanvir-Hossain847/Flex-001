"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare, ThumbsUp, X } from "lucide-react";
import { toast } from "sonner";

const MOCK_INITIAL_REVIEWS = [
  {
    id: 1,
    productName: "Premium Wireless Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    rating: 5,
    date: "2024-03-10",
    comment: "Absolutely love these! The sound quality is incredible and the battery life lasts for days. Highly recommend.",
    helpful: 12
  },
  {
    id: 2,
    productName: "Ergonomic Office Chair",
    productImage: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60",
    rating: 4,
    date: "2024-02-15",
    comment: "Great chair, very comfortable for long hours. Assembly was a bit tricky but manageable.",
    helpful: 5
  }
];

const MOCK_PENDING_REVIEWS = [
  {
    id: 3,
    productName: "Smart Fitness Watch",
    productImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60",
    purchaseDate: "2024-04-01"
  }
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("posted"); // posted, pending
  const [reviews, setReviews] = useState(MOCK_INITIAL_REVIEWS);
  const [pendingReviews, setPendingReviews] = useState(MOCK_PENDING_REVIEWS);
  
  // Review Writing State
  const [writingReview, setWritingReview] = useState(null); // Holds the product object being reviewed
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });

  const handleStartReview = (product) => {
    setWritingReview(product);
    setReviewForm({ rating: 0, comment: "" });
  };

  const handleCloseReview = () => {
    setWritingReview(null);
    setReviewForm({ rating: 0, comment: "" });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (reviewForm.rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (reviewForm.comment.trim().length < 10) {
       toast.error("Please write a bit more (at least 10 characters).");
       return;
    }

    // Create new review object
    const newReview = {
      id: Date.now(),
      productName: writingReview.productName,
      productImage: writingReview.productImage,
      rating: reviewForm.rating,
      date: new Date().toISOString(),
      comment: reviewForm.comment,
      helpful: 0
    };

    // Update State
    setReviews([newReview, ...reviews]);
    setPendingReviews(pendingReviews.filter(p => p.id !== writingReview.id));
    
    // Close & Feedback
    setWritingReview(null);
    setActiveTab("posted");
    toast.success("Review submitted successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Reviews</h1>
          <p className="text-zinc-400 mt-1">Manage and view your product feedback.</p>
        </div>
        
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10">
           <button 
             onClick={() => setActiveTab("posted")}
             className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'posted' ? 'bg-secondary text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
           >
             Posted Reviews
           </button>
           <button 
             onClick={() => setActiveTab("pending")}
             className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-gray-700 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
           >
             Pending ({pendingReviews.length})
           </button>
        </div>
      </div>

      {/* Write Review Modal / Overlay */}
      {writingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg relative shadow-2xl">
              <button 
                onClick={handleCloseReview}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Write a Review</h2>
              <p className="text-zinc-400 text-sm mb-6">Evaluating <span className="text-white font-medium">{writingReview.productName}</span></p>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                 {/* IDV Star Rating */}
                 <div className="flex flex-col items-center gap-2 py-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="text-sm font-medium text-zinc-300">How would you rate it?</p>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           type="button"
                           onClick={() => setReviewForm({...reviewForm, rating: star})}
                           className="transition-transform hover:scale-110 focus:outline-none"
                         >
                           <Star 
                             size={32} 
                             fill={star <= reviewForm.rating ? "#FFD700" : "none"} 
                             className={star <= reviewForm.rating ? "text-yellow-400 border-none" : "text-zinc-600"}
                             strokeWidth={1.5}
                           />
                         </button>
                       ))}
                    </div>
                    <p className="text-xs text-zinc-500 h-4">
                       {reviewForm.rating === 5 && "Excellent!"}
                       {reviewForm.rating === 4 && "Very Good"}
                       {reviewForm.rating === 3 && "Average"}
                       {reviewForm.rating === 2 && "Poor"}
                       {reviewForm.rating === 1 && "Terrible"}
                    </p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Your Experience</label>
                    <textarea 
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      placeholder="What did you like or dislike? How was the quality?"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none placeholder:text-zinc-600"
                    />
                    <p className="text-xs text-right text-zinc-500">{reviewForm.comment.length}/500</p>
                 </div>

                 <button 
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-secondary hover:text-white transition-all shadow-lg hover:shadow-secondary/20"
                 >
                    Submit Review
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Content - Posted Reviews */}
      {activeTab === "posted" && (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-white/10 transition-colors">
              <div className="shrink-0 w-full md:w-32 aspect-square relative bg-black/50 rounded-xl overflow-hidden border border-white/5">
                <Image 
                  src={review.productImage} 
                  alt={review.productName} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{review.productName}</h3>
                    <div className="flex items-center gap-1 mt-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill={star <= review.rating ? "currentColor" : "none"} 
                          className={star <= review.rating ? "" : "text-zinc-700"}
                        />
                      ))}
                      <span className="text-xs text-zinc-500 ml-2 font-medium">On {new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="text-xs text-zinc-500 hover:text-white transition-colors">Edit</button>
                </div>
                
                <p className="text-zinc-300 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-4 pt-2">
                   <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <ThumbsUp size={14} />
                      <span>{review.helpful} people found this helpful</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
          
          {reviews.length === 0 && (
             <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-white/10">
                <MessageSquare size={48} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
                <p className="text-zinc-500">Share your thoughts on products you've purchased.</p>
             </div>
          )}
        </div>
      )}

      {/* Content - Pending Reviews */}
      {activeTab === "pending" && (
         <div className="grid gap-6">
            {pendingReviews.map((item) => (
               <div key={item.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="shrink-0 w-24 h-24 relative bg-black/50 rounded-xl overflow-hidden border border-white/5">
                    <Image 
                      src={item.productImage} 
                      alt={item.productName} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="font-bold text-white text-lg">{item.productName}</h3>
                     <p className="text-sm text-zinc-500">Purchased on {new Date(item.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleStartReview(item)}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-secondary hover:text-white transition-all shadow-lg hover:shadow-secondary/20"
                  >
                     Write a Review
                  </button>
               </div>
            ))}
            
            {pendingReviews.length === 0 && (
               <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-white/10">
                  <p className="text-zinc-500 text-lg">No pending reviews.</p>
                  <p className="text-zinc-600 text-sm">You have reviewed all your purchases!</p>
               </div>
            )}
         </div>
      )}
    </div>
  );
}
