import React from 'react';
import { BsRobot } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] border-t border-[#00D4FF]/20 w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Brand Column */}
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start items-center gap-2 mb-3">
                <div className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] p-2 rounded-lg shadow-lg">
                  <BsRobot className="text-[#0A0F1E]" size={18} />
                </div>
                <h2 className="font-bold text-base sm:text-lg bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] bg-clip-text text-transparent">
                  InterviewIQ.AI
                </h2>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                AI-powered interview preparation platform designed to improve
                communication skills, technical depth and professional confidence.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Pricing', 'Blog'].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-[#00FFB3] text-xs sm:text-sm transition-colors duration-300 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">
                Support
              </h3>
              <ul className="space-y-2">
                {['Help Center', 'Contact Us', 'FAQ', 'Community'].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-[#00FFB3] text-xs sm:text-sm transition-colors duration-300 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-[#00FFB3] text-xs sm:text-sm transition-colors duration-300 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 sm:my-8 pt-4 border-t border-[#00D4FF]/10"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} InterviewIQ.AI. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {['GitHub', 'Twitter', 'LinkedIn'].map((social, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-500 hover:text-[#00FFB3] text-xs sm:text-sm transition-all duration-300"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </footer>
  );
}