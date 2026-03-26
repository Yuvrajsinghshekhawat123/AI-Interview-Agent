import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../02-Components/01-NavBar/NavBar";
import { setCloseLogin } from "../../00-app/02-authUISlice";
import { Login } from "../../05-pages/02-PublicPages/01-Login";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

export const MainLayout = () => {
  const dispatch = useDispatch();
  const showLogin = useSelector((state) => state.ui.showLogin);
  return (
    <div>
      <section
        className={` bg-gray-100 min-h-screen relative ${showLogin ? "blur-[1.5px] pointer-events-none " : ""}`}
      >
        <NavBar />
        <Outlet />
        
      </section>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // 🔥 fade out
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={() => dispatch(setCloseLogin())}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }} // 🔥 smooth exit
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Login />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
