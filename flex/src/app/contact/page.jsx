"use client";

import { useRef, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { FaUser, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ContactPage = () => {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  useEffect(() => {
   
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (containerRef.current) {
        tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8 }
        );
    }
    
    if (headingRef.current) {
        tl.fromTo(
        headingRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
        );
    }
    
    if (formRef.current && formRef.current.children) {
        tl.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
        "-=0.2"
        );
    }
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedback(null);

    const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      console.error("Missing EmailJS environment variables.", { serviceID, templateID, publicKey });
      setFeedback({
        type: "error",
        message: "Configuration error: Missing environment variables. Please restart your server if you just added them.",
      });
      setIsSending(false);
      return;
    }

    emailjs
      .sendForm(serviceID, templateID, formRef.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          setFeedback({
            type: "success",
            message: "Message sent! We'll get back to you soon.",
          });
          formRef.current.reset();
          
         
          gsap.fromTo(".feedback-msg", 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.4 }
          );
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setFeedback({
            type: "error",
            message: `Failed to send message: ${error.text || "Unknown error"}. Please check your console.`,
          });
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--color-primary)] px-4 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)] rounded-full blur-[120px] opacity-20 animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] opacity-10 animate-float-soft"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative z-10 max-w-4xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Info & Heading */}
          <div className="text-white space-y-6">
            <h1 ref={headingRef} className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Let's Start a Conversation
            </h1>
            <p className="text-gray-400 text-lg">
              Have a quarry in mind or just want to say hi? Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-4 pt-6">
                <div className="flex items-center space-x-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)]">
                        <FaEnvelope />
                    </div>
                    <span>hello@flex.com</span>
                </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-secondary)] transition-colors duration-300">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-gray-500 focus:border-[var(--color-secondary)] focus:bg-white/10 transition-all duration-300"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-secondary)] transition-colors duration-300">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-gray-500 focus:border-[var(--color-secondary)] focus:bg-white/10 transition-all duration-300"
                />
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message..."
                  required
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-gray-500 focus:border-[var(--color-secondary)] focus:bg-white/10 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {feedback && (
                <div className={`feedback-msg p-3 rounded-lg flex items-center gap-2 text-sm ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {feedback.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-xl bg-[var(--color-secondary)] text-white font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-secondary)]/20"
              >
                {isSending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span> Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="text-sm" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
