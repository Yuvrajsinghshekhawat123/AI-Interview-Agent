import React, { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "framer-motion";
import { auth, provider } from "../../01-api/firebase";
import { ImSpinner2 } from "react-icons/im";

import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useLogin } from "../../03-features/01-user/03-hook/01-useLogin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCloseLogin } from "../../00-app/02-authUISlice";
import { MdCancel } from "react-icons/md";
import { setUser } from "../../00-app/01-userSlice";
export const Login = () => {
  const [rotate, setRotate] = useState(0);

  const { mutateAsync } = useLogin();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async () => {
    try {
      setProcessing(true);

      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();

      const data = await mutateAsync(token);

      dispatch(setUser(data.user));
      dispatch(setCloseLogin());

      toast.success(data.message);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.code === "auth/popup-closed-by-user") {
        toast.error("Popup closed. Try again.");
      } else if (err.code === "auth/network-request-failed") {
        toast.error("Network issue. Try again.");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  function handleRotate() {
    setRotate((prev) => prev + 360);
  }

  return (
    <section className="flex justify-center items-center  ">
      {/* Card Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-[45vh] sm:w-full max-w-sm px-8 py-6 rounded-2xl bg-white 
                   shadow-[0_10px_40px_rgba(0,0,0,0.1)] 
                   border border-gray-200 
                   flex flex-col items-center gap-5"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative w-full flex items-center justify-center "
        >
          <div className="flex items-center gap-2 ">
            <BsRobot
              className="bg-black text-white p-1.5 rounded-lg"
              size={30}
            />
            <span className="font-medium text-sm">InterviewIQ.AI</span>
          </div>

          <motion.button
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.19 }}
            onClick={() => dispatch(setCloseLogin())}
            className="absolute  -right-3 top-0 text-3xl  transition cursor-pointer"
          >
            <MdCancel />
          </motion.button>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="font-semibold text-2xl">Continue with</h1>

          <div className="inline-flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-green-600">
            <IoSparkles size={14} />
            <span className="font-medium text-lg">AI Smart Interview</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-600 text-sm leading-relaxed"
        >
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </motion.p>

        {/* Button */}
        <motion.button
          onClick={() => {
            if (!processing) {
              handleRotate();
              handleLogin();
            }
          }}
          disabled={processing}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full w-full shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ImSpinner2 className="animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <motion.img
                transition={{ delay: 0.1, duration: 0.5 }}
                animate={{ rotate }}
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
};
