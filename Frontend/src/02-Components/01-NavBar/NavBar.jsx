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
import { Login } from "../../05-pages/02-PublicPages/01-Login";

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
    // ✅ If login modal is open → DO NOTHING
    if (showLogin) return;

    // ✅ Close user popup only
    if (
      userRef.current &&
      !userRef.current.contains(e.target)
    ) {
      setShowUserPop(false);
    }

    // ✅ Close credit popup only
    if (
      creditRef.current &&
      !creditRef.current.contains(e.target)
    ) {
      setShowCreditPop(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showLogin]); // ✅ IMPORTANT



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
    <section className="px-3 sm:px-6 ">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex justify-center`}
      >
        {/* ✅ Responsive Container */}
        <div className="w-full max-w-6xl mt-4  bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-4">
            <BsRobot className="bg-black text-white p-1 rounded-lg" size={25} />
            <span className="font-medium text-sm sm:text-base">
              InterviewIQ.AI
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Credits */}
            <div className="relative" ref={creditRef}>
              <button
                onClick={() => {
                  setShowCreditPop(!showCreditPop);
                  setShowUserPop(false);
                }}
                className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm hover:bg-gray-200"
              >
                <BsCoin size={18} />
                {user?.credits ?? 0}
              </button>

              {showCreditPop && (
                <div>
                  {showCreditPop && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute right-0 mt-3 min-w-[220px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">
                          💰 Credits
                        </h3>
                        <span className="text-xs text-gray-500">
                          {user?.credits ?? 0} left
                        </span>
                      </div>

                      {/* Content */}
                      {!user ? (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <p className="text-sm text-gray-600 text-center">
                            Login to access your credits and start interviews
                          </p>

                          <motion.button
                            onClick={() => {
                              // navigate("/login");
                              dispatch(setOpenLogin());
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-black text-white p-2 rounded-lg w-full shadow-md cursor-pointer"
                          >
                            Login
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <p className="text-sm text-gray-600">
                            Need more credits to continue your interview?
                          </p>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium"
                          >
                            Buy More Credits
                          </motion.button>

                          <p className="text-xs text-gray-400 text-center">
                            Secure payment • Instant activation
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="relative" ref={userRef}>
              <div
                onClick={() => {
                  setShowUserPop(!showUserPop);
                  setShowCreditPop(false);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {user ? (
                  user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">{firstLetter}</span>
                  )
                ) : (
                  <FaUserAstronaut />
                )}
              </div>

              {showUserPop && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute right-0 mt-3 min-w-[220px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                      {user?.name?.[0]?.toUpperCase() || "G"}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {user?.name || "Guest"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-3 border-t"></div>

                  {/* Menu Items */}
                  {user ? (
                    <div className="flex flex-col gap-1 text-sm font-medium">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                        📜 Interview History
                      </button>

                      {logout ? (
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition  disabled:cursor-not-allowed disabled:opacity-80"
                          disabled={logout}
                        >
                          <div className="flex items-center gap-2">
                            {/* Spinner */}
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

                            {/* Text */}
                            <span>Logging out...</span>
                          </div>
                        </button>
                      ) : (
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => {
                        // navigate("/login");
                        dispatch(setOpenLogin());
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black text-white p-2 rounded-lg w-full shadow-md cursor-pointer"
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
