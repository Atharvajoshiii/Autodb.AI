import { useState } from 'react';
import React from "react";

import { motion } from 'framer-motion';
import { Database, Lock, Mail, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Network, Code, Layers, Zap, Cpu, Globe } from "lucide-react";
import app from './firebase_config';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useLocation } from 'wouter';

const LoginPage = () => {
  const [location, setLocation] = useLocation();
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<'email' | 'password' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
      setLocation('/dashboard');
    } catch (error: any) {
      alert('error occured , try again please');
      console.error("Error signing in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
      setLocation('/dashboard');
    } catch (error: any) {
      alert('error occured , try again please');
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - AI Visualization */}
      <div className="w-2/3 relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 flex items-center justify-center overflow-hidden px-4 py-6 lg:px-8 lg:py-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 opacity-50 pointer-events-none"></div>
        
        {/* Floating Geometric Shapes */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.6, 0.8, 0.6],
            scale: [0.8, 1, 0.8] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-0 hidden md:block"
        >
          <svg viewBox="0 0 1200 800" className="w-full h-full opacity-20">
            {[...Array(40)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 800}
                r={Math.random() * 10 + 2}
                fill="rgba(255,255,255,0.1)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  r: [2, 10, 2]
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 max-w-xl w-full flex flex-col justify-center items-center space-y-6 lg:space-y-10">
          {/* Header and Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-4 w-full justify-center"
          >
            <Zap className="w-8 h-8 lg:w-12 lg:h-12 text-zinc-200" />
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">AutoDB.AI</h1>
          </motion.div>

          {/* Feature Showcase */}
          <motion.div 
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="grid grid-cols-2 gap-4 lg:gap-6 w-full hidden md:grid max-h-[50vh] place-content-center"
>
  {[
    {
      icon: Cpu,
      title: "AI-Powered Insights",
      description: "Intelligent schema generation",
      color: "text-zinc-200"
    },
    {
      icon: Network,
      title: "Smart Mapping",
      description: "Advanced data relationships",
      color: "text-zinc-300"
    },
    {
      icon: Globe,
      title: "Scalable Design",
      description: "Future-proof solutions",
      color: "text-zinc-100"
    },
    {
      icon: Code,
      title: "Automated Inference",
      description: "Intelligent algorithms",
      color: "text-zinc-50"
    }
  ].map((feature, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-zinc-800 transform transition-all group flex flex-col justify-between"
    >
      <div>
        <feature.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${feature.color} mb-2 lg:mb-4 group-hover:rotate-12 transition-transform`} />
        <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2 text-white">{feature.title}</h3>
        <p className="text-zinc-400 text-xs lg:text-sm">{feature.description}</p>
      </div>
    </motion.div>
  ))}
</motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4 lg:space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Revolutionize Your Database Architecture
            </h2>
            <p className="text-base lg:text-xl text-zinc-300 px-4">
              Transform complex data landscapes into elegant, intelligent schema solutions.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4 lg:pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-100 text-zinc-900 px-4 py-2 lg:px-6 lg:py-3 rounded-full font-semibold shadow-lg hover:bg-zinc-200 text-sm lg:text-base transition-all"
              >
                Explore Features
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-zinc-700 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full hover:bg-zinc-800 text-sm lg:text-base transition-all"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      
      {/* Right Side - Login Form */}
      <div className="w-1/3 md:w-full lg:w-1/3 bg-white flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 opacity-50 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="w-full max-w-md z-10 relative"
        >
          {/* Floating Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-zinc-200 rounded-full opacity-50 blur-2xl hidden lg:block"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-zinc-300 rounded-full opacity-50 blur-2xl hidden lg:block"></div>

          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 lg:p-10 relative overflow-hidden">
            {/* Subtle Glow Border */}
            <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 opacity-30 rounded-3xl blur-lg pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-center mb-6 lg:mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl lg:text-3xl font-bold text-zinc-900 mb-2 lg:mb-3"
                >
                  Welcome Back
                </motion.h2>
                <p className="text-xs lg:text-sm text-zinc-500">Sign in to Schema Forge AI</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  <input 
                    type="email"
                    value={email}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 border-2 rounded-xl text-sm lg:text-base transition-all duration-300 focus:outline-none ${
                      activeField === 'email' 
                      ? 'border-zinc-900 ring-4 ring-zinc-200' 
                      : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                    placeholder="Email Address"
                    required
                  />
                  <Mail className={`absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                    activeField === 'email' ? 'text-zinc-900' : 'text-zinc-400'
                  }`} />
                  {email && <CheckCircle className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-green-500" />}
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 border-2 rounded-xl text-sm lg:text-base transition-all duration-300 focus:outline-none ${
                      activeField === 'password' 
                      ? 'border-zinc-900 ring-4 ring-zinc-200' 
                      : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                    placeholder="Password"
                    required
                  />
                  <Lock className={`absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                    activeField === 'password' ? 'text-zinc-900' : 'text-zinc-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 transition"
                  >
                    {showPassword ? <EyeOff size={16} className="lg:w-5 lg:h-5" /> : <Eye size={16} className="lg:w-5 lg:h-5" />}
                  </button>
                </motion.div>
                
                <div className="flex justify-between items-center text-xs lg:text-sm">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-zinc-900 focus:ring-zinc-700 w-3 h-3 lg:w-4 lg:h-4"
                    />
                    <span className="text-zinc-600">Remember me</span>
                  </label>
                  <a href="#" className="text-zinc-900 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-zinc-900 text-white py-3 lg:py-4 rounded-xl font-semibold hover:bg-zinc-800 text-sm lg:text-base transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-zinc-200/50"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </motion.button>
                
                <div className="flex items-center my-3 lg:my-4">
                  <div className="border-t border-zinc-300 grow mr-3"></div>
                  <span className="text-zinc-500 text-xs lg:text-sm">or continue with</span>
                  <div className="border-t border-zinc-300 grow ml-3"></div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 py-3 lg:py-4 border-2 border-zinc-200 rounded-xl hover:bg-zinc-50 text-sm lg:text-base transition-all duration-300"
                >
                  <FcGoogle className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="font-medium text-zinc-700">Continue with Google</span>
                </motion.button>
              </form>
            </div>
          </div>

          <div className="text-center mt-4 lg:mt-6 text-xs lg:text-sm text-zinc-600">
            Don't have an account? <a href="/signup" className="text-zinc-900 hover:underline">Sign Up</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;