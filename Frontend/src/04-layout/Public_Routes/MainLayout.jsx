
import { Outlet } from "react-router-dom";
import NavBar from "../../02-Components/01-NavBar/NavBar";
import { setCloseLogin } from "../../00-app/02-authUISlice";
import { Login } from "../../05-pages/02-PublicPages/01-Login";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../../02-Components/02-footer/01-footer";
import React, { useState, useEffect } from 'react';
import { retryEvents } from "../../03-features/01-user/01-api/00-axiosClient";
import { RetryOverlay } from "../../02-Components/RetryOverlay";

export const MainLayout = () => {
  const dispatch = useDispatch();
  const showLogin = useSelector((state) => state.ui.showLogin);
  const [showRetry, setShowRetry] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [maxRetries, setMaxRetries] = useState(3);
  
  useEffect(() => {
    const unsubscribeAttempt = retryEvents.subscribe((event, data) => {
      if (event === 'retry-attempt') {
        setShowRetry(true);
        setRetryAttempt(data.attempt);
        setMaxRetries(data.max);
      } else if (event === 'retry-success' || event === 'retry-failed') {
        setShowRetry(false);
      }
    });
    
    return () => {
      unsubscribeAttempt();
    };
  }, []);
  
  return (
    <>
      
        {/* Your content */}
       <div className="bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] min-h-screen">
      <section
        className={`min-h-screen relative transition-all duration-300 ${
          showLogin ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <NavBar />
        <Outlet />
        <Footer />
      </section>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            onClick={() => dispatch(setCloseLogin())}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Login />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
      </div>
      
      <RetryOverlay 
        isVisible={showRetry}
        attempt={retryAttempt}
        maxAttempts={maxRetries}
      />
    </>
  );
};

