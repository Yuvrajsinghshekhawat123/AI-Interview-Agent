import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const RetryOverlay = ({ isVisible, attempt, maxAttempts }) => {
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] border border-[#00D4FF]/30 rounded-2xl p-8 max-w-md mx-4 text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#00D4FF]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00FFB3] border-r-[#00D4FF] rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Connecting to Server
          </h3>
          
          <p className="text-gray-400 text-sm mb-3">
            Attempt {attempt} of {maxAttempts}
          </p>
          
          <div className="w-full bg-[#00D4FF]/10 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(attempt / maxAttempts) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <p className="text-gray-500 text-xs">
            Please wait while we reconnect...
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};