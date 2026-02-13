"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const container = useRef(null);
  const formRef = useRef(null);
  const router = useRouter();
  const { createUser, googleLogin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 🎬 Page Load Animation
  useGSAP(() => {
    gsap.from(formRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // 🚀 Submit Animation + Redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await createUser(email, password, name);
      animateAndRedirect();
    } catch (err) {
      setError("Failed to create an account.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      animateAndRedirect();
    } catch (err) {
      setError("Failed to register with Google.");
      console.error(err);
    }
  };

  const animateAndRedirect = () => {
    gsap.to(container.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/");
      },
    });
  };

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center bg-base-300 p-20"
    >
      <div className="w-full max-w-6xl bg-base-300 rounded-3xl shadow-2xl flex overflow-hidden border border-secondary/30">
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-black"></div>

          {/* Image */}
          <Image
            src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/Transparent-Model_z7lplb.png"
            alt="model"
            fill
            className="object-contain object-center z-10"
            priority
          />

          {/* Dark overlay (optional, put ABOVE image if you want darker look) */}
          <div className="absolute inset-0 bg-black/40 z-20"></div>

          {/* Text Content */}
          <div className="relative z-30 p-12 flex flex-col justify-between text-white w-full">
            <div>
              <h2 className="text-lg tracking-widest uppercase opacity-70">
                WELCOME TO FLEX
              </h2>
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight">
                Stay Cold. <br /> Stay Bold.
              </h1>
              <p className="mt-4 text-white/70 max-w-sm">
                Become part of a creative platform where innovation meets
                technology. Your journey starts here.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          ref={formRef}
          className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-base-200"
        >
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold text-base-content/70 mb-2">
              Create Account
            </h1>
            <p className="text-base-content/70 mb-8">
              Register to unlock your experience
            </p>

            {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full focus:border-secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full focus:border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full focus:border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full focus:border-secondary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
              </div>

              {/* 🔥 Success Color Button */}
              <button
                type="submit"
                className="btn bg-success border-none w-full text-white hover:scale-105 transition-transform duration-300"
              >
                Register
              </button>
            </form>

            <div className="divider my-6">or</div>

            <button 
              className="btn btn-outline w-full"
              type="button"
              onClick={handleGoogleLogin}
            >
              Register with Google
            </button>

            <p className="text-sm mt-6 text-center">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-secondary font-medium cursor-pointer"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
