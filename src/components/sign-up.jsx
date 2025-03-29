import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase.jsx";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fixed auth state listener
  useEffect(() => {
    // Access auth directly from firebase
    const unsubscribe = firebase.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [firebase]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        await firebase.loginWithEmailAndPassword(formData.email, formData.password);
        toast.success(`Welcome back!`);
      } else {
        // Sign up
        const userCredential = await firebase.signUpWithEmailAndPassword(
          formData.email,
          formData.password
        );

        // Update user profile with full name
        await firebase.updateUserProfile(userCredential.user, {
          displayName: formData.fullName,
        });

        toast.success(`Welcome to our platform, ${formData.fullName}!`);
      }
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.message);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await firebase.signInWithGoogle();
      toast.success(`Welcome ${result.user.displayName}!`);
    } catch (err) {
      setError(err.message);
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Fix handleSignOut
  const handleSignOut = async () => {
    try {
      await firebase.signOut(); // Direct method call
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Failed to sign out');
    }
  };

  if (currentUser) {
    return (
      <section className="flex justify-center px-6 lg:px-20 bg-black py-[120px]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome, {currentUser.displayName || 'User'}!</h2>
            <p className="text-gray-600 mb-6">You are currently signed in</p>
            <button
              onClick={handleSignOut}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center px-6 lg:px-20 bg-black py-[120px] ">
      <Toaster position="top-center" reverseOrder={false} />
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

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full"></div>
                  <span className="bg-white px-4 text-sm text-gray-500">or</span>
                  <div className="border-t border-gray-300 w-full"></div>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium block mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10"
                        placeholder="John Doe"
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium block mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10"
                      placeholder="you@example.com"
                      required
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
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pl-10 pr-10"
                      placeholder="••••••••"
                      required
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
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Please wait..."
                  ) : (
                    <>
                      {isLogin ? "Sign in" : "Create account"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
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
