"use client";

import { useRef, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { 
  FaUser, 
  FaEnvelope, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaQuestionCircle, 
  FaHeadset, 
  FaChevronDown,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaBolt
} from "react-icons/fa";

// FAQ Data
const faqs = [
  {
    question: "Where is my order?",
    answer:
      "You can track your order status in real-time by visiting the 'Track Order' page and entering your order ID sent to your email.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for all unused items in original packaging. Refunds are processed within 5-7 business days.",
  },
  {
    question: "How does the temperature display work?",
    answer:
      "FLEX bottles use a smart temperature-sensing lid that shows the current liquid temperature in real time. Just tap the lid to activate the display.",
  },
  {
    question: "Does the bottle need charging?",
    answer:
      "No. FLEX bottles use a long-lasting built-in battery that can last up to 1 year with normal use. No charging required.",
  },
  {
    question: "Is the temperature display waterproof?",
    answer:
      "Yes, the display lid is splash-resistant and safe for daily use. However, it should not be submerged in water.",
  },
  {
    question: "What temperature range can the bottle display?",
    answer:
      "FLEX bottles accurately display temperatures from 0°C to 100°C, making them suitable for both cold and hot beverages.",
  },
  {
    question: "Can I put hot water in the bottle?",
    answer:
      "Yes, FLEX bottles are designed to safely hold hot liquids. The temperature display helps you avoid burns by showing the exact heat level.",
  },
  {
    question: "Is FLEX made of safe materials?",
    answer:
      "Absolutely. FLEX bottles are made from high-quality, BPA-free stainless steel and food-grade materials for safe everyday use.",
  },
  {
    question: "Does the bottle keep drinks hot or cold?",
    answer:
      "Yes. FLEX bottles use double-wall vacuum insulation to keep drinks hot for up to 12 hours and cold for up to 24 hours.",
  },
  {
    question: "Is the bottle leak-proof?",
    answer:
      "Yes, FLEX bottles are 100% leak-proof when the lid is properly closed, making them perfect for travel and daily carry.",
  },
];

const ContactPage = () => {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial Stagger Animation
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    )
    .fromTo(
      [headingRef.current, ".contact-intro"],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(
      formRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6 },
      "-=0.3"
    )
    .fromTo(
      sidebarRef.current.children,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.6 },
      "-=0.4"
    );
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedback(null);

    const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      setFeedback({
        type: "error",
        message: "Configuration error. Please check console.",
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
            message: "Message sent successfully!",
          });
          formRef.current.reset();
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setFeedback({
            type: "error",
            message: "Failed to send message.",
          });
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <section className="min-h-screen bg-[var(--color-primary)] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] bg-[var(--color-secondary)] rounded-full blur-[140px] opacity-20 animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[140px] opacity-10 animate-float-soft"></div>
      </div>

      <div
        ref={containerRef}
        className="container mx-auto max-w-7xl relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1
            ref={headingRef}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500"
          >
            Customer Support
          </h1>
          <p className="contact-intro text-gray-400 text-lg max-w-2xl mx-auto">
            We're here to help with your orders, returns, and product questions.
            Choose a topic below or check our FAQs.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pl-2">
          {/* Main Contact Form (Left) */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <FaPaperPlane className="text-[var(--color-secondary)]" />{" "}
                  Send a Message
                </h3>
                {/* Response Time Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                  <FaBolt className="text-xs" /> Avg. Response: &lt; 2 hrs
                </div>
              </div>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                {/* Subject Selector */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Topic
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        className="w-full pl-4 pr-10 py-4 bg-black/20 border border-white/10 rounded-xl outline-none text-white appearance-none focus:border-[var(--color-secondary)] transition-all cursor-pointer"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select a topic...
                        </option>
                        <option value="Order Status" className="bg-gray-900">
                          Order Status
                        </option>
                        <option value="Return/Refund" className="bg-gray-900">
                          Return & Refund
                        </option>
                        <option
                          value="Product Question"
                          className="bg-gray-900"
                        >
                          Product Question
                        </option>
                        <option value="Other" className="bg-gray-900">
                          Other Inquiry
                        </option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">
                      Order # (Optional)
                    </label>
                    <input
                      type="text"
                      name="order_id"
                      placeholder="#12345"
                      className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-xl outline-none text-white placeholder-gray-600 focus:border-[var(--color-secondary)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[var(--color-secondary)] transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl outline-none text-white placeholder-gray-600 focus:border-[var(--color-secondary)] transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[var(--color-secondary)] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl outline-none text-white placeholder-gray-600 focus:border-[var(--color-secondary)] transition-all"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="How can we help you today?"
                    required
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none text-white placeholder-gray-600 focus:border-[var(--color-secondary)] transition-all resize-none"
                  ></textarea>
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${feedback.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                  >
                    {feedback.type === "success" ? (
                      <FaCheckCircle size={18} />
                    ) : (
                      <FaExclamationCircle size={18} />
                    )}
                    {feedback.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-secondary)] to-red-900 text-white font-bold text-lg hover:shadow-lg hover:shadow-red-900/40 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Request <FaPaperPlane className="text-sm" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div ref={sidebarRef} className="lg:col-span-5 space-y-6">
            {/* Contact Info & Hours Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaHeadset className="text-[var(--color-secondary)]" /> Contact
                Information
              </h4>

              <div className="space-y-6">
                {/* Direct Contact */}
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">Our Office</h5>
                      <p className="text-gray-400 text-sm">
                        123 Asad Avenue
                        <br />
                        Mohammadpur, Dhaka 1207
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
                      <FaPhoneAlt />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">
                        Phone Support
                      </h5>
                      <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">Email</h5>
                      <p className="text-gray-400 text-sm">support@flex.com</p>
                    </div>
                  </div>
                </div>

                <div className="divider border-b border-white/10 my-2"></div>

                {/* Support Hours */}
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
                      <FaClock />
                    </div>
                    <div className="w-full">
                      <h5 className="font-semibold text-white mb-2">
                        Support Hours
                      </h5>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Mon - Fri</span>
                        <span>9:00 AM - 8:00 PM EST</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Sat - Sun</span>
                        <span>10:00 AM - 6:00 PM EST</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-3xl overflow-hidden h-64 min-h-[250px] relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14669.345207603423!2d90.3447778!3d23.7637246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c8716ee1f1ef%3A0xd4e950f1d7bb1b08!2sMohammadpur%2C%20Dhaka%201207%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  borderRadius: "1rem",
                  filter: "grayscale(100%) invert(92%) contrast(83%)",
                }}
                allowFullScreen=""
                loading="lazy"
                title="Company Location"
              ></iframe>
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>

              {/* Overlay Badge */}
              <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-600" /> Locate Us
              </div>
            </div>


          </div>
        </div>

        {/* Full Width FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[var(--color-secondary)] text-sm font-bold mb-6">
              <FaQuestionCircle /> Help Center
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
              Find quick answers to common questions about shipping, returns, and product details.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="collapse collapse-plus bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <input type="radio" name="main-faq-accordion" />
                <div className="collapse-title text-xl font-medium text-white py-6">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-gray-400 pb-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
