import React from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone 
} from 'lucide-react';

const AutoDBFooter = () => {
  const socialLinks = [
    { 
      Icon: Twitter, 
      href: "https://twitter.com/autodb", 
      color: "hover:text-blue-400" 
    },
    { 
      Icon: Linkedin, 
      href: "https://linkedin.com/company/autodb", 
      color: "hover:text-blue-600" 
    },
    { 
      Icon: Github, 
      href: "https://github.com/autodb", 
      color: "hover:text-gray-200" 
    },
    { 
      Icon: Instagram, 
      href: "https://instagram.com/autodb", 
      color: "hover:text-pink-500" 
    }
  ];

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Animated Geometric Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-[200%] h-[200%] bg-gradient-to-r from-white via-gray-700 to-white animate-slow-spin origin-center"></div>
      </div>

      {/* Main Footer Content */}
      <motion.div 
        className="container mx-auto px-6 py-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        variants={footerVariants}
      >
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold mb-4 text-white/90">AutoDB</h2>
            <p className="text-gray-300 mb-6">
              Revolutionizing database generation with cutting-edge AI technology.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, color }) => (
                <a 
                  key={href} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 ${color} transform hover:scale-125`}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6">Explore</h3>
            <ul className="space-y-3">
              {[
                { name: "Product", href: "#product" },
                { name: "Solutions", href: "#solutions" },
                { name: "Pricing", href: "#pricing" },
                { name: "Documentation", href: "#docs" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <a 
                    href={href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "Blog", href: "#blog" },
                { name: "Case Studies", href: "#cases" },
                { name: "Webinars", href: "#webinars" },
                { name: "Support", href: "#support" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <a 
                    href={href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span>support@autodb.ai</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <span>+1 (555) AUTO-DB</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={20} className="text-gray-400" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="mt-12 pt-6 border-t border-white/10 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-400">
            ©️ {new Date().getFullYear()} AutoDB. All Rights Reserved.
            <span className="ml-4 text-sm">
              Powered by AI Innovation
            </span>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default AutoDBFooter;