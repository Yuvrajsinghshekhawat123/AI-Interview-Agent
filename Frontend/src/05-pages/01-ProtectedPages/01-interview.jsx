import { FaUserTie } from "react-icons/fa";
import { BsMic } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useAnalyzeResume } from "../../03-features/01-user/03-hook/04-useAnalyze";
import { useGenerateQuestions } from "../../03-features/01-user/03-hook/05-useGenerateQuestions";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../00-app/01-userSlice";
import { useNavigate } from "react-router-dom";
import {
  resetGeneratedQuestions,
  setGeneratedQuestions,
} from "../../00-app/03-questionsSlice";

export default function InterviewSetup() {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewtype, setInterviewtype] = useState("Technical Interview");
  const [fileName, setFileName] = useState(null);
  const [resumeAanalysisData, setResumeAanalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { mutate } = useAnalyzeResume();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only upload pdf");
      return;
    }

    setFileName(file.name);

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", file);
    mutate(formData, {
      onSuccess: (data) => {
        setResumeAanalysisData(data);
        setIsAnalyzing(false);
        setRole(data.role);
        console.log(data);
      },
      onError: (err) => {
        setIsAnalyzing(false);
        setFileName("");
        if (err.response?.data?.message) {
          toast.warning(err.response?.data?.message);
        } else {
          toast.error("Something went wrong");
        }
      },
      onSettled: () => {
        setIsAnalyzing(false);
      },
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const { mutate: generateQuestionsMutate } = useGenerateQuestions();

  const handleGenerateQuestions = () => {
    dispatch(resetGeneratedQuestions());
    setIsGeneratingQuestions(true);
    generateQuestionsMutate(
      {
        role,
        experience,
        mode: interviewtype,
        resumeText: resumeAanalysisData?.resumeText,
        projects: resumeAanalysisData?.projects,
        skills: resumeAanalysisData?.skills,
      },
      {
        onSuccess: (data) => {
          dispatch(updateUser({ credits: data.creditsLeft }));
          setIsGeneratingQuestions(false);
          dispatch(setGeneratedQuestions(data));
          navigate("/user/interview2", { replace: true });
        },
        onError: (err) => {
          setIsGeneratingQuestions(false);
          setFileName("");
          if (err.response?.data?.message) {
            toast.warning(err.response?.data?.message);
          } else {
            toast.error("Something went wrong");
          }
        },
      },
    );
  };

  const items = [
    { icon: <FaUserTie />, text: "Choose Role & Experience" },
    { icon: <BsMic />, text: "Smart Voice Interview" },
    { icon: <FiBarChart2 />, text: "Performance Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center px-4">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 border border-[#00D4FF]/20">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="p-8 flex flex-col justify-center bg-gradient-to-br from-[#00D4FF]/5 to-[#00FFB3]/5"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent">
            Start Your AI Interview
          </h2>
          <p className="text-[#00D4FF]/60 mt-3 text-sm">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          {/* Features */}
          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="flex items-center gap-3 bg-[#0F1629]/60 backdrop-blur-sm p-3 rounded-lg border border-[#00D4FF]/20 hover:border-[#00FFB3]/40 transition-all duration-300"
              >
                <span className="text-[#00FFB3]">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] bg-clip-text text-transparent">
            Interview Setup
          </h2>

          {/* Input Fields */}
          <input
            type="text"
            value={role}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setRole(value);
              }
            }}
            placeholder="Enter Role (e.g Full Stack Developer)"
            className="w-full bg-[#0F1629]/60 border border-[#00D4FF]/20 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00FFB3] focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
          />

          <input
            type="text"
            value={experience}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*$/.test(value)) setExperience(value);
            }}
            placeholder="Experience (e.g. 2 years)"
            className="w-full bg-[#0F1629]/60 border border-[#00D4FF]/20 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00FFB3] focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
          />

          {/* Select Dropdown */}
          <select
            value={interviewtype}
            onChange={(e) => setInterviewtype(e.target.value)}
            className="w-full bg-[#0F1629]/60 border border-[#00D4FF]/20 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00FFB3] focus:border-transparent transition-all duration-300 cursor-pointer"
          >
            <option className="bg-[#0A0F1E]">Technical Interview</option>
            <option className="bg-[#0A0F1E]">HR Interview</option>
          </select>

          {/* Upload Box */}
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center bg-[#0F1629]/60 border border-[#00D4FF]/20 rounded-lg p-8 mb-4"
            >
              <div className="w-10 h-10 border-3 border-[#00FFB3] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#00D4FF]">Analyzing your resume...</p>
            </motion.div>
          ) : !resumeAanalysisData ? (
            <div
              onClick={handleClick}
              className="group border-2 border-dashed border-[#00D4FF]/40 rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-[#00FFB3] hover:bg-[#00FFB3]/5 transition-all duration-300"
            >
              <LuUpload className="mx-auto text-[#00FFB3] mb-3" size={32} />
              <p className="text-sm text-gray-400 group-hover:text-[#00D4FF] transition-colors duration-300">
                {fileName
                  ? fileName
                  : "Click to upload your resume to auto-fill the fields (optional)."}
              </p>
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            // Resume Analysis Result
            <div className="border border-[#00FFB3]/30 bg-[#00FFB3]/5 rounded-lg p-4 mb-4 backdrop-blur-sm">
              <h2 className="font-semibold text-[#00FFB3] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FFB3] rounded-full animate-pulse"></span>
                Resume Analysis Result
              </h2>

              <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {/* Projects */}
                {resumeAanalysisData.projects &&
                  resumeAanalysisData.projects.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2 text-[#00D4FF] text-sm">
                        📁 Projects:
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
                        {resumeAanalysisData.projects.map((project, index) => (
                          <li key={index}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Skills */}
                {resumeAanalysisData.skills &&
                  resumeAanalysisData.skills.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 text-[#00D4FF] text-sm">
                        ⚡ Skills:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeAanalysisData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-[#00D4FF]/20 to-[#00FFB3]/20 text-[#00FFB3] px-3 py-1 rounded-full text-sm border border-[#00FFB3]/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Start Button */}
          <motion.button
            onClick={handleGenerateQuestions}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={
              (fileName && !resumeAanalysisData) || isGeneratingQuestions
            }
            className="cursor-pointer w-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E] font-semibold py-3 rounded-full hover:shadow-lg hover:shadow-[#00FFB3]/30 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
          >
            {isGeneratingQuestions ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin"></div>
                Generating Questions...
              </span>
            ) : (
              "Start Interview"
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 212, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00D4FF, #00FFB3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00FFB3;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          transition: background-color 600000s 0s, color 600000s 0s;
        }
        
        input::placeholder {
          color: #6B7280;
        }
        
        select option {
          background-color: #0A0F1E;
          color: white;
        }
      `}</style>
    </div>
  );
}
