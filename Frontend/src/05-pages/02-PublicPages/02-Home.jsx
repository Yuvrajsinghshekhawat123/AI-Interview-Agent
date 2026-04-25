import React from "react";
import { IoSparkles } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLogin } from "../../00-app/02-authUISlice";
import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";
import { TiMicrophoneOutline } from "react-icons/ti";
import { LuTimer } from "react-icons/lu";
import aians from "../../assets/ai-ans.png";
import history from "../../assets/history.png";
import pdf from "../../assets/pdf.png";
import resume from "../../assets/resume.png";
import config from "../../assets/confi.png";
import credit from "../../assets/credit.png";
import HR from "../../assets/HR.png";
import tech from "../../assets/tech.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cardAnimation = {
    whileHover: {
      scale: 1.07,
      rotate: 0,
      borderColor: "#00FFB3",
      boxShadow: "0 0 20px rgba(0, 255, 179, 0.3)",
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  };

  const features = [
    {
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence.",
      img: aians,
    },
    {
      title: "Resume Based Interview",
      desc: "Project-specific questions based on uploaded resume.",
      img: resume,
    },
    {
      title: "Downloadable PDF Report",
      desc: "Detailed strengths, weaknesses and improvement insights.",
      img: pdf,
    },
    {
      title: "History & Analytics",
      desc: "Track progress with performance graphs and topic analysis.",
      img: history,
    },
  ];

  const modes = [
    {
      title: "HR Interview Mode",
      desc: "Behavioral and communication based evaluation.",
      img: HR,
    },
    {
      title: "Technical Mode",
      desc: "Deep technical questioning based on selected role.",
      img: tech,
    },
    {
      title: "Confidence Detection",
      desc: "Basic tone and voice analysis insights.",
      img: config,
    },
    {
      title: "Credits System",
      desc: "Unlock premium interview sessions easily.",
      img: credit,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center flex-col lg:w-[55vw] gap-5 py-12">
        
        {/* Top small text */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs sm:text-sm text-[#00D4FF]/70 flex justify-center items-center gap-2 flex-wrap w-full lg:w-[35vw]"
        >
          <IoSparkles size={14} className="text-[#00FFB3]" />
          <span>AI Powered Smart Interview Platform</span>
        </motion.p>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col justify-center items-center font-bold leading-tight sm:w-[70vw]"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-white">
            Practice Interviews with
          </h1>

          <h1 className="mt-2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] px-4 py-2 rounded-full w-fit text-xl sm:text-2xl md:text-3xl shadow-lg">
            AI Intelligence
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-400 sm:mt-6 text-sm sm:text-base md:text-lg px-2 text-center sm:w-[70vw] lg:w-[50vw]"
        >
          Role-based mock interviews with smart follow-ups, adaptive difficulty
          and real-time performance evaluation.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-[70vw]"
        >
          <motion.button
            onClick={() => {
              if (!user) dispatch(setOpenLogin());
              else navigate("/user/interview");
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 179, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="w-full sm:w-auto bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-[#00FFB3]/30 transition-all duration-300"
          >
            Start Interview
          </motion.button>

          <motion.button
          onClick={() => {
                        if (!user) dispatch(setOpenLogin());
                        else navigate("/user/interviewHistory");
            }}

            whileHover={{ scale: 1.05, borderColor: "#00FFB3", color: "#00FFB3" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto border border-[#00D4FF]/40 text-gray-300 px-6 py-3 rounded-full hover:bg-[#00FFB3]/10 transition-all duration-300"
          >
            View History
          </motion.button>
        </motion.div>

        {/* Step Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-6 items-stretch justify-center mt-12 px-4 w-[75vw] sm:w-full"
        >
          {/* Card 1 */}
          <motion.div
            {...cardAnimation}
            className="relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl rotate-[-6deg] flex-1 h-44 sm:h-48 lg:h-50 flex flex-col justify-between text-center border-2 border-[#00D4FF]/20"
          >
            <div className="pt-3 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-xl p-2 shadow-md">
                <BsRobot size={20} className="text-[#0A0F1E]" />
              </div>
              <p className="text-[#00FFB3] text-sm font-semibold">STEP 1</p>
              <h2 className="font-bold mt-2 text-base text-white">
                Role & Experience Selection
              </h2>
              <p className="text-gray-400 text-xs pt-2">
                AI adjusts difficulty based on selected job role.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            {...cardAnimation}
            className="relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl rotate-[5deg] flex-1 h-44 sm:h-48 lg:h-50 flex flex-col justify-between text-center border-2 border-[#00D4FF]/20"
          >
            <div className="pt-3 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-xl p-2 shadow-md">
                <TiMicrophoneOutline size={20} className="text-[#0A0F1E]" />
              </div>
              <p className="text-[#00FFB3] text-sm font-semibold">STEP 2</p>
              <h2 className="font-bold mt-2 text-base text-white">
                Smart Voice Interview
              </h2>
              <p className="text-gray-400 text-sm pt-2">
                Dynamic follow-up questions based on your answers.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            {...cardAnimation}
            className="relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl rotate-[-5deg] flex-1 h-44 sm:h-48 lg:h-50 flex flex-col justify-between text-center border-2 border-[#00D4FF]/20"
          >
            <div className="pt-3 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-xl p-2 shadow-md">
                <LuTimer size={20} className="text-[#0A0F1E]" />
              </div>
              <p className="text-[#00FFB3] text-sm font-semibold">STEP 3</p>
              <h2 className="font-bold mt-2 text-base text-white">
                Timer Based Simulation
              </h2>
              <p className="text-gray-400 text-sm pt-2">
                Real interview pressure with time tracking.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Advanced AI Capabilities Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-2xl md:text-3xl font-bold mt-15 mb-10 text-white"
        >
          Advanced AI{" "}
          <span className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] bg-clip-text text-transparent">
            Capabilities
          </span>
        </motion.h2>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mx-auto"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
                borderColor: "#00FFB3",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-5 md:p-6 shadow-lg border border-[#00D4FF]/20 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-28 h-28 object-contain"
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Multiple Interview Modes Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-2xl md:text-3xl font-bold mt-15 mb-10 text-white"
        >
          Multiple Interview{" "}
          <span className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] bg-clip-text text-transparent">
            Modes
          </span>
        </motion.h2>

        {/* Modes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-6 max-w-5xl mx-auto sm:grid-cols-1 md:grid-cols-2"
        >
          {modes.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
                borderColor: "#00FFB3",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="flex items-center justify-between bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#00D4FF]/20 cursor-pointer"
            >
              <div>
                <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs">{item.desc}</p>
              </div>
              <img
                src={item.img}
                alt={item.title}
                className="w-20 h-20 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}