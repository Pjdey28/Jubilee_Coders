import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className="flex justify-center px-6 lg:px-20 bg-black py-[120px] ">
      <div className="w-full max-w-7xl">

      <div className="mt-10 flex justify-center">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome" : "Create account"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up for an account to get started"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <label
                  htmlFor="name"
                  className="text-sm font-medium block mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10"
                    placeholder="John Doe"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}

            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium block mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="text-sm font-medium block mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10 pr-10"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button className="text-sm text-gray-600 hover:text-black transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group"
            >
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-black hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-gray-400 text-center mt-8 text-sm">
          By continuing, you agree to our{" "}
          <a href="#" className=" hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className=" hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
      </div>
      </div>
    </section>
  );
};

export default SignUp;
