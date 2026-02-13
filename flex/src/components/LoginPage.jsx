"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const container = useRef(null);
  const formRef = useRef(null);
  const router = useRouter();

  // 🎬 Entrance Animation (different from register)
  useGSAP(() => {
    gsap.from(formRef.current, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // 🚀 Submit Animation + Redirect
  const handleLogin = (e) => {
    e.preventDefault();

    gsap.to(container.current, {
      opacity: 0,
      y: -40,
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
      className="min-h-screen flex items-center justify-center bg-base-300 p-6"
    >
      <div className="w-full max-w-6xl bg-base-300 rounded-3xl shadow-2xl flex overflow-hidden border border-secondary/30">
        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          {/* Different Gradient Direction */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-secondary to-primary"></div>

          {/* Optional Image */}
          <Image
            src="https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882423/Transparent-Model_z7lplb.png"
            alt="model"
            fill
            className="object-contain object-center z-10"
            priority
          />

          <div className="absolute inset-0 bg-black/50 z-20"></div>

          <div className="relative z-30 p-12 flex flex-col justify-between text-white w-full">
            <div>
              <h2 className="text-lg tracking-widest uppercase opacity-70">
                FLEX MEMBERS
              </h2>
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">
                Welcome Back. <br /> Stay Unstoppable.
              </h1>
              <p className="mt-4 text-white/70 max-w-sm">
                Log in to access your personalized dashboard and continue
                building your creative journey.
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
            <h1 className="text-3xl font-bold text-base-content mb-2">Login</h1>
            <p className="text-base-content/70 mb-8">
              Access your FLEX account
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full focus:border-secondary"
                />
              </div>

              {/* Password */}
              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full focus:border-secondary"
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                  Remember me
                </label>
                <span className="text-secondary cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn bg-success border-none w-full text-white hover:shadow-lg hover:shadow-success/50 transition-all duration-300"
              >
                Login
              </button>
            </form>

            <div className="divider my-6">or</div>

            <button className="btn btn-outline w-full">
              Continue with Google
            </button>

            <p className="text-sm mt-6 text-center">
              Don’t have an account?{" "}
              <Link href={'/register'} className="text-secondary font-medium cursor-pointer">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
