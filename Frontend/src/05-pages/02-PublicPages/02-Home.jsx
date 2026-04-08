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
      borderColor: "#22c55e",
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
      img:HR,
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
    <div className="min-h-screen flex  justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center flex-col  lg:w-[55vw]  gap-5 ">
        {/* Top small text */}
        <p className="text-xs sm:text-sm text-gray-500  flex justify-center items-center gap-2 flex-wrap w-full lg:w-[35vw] ">
          <IoSparkles size={14} className="text-green-600" />
          <span>AI Powered Smart Interview Platform</span>
        </p>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col justify-center items-center font-bold text-gray-900 leading-tight sm:w-[70vw]  "
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl">
            Practice Interviews with
          </h1>

          <h1 className="mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-full w-fit text-xl sm:text-2xl md:text-3xl">
            AI Intelligence
          </h1>
        </motion.div>

        {/* Description */}
        <p className="text-gray-500  sm:mt-6 text-sm sm:text-base md:text-lg px-2 text-center sm:w-[70vw] lg:w-[50vw]">
          Role-based mock interviews with smart follow-ups, adaptive difficulty
          and real-time performance evaluation.
        </p>

        {/* Buttons */}
        <div className=" flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-[70vw]">
          <motion.button
            onClick={() => {
              // navigate("/login");
               if(!user) dispatch(setOpenLogin());
               else navigate("/user/interview");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "tween", duration: 0.01 }} // ⚡ super fast
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full transition"
          >
            Start Interview
          </motion.button>

          <button className="w-full sm:w-auto border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition">
            View History
          </button>
        </div>

        {/* cards */}
        <motion.div 
         initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
               
              duration: 0.5,
              ease: "easeOut",
            }}
   

        className="flex flex-col md:flex-row gap-6 items-stretch justify-center mt-12 px-4 w-[75vw] sm:w-full">
          {/* Card 1 */}
          <motion.div
            {...cardAnimation}
            className=" relative bg-white p-6 rounded-2xl shadow-xl rotate-[-6deg]  flex-1  h-44 sm:h-48 lg:h-50 xl:44   flex flex-col justify-between text-center border-2 border-transparent"
          >
            <div className="pt-3 text-center">
              <div className="absolute text-green-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-500 rounded-xl p-2 shadow-md">
                <BsRobot size={20} />
              </div>
              <p className="text-green-600 text-sm font-semibold">STEP 1</p>
              <h2 className="font-bold mt-2 text-base">
                Role & Experience Selection
              </h2>
              <p className="text-gray-500 text-xs pt-2">
                AI adjusts difficulty based on selected job role.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            {...cardAnimation}
            className="relative bg-white p-5 rounded-2xl shadow-xl rotate-[5deg] flex-1  sm:h-48 lg:h-50 xl:44  flex flex-col justify-between text-center border-2 border-transparent"
          >
            <div className="pt-3 text-center">
              <div className="absolute text-green-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-400 rounded-xl p-2 shadow-md">
                <TiMicrophoneOutline size={20} />
              </div>
              <p className="text-green-600 text-sm font-semibold">STEP 2</p>
              <h2 className="font-bold mt-2 text-base">
                Smart Voice Interview
              </h2>
              <p className="text-gray-500 text-sm pt-2">
                Dynamic follow-up questions based on your answers.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            {...cardAnimation}
            className="relative bg-white p-5 rounded-2xl shadow-xl rotate-[-5deg] flex-1  sm:h-48 lg:h-50 xl:44  flex flex-col justify-between text-center border-2 border-transparent"
          >
            <div className="pt-3 text-center">
              <div className="absolute text-green-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-400 rounded-xl p-2 shadow-md">
                <LuTimer size={20} />
              </div>
              <p className="text-green-600 text-sm font-semibold">STEP 3</p>
              <h2 className="font-bold mt-2 text-base">
                Timer Based Simulation
              </h2>
              <p className="text-gray-500 text-sm pt-2">
                Real interview pressure with time tracking.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
           
          className="text-center text-2xl md:text-3xl font-bold mt-15 mb-10"
        >
          Advanced AI <span className="text-green-600">Capabilities</span>
        </motion.h2>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
         
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2   mx-auto"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.12)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-100  cursor-pointer  "
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                className="w-28 h-28 object-contain"
              />

              {/* Text */}
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          
          className="text-center text-2xl md:text-3xl font-bold mt-15 mb-10"
        >
          Multiple Integerview <span className="text-green-600">Modes</span>
        </motion.h2>


        

        <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
         
        className="grid gap-6 max-w-5xl mx-auto sm:grid-cols-1 md:grid-cols-2">
          {modes.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.12)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-md border border-gray-100 cursor-pointer"
            >
              {/* Left Text */}
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">
                  {item.desc}
                </p>
              </div>

              {/* Right Image */}
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
