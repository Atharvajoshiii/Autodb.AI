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
  const [location , setLocation] = useLocation();
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
      setLocation('/home');
    } catch(error){
      alert('error occured , try again please')
      console.error("Error signing in with Google:", error);
    };
    
  };

  const handleGoogleLogin = async () => {
    // Google login logic
    try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("User signed in:", user);
                // Handle successful login (e.g., redirect or store user info)
                setLocation('/home')
    
            } catch (error) {
                alert('error occured , try again please')
                console.error("Error signing in with Google:", error);
            }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - AI Visualization */}
      <div className="w-2/3 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden px-4 py-6 lg:px-8 lg:py-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-50 pointer-events-none"></div>
        
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
            <Zap className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-400" />
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">AutoDB.AI</h1>
          </motion.div>

          {/* Feature Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 lg:gap-6 w-full hidden md:grid"
          >
            {[
              {
                icon: Cpu,
                title: "AI-Powered Insights",
                description: "Intelligent schema generation",
                color: "text-blue-400"
              },
              {
                icon: Network,
                title: "Smart Mapping",
                description: "Advanced data relationships",
                color: "text-green-400"
              },
              {
                icon: Globe,
                title: "Scalable Design",
                description: "Future-proof solutions",
                color: "text-purple-400"
              },
              {
                icon: Code,
                title: "Automated Inference",
                description: "Intelligent algorithms",
                color: "text-pink-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-white/20 transform transition-all group"
              >
                <feature.icon className={`w-8 h-8 lg:w-12 lg:h-12 ${feature.color} mb-2 lg:mb-4 group-hover:rotate-12 transition-transform`} />
                <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70 text-xs lg:text-sm">{feature.description}</p>
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
            <p className="text-base lg:text-xl text-white/80 px-4">
              Transform complex data landscapes into elegant, intelligent schema solutions.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4 lg:pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-900 px-4 py-2 lg:px-6 lg:py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 text-sm lg:text-base transition-all"
              >
                Explore Features
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/30 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full hover:bg-white/10 text-sm lg:text-base transition-all"
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
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 opacity-50 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="w-full max-w-md z-10 relative"
        >
          {/* Floating Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-100 rounded-full opacity-50 blur-2xl hidden lg:block"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl hidden lg:block"></div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-10 relative overflow-hidden">
            {/* Subtle Glow Border */}
            <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 opacity-30 rounded-3xl blur-lg pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-center mb-6 lg:mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 lg:mb-3"
                >
                  Welcome Back
                </motion.h2>
                <p className="text-xs lg:text-sm text-gray-500">Sign in to Schema Forge AI</p>
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
                      ? 'border-indigo-500 ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    placeholder="Email Address"
                    required
                  />
                  <Mail className={`absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                    activeField === 'email' ? 'text-indigo-500' : 'text-gray-400'
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
                      ? 'border-indigo-500 ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    placeholder="Password"
                    required
                  />
                  <Lock className={`absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                    activeField === 'password' ? 'text-indigo-500' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500 transition"
                  >
                    {showPassword ? <EyeOff size={16} className="lg:w-5 lg:h-5" /> : <Eye size={16} className="lg:w-5 lg:h-5" />}
                  </button>
                </motion.div>
                
                <div className="flex justify-between items-center text-xs lg:text-sm">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-indigo-600 focus:ring-indigo-500 w-3 h-3 lg:w-4 lg:h-4"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-indigo-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 lg:py-4 rounded-xl font-semibold hover:opacity-90 text-sm lg:text-base transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-indigo-200/50"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </motion.button>
                
                <div className="flex items-center my-3 lg:my-4">
                  <div className="border-t border-gray-300 grow mr-3"></div>
                  <span className="text-gray-500 text-xs lg:text-sm">or continue with</span>
                  <div className="border-t border-gray-300 grow ml-3"></div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full flex items-center justify-center space-x-3 py-3 lg:py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 text-sm lg:text-base transition-all duration-300"
                >
                  <FcGoogle className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </motion.button>
              </form>
            </div>
          </div>

          <div className="text-center mt-4 lg:mt-6 text-xs lg:text-sm text-gray-600">
            Don't have an account? <a href="#" className="text-indigo-600 hover:underline">Sign Up</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;