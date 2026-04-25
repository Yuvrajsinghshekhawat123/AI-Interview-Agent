import React, { useState, useRef, useEffect } from "react";
import { BsCoin, BsRobot } from "react-icons/bs";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FaUserAstronaut } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../03-features/01-user/03-hook/03-useLogout";
import { toast } from "react-toastify";

import { ImSpinner2 } from "react-icons/im";
import { useQueryClient } from "@tanstack/react-query";
import { clearUser } from "../../00-app/01-userSlice";
import { setCloseLogin, setOpenLogin } from "../../00-app/02-authUISlice";

export default function NavBar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const showLogin = useSelector((state) => state.ui.showLogin);
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const { mutate } = useLogout();

  const queryClient = useQueryClient();

  const [showUserPop, setShowUserPop] = useState(false);
  const [showCreditPop, setShowCreditPop] = useState(false);

  const userRef = useRef();
  const creditRef = useRef();

  const firstLetter = user?.name?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    function handleClickOutside(e) {
      if (showLogin) return;

      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserPop(false);
      }

      if (creditRef.current && !creditRef.current.contains(e.target)) {
        setShowCreditPop(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogin]);

  function handleLogout() {
    setLogout(true);

    mutate(undefined, {
      onSuccess: async (data) => {
        dispatch(clearUser());
        await queryClient.invalidateQueries({ queryKey: ["userDetails"] });
        toast.success(data.message);
        setLogout(false);
        navigate("/");
      },

      onError: (err) => {
        setLogout(false);
        toast.error(err.response?.data?.message || "Something went wrong");
      },
    });
  }

  return (
    <section className="px-3 sm:px-6 bg-gradient-to-b from-[#0A0F1E] to-transparent">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex justify-center"
      >
        {/* Main Container */}
        <div className="w-full max-w-6xl my-4 bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl border border-[#00D4FF]/20 rounded-xl shadow-2xl px-4 py-3 flex items-center justify-between">
          
          {/* Left - Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] p-1.5 rounded-lg">
              <BsRobot className="text-[#0A0F1E]" size={20} />
            </div>
            <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent">
              InterviewIQ.AI
            </span>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Credits Button */}
            <div className="relative" ref={creditRef}>
              <button
                onClick={() => {
                  setShowCreditPop(!showCreditPop);
                  setShowUserPop(false);
                }}
                className="flex items-center gap-1 sm:gap-2 bg-[#00FFB3]/10 border border-[#00FFB3]/30 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm hover:bg-[#00FFB3]/20 hover:border-[#00FFB3]/50 transition-all duration-300 group"
              >
                <BsCoin className="text-[#00FFB3] group-hover:animate-pulse" size={18} />
                <span className="text-white font-semibold">{user?.credits ?? 0}</span>
              </button>

              {/* Credits Popup */}
              {showCreditPop && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 min-w-[260px] bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] border border-[#00D4FF]/30 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] bg-clip-text text-transparent flex items-center gap-2">
                      <BsCoin className="text-[#00FFB3]" />
                      Credits Wallet
                    </h3>
                    <span className="text-xs text-[#00FFB3] bg-[#00FFB3]/10 px-2 py-1 rounded-full">
                      {user?.credits ?? 0} left
                    </span>
                  </div>

                  {/* Content */}
                  {!user ? (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <p className="text-sm text-gray-400 text-center">
                        Login to access your credits and start interviews
                      </p>

                      <motion.button
                        onClick={() => dispatch(setOpenLogin())}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] font-semibold p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:shadow-[#00FFB3]/30"
                      >
                        Login Now
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-gray-400">
                        Need more credits to continue your interview?
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] font-semibold py-2 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-[#00FFB3]/30"
                      >
                        Buy More Credits
                      </motion.button>

                      <p className="text-xs text-gray-500 text-center">
                        🔒 Secure payment • Instant activation
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* User Avatar */}
            <div className="relative" ref={userRef}>
              <div
                onClick={() => {
                  setShowUserPop(!showUserPop);
                  setShowCreditPop(false);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00FFB3]/30"
              >
                {user ? (
                  user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-[#0A0F1E]">{firstLetter}</span>
                  )
                ) : (
                  <FaUserAstronaut className="text-[#0A0F1E]" />
                )}
              </div>

              {/* User Popup */}
              {showUserPop && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 min-w-[260px] bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] border border-[#00D4FF]/30 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] flex items-center justify-center font-bold text-[#0A0F1E] text-sm">
                      {user?.name?.[0]?.toUpperCase() || "G"}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="font-semibold text-white text-sm">
                        {user?.name || "Guest"}
                      </h3>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-3 border-t border-[#00D4FF]/20"></div>

                  {/* Menu Items */}
                  {user ? (
                    <div className="flex flex-col gap-1 text-sm">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-[#00FFB3] hover:bg-[#00FFB3]/10 transition-all duration-300 w-full text-left">
                        <span>📜</span> Interview History
                      </button>

                      {logout ? (
                        <button
                          onClick={handleLogout}
                          disabled={logout}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full disabled:cursor-not-allowed"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <ImSpinner2 />
                          </motion.div>
                          <span>Logging out...</span>
                        </button>
                      ) : (
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => dispatch(setOpenLogin())}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] font-semibold p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:shadow-[#00FFB3]/30"
                    >
                      Login
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}