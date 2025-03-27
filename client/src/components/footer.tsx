import React from 'react';
import { Github, Linkedin, Twitter, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 overflow-hidden">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 opacity-50 pointer-events-none"></div>
      
      {/* Decorative Blob Shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Product Information */}
          <div className="space-y-6 transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Send className="text-white w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AutoDB</h4>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Revolutionizing database design through AI-powered automation. Create, optimize, and manage your databases with unprecedented intelligence and ease.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Github, href: "https://github.com/autodb", color: "hover:text-black" },
                { Icon: Linkedin, href: "https://linkedin.com/company/autodb", color: "hover:text-blue-700" },
                { Icon: Twitter, href: "https://twitter.com/autodb", color: "hover:text-blue-400" }
              ].map(({ Icon, href, color }, index) => (
                <a 
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    text-gray-500 ${color} 
                    transition-all duration-300 
                    transform hover:scale-110 hover:rotate-6
                    bg-white/50 hover:bg-white/80 
                    p-3 rounded-full shadow-md
                  `}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 transform transition-all duration-300 hover:scale-[1.02]">
            <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-4">
              {[
                "Features", "Pricing", "Documentation", 
                "AI Database Generator", "ER Diagram Tool"
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="
                      text-gray-600 
                      hover:text-transparent 
                      hover:bg-clip-text 
                      hover:bg-gradient-to-r 
                      from-blue-600 to-purple-600 
                      transition-all 
                      duration-300 
                      flex 
                      items-center 
                      group
                    "
                  >
                    <span className="mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Newsletter */}
          <div className="space-y-6 transform transition-all duration-300 hover:scale-[1.02]">
            <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-purple-500 pb-2">
              Stay Connected
            </h4>
            <div className="bg-white/60 p-6 rounded-xl shadow-lg">
              <div className="flex mb-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="
                    w-full 
                    px-4 py-2 
                    border 
                    border-gray-200 
                    rounded-l-lg 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500
                  "
                />
                <button 
                  className="
                    bg-gradient-to-r 
                    from-blue-500 
                    to-purple-600 
                    text-white 
                    px-4 
                    rounded-r-lg 
                    hover:from-blue-600 
                    hover:to-purple-700 
                    transition-all 
                    duration-300
                  "
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Subscribe for AI database insights and updates
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Contact: support@autodb.ai
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="
          border-t 
          border-gray-200/50 
          pt-8 
          mt-12 
          text-center 
          relative 
          before:absolute 
          before:inset-x-0 
          before:top-0 
          before:h-[1px] 
          before:bg-gradient-to-r 
          before:from-transparent 
          before:via-blue-500/50 
          before:to-transparent
        ">
          <p className="text-gray-600 text-sm mb-4">
            © 2024 AutoDB. All Rights Reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="#" 
              className="
                text-gray-500 
                hover:text-blue-600 
                text-sm 
                transition-colors
              "
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="
                text-gray-500 
                hover:text-blue-600 
                text-sm 
                transition-colors
              "
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;